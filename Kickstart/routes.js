// "next-routes" enables us to define dynamic routes which contain tokens/parameters in their URL
// "next-routes" exports a function which we need to immediately call
const routes = require("next-routes")();

routes
  .add("/campaigns/new", "/campaigns/new")
  .add("/campaigns/:campaignAddress", "/campaigns/show")
  .add("/campaigns/:campaignAddress/requests", "/campaigns/requests/list")
  .add("/campaigns/:campaignAddress/requests/new", "/campaigns/requests/new");

// routes exports a bunch of helper methods/components to enable the navigation among the pages
module.exports = routes;