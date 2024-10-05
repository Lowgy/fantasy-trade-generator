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
}
