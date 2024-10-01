'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface SelectionItemProps {
  value: string;
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const SelectionItem: React.FC<SelectionItemProps> = ({
  selected,
  onClick,
  children,
}) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between w-full p-4 bg-white border-2 rounded-lg cursor-pointer transition-all ${
      selected
        ? 'border-blue-600 bg-blue-50'
        : 'border-gray-200 hover:bg-gray-50'
    }`}
  >
    {children}
  </div>
);

const SleeperLogin = () => {
  const [username, setUsername] = useState('');
  const [step, setStep] = useState(1);
  const [availableLeagues, setAvailableLeagues] = useState<string[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sleeper username submitted:', username);
    setAvailableLeagues(['League 1', 'League 2', 'League 3']);
    setStep(2);
  };

  const handleLeagueSelect = (league: string) => {
    setSelectedLeague(league);
  };

  const handleLeagueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Selected league:', selectedLeague);
  };

  if (step === 1) {
    return (
      <form onSubmit={handleUsernameSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sleeper-username">Sleeper Username</Label>
          <Input
            id="sleeper-username"
            type="text"
            placeholder="Enter your Sleeper username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={!username}>
          Next
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleLeagueSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Select Your League</Label>
        <div className="space-y-2">
          {availableLeagues.map((league) => (
            <SelectionItem
              key={league}
              value={league}
              selected={selectedLeague === league}
              onClick={() => handleLeagueSelect(league)}
            >
              <span
                className={`font-medium ${
                  selectedLeague === league ? 'text-blue-600' : ''
                }`}
              >
                {league}
              </span>
            </SelectionItem>
          ))}
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={!selectedLeague}>
        Connect Sleeper Account
      </Button>
    </form>
  );
};

export default function OnboardingPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const renderLoginComponent = () => {
    switch (selectedPlatform) {
      case 'Sleeper':
        return <SleeperLogin />;
      case 'ESPN':
        return (
          <div className="space-y-4">
            <p>
              To connect your ESPN account, you&apos;ll need to log in through
              ESPN&apos;s website.
            </p>
            <Button
              onClick={() =>
                window.open('https://www.espn.com/fantasy/', '_blank')
              }
              className="w-full"
            >
              Go to ESPN Fantasy
            </Button>
          </div>
        );
      case 'Yahoo':
        return (
          <div className="space-y-4">
            <p>
              To connect your Yahoo account, you&apos;ll need to log in through
              Yahoo&apos;s website.
            </p>
            <Button
              onClick={() =>
                window.open(
                  'https://football.fantasysports.yahoo.com/',
                  '_blank'
                )
              }
              className="w-full"
            >
              Go to Yahoo Fantasy
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          {selectedPlatform && (
            <Button
              variant="ghost"
              className="p-0 h-8 w-8 absolute left-4 top-4"
              onClick={() => setSelectedPlatform(null)}
              aria-label="Back to platform selection"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <CardTitle className="text-2xl font-bold text-center">
            {selectedPlatform
              ? `Connect ${selectedPlatform} Account`
              : 'Connect Your Fantasy League'}
          </CardTitle>
          <CardDescription className="text-center">
            {selectedPlatform
              ? `Follow the steps to connect your ${selectedPlatform} account`
              : 'Choose your fantasy football platform and connect your account'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedPlatform ? (
            renderLoginComponent()
          ) : (
            <div className="space-y-4">
              {['Sleeper', 'ESPN', 'Yahoo'].map((platform) => (
                <SelectionItem
                  key={platform}
                  value={platform}
                  selected={selectedPlatform === platform}
                  onClick={() => setSelectedPlatform(platform)}
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
                    <span
                      className={`font-medium ${
                        selectedPlatform === platform ? 'text-blue-600' : ''
                      }`}
                    >
                      {platform}
                    </span>
                  </div>
                </SelectionItem>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
