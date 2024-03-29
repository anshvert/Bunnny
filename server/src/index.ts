import { Context, Elysia, InputSchema, MergeSchema, UnwrapRoute } from "elysia";
import { swagger } from '@elysiajs/swagger'
import { userController } from "./controllers/user.controller";
import { cors } from '@elysiajs/cors'
import { WS } from "elysia/dist/ws/types";
import { GetPathParameter, Prettify } from "elysia/dist/types";
import { ServerWebSocket, WebSocketHandler } from "bun";
import { messageController } from "./controllers/message.controller";
import { searchController } from "./controllers/search.controller";

const PORT = process.env.PORT || 4000

type webSocketOptions = WS.LocalHook<InputSchema<never & string>, MergeSchema<UnwrapRoute<WebSocketHandler<Context>, Prettify<any>>,
    Prettify<MergeSchema<{}, any>>> & {params: Record<GetPathParameter<"/ws">, string>},
    {request: {}, store: {}, derive: {}, resolve: {}}, {}, "/ws">

const app = new Elysia()
    .ws("/ws", {
        message(ws: ServerWebSocket<Context>, message: any) {
            if (message.action === "subscribe") {
                message.topics.forEach((topic) => {
                    ws.subscribe(topic)
                })
            } else {
                ws.publish(message.receiver, JSON.stringify(message))
            }
        }
    } as webSocketOptions)
    .use(swagger({
        path: "/v1/swagger",
        documentation: {
            info: {
                title: 'BunJS & ElysiaJS',
                version: '1.0.0',
          },
        }}))
    .use(cors())
    .get("/", () => "Hello Elysia")
    .group('/api',(app: Elysia<"/api">) =>
        app.use(userController)
            .use(messageController)
            .use(searchController))
    .listen(PORT);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
