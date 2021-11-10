'use strick';

const net = require('net');
const tcpClient = require('./client');

class tcpServer {
    // 서버 이름, 리슨 포트, 처리할 주소 목록
    constructor(name, port, urls) {

        // 서버 정보
        this.context = {
            name,
            port,
            urls
        }

        this.merge = {};

        // 서버 생성
        this.server = net.createServer(socket => {
            this.onCreate(socket);

            socket.on('error', exception => {
                this.onClose(socket);
            })

            socket.on('close', () => {
                this.onClose(socket);
            })

            socket.on('data', data => {
                let key = `${socket.remoteAddress}:${socket.remotePort}`;
                let sz = this.merge[key] ? this.merge[key] + data.toString() : data.toString();
                let arr = sz.split('||');
                for(let n in  arr) {
                    if(sz.charAt(sz.length - 1) != '||' && n == arr.length - 1) {
                        this.merge[key] = arr[n];
                        break;
                    } else if(arr[n] == '') {
                        break;
                    } else {
                        this.onRead(socket, JSON.parse(arr[n]));
                    }
                }
            })
        })

        this.server.on('error', err => {
            console.log(err);
        })

        this.server.listen(port, () => {
            console.log('listen : ', this.server.address());
        })

    }

    onCreate(socket) {
        console.log('onCreate', socket.remoteAddress, socket.remotePort);
    }

    onClose(socket) {
        console.log('onClose', socket.remoteAddress, socket.remotePort);
    }

    connectDistributor(host, port, onNoti) {
        let packet = {
            uri: '/distributes',
            method: 'POST',
            ket: 0,
            params: this.context,
        };

        let isConnectedDistributor = false;

        this.clientDistributor = new tcpClient(
            host,
            port,
            (options) => {  // connect success
                isConnectedDistributor = true;
                this.clientDistributor.write(packet);
            },
            (options, data) => onNoti(data),
            (options) => { isConnectedDistributor = false; }, // close
            (options) => { isConnectedDistributor = false; }, // error
        )

        setInterval(() => {
            if(isConnectedDistributor != true) {
                this.clientDistributor.connect();
            }
        }, 3000);
    }
}

module.exports = tcpServer;