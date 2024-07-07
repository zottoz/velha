const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let Jogadores = [];
let Jogador = '';
let turno;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
    console.log('Usuario conectado');

    /* Adiciona jogadores X ou O
    */
    if(Jogadores.length==0){
        Jogador = 'X';
        turno = Jogador;
        Jogadores.push(Jogador);
        io.emit('definirJogador', Jogador);
        console.log('Definido o jogador = X');
    }
    else if(Jogadores.length==1){
        Jogador = 'O';
        Jogadores.push(Jogador);
        io.emit('definirJogador', Jogador);
        console.log('Definido o jogador = O');
    }
    else{
        io.emit('definirJogador', 999);
        console.log('Jogo lotado');
    }


    /* Remove jogador que saiu e atualiza lista
    */ 
    socket.on('disconnect', () => {
        Jogadores.pop();
        console.log('Desconectouu');
    });

    /**
     * Realiza as jogadas
     */

    socket.on('jogada', (comando) => {
        console.log(comando);

        io.emit('jogada', comando);

    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});