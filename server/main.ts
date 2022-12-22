import { createApp, createRouter, createError, toNodeListener, eventHandler, sendStream, setHeader } from "h3";
import { createServer } from "http";
import fetch from "node-fetch";
import { writeFile, existsSync, mkdirSync, createReadStream } from "fs";

const map = {} as Record<string, string>;
const app = createApp();

const router = createRouter()
    .get("/icon/:icon", eventHandler(e => {
        const name = e.context.params.icon;
        if (!existsSync("./icon/" + name + ".png")) {
            throw createError({
                statusCode: 404
            })
        }
        setHeader(e, "Content-Type", "image/png");
        return sendStream(e, createReadStream("./icon/" + name + ".png"));
    }))
    .get("/:package", eventHandler(
        async (e) => {
            const name = e.context.params.package;
            if (typeof name !== "string" || name.length === 0) {
                throw createError({
                    statusCode: 401,
                    data: {
                        message: "Invalid package name."
                    }
                })
            }
            let appName = map[name];
            if (!appName) {
                const result = await fetch("https://coolapk.com/apk/" + name, {
                    "headers": {
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                        "cache-control": "no-cache",
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "document",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "none",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1"
                    },
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": null,
                    "method": "GET"
                });
                const text = await result.text();
                appName = text.match(/<p class\="detail_app_title">(.*?)</)?.[1] || '';
                const icon = text.match(/http:\/\/pp.myapp.com\/ma_icon\/0\/icon_.*?\/256/)?.[0];
                if (icon) {
                    if (!existsSync("./icon")) {
                        mkdirSync("./icon");
                    }
                    if (!existsSync("./icon/" + name + ".png")) {
                        await new Promise<void>(async (resolve, reject) => {
                            try {
                                writeFile("./icon/" + name + ".png", Buffer.from(await (await fetch(icon)).arrayBuffer()), {}, () => {
                                    resolve();
                                });
                            } catch (e) {
                                reject(e);
                            }
                        });
                    }
                }
            }

            return {
                "packageName": name,
                "name": appName
            }
        }
    ));

app.use(router);
createServer(toNodeListener(app)).listen(3003);