import { value } from './value.js';

value.socket = io();


value.socket.on('connect', async (socket) => {
  console.log('Connected');
});

value.socket.on('disconnect', function () {
  console.log('Disconnected');
});

value.socket.on('privateResponse', function (res) {
  console.log('privateResponse', res);
  
});

value.socket.on('roomMessage', function (res) {
  console.log('roomMessage', res);
  
});

export function socketLogin(user) {
  // value.socket.emit('login',  "1");
  value.socket.emit('login', user.id.toString(), response =>
    console.log('login:', response),
  );
  
  // value.socket.emit('joinRoom', user.id.toString());

  // value.socket.emit('privateMessage', { userId: user.id, message : "hit" });
}

export function socketLogout() {
  // value.socket.emit('disconnect');
  // value.socket.emit('login', 1, (response) => console.log('logout:', response));


}

// const roomName = "exampleRoom";
// value.socket.emit('joinRoom', roomName);

//   // 룸에 메시지 보내기
//   const message = "Hello, room!";
//   value.socket.emit('sendRoomMessage', { roomName, message });

//   // 룸에서 메시지 받기
//   value.socket.on('roomMessage', (roomMessage) => {
//     console.log('Received room message:', roomMessage);
//     // 룸 메시지를 화면에 표시하거나 다른 작업을 수행
//   });

// value.socket.on('events', function (data) {
//   console.log('event', data);
// });
// socket.on('exception', function (data) {
//   console.log('event', data);
// });
// socket.on('disconnect', function () {
//   console.log('Disconnected');
// });
