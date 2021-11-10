'use strict';

// 비지니스 로직 파일
const business = require('../../monolithic/src/monolithic_members');

class members extends require('./server.js') {
    constructor() {
        // 부모 클래스 생성자 
        super('members', 9020, ['POST/members', 'GET/members', 'DELETE/members']);

        this.connectDistributor('127.0.0.10', 9000, data => console.log('Distributor Notification', data));
    }

    // 클라이언트 요청에 따른 비지니스 로직
    onRead(socket, data) {
        console.log('onRead : ', socket.remoteAddress, socket.remotePort, data);
        
        business.onRequest(socket, data.method, data.uri, data.params, (s, packet) => {
            socket.write(JSON.stringify(packet) + '||'); // 응답 패킷 전송
        })
    }
}

new members();