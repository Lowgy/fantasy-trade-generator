/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { getSleeperData, updateUserWithLeague } from './actions';
import { useRouter } from 'next/navigation';
import { useSession } from '../../../components/session-provider';

interface SelectionItemProps {
  value: string;
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const SelectionItem: React.FC<SelectionItemProps> = ({
  selected,
  onClick,
  children,
  disabled,
}) => (
  <div
    onClick={disabled ? undefined : onClick}
    className={`flex items-center justify-between w-full p-4 bg-lighter-charcoal border-2 rounded-lg transition-all ${
      selected
        ? 'border-light-blue bg-blue/10'
        : 'border-darker-gray hover:bg-dark-charcoal'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {children}
  </div>
);

interface SleeperLeague {
  league_id: string;
  name: string;
  avatar: string;
}

const SleeperLogin = ({ userId }: any) => {
  const [username, setUsername] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [availableLeagues, setAvailableLeagues] = useState<SleeperLeague[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [sleeperId, setSleeperId] = useState<string | null>(null);
  const router = useRouter();

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sleeperData = await getSleeperData(username);
    if (sleeperData.error) {
      setError(sleeperData.error);
      return;
    }
    setSleeperId(sleeperData.user.user_id);
    setAvailableLeagues(sleeperData.leagues);
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setUsername(e.target.value);
  };

  const handleLeagueSelect = (league: string) => {
    setSelectedLeague(league);
  };

  const handleLeagueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeague) return;

    const selectedLeagueData = availableLeagues.find(
      (league) => league.name === selectedLeague
    );
    if (!selectedLeagueData) return;

    try {
      const result = await updateUserWithLeague(
        userId,
        selectedLeagueData,
        sleeperId
      );

      if (result.error) {
        console.error(result.error);
      } else {
        router.push('/generator');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (step === 1) {
    return (
      <form onSubmit={handleUsernameSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sleeper-username" className="text-almost-white">
            Sleeper Username
          </Label>
          <Input
            id="sleeper-username"
            type="text"
            placeholder="Enter your Sleeper username"
            value={username}
            onChange={handleInputChange}
            required
            className="bg-dark-charcoal text-almost-white border-darker-gray focus:border-light-blue"
          />
        </div>
        {error && <p className="text-center text-red">{error}</p>}
        <Button
          type="submit"
          className="w-full bg-light-blue text-dark-charcoal hover:bg-light-blue/90"
          disabled={!username}
        >
          Next
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleLeagueSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-almost-white">Select Your League</Label>
        <div className="space-y-2">
          {availableLeagues.map((league) => (
            <SelectionItem
              key={league.league_id}
              value={league.name}
              selected={selectedLeague === league.name}
              onClick={() => handleLeagueSelect(league.name)}
            >
              <div className="flex items-center space-x-4 w-full">
                <div className="w-10 h-10 relative flex-shrink-0">
                  <Image
                    src={
                      league.avatar
                        ? `https://sleepercdn.com/avatars/${league.avatar}`
                        : '/sleeper-logo.png'
                    }
                    alt={`${league.name} avatar`}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <span
                  className={`font-medium flex-grow ${
                    selectedLeague === league.name
                      ? 'text-light-blue'
                      : 'text-almost-white'
                  }`}
                >
                  {league.name}
                </span>
              </div>
            </SelectionItem>
          ))}
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-light-blue text-dark-charcoal hover:bg-light-blue/90"
        disabled={!selectedLeague}
      >
        Connect Sleeper Account
      </Button>
    </form>
  );
};

export default function OnboardingPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const { user: loggedInUser } = useSession();

  const renderLoginComponent = () => {
    switch (selectedPlatform) {
      case 'Sleeper':
        return <SleeperLogin userId={loggedInUser.id} />;
      case 'ESPN':
        return (
          <div className="space-y-4">
            <p className="text-almost-white">
              To connect your ESPN account, you&apos;ll need to log in through
              ESPN&apos;s website.
            </p>
            <Button
              onClick={() =>
                window.open('https://www.espn.com/fantasy/', '_blank')
              }
              className="w-full bg-light-blue text-dark-charcoal hover:bg-light-blue/90"
            >
              Go to ESPN Fantasy
            </Button>
          </div>
        );
      case 'Yahoo':
        return (
          <div className="space-y-4">
            <p className="text-almost-white">
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
              className="w-full bg-light-blue text-dark-charcoal hover:bg-light-blue/90"
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
    <div className="min-h-screen flex items-center justify-center bg-dark-charcoal p-4">
      <Card className="w-full max-w-lg bg-lighter-charcoal border-darker-gray">
        <CardHeader className="space-y-1">
          {selectedPlatform && (
            <Button
              variant="ghost"
              className="p-0 h-8 w-8 absolute left-4 top-4 text-almost-white hover:text-light-blue"
              onClick={() => setSelectedPlatform(null)}
              aria-label="Back to platform selection"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <CardTitle className="text-2xl font-bold text-center text-almost-white">
            {selectedPlatform
              ? `Connect ${selectedPlatform} Account`
              : 'Connect Your Fantasy League'}
          </CardTitle>
          <CardDescription className="text-center text-light-gray-dark">
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
                  disabled={platform === 'ESPN' || platform === 'Yahoo'}
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
                        selectedPlatform === platform
                          ? 'text-light-blue'
                          : 'text-almost-white'
                      }`}
                    >
                      {platform}
                      {(platform === 'Yahoo' || platform === 'ESPN') &&
                        ' (Coming Soon)'}
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
