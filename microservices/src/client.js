'use strick';

const net = require('net');

/**
 * @param host 접속 정보
 * @param onCreate 접속 완료
 * @param onRead 데이터 수신
 * @param onEnd 접속 종료
 * @param onError 에러 발생
 */
class tcpClient {
    constructor(host, port, onCreate, onRead, onEnd, onError) {
        this.options = {
            host,
            port
        };
        this.onCreate = onCreate;
        this.onRead = onRead;
        this.onEnd = onEnd;
        this.onError = onError;
    }

    // 접속 처리 함수
    connect() { 

        // 접속 완료
        this.client = net.connect(this.options, () => {
            if(this.client) {
                // 접속 완료 콜백
                this.onCreate(this.options);
            }
        })

        // 데이터 수신
        this.client.on('data', data => {
            var sz = this.merge ? this.merge + data.toString() : data.toString();
            var arr = sz.split('||');
            for(let n in arr) {
                if(sz.charAt(sz.length - 1) != '||' && n == arr.length - 1) {
                    this.merge = arr[n];
                    break;
                } else if(arr[n] == '') {
                    break;
                } else {
                    this.onRead(this.options, JSON.parse(arr[n]));
                }
            }
        })

        // 접속 종료
        this.client.on('close', () => {
            if(this.onEnd) {
                this.onEnd(this.options);
            }
        })

        // 에러 발생
        this.client.on('error', (err) => {
            if(this.onError) {
                this.onError(this.options, err);
            }
        })
    }

    // 데이터 발송
    write(packet) {
        this.client.write(JSON.stringify(packet) + '||');
    }
}

module.exports = tcpClient;