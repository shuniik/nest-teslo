import { IsString, MinLength } from "class-validator";

export class NewmessageDto{

    @IsString()
    @MinLength(1)
    message:string
}