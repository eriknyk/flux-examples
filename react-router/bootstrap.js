/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
require('babel/register');
var express = require('express');
var favicon = require('serve-favicon');
var serialize = require('serialize-javascript');
var navigateAction = require('./actions/navigate');
var debug = require('debug')('Example');
var React = require('react');
var app = require('./app');
var HtmlComponent = React.createFactory(require('./components/Html.jsx'));
var FluxibleComponent = require('fluxible/addons/FluxibleComponent');
var Router = require('react-router').default;

var server = express();
server.use(favicon(__dirname + '/../favicon.ico'));
server.use('/public', express.static(__dirname + '/build'));

// server.use(function (req, res, next) {
//     var context = app.createContext();

//     Router.run(app.getComponent(), req.path, function (Handler, state) {
//         context.executeAction(navigateAction, state, function () {

//             var exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

//             var Component = React.createFactory(Handler);
//             var html = React.renderToStaticMarkup(HtmlComponent({
//                 state: exposed,
//                 markup: React.renderToString(
//                     React.createElement(
//                         FluxibleComponent,
//                         { context: context.getComponentContext() },
//                         Component()
//                     )
//                 )
//             }));
//             debug('Sending markup');
//             res.send(html);
//         });
//     });
// });

var Location = require('react-router/lib/Location');

server.use(function (req, res, next) {
    var context = app.createContext();
    var location = new Location(req.path, req.query);

    //console.log('->', context);

    Router.run(app.getComponent(), location, (error, initialState, transition) => {
        //console.log('-> initialState -->', initialState);
        context.executeAction(navigateAction, initialState, function () {
            //var html = React.renderToString(<Router {...initialState}/>);
            //var html = '<h1>Hello</h1>';
            var exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';


            //var Component = app.getComponent();

            console.log('---server:::: initialState', initialState);

            var html = React.renderToStaticMarkup(HtmlComponent({
                state: exposed,
                markup: React.renderToString(
                    React.createElement(
                    FluxibleComponent,
                    { context: context.getComponentContext() },
                    <Router {...initialState}/>
                )),
                context: context.getComponentContext()
            }));


            res.send(html);
        });
    });
});

var port = process.env.PORT || 3000;
server.listen(port);
console.log('Listening on port ' + port);
