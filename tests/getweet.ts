import { Twino } from "../mod.ts"
import { bearer } from "./token.ts"

(async () => {
    var twino = new Twino(bearer)
    var tweet = await twino.getTweet("1212092628029698048");
    console.log(tweet)
})()