const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const User = mongoose.model("User");
const delayTime = 300;
let players = [];

const rollTheDice = () => {
    return new Promise((resolve, reject) => {
        let i,
            number = 0,
            faceValue,
            output = '';
        const point = "&#x268";
        let diceCount = 2;
        for (i = 0; i < diceCount; i++) {
            faceValue = Math.floor(Math.random() * 6);
            number += (faceValue + 1);
            output += point + faceValue + "; ";
        }
        setTimeout(() => {
            resolve({
                number,
                output,
                diceCount
            })
        }, delayTime);
    })
}

const diceGame = (io) => {
    let start,gameStatus, resultNumber;
    setInterval(function () {
        start = Date.now()
        gameStatus="starting"
        io.sockets.emit('time', {status: gameStatus,start:start});
        let interval = setInterval(function () {
            if (Date.now() - start >= 10000) {
                rollTheDice()
                    .then((data) => {                       
                        resultNumber = data.number
                        if (players.length != 0) {
                            players.forEach(player => {
                                let amoutCoin
                                if (resultNumber % 2) {
                                    if (player.choose == 'Le') {
                                        amoutCoin = player.bet
                                    }
                                    else {
                                        amoutCoin = -(player.bet)
                                    }
                                }
                                else {
                                    if (player.choose == 'Le') {
                                        amoutCoin = -(player.bet)
                                    }
                                    else {
                                        amoutCoin = player.bet
                                    }
                                }
                                User.updateOne({ username: player.username }, {
                                    $inc: { coin: amoutCoin }
                                },function (err, affected, resp) {})
                                gameStatus="end"
                                io.sockets.emit('result', {status:gameStatus, number: data.number,point: data.output});
                            })
                        }
                        players = [];
                        gameStatus="end"
                        io.sockets.emit('result', {status:gameStatus, number: data.number,point: data.output});
                    })
                    .catch((err) => {
                        console.log("ERROR: ", err.message)
                    })
                clearInterval(interval);
            }
        }, 100);
    }, 15000)

    io.on('connection', function (socket) {
        console.log('a user connected');
        gameStatus="starting"
        socket.emit('time',{status: gameStatus,start:start});
        socket.on('detailOrder', function (data) {
            players.push({
                username: data.username,
                bet: data.moneyOrder,
                choose: data.stateOrder
            })
            io.emit('detailOrder', data);
        });
        // socket.emit('listbet', players);
        socket.on('username', function (username) {
            io.emit('username', username);
        });
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    });
}

module.exports = {
    diceGame
}