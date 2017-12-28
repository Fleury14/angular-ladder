interface Player {
    name: string;
    psnId: string;
    wins: number;
    losses: number;
    elo: number;
    streak: string;
    rank: number;
    google?: string;
}

export default Player;
