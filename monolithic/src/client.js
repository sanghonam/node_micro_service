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
            console.log(chunk);
            data += chunk;
        });

        res.on('end', () => {
            cb(data);
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
        options.path = '/goods?id=6';
        request(cb);
    }
}

const members = (callback) => {
    memebers_post(() => {
        memebers_get(() => {
            memebers_delete(callback);
        });
    });

    function memebers_post(cb) {
        options.method = 'POST';
        options.path = '/members';
        request(cb, {
            username: 'username',
            password: 'password',
            passwordConfirm: 'password',
        });
    }

    function memebers_get(cb) {
        options.method = 'GET';
        options.path = '/members?username=username&password=password';
        request(cb);
    }

    function memebers_delete(cb) {
        options.method = 'DELETE';
        options.path = '/members?username=username';
        request(cb);
    }
}

const purchases = (callback) => {
    purchases_post(() => {
        purchases_get(callback);
    });

    function purchases_post(cb) {
        options.method = 'POST';
        options.path = '/purchases';
        request(cb, {
            userid: 1,
            goodsid: 1,
        });
    }

    function purchases_get(cb) {
        options.method = 'GET';
        options.path = '/purchases?userid=1';
        request(cb);
    }
}

goods(() => {
    console.log('goods api test success');
    members(() => {
        console.log('members api test success');
        purchases(() => {
            console.log('purchases api test success');
        })
    });
});

