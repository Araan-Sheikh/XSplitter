import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Create response to remove the cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Remove the admin token cookie
    response.cookies.delete('admin_token');

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
} 