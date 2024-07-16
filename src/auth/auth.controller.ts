import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto,LoginUserDto } from './dto/index';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser, RawHeaders } from './decorators/';
import { User } from './entities/auth.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { validRoles } from './interfaces';
import { ApiResponse, ApiTags } from '@nestjs/swagger';



@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @ApiResponse({status:201, description:'Product was created', type:Auth})
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiResponse({status:201, description:'User is login', type:Auth})
  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User){
    return this.authService.checkOuthStatus(user)
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
   @Req() request: Express.Request,
   @GetUser() user: User,
   @GetUser('email') userEmail: string,
   @RawHeaders() rawHeaders:string
  ){

    //console.log(request);
    // console.log({user});
    return {
      ok:true,
      mesage: 'hola mundo privado',
       user,
       userEmail,
       rawHeaders
    }
  }

  @Get('private2')
  @RoleProtected(validRoles.superUser,validRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user:User
  ){
    return{
      ok:true,
      user
    }
  }

  @Get('private3')
  @Auth(validRoles.admin)
  privateRoute3(
    @GetUser() user:User
  ){
    return{
      ok:true,
      user
    }
  }

}
