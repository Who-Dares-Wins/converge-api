/**
 * Type.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    typeId: { type: 'number', unique: true },

    name: 'string',

    description: 'string'

  },

};
