/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
/*global App, document, window */
'use strict';
var React = require('react');
var debug = require('debug');
var bootstrapDebug = debug('Example');
var app = require('./app');
var dehydratedState = window.App; // Sent from the server
var Router = require('react-router').default;
var HistoryLocation = Router.HistoryLocation;
var navigateAction = require('./actions/navigate');
var FluxibleComponent = require('fluxible/addons/FluxibleComponent');

var BrowserHistory = require('react-router/lib/BrowserHistory');
var HashHistory = require('react-router/lib/HashHistory');

import routes from './components/Routes.jsx';

window.fluxibleDebug = debug;
window.React = React;

app.rehydrate(dehydratedState, function (err, context) {
    if (err) {
        throw err;
    }

    window.context = context;
    var firstRender = true;

    Router.run(routes, new BrowserHistory(), function (error, Handler, state) {
        if (firstRender) {
            React.render(
                React.createElement(
                    FluxibleComponent,
                    { context: context.getComponentContext() },
                    <Router children={routes} history={new BrowserHistory()}/>
                ),
                document.getElementById('app')
            );
            firstRender = false;
        } else {
            context.executeAction(navigateAction, state, function () {
                React.render(
                    React.createElement(
                        FluxibleComponent,
                        { context: context.getComponentContext() },
                        <Router children={routes} history={new BrowserHistory()}/>
                    ),
                    document.getElementById('app')
                );
            });
        }
    });
});
