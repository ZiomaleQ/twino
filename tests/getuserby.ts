import { Twino } from "../mod.ts"
import { bearer } from "./token.ts"

(async () => {
    var twino = new Twino(bearer)
    var user = await twino.getUserBy("deepivin");
    console.log(user)
})()