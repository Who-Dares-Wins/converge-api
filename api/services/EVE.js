/**
 * EVE
 *
 * @description :: The gateway to ESI. Resolves EVE IDs to local records with caching.
 * @help        :: https://esi.tech.ccp.is/ui/
 */

let ESI = require('eve-swagger-simple');

module.exports = {

  async character(characterId, forceRefresh) {
    if (!characterId)
      return;

    let localCharacter = await Character.findOne({ characterId });

    if (!localCharacter || forceRefresh) {
      let {
        name,
        corporation_id: corporationId,
        alliance_id: allianceId
      } = await ESI.request(`/characters/${characterId}`);

      let alliance = await EVE.alliance(allianceId, forceRefresh),
          corporation = await EVE.corporation(corporationId, alliance, forceRefresh),
          lastEsiUpdate = new Date().toISOString();

      let payload = {
        characterId,
        name,
        lastEsiUpdate,
        corporation: corporation ? corporation.id : null,
        alliance: alliance ? alliance.id : null
      };

      if (localCharacter) {
        localCharacter = await Character.update(localCharacter.id, payload).fetch();
        localCharacter = _.first(localCharacter);
      } else {
        localCharacter = await Character.create(payload);
      }
    }

    return localCharacter;
  },

  async corporation(corporationId, allianceRecord, forceRefresh) {
    if (!corporationId)
      return;

    let localCorporation = await Corporation.findOne({ corporationId });

    if (!localCorporation || forceRefresh) {
      let { 
        name,
        ticker,
        member_count: memberCount
      } = await ESI.request(`/corporations/${corporationId}`);

      let payload = {
        corporationId,
        name,
        ticker,
        memberCount,
        alliance: allianceRecord ? allianceRecord.id : null
      };

      if (localCorporation) {
        localCorporation = await Corporation.update(localCorporation.id, payload).fetch();
        localCorporation = _.first(localCorporation);
      } else {
        localCorporation = await Corporation.create(payload);
      }
    }

    return localCorporation;
  },

  async alliance(allianceId, forceRefresh) {
    if (!allianceId)
      return;

    let localAlliance = await Alliance.findOne({ allianceId });

    if (!localAlliance || !localAlliance.name || forceRefresh) {
      let { 
        name,
        ticker
      } = await ESI.request(`/alliances/${allianceId}`);

      let payload = {
        allianceId,
        name,
        ticker
      };

      if (localAlliance) {
        localAlliance = await Alliance.update(localAlliance.id, payload).fetch();
        localAlliance = _.first(localAlliance);
      } else {
        localAlliance = await Alliance.create(payload);
      }
    }

    return localAlliance;
  },

  async type(typeId, forceRefresh) {
    if (!typeId)
      return;

    let localType = await Type.findOne({ typeId });

    if (!localType) {
      let {
        name,
        description
      } = await ESI.request(`/universe/types/${typeId}`);

      let payload = {
        typeId,
        name,
        description
      };

      if (localType) {
        localType = await Type.update(localType.id, payload).fetch();
        localType = _.first(localType);
      } else {
        localType = await Type.create(payload);
      }
    }

    return localType;
  },

};
