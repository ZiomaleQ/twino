import { Twino } from "../mod.ts"
import { bearer } from "./token.ts"

(async () => {
    var twino = new Twino(bearer)
    var stream = twino.createStream();
    stream.addRule("test", "")
    stream.connect({ all: false })
})()