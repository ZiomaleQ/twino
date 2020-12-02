import { Twino } from "./client.ts";
import { Fields } from "./types/tweet.ts";
import { Evt } from "https://deno.land/x/evt/mod.ts";
import { Tweet } from "./structs/Tweet.ts";
import { TweetType } from "./types/tweet.ts"
import consts from "./consts.ts";

export class Stream {
    client: Twino
    rules: { value: string; tag?: string }[]
    connected = false
    constructor(client: Twino) {
        this.client = client;
        this.rules = [];
    }

    async addRule(value: string, tag?: string) {
        this.rules.push({ value, tag })
    }

    async connect(options: Fields): Promise<{tweet: Evt<Tweet>, end: Evt<null>, disconnect: () => void}> {
        const rules = await this.client._fetch("GET", "tweets/search/stream/rules") as any
        const ids = rules.data.map((x: any) => x.id) ?? []
        await this.client._fetch("POST", "tweets/search/stream/rules", JSON.stringify({ ids }))
        await this.client._fetch("POST", "tweets/search/stream/rules", JSON.stringify({ add: this.rules }))

        const events = {
            tweet: new Evt<Tweet>(),
            end: new Evt<null>(),
            disconnect: () => {}
        }

        fetch(`${consts.BASE_URL}/tweets/search/stream`, {
            method: "GET", headers: {
                "Authorization": `Bearer ${this.client.bearer}`
            }
        }).then((response: Response) => {
            this.connected = true
            const reader = response.body?.getReader()
            if (!reader) throw Error("CHUJ");
            const decoder = new TextDecoder("utf-8")
            const t = this
            return new ReadableStream({
                start(controller) {
                    const pump = (): any => {
                        events.disconnect = () => reader.cancel()
                        return reader.read().then(({ done, value }) => {
                            if (done) {
                                controller.close()
                                return events.end.post(null)
                            }

                            try {
                                const parsed = JSON.parse(decoder.decode(value))
                                events.tweet.post(new Tweet(parsed.data as TweetType, t.client))
                            } catch {}
                            controller.enqueue(value)
                            return pump()
                        });
                    }

                    return pump()
                }
            })
        })

        return events
    }
}