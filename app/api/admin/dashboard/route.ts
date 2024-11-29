import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    // Get total groups count
    const totalGroups = await db.collection('groups').countDocuments();

    // Get groups with their member counts
    const groups = await db.collection('groups').aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          type: 1,
          currency: 1,
          createdAt: 1,
          memberCount: { $size: { $ifNull: ["$members", []] } }
        }
      }
    ]).toArray();

    // Calculate recent activities (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentGroups = await db.collection('groups')
      .countDocuments({
        createdAt: { $gte: sevenDaysAgo }
      });

    // Calculate active groups (groups with members)
    const activeGroups = groups.filter(group => group.memberCount > 0).length;

    // Transform the data for the dashboard
    const transformedGroups = groups.map(group => ({
      id: group._id.toString(),
      name: group.name,
      type: group.type || 'default',
      memberCount: group.memberCount,
      currency: group.currency || 'USD',
      createdAt: group.createdAt 
        ? new Date(group.createdAt).toISOString() 
        : new Date(group._id.getTimestamp()).toISOString(),
      status: group.memberCount > 0 ? 'active' : 'inactive'
    }));

    // Sort groups by creation date (newest first)
    transformedGroups.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Calculate statistics
    const stats = {
      totalGroups,
      activeGroups,
      recentActivities: recentGroups,
      memberDistribution: {
        empty: groups.filter(g => g.memberCount === 0).length,
        small: groups.filter(g => g.memberCount > 0 && g.memberCount <= 3).length,
        medium: groups.filter(g => g.memberCount > 3 && g.memberCount <= 6).length,
        large: groups.filter(g => g.memberCount > 6).length
      }
    };

    // Get the latest activities
    const latestActivities = transformedGroups
      .slice(0, 5)
      .map(group => ({
        id: group.id,
        name: group.name,
        type: 'group_created',
        timestamp: group.createdAt,
        details: `Group "${group.name}" was created with ${group.memberCount} members`
      }));

    return NextResponse.json({
      success: true,
      groups: transformedGroups,
      stats,
      latestActivities
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch dashboard data',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 