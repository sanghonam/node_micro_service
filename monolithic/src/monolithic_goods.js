const mysql = require('mysql');
const conn = {
    host: '3.144.29.25',
    user: 'root',
    password: '1234',
    database: 'monolithic'
};

const register = (method, pathname, params, cb) => {
    console.log('_____goods register_____');

    const response = {
        errorCode: 0,
        errormessage: "success",
    }

    if(!params.name || !params.category || !params.price || !params.description) {
        response.errorCode = 1;
        response.errormessage = 'Invalid Parameters';
        cb(response);
    } else {
        const connection = mysql.createConnection(conn);
        connection.connect();
        connection.query(
            "insert into goods(name, category, price, description) values(?, ?, ?, ?)",
            [params.name, params.category, params.price, params.description],
            (error, results, fields) => {
                if(error) {
                    response.errorCode = 1;
                    response.errormessage = error;
                }
                cb(response);
        });
        connection.end();
    }
};

const inquiry = (method, pathname, params, cb) => {
    console.log('_____goods inquiry_____');

    const response = {
        errorCode: 0,
        errormessage: "success",
    }

    const connection = mysql.createConnection(conn);
    connection.connect();
    connection.query('select *from goods', (error, results, fields) => {
        if(error) {
            response.errorCode = 1;
            response.errormessage = error;
        } else {
            response.results = results;
        }
        cb(response);
    });
    connection.end();
};

const unregister = (method, pathname, params, cb) => {
    console.log('_____goods unregister_____');
    
    const response = {
        errorCode: 0,
        errormessage: "success",
    };

    const connection = mysql.createConnection(conn);
    connection.connect();
    connection.query(
        'delete from goods where id = ?',
        [params.id],
        (error, results, fields) => {
        if(error) {
            response.errorCode = 1;
            response.errormessage = error;
        }
        cb(response);
    });
    connection.end();
};

exports.onRequest = function(res, method, pathname, params, cb) {
    switch(method) {
        case 'POST':
            return register(method, pathname, params, (response) => {
                process.nextTick(cb, res, response)});
        case 'GET':
            return inquiry(method, pathname, params, (response) => {
                process.nextTick(cb, res, response)});
        case 'DELETE':
            return unregister(method, pathname, params, (response) => {
                process.nextTick(cb, res, response)});
        default:
            return process.nextTick(cb, res, null);
    }
}