import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket, Namespace } from 'socket.io';

@WebSocketGateway()
// export class EventsGateway
//   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
//   afterInit(server: any) {
//     throw new Error('Method not implemented.');
//   }
//   @WebSocketServer() public server: Server;
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  // @WebSocketServer() public server: Server;

  private connectedUsers = new Map<string, Namespace>();
  private rooms = new Set<string>();

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);

    // 클라이언트가 로그아웃하면 연결된 사용자 목록에서 소켓을 제거
    this.connectedUsers.forEach((value, key) => {
      if (value.sockets.has(client.id)) {
        this.connectedUsers.delete(key);
        console.log('User logged out:', key);
      }
    });
  }


  @SubscribeMessage('login')
  handleLogin(@MessageBody() userId: string) {
    // 클라이언트가 로그인하면 연결된 사용자 목록에 네임스페이스를 추가
    const userNamespace = this.server.of(userId);
    this.connectedUsers.set(userId, userNamespace);
    console.log('User logged in:', userId);
    return 'User logged in:'+ userId;
  }

  @SubscribeMessage('sendNotification')
  handleSendNotification(@MessageBody() data: { userId: string, message: string }) {
    const { userId, message } = data;
    const userNamespace = this.connectedUsers.get(userId);

    if (userNamespace) {
      userNamespace.emit('notification', message);
      console.log('Notification sent to user:', userId);
      return 'Notification sent to user:'+ userId;
    } else {
      console.log('User not found:', userId);
      return 'User not found:'+ userId;
    }
  }

  @SubscribeMessage('privateMessage')
  handlePrivateMessage(@MessageBody() data: { userId: string, message: string }) {
    const { userId, message } = data;
    const senderNamespace = this.connectedUsers.get(userId);

    if (senderNamespace) {
      // 예시: 메시지를 전송한 클라이언트에게만 응답
      senderNamespace.emit('privateResponse', message);
      console.log('Private response sent to user:', userId);
      return 'Private response sent to user:'+ userId;
    } else {
      console.log('User not found:', userId);
      return 'User not found:'+ userId;
    }
  }

  
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() roomName: string, @ConnectedSocket() client: Socket) {
    client.join(roomName);
    this.rooms.add(roomName);
    console.log(`User ${client.id} joined room: ${roomName}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() roomName: string, @ConnectedSocket() client: Socket) {
    client.leave(roomName);
    this.rooms.delete(roomName);
    console.log(`User ${client.id} left room: ${roomName}`);
  }

  @SubscribeMessage('sendRoomMessage')
  handleSendRoomMessage(@MessageBody() data: { roomName: string, message: string }, @ConnectedSocket() client: Socket) {
    const { roomName, message } = data;
    this.server.to(roomName).emit('roomMessage', `User ${client.id}: ${message}`);
  }
}
