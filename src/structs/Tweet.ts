import { Twino } from "../client.ts";
import { TweetType } from "../types/tweet.ts";

export class Tweet {
    data: TweetType;
    client: Twino;
    constructor(data: TweetType, client: Twino) {
        this.data = data;
        this.client = client;
    }

    generateUrl() {

    }
}