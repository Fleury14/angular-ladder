export default class StreamModelResult {
    game: string;
    status: string;
    display_name: string;
    viewers: string;
    language: string;
    followers: string;
    url: string;
    logo: string;

    constructor(obj?: any) {
        this.game = obj.game;
        this.status = obj.status;
        this.display_name = obj.display_name;
        this.viewers = obj.viewers;
        this.language = obj.language;
        this.followers = obj.followers;
        this.url = obj.url;
        this.logo = obj.logo;
    }
 }
