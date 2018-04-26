/**
 * Character.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    characterId: { type: 'ref', columnType: 'bigint', unique: true },

    name: 'string',

    accessToken: 'string',

    refreshToken: 'string',

    lastEsiUpdate: 'string',

    // Associations

    corporation: { model: 'corporation' },

    alliance: { model: 'alliance' }

  },

  customToJSON: function() {
    this.characterId = parseInt(this.characterId);

    return _.omit(this, [
      'accessToken',
      'refreshToken'
    ]);
  }

};
