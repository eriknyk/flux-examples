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

// window.React = React; // For chrome dev tool support
// debug.enable('*');

// bootstrapDebug('rehydrating app');

// function RenderApp(context, Handler){
//     bootstrapDebug('React Rendering');
//     var mountNode = document.getElementById('app');

//     console.log('---->', Handler);

//     var Component = React.createFactory(Handler);

//     console.log('---Component->', Component);

//     React.render(
//         React.createElement(
//             FluxibleComponent,
//             { context: context.getComponentContext() },
//             Component()
//         ),
//         mountNode,
//         function () {
//             bootstrapDebug('React Rendered');
//         }
//     );
// }

// app.rehydrate(dehydratedState, function (err, context) {
//     if (err) {
//         throw err;
//     }
//     window.context = context;
//     console.log('===BrowserHistory=>', BrowserHistory);
//     console.log('===HistoryLocation=>', HistoryLocation);
//     console.log('===app.getComponent()=>', app.getComponent());

//     var firstRender = true;
//     Router.run(app.getComponent(), BrowserHistory, function (Handler, state) {
//         if (firstRender) {
//             console.log('-------firstRender:true ---------->')
//             // Don't call the action on the first render on top of the server rehydration
//             // Otherwise there is a race condition where the action gets executed before
//             // render has been called, which can cause the checksum to fail.
//             RenderApp(context, Handler);
//             firstRender = false;
//         } else {
//             console.log('-------firstRender:false ---------->')
//             context.executeAction(navigateAction, state, function () {
//                 RenderApp(context, Handler);
//             });
//         }
//     });
// });

window.React = React;

console.log('-----tttt----', app.getComponent())


app.rehydrate(dehydratedState, function (err, context) {
    window.context = context;
    var firstRender = true;
console.log('-----iiii----', app.getComponent())
    Router.run(app.getComponent(), new BrowserHistory(), function (error, Handler, state) {
        if (firstRender) {
            console.log('-----ooo1-----')
            React.render(
                React.createElement(
                    FluxibleComponent,
                    { context: context.getComponentContext() },
                    <Router children={routes} history={new BrowserHistory()}/>
                ),
                document.getElementById('app')
            );
            firstRender = false;
            console.log('-----ooo-----')
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



