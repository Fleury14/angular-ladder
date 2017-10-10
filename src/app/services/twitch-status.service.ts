import { Injectable, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';

import StreamResult from './../interfaces/stream-result';
import StreamModelResult from './../interfaces/stream-model';

import 'rxjs/add/operator/map';

declare var $: any;

@Injectable()


export class TwitchStatusService {

    public streamStatus: Object[] = [];
    public results = {
        esl_sc2: {},
        fresnogaminglive: {},
        TZN_Gaming: {},
        XsK_Samurai: {},
        Sigma349: {},
        LQFleury14: {}
    };
    private APIKey: String = '53wv511ngkdeb0lh2msons49a8p37z';
    private twitchAPI: String = 'https://api.twitch.tv/kraken/streams/';

    private listOfStreams: string[] = [ 'esl_sc2', 'fresnogaminglive', 'TZN_Gaming', 'XsK_Samurai', 'Sigma349', 'LQFleury14' ];
    public numberOfStreams: number = this.listOfStreams.length;


    constructor(private http: Http) {


        for (const stream  of this.listOfStreams) {
            const index = this.listOfStreams.indexOf(stream);
            this.twitchAPICall(stream).subscribe( response => { this.results[stream] = response; });
        }
    }

    private twitchAPICall(userstream) {
        return this.http.get(`${this.twitchAPI}${userstream}?client_id=${this.APIKey}?callback=JSONP_CALLBACK`)
        .map((res: Response) => res.json().stream);

    }

    public buildStatus() {
        // console.log(response, status);
        // console.log(this.streamStatus);
        // console.log(this.streamStatus[0]);
        console.log(this.results);
    }

    public getStatus(stream: string) {
        if (this.listOfStreams.indexOf(stream) < 0) {
            console.log('Error: Invalid stream passed to getStatus() in the twitch-status service.');
            return;
        } else if (this.results[stream] === null) {
            return 'Offline';
        } else {

            // console.log(this.streamStatus);
           return 'Online';

        }

    } // end getStatus

    public getStreamList() {
        return this.listOfStreams;
    }


}
