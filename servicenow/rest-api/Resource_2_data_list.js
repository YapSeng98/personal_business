// ============================================================
// BizTrack API — Resource 2 of 5
// ------------------------------------------------------------
//   Name             : Data list
//   HTTP method      : GET
//   Relative path    : /data/{table}
//   Requires auth    : FALSE
//   Requires ACL     : (leave empty)
//
//   Lists records. Query params: fields, query, order_by, order_desc, limit
// ============================================================
(function process(request, response) {
  var auth = new BizTrackAuth();
  auth.setCors(response);

  if (!auth.userForToken(request.getHeader('X-BizTrack-Token')))
    return auth.fail(response, 401, 'Not signed in.');

  function qp(name) {
    var v = request.queryParams[name];
    return (v && v.length) ? v[0] : '';
  }

  var out = auth.list(request.pathParams.table, {
    fields: qp('fields'),
    query: qp('query'),
    order_by: qp('order_by'),
    order_desc: qp('order_desc'),
    limit: qp('limit')
  });

  if (out && out.error) return auth.fail(response, 400, out.error);
  return auth.ok(response, out); // array -> { "result": [ ... ] }
})(request, response);
