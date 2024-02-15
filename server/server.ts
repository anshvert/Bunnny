Bun.serve({
    fetch(req, server) {
      if (server.upgrade(req)) {
        return;
      }
      return new Response('Upgrade failed :(', { status: 500 });
    },
    websocket: {
      message(ws, message) {
        console.log('Message received: ' + message);
        ws.send(`From Server: ${message}`)
      },
      open(ws) {
        console.log('Client connected');
      },
    },
    port: 4000,
});