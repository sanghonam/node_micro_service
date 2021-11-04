const mysql = require('mysql');
const conn = {
    host: '3.144.29.25',
    user: 'root',
    password: '1234',
    database: 'monolithic'
};

const register = (method, pathname, params, cb) => {
    const response = {
        key: params.key,
        errorCode: 0,
        errormessage: "success",
    }

    if(!params.username || !params.password) {
        response.errorCode = 1;
        response.errormessage = 'Invalid Parameters';
        cb(response);
    } else {
        const connection = mysql.createConnection(conn);
        connection.connect();
        connection.query(
            "insert into members(username, password)  values(?, ?)",
            [params.username, params.password],
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
    const response = {
        key: params.key,
        errorCode: 0,
        errormessage: "success",
    }

    const connection = mysql.createConnection(conn);
    connection.connect();
    connection.query(
        `select id from members where username = "${params.username}" and password = "${params.password}"`,
        (error, results, fields) => {
        if(error || !results.length) {
            response.errorCode = 1;
            response.errormessage = error || "invalid password";
        } else {
            response.results = results[0].id;
        }
        cb(response);
    });
    connection.end();
};

const unregister = (method, pathname, params, cb) => {
    const response = {
        key: params.key,
        errorCode: 0,
        errormessage: "success",
    };

    const connection = mysql.createConnection(conn);
    connection.connect();
    connection.query(
        `delete from members where username = ${params.username};`,
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