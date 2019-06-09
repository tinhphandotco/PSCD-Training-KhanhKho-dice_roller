const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const User = mongoose.model("User");
const delayTime = 300;
var start;

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
    setInterval(function () {
        start = Date.now()
        io.sockets.emit('time', start);
        let interval = setInterval(function () {
            if (Date.now() - start >= 10000) {
                rollTheDice()
                    .then((data) => {
                        var result ={
                            number : data.number,
                            point : data.output
                        }
                        io.sockets.emit('result', result);
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
        socket.emit('time', start);
        socket.on('totalcoin', function (data) {
            User.updateOne({ username: data.username }, {
                coin: data.coin
            }, function (err, affected, resp) {
            })
        });
        socket.on('detailOrder', function (data) {
            io.emit('detailOrder', data);
        });
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