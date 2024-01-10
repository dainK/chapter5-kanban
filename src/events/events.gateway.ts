import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket, Namespace } from 'socket.io';
import { EventType } from './events.type';

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('login')
  handleLogin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    client.join(userId);
    return 'User logged in:' + userId;
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() roomName: string, @ConnectedSocket() client: Socket) {
    client.join(roomName);
    console.log(`User ${client.id} joined room: ${roomName}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() roomName: string, @ConnectedSocket() client: Socket) {
    client.leave(roomName);
    console.log(`User ${client.id} left room: ${roomName}`);
  }

  @SubscribeMessage('sendRoomMessage')
  handleSendRoomMessage(@MessageBody() data: { roomName: string; message:string }) {
    const { roomName, message } = data;
    // let message = '';
    // switch (type) {
    //   case EventType.JoinBoard:
    //     message = '보드멤버에 추가 되었습니다.';
    //     break;
    //   case EventType.DropoutBoard:
    //     message = '보드멤버에서 제외 되었습니다.';
    //     break;
    //   case EventType.JoinCard:
    //     message = '보드멤버에 추가 되었습니다.';
    //     break;
    //   case EventType.DropoutCard:
    //     message = '보드멤버에 추가 되었습니다.';
    //     break;
    // }

    this.server.to(roomName).emit('roomMessage', ` ${message}`);
    console.log(`roomMessage: ${roomName}`);
  }
}
