interface ChallengeDB {
    challengerId: string;
    challengerName: string;
    challengerRank: number;
    challengerGoogle?: string;
    defenderId: string;
    defenderName: string;
    defenderRank: number;
    defenderGoogle?: string;
    game: string;
    deadline: number;
    dateSubmitted?: Date;
}

export default ChallengeDB;
