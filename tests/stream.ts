import { Twino } from "../mod.ts";
import { bearer } from "./token.ts";

(async () => {
    var twino = new Twino(bearer)
    // await twino._fetch<Response>("POST", "tweets/search/stream/rules",
    //     JSON.stringify({
    //         add: [{ value: "from:twitterdev from:twitterapi has:links" }]
    //     }), false).then(async x => { console.log(await x.text()) })

    twino._fetch<Response>("GET", "tweets/search/stream", "", false).then(async x => { console.log(await x.text()) })
})()