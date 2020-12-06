import { Twino } from "./client.ts";
import { Fields } from "./types/tweet.ts";
import { Evt } from "https://deno.land/x/evt/mod.ts";
import { TweetType } from "./types/tweet.ts"
import consts from "./consts.ts";

export class Stream {
    client: Twino
    rules: { value: string; tag?: string }[]
    connected = false
    endpoint: string

    constructor(client: Twino, endpoint = consts.ENDPOINTS.FILTERED_STREAM) {
        this.client = client
        this.rules = []
        this.endpoint = endpoint
    }

    async addRule(value: string, tag?: string) {
        this.rules.push({ value, tag })
    }

    async connect(options: Fields): Promise<{tweet: Evt<TweetType>, end: Evt<null>, disconnect: () => void}> {
        if (this.endpoint == consts.ENDPOINTS.FILTERED_STREAM) {
            const rules = await this.client._fetch("GET", consts.ENDPOINTS.RULES) as any
            const ids = rules.data.map((x: any) => x.id) ?? []
            await this.client._fetch("POST", consts.ENDPOINTS.RULES, JSON.stringify({ ids }))
            await this.client._fetch("POST", consts.ENDPOINTS.RULES, JSON.stringify({ add: this.rules }))
        }

        const events = {
            tweet: new Evt<TweetType>(),
            end: new Evt<null>(),
            disconnect: () => {}
        }

        console.log(this.endpoint)
        fetch(`${consts.BASE_URL}/${this.endpoint}`, {
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
                                events.tweet.post(parsed.data as TweetType)
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