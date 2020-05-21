const net = require('net');
const parser = require('./parser');

class Request {

    constructor(options) {
        this.method = options.method || 'GET';
        this.host = options.host;
        this.port = options.port || 8080;
        this.path = options.path || '/';
        this.body = options.body || {};
        this.headers = options.headers || {};

        if (!this.headers['Content-Type']) {
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        if (this.headers['Content-Type'] === 'application/json') {
            this.bodyText = JSON.stringify(this.body);
        } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            this.bodyText = Object.entries(this.body)
                .map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
        }

        this.headers['Content-Length'] = this.bodyText.length;
    }

    toString() {
        return `${this.method} ${this.path}/ HTTP/1.1\r
        ${Object.keys(this.headers).map((key) => `${key}: ${this.headers[key]}`).join('\r\n')}\r
        \r
        ${this.bodyText};`;
    }

    send(connection) {
        return new Promise((resolve, reject) => {
            let responseParser = new ResponseParser();
            if (connection) {
                connection.write(this.toString());
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString());
                })
            }
            connection.on('data', (data) => {
                responseParser.receive(data.toString());
                if (responseParser.isFinished) {
                    resolve(responseParser.response);
                }
                connection.end();
            });
            connection.on('error', (err) => {
                reject(err);
                connection.end();
            });
        })
    }
}

class Response {

}

class ResponseParser {
    constructor() {
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1; // \r
        this.WAITING_HEADER_NAME = 2; // :
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5; // \r
        this.WAITING_HEADER_BLOCK_END = 6; // \r\n
        this.WAITING_BODY = 7;

        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = '';
        this.headers = {};
        this.headerName = '';
        this.headerValue = '';
        this.bodyParser = null;
    }

    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished;
    }

    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }

    receive(string) {
        for (let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i));
        }
    }

    receiveChar(char) {
        if (this.current === this.WAITING_STATUS_LINE) {
            if (char === '\r') {
                this.current = this.WAITING_STATUS_LINE_END;
            } else if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            } else {
                this.statusLine += char;
            }
        } else if (this.current === this.WAITING_STATUS_LINE_END && char === '\n') {
            this.current = this.WAITING_HEADER_NAME;
        } else if (this.current === this.WAITING_HEADER_NAME) {
            if (char === ':') {
                this.current = this.WAITING_HEADER_SPACE;
            } else if (char === '\r') {
                this.current = this.WAITING_HEADER_BLOCK_END;
                if (this.headers['Transfer-Encoding'] === 'chunked') {
                    this.bodyParser = new TrunkedBodyParser();
                }
            } else {
                this.headersName += char;
            }
        } else if (this.current === this.WAITING_HEADER_SPACE && char === ' ') {
            this.current = this.WAITING_HEADER_VALUE;
        } else if (this.current === this.WAITING_HEADER_VALUE) {
            if (char === '\r') {
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headersName] = this.headersValue;
                this.headersName = '';
                this.headersValue = '';
            } else {
                this.headersValue += char;
            }
        } else if (this.current === this.WAITING_HEADER_LINE_END && char === '\n') {
            this.current = this.WAITING_HEADER_NAME;
        } else if (this.current === this.WAITING_HEADER_BLOCK_END && char === '\n') {
            this.current = this.WAITING_BODY;
        } else if (this.current === this.WAITING_BODY) {
            this.bodyParser.receiveChar(char);
        }
    }
}

class TrunkedBodyParser {
    constructor() {
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_TRUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;
        this.length = 0;
        this.content = [];
        this.isFinished = false;
        this.current = this.WAITING_LENGTH
    }

    receiveChar(char) {
        if (this.current === this.WAITING_LENGTH) {
            if (char === '\r') {
                if (this.length === 0) {
                    this.isFinished = true;
                } else {
                    this.current = this.WAITING_LENGTH_LINE_END;
                }
            } else {
                this.length *= 16;
                this.length += parseInt(char, 16);
            }
        } else if (this.current === this.WAITING_LENGTH_LINE_END && char === '\n') {
            this.current = this.READING_TRUNK;
        } else if (this.current === this.READING_TRUNK) {
            if (this.length > 0) {
                this.content.push(char);
                this.length--;
            }
            if (this.length === 0) {
                this.current = this.WAITING_NEW_LINE;
            }
        } else if (this.current === this.WAITING_NEW_LINE && char === '\r') {
            this.current = this.WAITING_NEW_LINE_END;
        } else if (this.current === this.WAITING_NEW_LINE_END && char === '\n') {
            this.current = this.WAITING_LENGTH;
        }
    }
}

void async function () {
    let request = new Request({
        method: 'POST',
        host: '127.0.0.1',
        port: '8080',
        headers: {
            'X-Foo': 'bar'
        },
        body: {
            user: 'llf17uw'
        }
    });
    let response = await request.send();
    let dom = parser.parseHTML(response.body);
    // console.log('Got response: ' + response);
    console.log('dom: ', dom);
}();