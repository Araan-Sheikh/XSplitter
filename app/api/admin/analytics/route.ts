import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    // Calculate total groups
    const totalGroups = await db.collection('groups').countDocuments();

    // Calculate active users (users who are members of at least one group)
    const activeUsers = await db.collection('groups').aggregate([
      { $unwind: '$members' },
      { $group: { _id: '$members.userId' } },
      { $count: 'total' }
    ]).toArray();
    const activeUsersCount = activeUsers[0]?.total || 0;

    // Get daily activity for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyGroups = await db.collection('groups')
      .aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]).toArray();

    // Fill in missing dates with zero counts
    const dates = [];
    const groups = [];
    for (let d = new Date(thirtyDaysAgo); d <= new Date(); d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dates.push(dateStr);
      const dayData = dailyGroups.find(item => item._id === dateStr);
      groups.push(dayData ? dayData.count : 0);
    }

    // Calculate group size distribution
    const groupSizes = await db.collection('groups')
      .aggregate([
        {
          $project: {
            size: { $size: { $ifNull: ["$members", []] } }
          }
        },
        {
          $group: {
            _id: "$size",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]).toArray();

    // Format group size distribution
    const membershipStats = {
      labels: groupSizes.map(size => `${size._id} ${size._id === 1 ? 'member' : 'members'}`),
      data: groupSizes.map(size => size.count)
    };

    return NextResponse.json({
      overview: {
        totalGroups,
        activeUsers: activeUsersCount,
      },
      dailyActivity: {
        dates,
        groups,
      },
      membershipStats,
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
} 