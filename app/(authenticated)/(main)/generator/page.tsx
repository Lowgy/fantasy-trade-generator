'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getUserLeagues, getUsersTeam, getLeagueTeams } from '../actions';
import { League, PlayerData, Trade } from '@/lib/types';
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

const calculateTotalValue = (players: PlayerData[]) => {
  return players.reduce((total, player) => total + (player.value_1qb || 0), 0);
};

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

  const handleRequestTrade = (trade: Trade) => {
    console.log('Trade requested:', trade);
  };

  const renderPlayerDetails = (player: PlayerData) => (
    <div className="flex items-center space-x-2 mb-2">
      <Image
        src={
          `https://sleepercdn.com/content/nfl/players/${player.id}.jpg` ||
          '/sleeper-logo.png'
        }
        alt={`${player.name} headshot`}
        width={60}
        height={60}
        className="rounded-full"
      />
      <div>
        <p className="font-semibold">{player.name}</p>
        <p className="text-sm text-muted-foreground">{player.position}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Trade Generator Card */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Trades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  onValueChange={(value) =>
                    setSelectedLeague(
                      leagues.find((l) => l.id === value) || null
                    )
                  }
                  value={selectedLeague?.id || ''}
                >
                  <SelectTrigger>
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
                  <SelectTrigger>
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
                  className="w-full"
                >
                  Generate Trades
                </Button>
              </CardContent>
            </Card>

            {/* Trade History Card */}
            <Card>
              <CardHeader>
                <CardTitle>Trade Generation History</CardTitle>
              </CardHeader>
              <CardContent>
                {tradeHistory.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>League</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Trades</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tradeHistory.map((history) => (
                        <TableRow key={history.id}>
                          <TableCell>{history.league}</TableCell>
                          <TableCell>{history.position}</TableCell>
                          <TableCell>{history.count}</TableCell>
                          <TableCell>{history.timestamp}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">
                    No trade history available. Generate trades to see them
                    here.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            {/* Generated Trades Card */}
            <Card>
              <CardHeader>
                <CardTitle>Generated Trades</CardTitle>
              </CardHeader>
              <CardContent>
                {generatedTrades.length > 0 ? (
                  <div className="space-y-4">
                    {generatedTrades.map((trade, index) => (
                      <Card key={index} className="bg-muted">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <Image
                                  src={
                                    `https://sleepercdn.com/content/nfl/players/${trade.myTeamPlayers[0].id}.jpg` ||
                                    '/sleeper-logo.png'
                                  }
                                  alt={`${trade.myTeamPlayers[0].name} headshot`}
                                  width={60}
                                  height={60}
                                  className="rounded-full mx-auto"
                                />
                                <p className="text-sm mt-1">
                                  {trade.myTeamPlayers[0].name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {trade.myTeamPlayers[0].position}
                                </p>
                              </div>
                              <div className="text-sm font-semibold">
                                {trade.myTeamName}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-sm font-semibold text-right">
                                {trade.otherTeamName}
                              </div>
                              <div className="text-center">
                                <Image
                                  src={
                                    `https://sleepercdn.com/content/nfl/players/${trade.otherTeamPlayers[0].id}.jpg` ||
                                    '/sleeper-logo.png'
                                  }
                                  alt={`${trade.otherTeamPlayers[0].name} headshot`}
                                  width={60}
                                  height={60}
                                  className="rounded-full mx-auto"
                                />
                                <p className="text-sm mt-1">
                                  {trade.otherTeamPlayers[0].name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {trade.otherTeamPlayers[0].position}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="w-full flex items-center justify-center">
                                View Details
                                <ChevronRight className="ml-2 h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Trade Details</DialogTitle>
                              </DialogHeader>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">
                                    {trade.myTeamName} Offers:
                                  </h4>
                                  {trade.myTeamPlayers.map((player) =>
                                    renderPlayerDetails(player)
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">
                                    {trade.otherTeamName} Offers:
                                  </h4>
                                  {trade.otherTeamPlayers.map((player) =>
                                    renderPlayerDetails(player)
                                  )}
                                </div>
                              </div>
                              <div className="mt-4 p-4 bg-muted rounded-lg">
                                <h4 className="font-semibold mb-2">
                                  Total Value Breakdown:
                                </h4>
                                <div className="flex justify-between">
                                  <div>
                                    <p className="text-sm">
                                      {trade.myTeamName}:{' '}
                                      {calculateTotalValue(trade.myTeamPlayers)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm">
                                      {trade.otherTeamName}:{' '}
                                      {calculateTotalValue(
                                        trade.otherTeamPlayers
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleRequestTrade(trade)}
                                className="w-full mt-4"
                              >
                                Request Trade
                              </Button>
                            </DialogContent>
                          </Dialog>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No trades generated yet. Use the form to generate trades.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
