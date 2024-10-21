/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getUserLeagues, getUsersTeam, getLeagueTeams } from '../actions';
import { League, Trade } from '@/lib/types';
import { useSession } from '@/components/session-provider';

const positions = [
  { id: 1, name: 'QB' },
  { id: 2, name: 'RB' },
  { id: 3, name: 'WR' },
  { id: 4, name: 'TE' },
];

interface TradeHistory {
  id: number;
  league: string;
  position: string;
  count: number;
  timestamp: string;
}

interface Team {
  id: number;
  leagueId: string;
  avatar: string | null;
  ownerId: string;
  teamName: string;
  players: string[];
}

export default function DashboardGeneratorPage() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [generatedTrades, setGeneratedTrades] = useState<Trade[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [leagueTeams, setLeagueTeams] = useState<Team[]>([]);
  const { user } = useSession();

  useEffect(() => {
    async function fetchLeagues() {
      const fetchedLeagues = await getUserLeagues(user.id);
      setLeagues(fetchedLeagues);
    }
    fetchLeagues();
  }, [user.id]);

  useEffect(() => {
    async function fetchTeams() {
      if (!selectedLeague) {
        return;
      }
      const usersTeam = await getUsersTeam(
        user.sleeperId || '',
        selectedLeague.id
      );
      const leagueTeams = await getLeagueTeams(selectedLeague.id);
      setUserTeam(usersTeam);
      setLeagueTeams(leagueTeams);
    }

    if (selectedLeague) {
      fetchTeams();
    }
  }, [selectedLeague, user.id, user.sleeperId]);

  const handleGenerateTrades = async () => {
    if (!selectedLeague) {
      return;
    }
    console.log('Generating trades...');
    if (!userTeam || !leagueTeams.length) {
      return;
    }
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        userTeam,
        leagueTeams,
        selectedPosition,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setGeneratedTrades(data.trades);
    setTradeHistory((prevHistory) => [
      {
        id: Date.now(),
        league: selectedLeague.name,
        position: selectedPosition,
        count: 3,
        timestamp: new Date().toLocaleString(),
      },
      ...prevHistory,
    ]);

    setSelectedLeague(null);
    setSelectedPosition('');
  };

  return (
    <div className="min-h-screen p-4 bg-light-gray dark:bg-dark-charcoal text-dark-gray dark:text-almost-white">
      <div className="max-w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trade Generator Card */}
          <Card className="lg:col-span-1 bg-white dark:bg-lighter-charcoal border-divider-light dark:border-darker-gray">
            <CardHeader>
              <CardTitle className="text-dark-gray dark:text-almost-white">
                Generate Trades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                onValueChange={(value) =>
                  setSelectedLeague(leagues.find((l) => l.id === value) || null)
                }
                value={selectedLeague?.id || ''}
              >
                <SelectTrigger className="border-divider-light dark:border-darker-gray text-dark-gray dark:text-almost-white">
                  <SelectValue placeholder="Choose a league" />
                </SelectTrigger>
                <SelectContent>
                  {leagues.map((league) => (
                    <SelectItem key={league.id} value={league.id}>
                      <div className="flex items-center">
                        <Image
                          src={
                            `https://sleepercdn.com/avatars/${league.avatar}` ||
                            '/sleeper-logo.png'
                          }
                          alt={`${league.name} logo`}
                          width={24}
                          height={24}
                          className="mr-2 rounded-full"
                        />
                        {league.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={setSelectedPosition}
                value={selectedPosition}
              >
                <SelectTrigger className="border-divider-light dark:border-darker-gray text-dark-gray dark:text-almost-white">
                  <SelectValue placeholder="Choose a position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position.id} value={position.name}>
                      {position.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleGenerateTrades}
                disabled={!selectedLeague || !selectedPosition}
                className="w-full bg-blue text-white hover:bg-blue/90 dark:bg-light-blue dark:text-dark-charcoal dark:hover:bg-light-blue/90"
              >
                Generate Trades
              </Button>
            </CardContent>
          </Card>

          {/* Recently Generated Trades Card */}
          <Card className="lg:col-span-2 bg-white dark:bg-lighter-charcoal border-divider-light dark:border-darker-gray">
            <CardHeader>
              <CardTitle className="text-dark-gray dark:text-almost-white">
                Generated Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              {generatedTrades.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
                  {generatedTrades.slice(0, 6).map((trade) => (
                    <li
                      key={trade.id}
                      className="p-4 bg-light-gray dark:bg-dark-charcoal rounded-md shadow border border-divider-light dark:border-darker-gray"
                    >
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-semibold text-dark-gray dark:text-almost-white">
                            {trade.myTeamName} Offers:
                          </h4>
                          {trade.myTeamPlayers.map((player, index) => (
                            <div className="flex items-center" key={index}>
                              <Image
                                src={
                                  `https://sleepercdn.com/content/nfl/players/${player.id}.jpg` ||
                                  '/sleeper-logo.png'
                                }
                                alt={`${player.name} headshot`}
                                width={80}
                                height={80}
                                className="mr-2 rounded-full"
                              />
                              <span className="text-gray dark:text-light-gray-dark">
                                {player.name}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <h4 className="font-semibold text-dark-gray dark:text-almost-white">
                            {trade.otherTeamName} Offers:
                          </h4>
                          {trade.otherTeamPlayers.map((player, index) => (
                            <div className="flex items-center" key={index}>
                              <Image
                                src={
                                  `https://sleepercdn.com/content/nfl/players/${player.id}.jpg` ||
                                  '/sleeper-logo.png'
                                }
                                alt={`${player.name} headshot`}
                                width={80}
                                height={80}
                                className="mr-2 rounded-full"
                              />
                              <span className="text-gray dark:text-light-gray-dark">
                                {player.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray dark:text-light-gray-dark">
                  No trades generated yet. Use the form to generate trades.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Trade History Card */}
          <Card className="lg:col-span-3 bg-white dark:bg-lighter-charcoal border-divider-light dark:border-darker-gray">
            <CardHeader>
              <CardTitle className="text-dark-gray dark:text-almost-white">
                Trade Generation History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tradeHistory.length > 0 ? (
                <div className="max-h-[300px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-divider-light dark:border-darker-gray">
                        <TableHead className="text-gray dark:text-light-gray-dark">
                          League
                        </TableHead>
                        <TableHead className="text-gray dark:text-light-gray-dark">
                          Position
                        </TableHead>
                        <TableHead className="text-gray dark:text-light-gray-dark">
                          Trades Generated
                        </TableHead>
                        <TableHead className="text-gray dark:text-light-gray-dark">
                          Timestamp
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tradeHistory.map((history) => (
                        <TableRow
                          key={history.id}
                          className="border-b border-divider-light dark:border-darker-gray"
                        >
                          <TableCell className="text-dark-gray dark:text-almost-white">
                            {history.league}
                          </TableCell>
                          <TableCell className="text-dark-gray dark:text-almost-white">
                            {history.position}
                          </TableCell>
                          <TableCell className="text-dark-gray dark:text-almost-white">
                            {history.count}
                          </TableCell>
                          <TableCell className="text-dark-gray dark:text-almost-white">
                            {history.timestamp}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-gray dark:text-light-gray-dark">
                  No trade history available. Generate trades to see them here.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
