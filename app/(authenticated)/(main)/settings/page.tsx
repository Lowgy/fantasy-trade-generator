/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useSession } from '@/components/session-provider';
import { getUserLeagues } from '../actions';
import { League } from '@/lib/types';

export default function SettingsPage() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const { user } = useSession();

  useEffect(() => {
    async function fetchLeagues() {
      const fetchedLeagues = await getUserLeagues(user.id);
      setLeagues(fetchedLeagues);
    }
    fetchLeagues();
  }, [user.id]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-full mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Leagues</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {leagues.map((league, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 relative">
                        <Image
                          src={
                            `https://sleepercdn.com/avatars/${league.avatar}` ||
                            '/sleeper-logo.png'
                          }
                          alt={`${league} logo`}
                          width={32}
                          height={32}
                        />
                      </div>
                      <span>{league.name}</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => console.log('Delete league')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Sync New League
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Sync a New League</DialogTitle>
                    <DialogDescription>
                      Choose your fantasy football platform to sync a new league
                    </DialogDescription>
                  </DialogHeader>
                  <RadioGroup
                    onValueChange={setSelectedPlatform}
                    className="space-y-4"
                  >
                    {['Sleeper', 'Yahoo', 'ESPN'].map((platform) => (
                      <div
                        key={platform}
                        className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <RadioGroupItem
                          value={platform}
                          id={platform}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={platform}
                          className="flex items-center justify-between w-full cursor-pointer peer-checked:font-bold"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 relative">
                              <Image
                                src={`/${platform.toLowerCase()}-logo.png`}
                                alt={`${platform} logo`}
                                width={48}
                                height={48}
                              />
                            </div>
                            <span>{platform}</span>
                          </div>
                          <ArrowRight className="text-gray-400 peer-checked:text-blue-600" />
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
