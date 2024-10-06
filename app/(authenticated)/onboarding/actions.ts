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

    const leagueTeams = await getLeagueTeams(leagueData.league_id);

    await Promise.all(
      leagueTeams.map(async (team: any) => {
        if (!team.roster_id || !team.owner_id || !team.league_id) {
          console.warn('Missing team properties:', team);
          return;
        }

        const existingTeam = await prisma.team.findUnique({
          where: { id: team.roster_id },
        });

        if (!existingTeam) {
          await prisma.team.create({
            data: {
              id: team.roster_id,
              ownerId: team.owner_id,
              leagueId: league.id,
              players: team.players,
              teamName: team.teamName || `Team ${team.display_name}`,
              avatar: team.avatar,
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

export async function getLeagueTeams(leagueId: string) {
  try {
    const rostersResponse = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}/rosters`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!rostersResponse.ok) {
      throw new Error(`HTTP error! status: ${rostersResponse.status}`);
    }
    const teamsInfoResponse = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}/users`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (!teamsInfoResponse.ok) {
      throw new Error(`HTTP error! status: ${teamsInfoResponse.status}`);
    }
    const teams = await teamsInfoResponse.json();
    const rosters = await rostersResponse.json();
    const fullTeamsInfo = [];
    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      team.teamName = team.metadata.team_name;
      const roster = rosters.find((r: any) => r.owner_id === team.user_id);
      if (roster) {
        fullTeamsInfo.push({ ...team, ...roster });
      }
    }
    return fullTeamsInfo;
  } catch (error) {
    console.error('Error in getLeagueRosters:', error);
    throw error;
  }
}
