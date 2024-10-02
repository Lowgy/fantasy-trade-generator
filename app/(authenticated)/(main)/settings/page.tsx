'use client';

import { useState } from 'react';
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
import { ArrowRight, Loader2, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
  const [syncedLeagues, setSyncedLeagues] = useState<string[]>([
    'Sleeper League',
    'Yahoo League',
    'ESPN League',
  ]);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = () => {
    if (!selectedPlatform) return;

    setIsLoading(true);
    setTimeout(() => {
      setSyncedLeagues([...syncedLeagues, `${selectedPlatform} League`]);
      setIsLoading(false);
      setSelectedPlatform(null);
    }, 2000);
  };

  const handleRemoveLeague = (league: string) => {
    setSyncedLeagues(syncedLeagues.filter((l) => l !== league));
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">League Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Manage Synced Leagues</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {syncedLeagues.map((league, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 relative">
                    <Image
                      src={`/placeholder.svg?height=32&width=32&text=${
                        league.split(' ')[0]
                      }`}
                      alt={`${league} logo`}
                      width={32}
                      height={32}
                    />
                  </div>
                  <span>{league}</span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveLeague(league)}
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
                            src={`/placeholder.svg?height=48&width=48&text=${platform}`}
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
              <Button
                onClick={handleSync}
                disabled={!selectedPlatform || isLoading}
                className="w-full mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  'Sync League'
                )}
              </Button>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </>
  );
}
