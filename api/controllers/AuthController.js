/**
 * AuthController
 *
 * @description :: EVE SSO
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let SSO = require('eve-sso-simple'),
    client_id = process.env.ESI_CLIENT_ID,
    client_secret = process.env.ESI_CLIENT_SECRET;

module.exports = {

  authorize: (req, res) => {
    return SSO.login({
      client_id,
      client_secret,
      redirect_uri: `${process.env.BASE_URL}/api/auth/token`,
      scope: 'esi-calendar.respond_calendar_events.v1 esi-skills.read_skills.v1 esi-skills.read_skillqueue.v1 esi-clones.read_clones.v1 esi-assets.read_assets.v1 esi-fleets.read_fleet.v1 esi-fittings.read_fittings.v1 esi-fittings.write_fittings.v1 esi-location.read_online.v1 esi-clones.read_implants.v1 esi-characterstats.read.v1'
    }, res);
  },

  token: (req, res) => {
    SSO.getTokens({
      client_id,
      client_secret,
    }, req, res, async(accessTokens, characterToken) => {
      req.session.accessTokens = accessTokens;
      req.session.characterToken = characterToken;
      req.session.authenticated = true;

      let character = await EVE.character(characterToken.CharacterID);

      let payload = {
        accessToken: accessTokens.access_token,
        refreshToken: accessTokens.refresh_token,
        corporation: character.corporation,
        alliance: character.alliance
      };

      await Character.update({ characterId: characterToken.CharacterID }, payload);

      res.redirect(`${process.env.BASE_URL}/home`);
    });
  },

  whoAmI: async(req, res) => {
    if (!req.session || !req.session.characterToken)
      return res.status(401).send();

    let character = await Character.findOne({ characterId: req.session.characterToken.CharacterID })
      .populate('corporation')
      .populate('alliance');

    if (!character)
      return res.status(401).send();

    return res.status(200).json({ character });
  },

  logout: (req, res, next) => {
    if (req.session)
      req.session.destroy();

    res.clearCookie('sails.sid');
    res.status(200).json({});
  }

};
