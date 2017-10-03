interface MatchRecord {
    game: string;
    date: string;
    winnerName: string;
    winnerRank: number;
    winnerChar: string;
    loserName: string;
    loserRank: number;
    loserChar: string;
    wins: number;
    losses: number;
}

export default MatchRecord;
