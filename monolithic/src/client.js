const http = require('http');

const options = {
    host: 'localhost',
    port: 8000,
    headers: {
        'Content-Type': 'application/json'
    }
}

const request = (cb, params) => {
    const req = http.request(options, res => {
        let data = '';

        res.on('data', chunk => {
        });

        res.on('end', (aaaa) => {
            cb();
        });
    })

    if(params) {
        req.write(JSON.stringify(params));
    }

    req.end();
}

const goods = (callback) => {
    goods_post(() => {
        goods_get(() => {
            goods_delete(callback);
        })
    })

    function goods_post(cb) {
        options.method = 'POST';
        options.path = '/goods';
        request(cb, {
            name: 'goods_name',
            category: 'category',
            price: 10000,
            description: 'description'
        });
    }

    function goods_get(cb) {
        options.method = 'GET';
        options.path = '/goods';
        request(cb);
    }

    function goods_delete(cb) {
        options.method = 'DELETE';
        options.path = '/goods?id=3';
        request(cb);
    }
}

goods(() => console.log('goods api test success'));