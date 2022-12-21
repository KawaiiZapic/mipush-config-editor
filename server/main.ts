import { createApp, createRouter, createError, toNodeListener, eventHandler } from "h3";
import { createServer } from "http";

const app = createApp();

const router = createRouter().get("/:package", eventHandler(
    async (e) => {
        const name = e.context.params.package;
        if (typeof name !== "string") {
            throw createError({
                statusCode: 401,
                data: {
                    message: "Invalid package name."
                }
            })
        }
        return {
            "packageName": name,
            "name": "XXX",
            "image": "link"
        }
    }
));

app.use(router);
createServer(toNodeListener(app)).listen(3003);