var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');


var app = express();

var MongoDBUtil = require('./modules/mongodb/mongodb.module').MongoDBUtil;

var UserController = require('./modules/user/user.module')().UserController;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

const config = require('./config/mongodb/mongodb-config.json');
mongoose.connect(`mongodb+srv://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.server}/${config.mongodb.database}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

MongoDBUtil.init();

app.use('/users', UserController);
app.use('/products', ProductController);


app.get('/', function (req, res) {
    var pkg = require(path.join(__dirname, 'package.json'));
    res.json({
        name: pkg.name,
        version: pkg.version,
        status: 'up'
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);

    res.json({
        message: res.locals.message,
        error: res.locals.error
    });
});

module.exports = app;
