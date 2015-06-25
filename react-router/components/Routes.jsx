var React = require('react');
var Route = require('react-router').Route;
var DefaultRoute = require('react-router').DefaultRoute;
var Application = require('./Application.jsx');
var Home = require('./Home.jsx');
var About = require('./About.jsx');

var routes2 = (
    <Route name="app" path="/" handler={Application}>
        <Route name="about" handler={About}/>
        <DefaultRoute name="home" handler={Home}/>
    </Route>
);

var routes = {
  path: '/',
  component: Application,
  childRoutes: [
    { path: 'about', component: About },
    { path: 'home', component: Home, default: true },
  ]
};

module.exports = routes;