/**
 * Doctrine.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name: 'string',

    description: 'string',

    priority: 'number',

    readiness: 'number', // computed

    active: { type: 'boolean', defaultsTo: true },

    // Associations

    author: { model: 'account' },

    corporation: { model: 'corporation' },

    alliance: { model: 'alliance' },

    fittings: { collection: 'fitting' }

  },

};
