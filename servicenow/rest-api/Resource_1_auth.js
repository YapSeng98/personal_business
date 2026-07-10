// ============================================================
// BizTrack API — Resource 1 of 5
// ------------------------------------------------------------
//   Name             : Auth
//   HTTP method      : POST
//   Relative path    : /auth/{action}
//   Requires auth    : FALSE   (Security tab → untick "Requires authentication")
//   Requires ACL     : (leave empty)
//
//   Handles: /auth/login  ·  /auth/register  ·  /auth/logout
// ============================================================
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
