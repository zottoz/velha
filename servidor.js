const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let board = Array(9).fill(null);

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
        if(Jogadores[0]=='O'){
            Jogadores[0]=='X';
        }
        console.log('Desconectuu');
    });

    /**
     * Realiza as jogadas
     */
    socket.on('jogada', (comando) => {

        board[comando.index] = comando.jogador;

        if(checkWin()){
            comando.mensagem = 'fim';
            board.fill(null);
            Jogadores =[];
        }
        else if(board.every(item => item !== null)){
            comando.mensagem = 'empate';
            board.fill(null);
            Jogadores = [];
        }

        io.emit('jogada', comando);

    });

});


// Função para verificar se há um vencedor
function checkWin() {
    if(board[0]!=null && board[0]==board[1] && board[1]==board[2]){
        return true;
    }
    if(board[3]!=null && board[3]==board[4] && board[4]==board[5]){
        return true;
    }
    if(board[6]!=null && board[6]==board[7] && board[7]==board[8]){
        return true;
    }
    if(board[0]!=null && board[0]==board[3] && board[3]==board[6]){
        return true;
    }
    if(board[1]!=null && board[1]==board[4] && board[4]==board[7]){
        return true;
    }
    if(board[2]!=null && board[2]==board[5] && board[5]==board[8]){
        return true;
    }
    if(board[0]!=null && board[0]==board[4] && board[4]==board[8]){
        return true;
    }
    if(board[2]!=null && board[2]==board[4] && board[4]==board[6]){
        return true;
    }   

    return false;
}

server.listen(3000, () => {
    console.log('listening on *:3000');
});

