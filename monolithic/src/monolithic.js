const http = require('http');
const url = require('url');
const querystring = require('querystring');

const members = require('./monolithic_members');
const purchases = require('./monolithic_purchases');
const goods = require('./monolithic_goods');

const server = http.createServer((req, res) => {
    const method = req.method;
    const uri = url.parse(req.url, true);
    const pathname = uri.pathname;

    console.log('----------------------');
    console.log('method : ', method);
    console.log('pathname : ', pathname);

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
}).listen(8000);

/**
 * 
 * @param {*} res       response 객체
 * @param {*} method    메서드
 * @param {*} pathname  URI
 * @param {*} params    입력 파라미터
 */
const onRequest = (res, method, pathname, params) => {
   switch(pathname) {
        case '/members':
            members.onRequest(res, method, pathname, params, response);
            break;
        case '/goods':
            goods.onRequest(res, method, pathname, params, response);
            break;
        case '/purchases':
            purchases.onRequest(res, method, pathname, params, response);
            break;
        default:
            // 정의되지 않은 요청에 404 에러 리턴
            res.writeHead(404);
            return res.end(); 
   }
}

/**
 * 
 * @param res       response 객체
 * @param packet    결과 파라미터
 */
const response = (res, packet) => {
    res.writeHead(200, { 'Content-Type' : 'application/json' });
    res.end(JSON.stringify(packet));
}