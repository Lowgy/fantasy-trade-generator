export interface League {
  id: string;
  name: string;
  avatar: string | null;
  type: string;
}

export interface PlayerData {
  id: string;
  player_id: string;
  first_name: string;
  last_name: string;
  position: string;
  value_1qb: number;
  value_2qb: number;
}

export interface Trade {
  id: number;
  league: string;
  myTeamName: string;
  otherTeamName: string;
  myTeamPlayers: {
    name: string;
    position: string;
    id: string;
    value_1qb: number | null;
    value_2qb: number | null;
  }[];
  otherTeamPlayers: {
    name: string;
    position: string;
    id: string;
    value_1qb: number | null;
    value_2qb: number | null;
  }[];
  timestamp: string;
}
