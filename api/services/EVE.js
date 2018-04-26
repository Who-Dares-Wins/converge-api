/**
 * EVE
 *
 * @description :: The gateway to ESI. Resolves EVE IDs to local records with caching.
 * @help        :: https://esi.tech.ccp.is/ui/
 */

let ESI = require('eve-swagger-simple');

module.exports = {

  async character(characterId) {
    if (!characterId)
      return;

    let localCharacter = await Character.findOne({ characterId });

    if (!localCharacter) {
      let {
        name,
        corporation_id: corporationId,
        alliance_id: allianceId
      } = await ESI.request(`/characters/${characterId}`);

      let alliance = await EVE.alliance(allianceId),
          corporation = await EVE.corporation(corporationId, alliance),
          lastEsiUpdate = new Date().toISOString();

      localCharacter = await Character.create({
        characterId,
        name,
        lastEsiUpdate,
        corporation: corporation ? corporation.id : null,
        alliance: alliance ? alliance.id : null
      })
      .intercept('E_UNIQUE', (e) => { sails.log.error(`[Swagger.character] Race condition: Tried to create a character that already exists. ${e}`) })
      .fetch();
    }

    return localCharacter;
  },

  async corporation(corporationId, allianceRecord) {
    if (!corporationId)
      return;

    let localCorporation = await Corporation.findOne({ corporationId });

    if (!localCorporation) {
      let { name,
            ticker,
            member_count: memberCount
          } = await ESI.request(`/corporations/${corporationId}`);

      localCorporation = await Corporation.create({
        corporationId,
        name,
        ticker,
        memberCount,
        alliance: allianceRecord ? allianceRecord.id : null
      })
      .intercept('E_UNIQUE', (e) => { sails.log.error(`[Swagger.corporation] Race condition: Tried to create a corporation that already exists. ${e}`) })
      .fetch();
    }

    return localCorporation;
  },

  async alliance(allianceId) {
    if (!allianceId)
      return;

    let localAlliance = await Alliance.findOne({ allianceId });

    if (!localAlliance || !localAlliance.name) {
      let { name, ticker } = await ESI.request(`/alliances/${allianceId}`);

      if (!localAlliance) {
        localAlliance = await Alliance.create({ allianceId, name, ticker })
          .intercept('E_UNIQUE', (e) => { sails.log.error(`[Swagger.alliance] Race condition: Tried to create an alliance that already exists. ${e}`) })
          .fetch();
      } else {
        localAlliance = await Alliance.update({ allianceId }, { name, ticker }).fetch();
        localAlliance = _.first(localAlliance);
      }
    }

    return localAlliance;
  },

  async type(typeId) {
    if (!typeId)
      return;

    let localType = await Type.findOne({ typeId });

    if (!localType) {
      let { name, description } = await ESI.request(`/universe/types/${typeId}`);

      localType = await Type.create({
        typeId,
        name,
        description
      })
      .intercept('E_UNIQUE', (e) => { sails.log.error(`[Swagger.type] Race condition: Tried to create a type that already exists. ${e}`) })
      .fetch();
    }

    return localType;
  },

};
