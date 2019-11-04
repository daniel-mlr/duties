/* minimal server */
/* Mon 04 Nov 2019 03:01:20 PM PST */

var connect = require('connect')
var serveStatic = require('serve-static')
connect().use(serveStatic(__dirname)).listen(8080, function() {
  console.log('server running on 8080...')
})
