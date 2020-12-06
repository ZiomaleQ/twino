import { Twino } from "../mod.ts"
import { bearer } from "./token.ts"

(async () => {
    var twino = new Twino(bearer)
    var stream = twino.createSampledStream();
    const events = await stream.connect({ all: false })
    events.tweet.attach(console.log)
    events.end.attach(() => console.log("koniec"))
    // setTimeout(() => events.disconnect(), 5000)
})()