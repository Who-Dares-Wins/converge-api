/**
 * Corporation.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    corporationId: { type: 'ref', columnType: 'bigint', unique: true },

    name: 'string',

    ticker: 'string',

    memberCount: 'number',

    isOwner: 'boolean',

    // Associations

    alliance: { model: 'alliance' },

    doctrines: { collection: 'doctrine' }

  },

  customToJSON: function() {
    this.corporationId = parseInt(this.corporationId);

    return this;
  }

};
