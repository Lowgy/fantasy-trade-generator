'use server';
import prisma from '@/lib/prisma';

export async function getUserLeagues(userId: string) {
  try {
    const userLeagues = await prisma.userLeague.findMany({
      where: {
        userId,
      },
      include: {
        league: true,
      },
    });

    const leagues = userLeagues.map((userLeague) => userLeague.league);

    return leagues;
  } catch (error) {
    console.error('Error in getUserLeagues:', error);
    throw error;
  }
}
