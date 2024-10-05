import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PlayerData } from '@/lib/types';

export async function GET(req: Request) {
  const cronJobToken = req.headers.get('X-Cron-Job-Token');

  const validToken = process.env.CRON_JOB_TOKEN;

  if (cronJobToken !== validToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch('https://api.sleeper.app/v1/players/nfl', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const playersData: Record<string, PlayerData> = await response.json();

    // Define the positions you want to include
    const allowedPositions = new Set(['QB', 'WR', 'RB', 'TE', 'DEF']); // Adjust the positions as needed

    // Filter and create an array of upsert promises for each player based on their position
    const playerPromises = Object.entries(playersData)
      .filter(([, player]) => allowedPositions.has(player.position)) // Filter by allowed positions
      .map(([playerId, player]) =>
        prisma.player.upsert({
          where: { playerId },
          create: {
            playerId: player.player_id,
            firstName: player.first_name,
            lastName: player.last_name,
            position: player.position,
          },
          update: {
            firstName: player.first_name,
            lastName: player.last_name,
            position: player.position,
          },
        })
      );

    // Process the upsert operations in batches
    const batchSize = 10; // Adjust the batch size as needed
    for (let i = 0; i < playerPromises.length; i += batchSize) {
      const batch = playerPromises.slice(i, i + batchSize);
      await Promise.all(batch);
    }

    return NextResponse.json({
      success: true,
      message: 'Players updated successfully.',
    });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players.' },
      { status: 500 }
    );
  }
}
