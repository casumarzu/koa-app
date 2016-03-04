var koa = require('koa');
var router = require('koa-route');
var vhost = require('koa-vhost');
var Jade = require('koa-jade');
var path = require('path');
var _ = require('lodash');

var server = koa();
var server1 = koa();
var server2 = koa();
var server3 = koa();
var server4 = koa();
var server5 = koa();

const jadeConfig = {
  // viewPath: path.resolve(__dirname, 'server/views'),
  debug: true,
  locals: {
    page_title: 'Koa-jade example',
    author: 'Andrey Ivanov'
  }
}

var jade1 = new Jade(_.assign({}, jadeConfig, {
  viewPath: './server/views/'
}))

var jade2 = new Jade(_.assign({}, jadeConfig, {
  viewPath: path.resolve(__dirname, 'server/views')
}))

jade1.use(server1)

// server1.use(function *(next) {
//     // this.body = 'server1';
//     this.render('index')
// });

server1.use(router.get('/', function* () {
  // this.render('index')
  this.body = 'server1';
}))

server1.use(router.get('/foo', function* () {
  // this.render('h1 Hello, #{name}', { name: 'Jade' }, { fromString: true })
  // this.render('./server/views/index.jade', {
  //   title: 'Koa-jade: a Jade middleware for Koa'
  // })
  this.body = 'server1 foo';
}))

server2.use(function *(next) {
    this.body = 'server2';
});

server3.use(function *(next) {
    this.body = 'server3';
});

server4.use(function *(next) {
    this.body = 'server4';
});

server5.use(function *(next) {
    this.body = 'server5';
});

server.use(vhost('s1.example.com', server1));

server.use(vhost(/s2\.example\.com/, server2));

server.use(vhost({
    host: 's3.example.com',
    app: server3
}));

server.use(vhost([{
    host: 's4.example.com',
    app: server4
}, {
    host: /s5\.example\.com/,
    app: server5
}]));

server.use(function * (next) {
    this.body = 'default Koa server';
});

server.listen(3000, function() {
    console.log('server listening port 3000');
});
