/**
 * Character.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    characterId: { type: 'number', unique: true },

    name: 'string',

    accessToken: 'string',

    refreshToken: 'string',

  },

  customToJSON: function() {
    return _.omit(this, [
      'accessToken',
      'refreshToken'
    ]);
  }

};
