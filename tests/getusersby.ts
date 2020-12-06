import { Twino } from "../mod.ts"
import { bearer } from "./token.ts"

(async () => {
    var twino = new Twino(bearer)
    var user = await twino.getUsersBy(["deepivin","maru039"]);
    console.log(user)
})()