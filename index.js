const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

// добавление курьера в массив если он онлайн

const addUSer = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });   
}

// удаление курьера из массива если он не в сети

const removerUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
  return users.find((user) => user.userId === userId)
}

// Когда пользователь подключен 

io.on("connection", (socket) => {
  console.log("a user connected.");
  socket.on("addUser", (userId) => {
    
    addUSer(userId, socket.id);
    io.emit("getUsers", users);
  });



// Отправка и получение сообщений

socket.on('sendMessage', ({senderId, receiverId, text}) => {
  const user = getUser(receiverId);
  io.to(user.socketId).emit('getMessage', {
    senderId,
    text,
  })
})


// когда пользователь отключился

  socket.on('disconnect', () => {
    console.log('a user disconnected')
    removerUser(socket.id)
    io.emit('removeUsers', users)
  })

});



