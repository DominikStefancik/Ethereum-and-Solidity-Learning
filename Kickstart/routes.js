// "next-routes" enables us to define dynamic routes which contain tokens/parameters in their URL
// "next-routes" exports a function which we need to immediately call
const routes = require("next-routes")();

// routes exports a bunch of helper methods/components to enable the navigation among the pages
module.exports = routes;