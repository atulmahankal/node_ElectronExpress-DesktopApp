'use strict';
(function () {
    const express = require('express');
    const path = require('path');
    const logger = require('morgan');
    const cookieParser = require('cookie-parser');
    const bodyParser = require('body-parser');
    const router = express.Router();

    const app = express();
    // const publicPath = path.resolve(__dirname, '/public');

    // point for static assets
    app.use(express.static('public'));

    //view engine setup
    // app.set('views', path.join(__dirname, 'viewsviews'));
    // app.engine('html', require('ejs').renderFile);
    // app.set('view engine', 'html');

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended:true
    }));

    router.get('/', (req,res) => {
        // res.send('Welcome to express server');
        res.sendFile(path.join(__dirname+'/index.html'));
      });
    app.use('/', router);
    app.use(cookieParser());

    // const server = app.listen(port, () => console.log(`Express server listening on port ${port}`));

    module.exports = app;

}());