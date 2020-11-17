import consts from "./consts.ts";

export class Twino {
    bearer: string;
    api_key: string;
    secret_key: string;
    lastReq = 0;

    constructor(bearer: string = "", api_key: string = "", secret_key: string = "") {
        this.bearer = bearer;
        this.api_key = api_key;
        this.secret_key = secret_key;
    }

    async _fetch<T>(method: string, path: string, body: string | FormData | null = "", json = true, contentType: string | boolean = "application/json", headers: any = {}): Promise<T> {
        if (contentType) headers["Content-Type"] = contentType

        var response = await this._performReq(`${consts.BASE_URL}/${path}`, {
            method, body, headers: {
                "Authorization": `Bearer ${this.bearer}`,
                ...headers,
            },
        })
        if (response.status == 400) throw Error((await response.json()).message)

        // deno-lint-ignore no-explicit-any
        let respJson: any
        if (json) {
            respJson = await response.json()
        } else if (response.status > 299 && response.status < 200) {
            throw Error(await response.text())
        }

        return json ? respJson : response;
    }

    async _performReq(path: string, req: RequestInit): Promise<Response> {
        var resp: Response;
        this.lastReq = 0
        if (this.lastReq == 0 || (Date.now() - this.lastReq > 250)) {
            this.lastReq = Date.now();
            resp = await fetch(path, req)
            console.log(await resp.json())
        } else {
            // await this.sleep(Date.now() - (this.lastReq + 250))
            this.lastReq = Date.now();
            resp = await fetch(path, req);
            console.log(await resp.json())
        }

        if (resp.status == 429) {
            console.log(await resp.json())
            const { retry_after } = await resp.json();
            // await this.sleep(retry_after ?? 0);
            this.lastReq = Date.now();
            resp = await this._performReq(path, req)
        }

        return resp
    }

}