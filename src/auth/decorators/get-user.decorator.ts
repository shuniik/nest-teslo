import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data:string, ctx: ExecutionContext)=>{

        //console.log(data);
        const req= ctx.switchToHttp().getRequest()
        const user = req.user;

        if(!user)
            throw new InternalServerErrorException('User not fount (request)')
        
        return (!data) 
            ? user
            : user[data]
    }
)