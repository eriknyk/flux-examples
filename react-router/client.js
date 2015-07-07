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

var dehydratedState = window.App; // Sent from the server

window.React = React;// For chrome dev tool support
window.fluxibleDebug = debug;

bootstrapDebug('app.rehydrate');

function RenderApp(context, Handler){
    var mountNode = document.getElementById('app');
    var RouterComponent = <Router children={app.getComponent()} history={new BrowserHistory()} />;

    React.render(
        React.createElement(
            FluxibleComponent,
            { context: context.getComponentContext() },
            RouterComponent
        ),
        mountNode,
        function () {
            debug('React Rendered');
        }
    );
}

app.rehydrate(dehydratedState, function (err, context) {
    if (err) {
        throw err;
    }

    window.context = context;
    var firstRender = true;

    // const history = new BrowserHistory();

    // // Fix for react checksum problem
    // if (typeof history.setup === 'function') {
    //     history.setup();
    // }

    //Router.run(app.getComponent(), history.location, function (error, Handler, state) {
    Router.run(app.getComponent(), new BrowserHistory(), function (error, Handler, state) {
        if (firstRender) {
            // Don't call the action on the first render on top of the server rehydration
            // Otherwise there is a race condition where the action gets executed before
            // render has been called, which can cause the checksum to fail.
            bootstrapDebug('first firstRender');
            RenderApp(context, Handler);
            firstRender = false;
        } else {
            console.log('context.executeAction(navigateAction...');
            context.executeAction(navigateAction, state, function () {
                RenderApp(context, Handler);
            });
        }
    });
});
