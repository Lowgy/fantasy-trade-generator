import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Assuming you have Prisma client setup

// Define a type for the request body
interface TradeRequestBody {
  userTeam: {
    id: number;
    leagueId: string;
    avatar: string | null;
    ownerId: string;
    teamName: string;
    players: string[];
  };
  leagueTeams: {
    id: number;
    leagueId: string;
    avatar: string | null;
    ownerId: string;
    teamName: string;
    players: string[];
  }[];
  selectedPosition: string;
}

// Define an interface for a Trade object
interface Trade {
  league: string;
  myTeamName: string; // Include team name
  otherTeamName: string; // Include team name
  myTeamPlayers: {
    name: string;
    position: string;
    id: string;
    value_1qb: number | null;
    value_2qb: number | null;
  }[]; // Include player ID in the players array
  otherTeamPlayers: {
    name: string;
    position: string;
    id: string;
    value_1qb: number | null;
    value_2qb: number | null;
  }[]; // Include player ID in the players array
  timestamp: string;
}

export async function POST(request: Request) {
  try {
    const body: TradeRequestBody = await request.json();

    const { userTeam, leagueTeams, selectedPosition } = body;

    // Fetch players from the database that match the selected position
    const playerIdsInPosition = await prisma.player.findMany({
      where: {
        position: selectedPosition,
      },
      select: {
        playerId: true,
        firstName: true,
        lastName: true,
        position: true,
        value_1qb: true,
        value_2qb: true,
      },
    });

    // Extract player IDs from the database results
    const playerIds = playerIdsInPosition.map((player) => player.playerId);

    // Filter user's team to only include players of the selected position
    const myTeamPlayers = userTeam.players.filter((playerId) =>
      playerIds.includes(playerId)
    );

    // Initialize the trades array with the explicit type
    const trades: Trade[] = [];

    // Loop through each league team and create trade proposals
    leagueTeams.forEach((team) => {
      // Skip the user's team
      if (team.id === userTeam.id) return;

      const otherTeamPlayers = team.players.filter((playerId) =>
        playerIds.includes(playerId)
      );

      // Create trade proposals for each combination of one player from your team and one player from the other team
      myTeamPlayers.forEach((myPlayerId) => {
        otherTeamPlayers.forEach((otherPlayerId) => {
          const myPlayer = playerIdsInPosition.find(
            (p) => p.playerId === myPlayerId
          );
          const otherPlayer = playerIdsInPosition.find(
            (p) => p.playerId === otherPlayerId
          );

          if (myPlayer && otherPlayer) {
            trades.push({
              league: userTeam.leagueId,
              myTeamName: userTeam.teamName, // Include user team name
              otherTeamName: team.teamName, // Include other team name
              myTeamPlayers: [
                {
                  name: `${myPlayer.firstName} ${myPlayer.lastName}`,
                  position: myPlayer.position,
                  value_1qb: myPlayer.value_1qb,
                  value_2qb: myPlayer.value_2qb,
                  id: myPlayerId,
                },
              ],
              otherTeamPlayers: [
                {
                  name: `${otherPlayer.firstName} ${otherPlayer.lastName}`,
                  position: otherPlayer.position,
                  value_1qb: otherPlayer.value_1qb,
                  value_2qb: otherPlayer.value_2qb,
                  id: otherPlayerId,
                },
              ],
              timestamp: new Date().toISOString(),
            });
          }
        });
      });
    });

    // Shuffle trades array and select 3 random trades
    const shuffledTrades = trades.sort(() => 0.5 - Math.random());
    const randomTrades = shuffledTrades.slice(0, 3);

    return NextResponse.json({ trades: randomTrades });
  } catch (error) {
    console.error('Error generating trades:', error);
    return NextResponse.json(
      { error: 'Failed to generate trades' },
      { status: 500 }
    );
  }
}
