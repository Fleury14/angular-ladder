interface StreamResult {
    stream: {
        game: string;
        viewers: number;
        channel: {
            url: string;
            status: string;
            video_banner: string;
        };
    };
}

export default StreamResult;
