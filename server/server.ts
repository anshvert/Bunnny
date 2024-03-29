Bun.serve({
    fetch(req, server) {
        if (server.upgrade(req)) {
            return;
        }
        return new Response('Upgrade failed :(', { status: 500 });
    },
    websocket: {
        message(ws, message: string) {
            console.log(message)
        const messageData = JSON.parse(message)
        if (messageData.action === "subscribe") {
            messageData.topics.forEach((topic) => {
                ws.subscribe(topic)
            })
        } else {
            ws.publish(messageData.receiver,JSON.stringify(messageData))
        }
      },
        open(ws) {
            console.log('Client connected');
      },
    },
    port: 4500,
});