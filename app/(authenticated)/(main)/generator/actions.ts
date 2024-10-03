'use server';
import prisma from '@/lib/prisma';

export async function getUserLeagues(userId: string) {
  try {
    const leagues = await prisma.league.findMany({
      where: {
        userId,
      },
    });
    return leagues;
  } catch (error) {
    console.error('Error in getUserLeagues:', error);
    throw error;
  }
}
