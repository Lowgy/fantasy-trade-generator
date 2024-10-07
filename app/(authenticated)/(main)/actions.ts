'use server';
import prisma from '@/lib/prisma';

export async function getUserLeagues(userId: string) {
  console.log('userId:', userId);
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

export async function getUsersTeam(userId: string, leagueId: string) {
  try {
    console.log('userId:', userId);
    console.log('leagueId:', leagueId);
    const userRoster = await prisma.team.findFirst({
      where: {
        ownerId: userId,
        leagueId,
      },
    });
    return userRoster;
  } catch (error) {
    console.error('Error in getUsersRoster:', error);
    throw error;
  }
}

export async function getLeagueTeams(leagueId: string) {
  try {
    const rosters = await prisma.team.findMany({
      where: {
        leagueId,
      },
    });
    return rosters;
  } catch (error) {
    console.error('Error in getLeaguesRosters:', error);
    throw error;
  }
}
