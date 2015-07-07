/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
require('babel/register');

import express from 'express';
import favicon from 'serve-favicon';
import serialize from 'serialize-javascript';
import navigateAction from './actions/navigate';
import React from 'react';
import app from './app';
import FluxibleComponent from 'fluxible/addons/FluxibleComponent';
import Router from 'react-router';
import Debug from 'debug';
import Location from 'react-router/lib/Location';

let debug = Debug('Example');
let HtmlComponent = React.createFactory(require('./components/Html.jsx'));
let server = express();

server.use(favicon(__dirname + '/../favicon.ico'));
server.use('/public', express.static(__dirname + '/build'));

server.use((req, res, next) => {
    var context = app.createContext();

    debug('Executing navigate action:', req.path);
    //var location = new Location(req.path, req.query);
    let location = new Location(req.originalUrl);

    Router.run(app.getComponent(), location, (error, initialState, transition) => {
        context.executeAction(navigateAction, initialState, function (err) {

            /* When it doesn't exist any state is because the resource doesn't exist */

            if (initialState) {
                debug('Exposing context state');
                var exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

                debug('Rendering Application component into html');

                 var RouterComponent = (
                    <Router
                        location={initialState.location}
                        branch={initialState.branch}
                        components={initialState.components}
                        params={initialState.params} />);

                var ApplicationComponent = React.createElement(
                    FluxibleComponent,
                    { context: context.getComponentContext() },
                    RouterComponent
                );

                var ApplicationMarkup = React.renderToString(ApplicationComponent);

                var html = React.renderToStaticMarkup(HtmlComponent({
                    state: exposed,
                    markup: ApplicationMarkup
                }));

                debug('Sending markup');
                res.type('html');
                res.write('<!DOCTYPE html>' + html);
                res.end();
            } else {
                let err = new Error();
                err.status = 404;
                next(err)
            }
        });
    });
});

var port = process.env.PORT || 3000;
server.listen(port);
console.log('Listening on port ' + port);
