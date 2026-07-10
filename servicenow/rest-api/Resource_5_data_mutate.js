// ============================================================
// BizTrack API — Resource 5 of 5
// ------------------------------------------------------------
//   Name             : Data update/delete
//   HTTP method      : POST
//   Relative path    : /data/{table}/{id}
//   Requires auth    : FALSE
//   Requires ACL     : (leave empty)
//
//   Update or delete one record. The frontend sends HTTP POST and puts
//   the real verb in the X-HTTP-Method header:
//     X-HTTP-Method: PATCH   -> update (body = fields to change)
//     X-HTTP-Method: DELETE  -> delete
// ============================================================
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
