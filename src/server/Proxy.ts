const http = require('http');

class Proxy {

    constructor(options) {
    }

    on() {
        console.log('proxy on');
    }

    off() {
        console.log('')
    }
}

export { Proxy };