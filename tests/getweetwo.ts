import { Twino } from "../mod.ts"
import { bearer } from "./token.ts"

(async () => {
    var twino = new Twino(bearer)
    var tweet = await twino.getTweet("1212092628029698048", { all: true });
    // var tweet1 = await twino.getTweetWithOptions("1263145271946551300", {})
    // var tweet2 = await twino.getTweetWithOptions("1260294888811347969", { all: true })
    console.log(tweet)
})()