import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/auth.entity';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

interface ConnectedClients {
    [id:string]: {
        socket: Socket,
        user: User,
    }
}

@Injectable()
export class MessagesWsService {

    private conectedClients: ConnectedClients ={}

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}


    async registerClient( client: Socket, userId: string){
        const user = await this.userRepository.findOneBy({id:userId})
        if(!user) throw new Error('User not found')
        if(!user.isActive) throw new Error('User not active')

        this.checkUserConnection(user)
        
        this.conectedClients[client.id] = {
            socket: client,
            user: user
        }
    }

    removeClient( clientId: string){
        delete this.conectedClients[clientId]
    }

    getConenctedClient(): string[]{
        // console.log(this.conectedClients);
        return Object.keys(this.conectedClients);
    }

    getUserFullName(socketId: string){
        return this.conectedClients[socketId].user.fullName
    }

    private checkUserConnection(user:User){
        for ( const clientId of Object.keys(this.conectedClients)){
            const connectedClient = this.conectedClients[clientId]
            if(connectedClient.user.id=== user.id){
                connectedClient.socket.disconnect()
                break;
            }
        }
    }
}
