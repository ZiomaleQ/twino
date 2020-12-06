import { Twino } from "../mod.ts"
import { bearer } from "./token.ts"

(async () => {
    var twino = new Twino(bearer)
    var user = await twino.getUsers(["504805351", "1332823899092881408"]);
    console.log(user)
})()