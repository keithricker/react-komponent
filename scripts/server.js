let server = require('react-komponent').SSR

server = server({url:'http://localhost:3000'})
let socket = server.socket()
server.start()