// ============================================================
// BizTrack API — Resource 4 of 5
// ------------------------------------------------------------
//   Name             : Data create
//   HTTP method      : POST
//   Relative path    : /data/{table}
//   Requires auth    : FALSE
//   Requires ACL     : (leave empty)
//
//   Creates a record. Body = the field values to set.
// ============================================================
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
