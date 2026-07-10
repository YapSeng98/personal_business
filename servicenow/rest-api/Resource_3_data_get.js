// ============================================================
// BizTrack API — Resource 3 of 5
// ------------------------------------------------------------
//   Name             : Data get one
//   HTTP method      : GET
//   Relative path    : /data/{table}/{id}
//   Requires auth    : FALSE
//   Requires ACL     : (leave empty)
//
//   Returns one record by sys_id. Query param: fields
// ============================================================
(function process(request, response) {
  var auth = new BizTrackAuth();
  auth.setCors(response);

  if (!auth.userForToken(request.getHeader('X-BizTrack-Token')))
    return auth.fail(response, 401, 'Not signed in.');

  var fields = request.queryParams.fields;
  var out = auth.getOne(
    request.pathParams.table,
    request.pathParams.id,
    (fields && fields.length) ? fields[0] : ''
  );

  if (out && out.error) return auth.fail(response, 404, out.error);
  return auth.ok(response, out);
})(request, response);
