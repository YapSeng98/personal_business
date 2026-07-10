// ============================================================
// BizTrack Scripted REST API — resource scripts
// Location : All → System Web Services → Scripted REST APIs → "BizTrack API"
// API base path : biztrack      (Namespace auto = x_887486_biztrack)
// Full base URL : https://<instance>/api/x_887486_biztrack/biztrack
//
// Create 5 resources on the API and paste the matching block below into
// each one's "Script". On EVERY resource set:
//   • Requires authentication = FALSE   (our own token guards it)
//   • Requires ACL = (leave empty)
// The frontend only ever sends HTTP GET or POST and puts the real verb
// in the X-HTTP-Method header, so PATCH/DELETE ride on POST.
// ============================================================


// ─────────────────────────────────────────────────────────────
// RESOURCE 1   ·   POST   /auth/{action}
//   action = login | register | logout
// ─────────────────────────────────────────────────────────────
(function process(request, response) {
  var auth = new BizTrackAuth();
  auth.setCors(response);

  var action = request.pathParams.action;
  var body = (request.body && request.body.data) ? request.body.data : {};
  var out;

  if (action === 'login') {
    out = auth.login(body);
  } else if (action === 'register') {
    out = auth.register(body);
  } else if (action === 'logout') {
    auth.logout(request.getHeader('X-BizTrack-Token'));
    out = { ok: true };
  } else {
    return auth.fail(response, 404, 'Unknown auth action: ' + action);
  }

  if (out && out.error) return auth.fail(response, 401, out.error);
  return auth.ok(response, out);
})(request, response);


// ─────────────────────────────────────────────────────────────
// RESOURCE 2   ·   GET   /data/{table}
//   query params: fields, query, order_by, order_desc, limit
// ─────────────────────────────────────────────────────────────
(function process(request, response) {
  var auth = new BizTrackAuth();
  auth.setCors(response);

  if (!auth.userForToken(request.getHeader('X-BizTrack-Token')))
    return auth.fail(response, 401, 'Not signed in.');

  function qp(name) { var v = request.queryParams[name]; return (v && v.length) ? v[0] : ''; }

  var out = auth.list(request.pathParams.table, {
    fields: qp('fields'),
    query: qp('query'),
    order_by: qp('order_by'),
    order_desc: qp('order_desc'),
    limit: qp('limit')
  });
  if (out && out.error) return auth.fail(response, 400, out.error);
  return auth.ok(response, out); // out is an array -> { result: [...] }
})(request, response);


// ─────────────────────────────────────────────────────────────
// RESOURCE 3   ·   GET   /data/{table}/{id}
// ─────────────────────────────────────────────────────────────
(function process(request, response) {
  var auth = new BizTrackAuth();
  auth.setCors(response);

  if (!auth.userForToken(request.getHeader('X-BizTrack-Token')))
    return auth.fail(response, 401, 'Not signed in.');

  var fields = request.queryParams.fields;
  var out = auth.getOne(request.pathParams.table, request.pathParams.id,
    (fields && fields.length) ? fields[0] : '');
  if (out && out.error) return auth.fail(response, 404, out.error);
  return auth.ok(response, out);
})(request, response);


// ─────────────────────────────────────────────────────────────
// RESOURCE 4   ·   POST   /data/{table}          (create)
// ─────────────────────────────────────────────────────────────
(function process(request, response) {
  var auth = new BizTrackAuth();
  auth.setCors(response);

  if (!auth.userForToken(request.getHeader('X-BizTrack-Token')))
    return auth.fail(response, 401, 'Not signed in.');

  var body = (request.body && request.body.data) ? request.body.data : {};
  var out = auth.create(request.pathParams.table, body);
  if (out && out.error) return auth.fail(response, 400, out.error);
  return auth.ok(response, out);
})(request, response);


// ─────────────────────────────────────────────────────────────
// RESOURCE 5   ·   POST   /data/{table}/{id}     (update or delete)
//   X-HTTP-Method: PATCH  -> update    ·   DELETE -> delete
// ─────────────────────────────────────────────────────────────
(function process(request, response) {
  var auth = new BizTrackAuth();
  auth.setCors(response);

  if (!auth.userForToken(request.getHeader('X-BizTrack-Token')))
    return auth.fail(response, 401, 'Not signed in.');

  var verb = request.getHeader('X-HTTP-Method') || 'PATCH';
  var table = request.pathParams.table;
  var id = request.pathParams.id;
  var out;

  if (verb === 'DELETE') {
    out = auth.remove(table, id);
  } else {
    var body = (request.body && request.body.data) ? request.body.data : {};
    out = auth.update(table, id, body);
  }
  if (out && out.error) return auth.fail(response, 400, out.error);
  return auth.ok(response, out);
})(request, response);
