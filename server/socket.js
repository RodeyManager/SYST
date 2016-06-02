var WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ host: '127.0.0.1', port: 3000 });

var stin, index = 0;

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    //ws.send('starting......');
    setInterval(function(){
        ws.send('starting......');
    }, 1000);
});
