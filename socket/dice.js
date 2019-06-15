const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const User = mongoose.model("User");
let players = [];

const rollTheDice = () => {
    return new Promise((resolve, reject) => {
        let i,
            number = 0,
            faceValue,
            output = '';
        const point = "&#x268";
        for (i = 0; i < 2; i++) {
            faceValue = Math.floor(Math.random() * 6);
            number += (faceValue + 1);
            output += point + faceValue + "; ";
        }
        setTimeout(() => {
            resolve({
                number,
                output
            })
        }, 300);
    })
}

const diceGame = (io) => {
    let start, gameStatus, resultNumber;
    const startingGame = () => {
        start = Date.now()
        gameStatus = "starting"
        io.sockets.emit('time', { status: gameStatus, start: start });
        setTimeout(() => {
            startedGame();
        }, 10000)
    }
    const startedGame = () => {
        gameStatus = "started"
        rollTheDice()
            .then((data) => {
                resultNumber = data.number
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
                    }, function (err, affected, resp) { })
                })
                io.sockets.emit('result', { status: gameStatus, number: data.number, point: data.output });
                players = [];
            })
            .catch((err) => {
                console.log("ERROR: ", err.message)
            })
        setTimeout(() => {
            endGame();
        }, 3000)
    }
    const endGame = () => {
        setTimeout(() => {
            startingGame();
        }, 3000)
    }
    startingGame();

    io.on('connection', function (socket) {
        gameStatus = "starting"
        socket.emit('time', { status: gameStatus, start: start });
        socket.on('detailOrder', function (data) {
            players.push({
                username: data.username,
                bet: data.moneyOrder,
                choose: data.stateOrder
            })
            io.emit('detailOrder', data);
        });
        socket.emit('listbet', players);
    });
}

module.exports = {
    diceGame
}