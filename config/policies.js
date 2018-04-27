/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // Leave for dev, tighten for prod
  '*': 'sessionAuth',

  // Blueprint actions to lock down:
  // find
  // findOne
  // create
  // update
  // destroy
  // populate
  // add
  // remove
  // replace

  // TODO
  // AllianceController: {},
  // CorporationController: {},
  // DoctrineController: {},
  // FittingController: {},
  // OperationController: {},
  // TimerController: {},

  AuthController: { '*': true }

};
