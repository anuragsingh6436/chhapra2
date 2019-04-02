const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();
var http=require('http');
var server = http.createServer(app);
var io= require('socket.io').listen(server);

// Passport Config
require('./config/passport')(passport);

app.use(express.static(__dirname));

// DB Config

mongoose.connect('mongodb+srv://asr_123:anurag@123@cluster0-nyfnu.mongodb.net/test1?retryWrites=true',{ useNewUrlParser: true });

let db =mongoose.connection;



db.once('open',function(){

  console.log('connected to mongodb'); 

});



db.on('error',function(err){

  console.log(err);

});
// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


//chat
io.sockets.on('connection',function(socket){
  connections.push(socket);
  console.log('Connected %s sockets connected',connections.length);

  socket.on('disconnect',function(data){
  
    users.splice(users.indexOf(socket.username),1);
    updataUsernames();
     connections.splice(connections.indexOf(socket),1);
      console.log("disconnected %s sockets connected",connections.length);
  });

  //send message
  socket.on('send message',function(data){
   io.sockets.emit('new message',{msg: data, user:socket.username});
  });

  //new user
  socket.on('new user',function(data,callback){
    //console.log('hhasr1');
    callback(true);
    socket.username= data;
    users.push(socket.username);
    updataUsernames();
  });
  function updataUsernames(){
    io.sockets.emit('get users',users);
  }
 
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server started on port ${PORT}`));