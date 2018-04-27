/**
 * Account.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    lastLogin: 'string',

    accessLevel: { type: 'number', defaultsTo: 0 },

    settings: { type: 'json', defaultsTo: {} },

    // Associations

    mainCharacter: { model: 'character', required: true },

    altCharacters: { collection: 'character' }

  },

};

