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
      let forceRefresh = true;
      let character = await EVE.character(characterToken.CharacterID, forceRefresh);
      let lastLogin = new Date().toISOString();
      let account;

      if (character.account) {
        // Character is already associated with an account, so retrieve it.
        account = await Account.update(character.account, { lastLogin }).fetch();
        account = _.first(account);
      } else {
        // Character is new, so create account.
        account = await Account.create({ mainCharacter: character.id, lastLogin }).fetch();
      }

      let payload = {
        accessToken: accessTokens.access_token,
        refreshToken: accessTokens.refresh_token,
        account: account.id,
        corporation: character.corporation,
        alliance: character.alliance
      };

      await Character.update({ characterId: characterToken.CharacterID }, payload);

      req.session.authenticated = true;
      req.session.account = account;
      req.session.accessTokens = accessTokens;
      req.session.characterToken = characterToken;

      res.redirect(`${process.env.BASE_URL}/`);
    });
  },

  whoAmI: async(req, res) => {
    if (!req.session || !req.session.account)
      return res.status(401).send();

    let account = await Account.findOne(req.session.account.id)
      .populate('mainCharacter')
      .populate('altCharacters');

    return res.status(200).json({ account });
  },

  logout: (req, res, next) => {
    if (req.session)
      req.session.destroy();

    res.clearCookie('sails.sid');
    res.status(200).json({});
  }

};
