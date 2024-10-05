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

export async function updateUserWithLeague(userId: string, leagueData: any) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Step 1: Update the user if needed (e.g., onboard flag)
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          onboarded: true,
        },
      });

      // Step 2: Check if the league already exists
      const existingLeague = await tx.league.findUnique({
        where: { id: leagueData.league_id },
      });

      // Step 3: If the league doesn't exist, create it
      let league;
      if (!existingLeague) {
        league = await tx.league.create({
          data: {
            id: leagueData.league_id,
            name: leagueData.name,
            type: 'sleeper',
            avatar: leagueData.avatar,
          },
        });
      } else {
        league = existingLeague;
      }

      // Step 4: Check if the user is already associated with the league
      const existingUserLeague = await tx.userLeague.findUnique({
        where: {
          userId_leagueId: { userId, leagueId: league.id },
        },
      });

      // Step 5: If the user is not already associated, create the UserLeague link
      if (!existingUserLeague) {
        await tx.userLeague.create({
          data: {
            userId,
            leagueId: league.id,
          },
        });
      }

      return { user: updatedUser, league };
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating user with league data:', error);
    return { error: 'Failed to update user with league data' };
  }
}
