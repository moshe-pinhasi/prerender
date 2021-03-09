#!/usr/bin/env node
var prerender = require('./lib');

// var server = prerender();

// var server = prerender({
//     chromeLocation: '/app/.apt/usr/bin/google-chrome'
// });

var server = prerender();

server.use(prerender.sendPrerenderHeader());
// server.use(prerender.blockResources());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());
console.log('prerender server is running 2')
server.start();
