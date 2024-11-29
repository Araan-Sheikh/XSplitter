import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';  // Disable static optimization
export const revalidate = 0;  // Disable cache

export async function GET() {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    // Fetch all groups with no caching
    const groups = await db.collection('groups')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedGroups = groups.map(group => ({
      id: group._id.toString(),
      groupId: group._id.toString(),
      name: group.name || '',
      type: group.type || 'standard',
      memberCount: Array.isArray(group.members) ? group.members.length : 0,
      currency: group.currency || 'USD',
      createdAt: group.createdAt || new Date(),
      status: group.status || 'inactive'
    }));

    // Calculate accurate stats
    const totalGroups = formattedGroups.length;
    const activeGroups = formattedGroups.filter(g => g.status === 'active').length;

    // Calculate recent activities (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentActivities = formattedGroups.filter(g => {
      const createdAt = new Date(g.createdAt);
      return createdAt >= weekAgo;
    }).length;

    // Calculate member distribution with accurate ranges
    const memberDistribution = {
      empty: formattedGroups.filter(g => g.memberCount === 0).length,
      small: formattedGroups.filter(g => g.memberCount >= 1 && g.memberCount <= 3).length,
      medium: formattedGroups.filter(g => g.memberCount >= 4 && g.memberCount <= 6).length,
      large: formattedGroups.filter(g => g.memberCount >= 7).length
    };

    // Get latest activities with proper timestamps
    const latestActivities = formattedGroups
      .filter(group => new Date(group.createdAt).getTime() > 0)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(group => ({
        id: group.id,
        name: group.name,
        type: group.type,
        timestamp: new Date(group.createdAt).toISOString(),
        details: `Group created with ${group.memberCount} member${group.memberCount !== 1 ? 's' : ''}`
      }));

    return NextResponse.json({
      groups: formattedGroups,
      stats: {
        totalGroups,
        activeGroups,
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