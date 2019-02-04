const app = require( 'express' )()
const server = require( 'http' ).Server( app )
const io = require( 'socket.io' )( server )

server.listen( 3000, () => {
 console.log( 'connction open 3000' )
} )

app.get( '/', ( req, res ) => {
  res.sendFile( __dirname + '/index.html' )
} )

const clients = {}
const JERRY = 'Jerry'

io.use( ( socket, next ) => {
  const handshakeData = socket.request;
  const clientId = handshakeData._query[ 'userId' ]
  clients[ socket.id ] = { clientId }
  next()
} )

io.on( 'connection', ( socket ) => {
  const client = clients[ socket.id ]
  console.log( `Client ${ client.clientId } connected` )
  setInterval( () => {
    const client = clients[ socket.id ]
    if ( client && client.clientId === JERRY ) {
      console.log( client )
      io.to( socket.id ).emit( 'CHEESE', {
        message: `Hello ${ client.clientId }! I have some cheese for you ;)`,
      } )
    }
  }, 5000 )

  socket.on( 'disconnect', ( event ) => {
    const clientId = clients[ socket.id ].clientId
    delete clients[ socket.id ]
    console.log( `Client ${ clientId } disconnected` )
  } )
} )
