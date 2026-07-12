// ============================================================
// BizTrack Script Include — BizTrackAuth
// Location : Studio → Create File → Server Development → Script Include
// Name     : BizTrackAuth
// Client callable : NO
//
// Powers the BizTrack API: app-account auth (register/login/logout,
// token sessions) + a token-guarded generic data proxy for the BizTrack
// tables. Mirrors the proven PFMT pattern (SHA-256 + GUID tokens).
//
// NOTE: tables created inside this scoped app are physically named
// x_887486_biztrack_<label>. The frontend uses short names (u_partner…);
// real() adds the scope prefix before every GlideRecord call.
// ============================================================

var BizTrackAuth = Class.create();
BizTrackAuth.prototype = {

  // ---- config -------------------------------------------------------------
  SCOPE: 'x_887486_biztrack_',   // real table = SCOPE + short name
  TABLE_USER: 'u_app_user',
  TABLE_SESSION: 'u_app_session',
  SESSION_DAYS: 7,
  // Short table names the frontend may reach through /data.
  ALLOWED: {
    u_customer_master: true,
    u_customer_purchase: true,
    u_business_goal: true,
    u_partner: true,
    u_activity: true,
    u_partner_activity: true
  },
  // Shared tables are visible to EVERY logged-in user (not owner-scoped).
  // Activities are team-wide events; everyone should see them.
  SHARED: {
    u_activity: true
  },
  // Reference field (short name) -> the table it points at. Used for
  // dot-walk resolution so it works even if a field is a plain string or
  // its reference table is mis-set.
  REF_MAP: {
    u_sponsor: 'u_partner',
    u_partner_of: 'u_partner',
    u_customer: 'u_customer_master',
    u_partner: 'u_partner',
    u_activity: 'u_activity'
  },

  initialize: function () {},

  real: function (shortName) { return this.SCOPE + shortName; },

  // ---- HTTP helpers -------------------------------------------------------
  setCors: function (response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-BizTrack-Token, X-HTTP-Method');
  },
  ok: function (response, payload) {
    response.setStatus(200);
    response.setBody(payload);
  },
  fail: function (response, status, message) {
    response.setStatus(status);
    response.setBody({ error: message });
  },

  // ---- crypto -------------------------------------------------------------
  hashPassword: function (plaintext, salt) {
    return new GlideDigest().getSHA256Hex(String(salt) + String(plaintext));
  },
  newSalt: function () { return gs.generateGUID().replace(/-/g, ''); },
  newToken: function () { return gs.generateGUID().replace(/-/g, ''); },

  // ---- sessions -----------------------------------------------------------
  createSession: function (userSysId, deviceHint) {
    var token = this.newToken();
    var expires = new GlideDateTime();
    expires.addDaysUTC(this.SESSION_DAYS);

    var gr = new GlideRecord(this.real(this.TABLE_SESSION));
    gr.initialize();
    gr.setValue('u_user', userSysId);
    gr.setValue('u_token', token);
    gr.setValue('u_expires_at', expires);
    gr.setValue('u_device_hint', deviceHint || '');
    gr.insert();
    return token;
  },
  userForToken: function (token) {
    if (!token) return null;
    var s = new GlideRecord(this.real(this.TABLE_SESSION));
    s.addQuery('u_token', token);
    s.addQuery('u_expires_at', '>', new GlideDateTime());
    s.setLimit(1);
    s.query();
    if (!s.next()) return null;

    var u = new GlideRecord(this.real(this.TABLE_USER));
    if (!u.get(s.getValue('u_user'))) return null;
    if (u.getValue('u_active') === 'false') return null;
    this.currentUserId = u.getUniqueValue(); // used for ownership/visibility
    return u;
  },
  logout: function (token) {
    if (!token) return;
    var s = new GlideRecord(this.real(this.TABLE_SESSION));
    s.addQuery('u_token', token);
    s.query();
    if (s.next()) { s.setValue('u_expires_at', new GlideDateTime()); s.update(); }
  },

  // ---- auth actions -------------------------------------------------------
  userPayload: function (u) {
    return {
      sys_id: u.getUniqueValue(),
      username: u.getValue('u_username'),
      display_name: u.getValue('u_display_name'),
      email: u.getValue('u_email'),
      upline: u.getValue('u_upline')
    };
  },

  register: function (body) {
    var username = (body.username || '').trim().toLowerCase();
    var password = body.password || '';
    if (!username || !password) return { error: 'Username and password are required.' };
    if (password.length < 6) return { error: 'Password must be at least 6 characters.' };

    var dupe = new GlideRecord(this.real(this.TABLE_USER));
    dupe.addQuery('u_username', username);
    dupe.setLimit(1);
    dupe.query();
    if (dupe.next()) return { error: 'That username is already taken.' };

    var salt = this.newSalt();
    var u = new GlideRecord(this.real(this.TABLE_USER));
    u.initialize();
    u.setValue('u_username', username);
    u.setValue('u_salt', salt);
    u.setValue('u_password_hash', this.hashPassword(password, salt));
    u.setValue('u_display_name', (body.display_name || username).trim());
    u.setValue('u_email', (body.email || '').trim());
    u.setValue('u_active', true);
    u.setValue('u_last_login', new GlideDateTime());
    // Link to upline account (referral) so the upline can see this user's data.
    var uplineName = (body.upline || '').trim().toLowerCase();
    if (uplineName && uplineName !== username) {
      var up = new GlideRecord(this.real(this.TABLE_USER));
      up.addQuery('u_username', uplineName);
      up.setLimit(1);
      up.query();
      if (up.next()) u.setValue('u_upline', up.getUniqueValue());
    }
    var id = u.insert();
    if (!id) return { error: 'Could not create the account.' };

    return { token: this.createSession(id, body.device || ''), user: this.userPayload(u) };
  },

  login: function (body) {
    var username = (body.username || '').trim().toLowerCase();
    var password = body.password || '';
    if (!username || !password) return { error: 'Username and password are required.' };

    var u = new GlideRecord(this.real(this.TABLE_USER));
    u.addQuery('u_username', username);
    u.setLimit(1);
    u.query();
    if (!u.next()) return { error: 'Invalid username or password.' };
    if (u.getValue('u_active') === 'false') return { error: 'This account is disabled.' };

    var attempt = this.hashPassword(password, u.getValue('u_salt'));
    if (attempt !== u.getValue('u_password_hash')) return { error: 'Invalid username or password.' };

    u.setValue('u_last_login', new GlideDateTime());
    u.update();
    return { token: this.createSession(u.getUniqueValue(), body.device || ''), user: this.userPayload(u) };
  },

  // ---- visibility: owner + downline accounts ------------------------------
  // Returns [self + every account below me in the u_upline tree]. A record is
  // visible only if its u_owner is in this set (downline can't see upline).
  myOwners: function () {
    if (this._owners) return this._owners;
    var ids = [this.currentUserId];
    var frontier = [this.currentUserId];
    var guard = 0;
    while (frontier.length && guard < 500) {
      guard++;
      var gr = new GlideRecord(this.real(this.TABLE_USER));
      gr.addQuery('u_upline', 'IN', frontier.join(','));
      gr.query();
      var next = [];
      while (gr.next()) {
        var id = gr.getUniqueValue();
        if (ids.indexOf(id) < 0) { ids.push(id); next.push(id); }
      }
      frontier = next;
    }
    this._owners = ids;
    return ids;
  },
  canSee: function (gr) {
    var o = gr.getValue('u_owner');
    return !!o && this.myOwners().indexOf(o) > -1;
  },

  // ---- generic data proxy -------------------------------------------------
  assertTable: function (table) { return this.ALLOWED[table] === true; },

  serialize: function (gr, fieldList) {
    var out = { sys_id: gr.getUniqueValue() };
    if (!fieldList || !fieldList.length) {
      // scoped GlideRecord.getElements() returns a JS array (.length / [i]),
      // not a Java list (.size() / .get(i)).
      var els = gr.getElements();
      for (var i = 0; i < els.length; i++) {
        var name = els[i].getName();
        out[name] = gr.getValue(name);
      }
      return out;
    }
    for (var f = 0; f < fieldList.length; f++) {
      var field = fieldList[f];
      if (!field) continue;
      if (field.indexOf('.') > -1) {
        // dot-walk: load the referenced record by its sys_id from the known
        // target table. Works regardless of the field's type/reference config.
        var parts = field.split('.');
        var refVal = gr.getValue(parts[0]);
        var target = this.REF_MAP[parts[0]];
        if (refVal && target) {
          var rr = new GlideRecord(this.real(target));
          out[field] = rr.get(refVal) ? (rr.getValue(parts[1]) || '') : '';
        } else {
          out[field] = '';
        }
      } else {
        out[field] = gr.getValue(field);
      }
    }
    return out;
  },

  list: function (table, params) {
    if (!this.assertTable(table)) return { error: 'Table not allowed: ' + table };
    var fields = (params.fields || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);

    var gr = new GlideRecord(this.real(table));
    if (params.query) gr.addEncodedQuery(params.query);
    if (!this.SHARED[table]) gr.addQuery('u_owner', 'IN', this.myOwners().join(',')); // visibility filter (shared tables skip it)
    if (params.order_by) {
      if (String(params.order_desc) === 'true') gr.orderByDesc(params.order_by);
      else gr.orderBy(params.order_by);
    }
    var limit = parseInt(params.limit, 10);
    if (!isNaN(limit) && limit > 0) gr.setLimit(limit);
    gr.query();

    var rows = [];
    while (gr.next()) rows.push(this.serialize(gr, fields));
    return rows;
  },

  getOne: function (table, sysId, fields) {
    if (!this.assertTable(table)) return { error: 'Table not allowed: ' + table };
    var gr = new GlideRecord(this.real(table));
    if (!gr.get(sysId) || (!this.SHARED[table] && !this.canSee(gr))) return { error: 'Record not found.' };
    var list = (fields || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    return this.serialize(gr, list);
  },

  create: function (table, body) {
    if (!this.assertTable(table)) return { error: 'Table not allowed: ' + table };
    var gr = new GlideRecord(this.real(table));
    gr.initialize();
    this._applyBody(gr, body);
    if (this.currentUserId) gr.setValue('u_owner', this.currentUserId); // stamp creator
    var id = gr.insert();
    if (!id) return { error: 'Create failed.' };
    return this.serialize(gr, null);
  },

  update: function (table, sysId, body) {
    if (!this.assertTable(table)) return { error: 'Table not allowed: ' + table };
    var gr = new GlideRecord(this.real(table));
    if (!gr.get(sysId) || (!this.SHARED[table] && !this.canSee(gr))) return { error: 'Record not found.' };
    this._applyBody(gr, body);
    gr.update();
    return this.serialize(gr, null);
  },

  remove: function (table, sysId) {
    if (!this.assertTable(table)) return { error: 'Table not allowed: ' + table };
    var gr = new GlideRecord(this.real(table));
    if (!gr.get(sysId) || (!this.SHARED[table] && !this.canSee(gr))) return { error: 'Record not found.' };
    gr.deleteRecord();
    return { deleted: true };
  },

  _applyBody: function (gr, body) {
    for (var key in body) {
      if (!body.hasOwnProperty(key)) continue;
      // never let the client set sys_id, dot-walk keys, or the owner stamp
      if (key === 'sys_id' || key === 'u_owner' || key.indexOf('.') > -1) continue;
      gr.setValue(key, body[key]);
    }
  },

  type: 'BizTrackAuth'
};
