/**
 * Alliance.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    allianceId: { type: 'ref', columnType: 'bigint', unique: true },

    name: 'string',

    ticker: 'string',

    isOwner: 'boolean',

    // Associations

    corporations: { collection: 'corporation' },

    doctrines: { collection: 'doctrine' }

  },

  customToJSON: function() {
    this.allianceId = parseInt(this.allianceId);

    return this;
  }

};
