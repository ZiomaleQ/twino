import consts from "./consts.ts";
import { Stream } from "./stream.ts";
import { Fields, TweetType } from "./types/tweet.ts";
import { UserType } from "./types/user.ts";

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

    async getTweet(id: string, options: Fields = {}): Promise<TweetType> {
        var optionsString = this._createOptionsString(options);
        var temp = await this._fetch<any>("GET", `tweets?ids=${id}${optionsString}`, "")
        return { ...temp.data[0], includes: { ...temp.includes } }
    }

    async getTweets(id: string[], options: Fields = {}): Promise<TweetType[]> {
        var optionsString = this._createOptionsString(options);
        var temp = await this._fetch<any>("GET", `tweets?ids=${id.join(",")}${optionsString}`, "")
        return temp.data as TweetType[]
    }

    async getUserBy(username: string, options: Fields = {}): Promise<UserType[]> {
        var optionsString = this._createOptionsString(options);
        var temp = await this._fetch<any>("GET", `${consts.ENDPOINTS.USERS_BY}?usernames=${username}${optionsString}`, "")
        return { ...temp.data[0], includes: { ...temp.includes } }
    }

    async getUsersBy(usernames: string[], options: Fields = {}): Promise<UserType[]> {
        var optionsString = this._createOptionsString(options);
        var temp = await this._fetch<any>("GET", `${consts.ENDPOINTS.USERS_BY}?usernames=${usernames.join(",")}${optionsString}`, "")
        return temp.data as UserType[]
    }

    _createOptionsString(options: Fields): string {
        var optionsString = "";
        if (options.all) options = { expansions: true, media: true, place: true, poll: true, tweet: true, user: true }
        if (options.expansions) optionsString += "&expansions=attachments.poll_ids,attachments.media_keys,author_id,entities.mentions.username,geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id"
        if (options.media) optionsString += "&media.fields=duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics"
        if (options.place) optionsString += "&place.fields=contained_within,country,country_code,full_name,geo,id,name,place_type"
        if (options.poll) optionsString += "&poll.fields=duration_minutes,end_datetime,id,options,voting_status"
        if (options.tweet) optionsString += "&tweet.fields=attachments,author_id,context_annotations,conversation_id,created_at,entities,geo,id,in_reply_to_user_id,lang,public_metrics,possibly_sensitive,referenced_tweets,source,text,withheld"
        if (options.user) optionsString += "&user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld"

        return optionsString
    }

    async _fetch<T>(method: string, path: string, body: string | FormData | null = "", json = true, contentType: string | boolean = "application/json", headers: any = {}): Promise<T> {
        if (contentType) headers["Content-Type"] = contentType

        var response = await this._performReq(`${consts.BASE_URL}/${path}`, {
            method, body, headers: {
                "Authorization": `Bearer ${this.bearer}`,
                ...headers,
            },
        })

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

        return resp
    }

    createFilteredStream(): Stream {
        return new Stream(this)
    }

    createSampledStream(): Stream {
        return new Stream(this, consts.ENDPOINTS.SAMPLED_STREAM)
    }
}