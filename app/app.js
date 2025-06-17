const cors = require("cors");
const morgan = require("morgan");
const express = require('express');
const bodyParser = require('body-parser');
//const http = require('http');
//const { Server } = require('socket.io');
const appRoutes = require('./routes/app.routes');
const error = require('./middleware/error.handler');
const { APP_SERVER_PORT } = require("./constants/app_constants");

const app = express();
const PORT = APP_SERVER_PORT;
//const server = http.createServer(app);
//const io = new Server(server);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.use('/chat/v1/api', appRoutes);
app.use(error.errorHandler);

/*
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('sendMessage', (data) => {
        const { sender, receiver, message, media } = data;
        socket.to(receiver).emit('receiveMessage', { sender, message, media });
    });
})
*/

app.listen(PORT, () => {
    console.log(`CHAT SERVER RUNNING ON PORT: ${PORT}`);
});
