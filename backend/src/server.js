const express = require('express');
//É usado o "./" antes da chamada do Routes para o programa entender que é um diretório e não um módulo
const routes = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect('mongodb+srv://omnistack:omnistack@omnistack-j1no4.mongodb.net/semana09?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connectedUsers = {};

io.on('connection', socket => {
    const { user_id } = socket.handshake.query;

    connectedUsers[user_id] = socket.id;
 });

 app.use((req, res, next) => {
     req.io = io;
     req.connectedUsers = connectedUsers;

     return next();
 });

//req.query = Acessar query params ( para filtro ) localhost/users?idade=20
//req.params = Acessar route params (para edição, delete) localhost/users/{id}
//req.body = Acessar corpo da reposição (Criação e edição de registros)


//Esse app.use serve para o express reconhecer envios em formato JSON
app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..','uploads')))
app.use(routes);

server.listen(3333);