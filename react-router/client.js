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

bootstrapDebug('app.rehydrate');

app.rehydrate(dehydratedState, function (err, context) {
    if (err) {
        throw err;
    }

    window.context = context;
    var firstRender = true;
    const history = new BrowserHistory();

    // Fix for react checksum problem
    if (typeof history.setup === 'function') {
        history.setup();
    }


    Router.run(app.getComponent(), history.location, function (error, Handler, state) {
        if (firstRender) {
            bootstrapDebug('first firstRender');
            React.render(
                React.createElement(
                    FluxibleComponent,
                    { context: context.getComponentContext() },
                    <Router children={ app.getComponent() } history={ history } />
                ), document.getElementById('app')
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
