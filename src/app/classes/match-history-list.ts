import MatchRecord from './../interfaces/match-record';

export default class MatchRecordList {
    private list: MatchRecord[];

    private buildList() {

        const listArr: any[] = [];

        listArr.push(['Tekken', '7/12', 'Reckless', 1, 'Steve', 'Fobi_Yo', 4, 'Jack, Kuma', 5, 1]);
        listArr.push(['Tekken', '7/19', 'Fobi_Yo', 4, 'Kuma', 'Fleury14', 6, 'Lars', 5, 4]);
        listArr.push(['Tekken', '7/24', 'El Rado', 3, 'Lili', 'Fleury14', 6, 'Lars', 5, 1]);
        listArr.push(['Tekken', '7/24', 'Domezy', 2, 'Paul', 'El Rado', 3, 'Lili', 5, 0]);
        listArr.push(['Tekken', '7/24', 'El Rado', 3, 'Lili', 'Fobi_Yo', 4, 'Kuma', 5, 3]);
        listArr.push(['Tekken', '8/3', 'Fleury14', 6, 'Lars', 'Jard', 5, 'Paul', 5, 1]);
        listArr.push(['Tekken', '8/16', 'Fobi_yo', 4, 'Yoshimitsu, Jack', 'Fleury14', 5, 'Lars', 5, 2]);
        listArr.push(['Tekken', '8/16', 'Domezy', 2, 'Katarina', 'Reckless', 1, 'Steve, Hwoarang', 5, 1]);

        for (let i = 0; i < listArr.length; i++) {
            this.list.unshift({
                game: listArr[i][0],
                date: listArr[i][1],
                winnerName: listArr[i][2],
                winnerRank: listArr[i][3],
                winnerChar: listArr[i][4],
                loserName: listArr[i][5],
                loserRank: listArr[i][6],
                loserChar: listArr[i][7],
                wins: listArr[i][8],
                losses: listArr[i][9]
            });
        }

        // this.list.unshift({
        //     game: 'Tekken',
        //     date: '7/12',
        //     winnerName: 'Reckless',
        //     winnerRank: 1,
        //     winnerChar: 'Steve',
        //     loserName: 'Fobi_Yo',
        //     loserRank: 4,
        //     loserChar: 'Jack, Kuma',
        //     wins: 5,
        //     losses: 1,
        // });


    }

    constructor() {
        this.list = [];
        this.buildList();
        console.log('Match history list built!');
    }

    public getMatchListLength() {
        return this.list.length;
    }

    public getMatchRecord(iteration: number) {
        return this.list[iteration];
    }

    public getRecentMatches() {
        return [this.list[0], this.list[1], this.list[2]];
    }
}
