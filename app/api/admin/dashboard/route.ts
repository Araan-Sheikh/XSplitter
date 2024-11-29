import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    // Fetch all groups with no caching
    const groups = await db.collection('groups')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedGroups = groups.map(group => {
      // Ensure proper member count calculation
      const memberCount = group.members && Array.isArray(group.members) ? group.members.length : 0;

      return {
        id: group._id.toString(),
        groupId: group._id.toString(),
        name: group.name || '',
        type: group.type || 'standard',
        memberCount,
        currency: group.currency || 'USD',
        createdAt: group.createdAt || new Date(),
        status: memberCount > 0 ? 'active' : 'inactive'
      };
    });

    // Calculate stats
    const totalGroups = formattedGroups.length;

    // Calculate groups with members (active groups)
    const activeGroups = formattedGroups.filter(group => group.memberCount > 0).length;

    // Calculate recent activities (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentActivities = formattedGroups.filter(group => {
      const createdAt = new Date(group.createdAt);
      return createdAt >= weekAgo;
    }).length;

    // Calculate member distribution with proper ranges
    const memberDistribution = {
      empty: formattedGroups.filter(g => g.memberCount === 0).length,
      small: formattedGroups.filter(g => g.memberCount >= 1 && g.memberCount <= 3).length,
      medium: formattedGroups.filter(g => g.memberCount >= 4 && g.memberCount <= 6).length,
      large: formattedGroups.filter(g => g.memberCount >= 7).length
    };

    // Get latest activities with proper member count
    const latestActivities = formattedGroups
      .filter(group => new Date(group.createdAt).getTime() > 0)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(group => ({
        id: group.id,
        name: group.name,
        type: 'group',
        timestamp: new Date(group.createdAt).toISOString(),
        details: `Group created with ${group.memberCount} member${group.memberCount !== 1 ? 's' : ''}`
      }));

    return NextResponse.json({
      groups: formattedGroups,
      stats: {
        totalGroups,
        activeGroups, // This now correctly represents groups with members
        recentActivities,
        memberDistribution
      },
      latestActivities
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 