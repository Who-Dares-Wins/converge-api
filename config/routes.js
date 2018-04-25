/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  'GET /api/auth/authorize' : 'AuthController.authorize',
  'GET /api/auth/token' : 'AuthController.token',
  'GET /api/auth/whoami': 'AuthController.whoAmI'

};
