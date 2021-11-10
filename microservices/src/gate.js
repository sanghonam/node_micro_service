
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const tcpClient = require('./client');

let mapClients = {};
let mapUrls = {};
let mapResponse = {};
let mapRR = {};
let index = 0;

const server = http.createServer((req, res) => {
    const method = req.method;
    const uri = url.parse(req.url, true);
    const pathname = uri.pathname;

    if(method === 'POST' || method === 'PUT') {
        let body = '';

        req.on('data', data => body+=data );

        req.on('end', () => {
            const params = req.headers['content-type'] === 'application/json' ?
                JSON.parse(body) : querystring.parse(body);
            onRequest(res, method, pathname, params);
        });
    } else {
        onRequest(res, method, pathname, uri.query);
    }
}).listen(8000, () => {
    console.log('listen', server.address);

    let packet = {
        uri: "/distributes",
        method: "POST",
        key: 0,
        params: {
            port: 8000,
            name: 'gate',
            urls: [],
        }
    }

    let isConnectedDistributor = false;

    this.clientDistributor = new tcpClient(
        '127.0.0.1',
        9000,
        options => { 
            isConnectedDistributor = true;
            this.clientDistributor.write(packet)
        },
        (options, data) => onDistribute(data),
        (options) => { isConnectedDistributor = false; }, // close
        (options) => { isConnectedDistributor = false; }, // error
    );

    setInterval(() => {
        if(isConnectedDistributor != true) {
            this.clientDistributor.connect();
        }
    }, 3000);
});

function onRequest(res, method, pathname, parmas) {
    let key = method + pathname; // POST/goods
    let client = mapUrls[key];

    if(!client) {
        res.writeHead(404);
        res.end();
        return;
    } else {
        params.key = index;

        let packet = {
            uri: pathname,
            method,
            params,
        };

        mapResponse[index] = res;
        index++;
        // 여기서부터 진행..
    }
}

function onDistribute(data) {
    for( let n in data.params ) {
        let node = data.params[n];
        let key = node.host + ':' + node.port;

        if(mapClients[key] == null && node.name != "gate") {
            let client = new tcpClient(node.host, 
                node.port, onCreateClient, onReadClient, onEndClient, onErrorClient);
            
            // 마이크로서비스 연결 정보 저장
            mapClients[key] = {
                client,
                info: node,
            };

            // 마이크로서비스 URL 정보 저장
            for( let m in node.urls ) {
                let key = node.urls[m];
                if(mapUrls[key] == null) {
                    mapUrls[key] = [];
                }
                mapUrls[key].push(client);
            }
            client.connect();

        }
    }
}

function onCreateClient(options) {};

function onReadClient(options, packet) {};

function onEndClient(options) {
    let key = options.host + ':' + options.port;
    for( let n in mapClients[key].info.urls) {
        let node = mapClients[key].info.urls[n];
        delete mapUrls[node];
    }
    delete mapClients[key];
}

function onErrorClient(options) {};
