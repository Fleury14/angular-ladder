interface ChallengeDB {
    challengerId: string;
    challengerName: string;
    challengerRank: number;
    defenderId: string;
    defenderName: string;
    defenderRank: number;
    game: string;
    deadline: number;
    dateSubmitted?: Date;
}

export default ChallengeDB;
