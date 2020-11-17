import consts from "./consts.ts";
import { Fields, TweetType } from "./types/tweet.ts";

export class Twino {
    bearer: string;
    api_key: string;
    secret_key: string;
    lastReq = 0;

    constructor(bearer: string = "", api_key: string = "", secret_key: string = "") {
        this.bearer = bearer;
        this.api_key = api_key;
        this.secret_key = secret_key;
    }

    async getTweets(...ids: string[]): Promise<TweetType[]> {
        var temp = await this._fetch<Response>("GET", `tweets?ids=${ids.join(',')}`, "", false)
        return (await temp.json()).data.map((x: any) => x as TweetType)
    }

    async getTweet(id: string): Promise<TweetType> {
        var temp = await this._fetch<Response>("GET", `tweets?ids=${id}`, "", false)
        return (await temp.json()).data[0] as TweetType
    }

    async getTweetWithOptions(id: string, options: Fields) {
        var optionsString = "";
        if (options.all) options = { expansions: true, media: true, place: true, poll: true, tweet: true, user: true }
        if (options.expansions) optionsString += "&expansions=attachments.poll_ids,attachments.media_keys,author_id,entities.mentions.username,geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id"
        if (options.media) optionsString += "&media.fields=duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics,promoted_metrics"
        if (options.place) optionsString += "&place.fields=contained_within,country,country_code,full_name,geo,id,name,place_type"
        if (options.poll) optionsString += "&poll.fields=duration_minutes,end_datetime,id,options,voting_status"
        if (options.tweet) optionsString += "&tweet.fields=attachments,author_id,context_annotations,conversation_id,created_at,entities,geo,id,in_reply_to_user_id,lang,public_metrics,possibly_sensitive,referenced_tweets,source,text,withheld"
        if (options.user) optionsString += "&user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld"

        var temp = await this._fetch<Response>("GET", `tweets?ids=${id}${optionsString}`, "", false)
        return (await temp.json()).data[0] as TweetType
    }

    async getTweetsWithOptions(id: string[], options: Fields) {
        var optionsString = "";
        if (options.all) options = { expansions: true, media: true, place: true, poll: true, tweet: true, user: true }
        if (options.expansions) optionsString += "&expansions=attachments.poll_ids,attachments.media_keys,author_id,entities.mentions.username,geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id"
        if (options.media) optionsString += "&media.fields=duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics,promoted_metrics"
        if (options.place) optionsString += "&place.fields=contained_within,country,country_code,full_name,geo,id,name,place_type"
        if (options.poll) optionsString += "&poll.fields=duration_minutes,end_datetime,id,options,voting_status"
        if (options.tweet) optionsString += "&tweet.fields=attachments,author_id,context_annotations,conversation_id,created_at,entities,geo,id,in_reply_to_user_id,lang,public_metrics,possibly_sensitive,referenced_tweets,source,text,withheld"
        if (options.user) optionsString += "&user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld"

        var temp = await this._fetch<Response>("GET", `tweets?ids=${id.join(",")}${optionsString}`, "", false)
        return (await temp.json()).data.map((x: any) => x as TweetType)
    }

    async _fetch<T>(method: string, path: string, body: string | FormData | null = "", json = true, contentType: string | boolean = "application/json", headers: any = {}): Promise<T> {
        if (contentType) headers["Content-Type"] = contentType

        var response = await this._performReq(`${consts.BASE_URL}/${path}`, {
            method, body, headers: {
                "Authorization": `Bearer ${this.bearer}`,
                ...headers,
            },
        })

        if (response.status == 400) throw Error((await response.json()).message)

        // deno-lint-ignore no-explicit-any
        let respJson: any
        if (json) {
            respJson = await response.json()
        } else if (response.status > 299 && response.status < 200) {
            throw Error(await response.text())
        }

        return json ? respJson : response;
    }

    async _performReq(path: string, req: RequestInit): Promise<Response> {
        var resp: Response;
        this.lastReq = 0
        if (this.lastReq == 0 || (Date.now() - this.lastReq > 250)) {
            this.lastReq = Date.now();
            resp = await fetch(path, req)
        } else {
            // await this.sleep(Date.now() - (this.lastReq + 250))
            this.lastReq = Date.now();
            resp = await fetch(path, req);
        }

        // if (resp.status == 429) {
        //     const { retry_after } = await resp.json();
        //     // await this.sleep(retry_after ?? 0);
        //     this.lastReq = Date.now();
        //     resp = await this._performReq(path, req)
        // }

        return resp
    }

}