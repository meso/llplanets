
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.listen(3010);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

var io = require('socket.io').listen(app);
var slideCount = 0;
var slide = io.of('/slide').on('connection', function(socket) {
  slideCount++;
  slide.emit('count', {count: slideCount});

  socket.on('disconnect', function() {
    slideCount--;
    slide.emit('count', {count: slideCount});
  });
});

process.on('uncaughtException', function(err) {
  console.log(err.toString());
});

