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
            this.client.debug.post("Fetching current rules...")
            const rules = await this.client._fetch("GET", consts.ENDPOINTS.RULES) as any
            this.client.debug.post(`Current rules: ${JSON.stringify(rules.data)}`)
            const ids = rules.data.map((x: any) => x.id) ?? []
            this.client.debug.post(`Deleting rules; ${JSON.stringify(ids)}`)
            await this.client._fetch("POST", consts.ENDPOINTS.RULES, JSON.stringify({ delete: { ids } }))
            this.client.debug.post(`Adding rules: ${JSON.stringify(this.rules)}`)
            await this.client._fetch("POST", consts.ENDPOINTS.RULES, JSON.stringify({ add: this.rules }))
        }

        const events = {
            tweet: new Evt<TweetType>(),
            end: new Evt<null>(),
            disconnect: () => {}
        }

        this.client.debug.post(`Starting stream, URL: ${consts.BASE_URL}/${this.endpoint}${this.client._createOptionsString(options, true)}`)
        fetch(`${consts.BASE_URL}/${this.endpoint}${this.client._createOptionsString(options, true)}`, {
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
                    t.client.debug.post("Stream started, waiting for data...")
                    const pump = (): any => {
                        events.disconnect = () => reader.cancel()
                        return reader.read().then(({ done, value }) => {
                            if (done) {
                                t.client.debug.post("Stream done.")
                                controller.close()
                                return events.end.post(null)
                            }

                            try {
                                t.client.debug.post("Parsing tweet...")
                                const parsed = JSON.parse(decoder.decode(value))
                                events.tweet.post(parsed.data as TweetType)
                            } catch {
                                t.client.debug.post("Some error occured during parse, ignoring.")
                            }
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