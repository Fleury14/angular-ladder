interface Player {
    name: string;
    psnId: string;
    wins: number;
    losses: number;
    elo: number;
    streak: string;
    rank: number;
    gameWins?: number;
    gameLosses?: number;
    google?: string;
}

export default Player;
