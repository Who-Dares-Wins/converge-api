/**
 * Type.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    typeId: { type: 'ref', columnType: 'bigint', unique: true },

    name: 'string',

    description: 'string'

  },

  customToJSON: function() {
    this.typeId = parseInt(this.typeId);

    return this;
  }

};
