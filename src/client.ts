import consts from "./consts.ts";
import { Stream } from "./stream.ts";
import { ExpansionFieldEnum, Fields, TweetFieldEnum, TweetType } from "./types/tweet.ts";
import { UserFieldEnum, UserType } from "./types/user.ts";
import { Evt } from "https://deno.land/x/evt/mod.ts";
import { MediaFieldEnum } from "./types/media.ts";
import { PlaceFieldEnum } from "./types/place.ts";
import { PollFieldEnum } from "./types/poll.ts";

export class Twino {
    bearer: string;
    api_key: string;
    secret_key: string;
    lastReq = 0;
    debug = new Evt<string>()

    constructor(bearer: string = "", api_key: string = "", secret_key: string = "") {
        this.bearer = bearer;
        this.api_key = api_key;
        this.secret_key = secret_key;
    }

    async getTweet(id: string, options: Fields = {}): Promise<TweetType> {
        var optionsString = this._createOptionsString(options, true);
        var temp = await this._fetch<any>("GET", `tweets/${id}${optionsString}`, "")
        return { ...temp.data, includes: { ...temp.includes } }
    }

    async getTweets(id: string[], options: Fields = {}): Promise<TweetType[]> {
        var optionsString = this._createOptionsString(options);
        var temp = await this._fetch<any>("GET", `tweets?ids=${id.join(",")}${optionsString}`, "")
        return temp.data as TweetType[]
    }

    async getUser(id: string, options: Fields = {}): Promise<UserType> {
        var optionsString = this._createOptionsString(options, true);
        var temp = await this._fetch<any>("GET", `users/${id}${optionsString}`, "")
        return temp.data
    }

    async getUsers(ids: string[], options: Fields = {}): Promise<UserType[]> {
        var optionsString = this._createOptionsString(options);
        var temp = await this._fetch<any>("GET", `users?ids=${ids.join(",")}${optionsString}`, "")
        return temp.data as UserType[]
    }

    async getUserBy(username: string, options: Fields = {}): Promise<UserType> {
        var optionsString = this._createOptionsString(options);
        var temp = await this._fetch<any>("GET", `${consts.ENDPOINTS.USER_BY}/${username}${optionsString}`, "")
        return temp.data
    }

    async getUsersBy(usernames: string[], options: Fields = {}): Promise<UserType[]> {
        var optionsString = this._createOptionsString(options);
        var temp = await this._fetch<any>("GET", `${consts.ENDPOINTS.USERS_BY}?usernames=${usernames.join(",")}${optionsString}`, "")
        return temp.data as UserType[]
    }

    // deno-lint-ignore no-explicit-any
    _enumValues(input: any) {
        return Object.keys(input)
            .map(x => input[x])
    }

    _createOptionsString(options: Fields, fromBlank = false): string {
        var optionsString = "", x = false;
        if (options.all) options = { expansions: true, media: true, place: true, poll: true, tweet: true, user: true }
        if (options.expansions) {
            if (typeof options.expansions == "boolean" && options.expansions == true) options.expansions = this._enumValues(ExpansionFieldEnum)
            optionsString += `${fromBlank && !x ? "?" : "&"}expansions=${options.expansions.join(",")}`
            x = true
        }    
        if (options.media) {
            if (typeof options.media == "boolean" && options.media == true) options.media = this._enumValues(MediaFieldEnum)
            optionsString += `${fromBlank && !x ? "?" : "&"}media.fields=${options.media.join(",")}`
            x = true
        }    
        if (options.place) {
            if (typeof options.place == "boolean" && options.place == true) options.place = this._enumValues(PlaceFieldEnum)
            optionsString += `${fromBlank && !x ? "?" : "&"}place.fields=${options.place.join(",")}`
            x = true
        }
        if (options.poll) {
            if (typeof options.poll == "boolean" && options.poll == true) options.poll = this._enumValues(PollFieldEnum)
            optionsString += `${fromBlank && !x ? "?" : "&"}poll.fields=${options.poll.join(",")}`
            x = true
        }
        if (options.tweet) {
            if (typeof options.tweet == "boolean" && options.tweet == true) options.tweet = this._enumValues(TweetFieldEnum)
            optionsString += `${fromBlank && !x ? "?" : "&"}tweet.fields=${options.tweet.join(",")}`
            x = true
        }
        if (options.user) {
            if (typeof options.user == "boolean" && options.user == true) options.user = this._enumValues(UserFieldEnum)
            optionsString += `${fromBlank && !x ? "?" : "&"}user.fields=${options.user.join(",")}`
            x = true
        }

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