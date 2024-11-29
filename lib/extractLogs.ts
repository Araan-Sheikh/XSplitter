import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function extractHistoricalLogs() {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    console.log('Starting log extraction...');

    // Clear existing logs
    await db.collection('logs').deleteMany({});
    console.log('Cleared existing logs');

    // Get all groups
    const groups = await db.collection('groups').find({}).toArray();
    console.log(`Found ${groups.length} groups`);
    
    const logs = [];

    // Process groups
    console.log('Processing groups...');
    for (const group of groups) {
      // Log group creation
      logs.push({
        action: 'Group Created',
        type: 'group',
        details: `Created group "${group.name}" with ${group.members?.length || 0} members`,
        userId: group.createdBy || 'system',
        timestamp: new Date(group.createdAt) || new Date(group._id.getTimestamp()),
        status: 'success',
        metadata: {
          groupId: group._id.toString(),
          groupName: group.name,
          memberCount: group.members?.length || 0,
          createdAt: group.createdAt
        }
      });

      // Log member additions if present
      if (group.members?.length > 0) {
        logs.push({
          action: 'Members Added',
          type: 'member',
          details: `Added ${group.members.length} members to group "${group.name}"`,
          userId: group.createdBy || 'system',
          timestamp: new Date(group.createdAt) || new Date(group._id.getTimestamp()),
          status: 'success',
          metadata: {
            groupId: group._id.toString(),
            groupName: group.name,
            memberCount: group.members.length,
            members: group.members
          }
        });
      }

      console.log(`Processed group: ${group.name}`);
    }

    // Sort and insert logs
    logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (logs.length > 0) {
      await db.collection('logs').insertMany(logs);
      console.log(`Successfully created ${logs.length} logs with breakdown:`, {
        total: logs.length,
        groups: logs.filter(log => log.type === 'group').length,
        members: logs.filter(log => log.type === 'member').length
      });
    }

    return {
      success: true,
      count: logs.length,
      breakdown: {
        total: logs.length,
        groups: logs.filter(log => log.type === 'group').length,
        members: logs.filter(log => log.type === 'member').length
      }
    };

  } catch (error) {
    console.error('Fatal error in log extraction:', error);
    return {
      success: false,
      error: error.message
    };
  }
} 