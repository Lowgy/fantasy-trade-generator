/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import prisma from '@/lib/prisma';

export async function getSleeperData(username: string) {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/user/${username}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data === null) {
      return { error: 'User not found' };
    }

    const leagues = await getSleeperLeagues(data.user_id);
    return { user: data, leagues };
  } catch (error) {
    console.error('Error in getSleeperData:', error);
    return { error: 'An error occurred while fetching data' };
  }
}

export async function getSleeperLeagues(user_id: string) {
  try {
    const date = new Date();
    const response = await fetch(
      `https://api.sleeper.app/v1/user/${user_id}/leagues/nfl/${date.getFullYear()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const leagues = await response.json();
    return leagues;
  } catch (error) {
    console.error('Error in getSleeperLeagues:', error);
    throw error;
  }
}

export async function updateUserWithLeague(
  userId: string,
  leagueData: any,
  sleeperId: string | null
) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        onboarded: true,
        sleeperId,
      },
    });

    const existingLeague = await prisma.league.findUnique({
      where: { id: leagueData.league_id },
    });

    const league =
      existingLeague ??
      (await prisma.league.create({
        data: {
          id: leagueData.league_id,
          name: leagueData.name,
          type: 'sleeper',
          avatar: leagueData.avatar,
        },
      }));

    const leagueRosters = await getLeagueRosters(leagueData.league_id);
    await Promise.all(
      leagueRosters.map(async (roster: any) => {
        const existingRoster = await prisma.roster.findUnique({
          where: { id: roster.roster_id },
        });

        if (!existingRoster) {
          await prisma.roster.create({
            data: {
              id: roster.roster_id,
              ownerId: roster.owner_id,
              leagueId: league.id,
              players: roster.players,
            },
          });
        }
      })
    );

    const existingUserLeague = await prisma.userLeague.findUnique({
      where: {
        userId_leagueId: { userId, leagueId: league.id },
      },
    });

    if (!existingUserLeague) {
      await prisma.userLeague.create({
        data: {
          userId,
          leagueId: league.id,
        },
      });
    }

    return { success: true, user: updatedUser, league };
  } catch (error) {
    console.error('Error updating user with league data:', error);
    return { error: 'Failed to update user with league data' };
  }
}

export async function getLeagueRosters(leagueId: string) {
  try {
    const response = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}/rosters`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rosters = await response.json();
    return rosters;
  } catch (error) {
    console.error('Error in getLeagueRosters:', error);
    throw error;
  }
}
