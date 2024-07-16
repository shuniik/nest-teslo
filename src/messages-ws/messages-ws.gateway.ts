import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';
import { Server } from 'http';
import { NewmessageDto } from './dtos/new-message.dto';
import { privateDecrypt } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({cors: true})
export class MessagesWsGateway implements OnGatewayConnection,OnGatewayDisconnect {

  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) {}

  
  async handleConnection(client: Socket) {

    const token = client.handshake.headers.authentication as string;

    let payload: JwtPayload

    try {
      payload= this.jwtService.verify(token)  
      await this.messagesWsService.registerClient(client, payload.id)
    } catch (error) {
      client.disconnect()
      return;
    }

  console.log({payload});

    console.log(token);
    this.wss.emit('clients-updated',this.messagesWsService.getConenctedClient())
  }
  
  handleDisconnect(client: Socket) {
    // console.log({conectados: this.messagesWsService.getConenctedClient()});
    this.messagesWsService.removeClient(client.id)
    
    this.wss.emit('clients-updated',this.messagesWsService.getConenctedClient())
    
  }
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client:Socket, payload:NewmessageDto){

    console.log({payload});
    
    // //! Emite únicamente al cliente.
    // client.emit('message-from-server',{
    //   fullName: 'soy yo',
    //   message:payload.message || 'no-message!!!'
    // })
    //! Emite a todos, menos al cliente.
    // client.broadcast.emit('message-from-server',{
    //   fullName: 'soy yo',
    //   message:payload.message || 'no se encontró el mensaje!!!'
    // })

    //! Emitir a todos
    this.wss.emit('message-from-server',{
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'No viene mensaje'
    });

  }
}
