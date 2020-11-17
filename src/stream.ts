import { Twino } from "./client.ts";
import { Fields } from "./types/tweet.ts";
import { Evt } from "https://deno.land/x/evt/mod.ts";
import { Tweet } from "./structs/Tweet.ts";
import consts from "./consts.ts";

export class Stream {
    client: Twino
    rules: { value: string; tag: string }[]
    constructor(client: Twino) {
        this.client = client;
        this.rules = [];
    }

    async addRule(value: string, tag: string) {
        this.rules.push({ value, tag })
    }

    async connect(options: Fields): /* Promise<Evt<Tweet>> */Promise<any> {
        this.client._fetch("POST", "tweets/search/stream/rules", JSON.stringify({ rules: this.rules }))

        fetch(`${consts.BASE_URL}/tweets/search/stream`, {
            method: "GET", headers: {
                "Authorization": `Bearer ${this.client.bearer}`
            }
        }).then(response => response.body)
            .then(body => {
                const reader = body!!.getReader();
                console.log("Cóź kurwa no nie działa")
                return new ReadableStream({
                    start(controller) {
                        return pump();
                        function pump(): any {
                            return reader.read().then(({ done, value }) => {
                                // When no more data needs to be consumed, close the stream
                                if (done) {
                                    controller.close();
                                    console.log("No to ok")
                                    return;
                                }
                                // Enqueue the next data chunk into our target stream
                                console.log("Daj no")
                                controller.enqueue(value);
                                return pump();
                            });
                        }
                    }
                })
            })
            .then(stream => new Response(stream))
            .then(response => response.json())
            .then(blob => {console.log(blob); console.log("Kozak")})
    }
}