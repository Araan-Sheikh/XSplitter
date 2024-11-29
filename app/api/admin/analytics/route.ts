import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    // Calculate date range based on filter
    const startDate = new Date();
    switch (filter) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        // For 'all', set to a far past date or the earliest possible date in your data
        startDate.setFullYear(2020);
    }

    // Get total groups and active users
    const totalGroups = await db.collection('groups').countDocuments();
    const activeUsers = await db.collection('groups').aggregate([
      { $unwind: '$members' },
      { $group: { _id: '$members.userId' } },
      { $count: 'total' }
    ]).toArray();

    // Get daily activity within the date range
    const dailyGroups = await db.collection('groups')
      .aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
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

    // Generate date range array
    const dates = [];
    const groups = [];
    let currentDate = new Date(startDate);
    const endDate = new Date();

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dates.push(dateStr);
      const dayData = dailyGroups.find(item => item._id === dateStr);
      groups.push(dayData ? dayData.count : 0);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate membership distribution
    const membershipStats = await db.collection('groups')
      .aggregate([
        {
          $project: {
            size: { $size: { $ifNull: ["$members", []] } }
          }
        },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $eq: ["$size", 0] }, then: "Empty" },
                  { case: { $lte: ["$size", 3] }, then: "1-3" },
                  { case: { $lte: ["$size", 6] }, then: "4-6" },
                ],
                default: "7+"
              }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]).toArray();

    // Format the data
    const formattedStats = {
      labels: membershipStats.map(stat => stat._id),
      data: membershipStats.map(stat => stat.count)
    };

    // Format dates for display
    const formatDate = (dateStr: string) => {
      if (filter === 'week') {
        return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
      } else if (filter === 'month') {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (filter === 'year') {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short' });
      }
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return NextResponse.json({
      overview: {
        totalGroups,
        activeUsers: activeUsers[0]?.total || 0,
      },
      dailyActivity: {
        dates: dates.map(formatDate),
        groups,
      },
      membershipStats: formattedStats,
    });

  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics data',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 