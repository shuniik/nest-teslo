import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ){}


  async checkOuthStatus(user:User){
    return {
      ...user,
      token: this.getJwtToken({ id: user.id})
    }
  }
  
  
  async create(createUserDto: CreateUserDto) {

    const { password, ...userData } = createUserDto;
    
    try {
      const user= this.userRepository.create({
        ...userData, 
        password: bcrypt.hashSync(password,10)
      });

      await this.userRepository.save(user)
      delete user.password;
      return {
        ...user,
        token:this.getJwtToken({id:user.id})
      }
      
    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async login(loginUserDto:LoginUserDto){
    const {password,email} = loginUserDto

    const user= await this.userRepository.findOne({
      where:{email},
      select: {email:true,password:true,id:true}
    })
    if(!user)
      throw new UnauthorizedException('Credentials area not valid (email)')
    
    if(!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials area not valid (password)')
      
    return {
      ...user,
      token: this.getJwtToken({ id: user.id})
    }
  }

  private getJwtToken(payload: JwtPayload){
    const token= this.jwtService.sign(payload);
    return token
  }
 
  private handleDBErrors(error:any):never{
    if(error.code=== '23505')
      throw new BadRequestException(error.detail)
    console.log(error);
    throw new InternalServerErrorException('Please check server logs')
  }
}
