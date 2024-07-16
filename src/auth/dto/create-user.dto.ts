import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto{
    @ApiProperty({
        example:'shunik@google.com',
        description:'Agregar email: juan@gmail.com',
        nullable:false

    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example:'1123@Adfw2',
        description:'Contraseña debe de tener mayusculas, minusculas y numeros',
        minLength:6,
        maxLength:50

    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        example:'Juan pablo Mateo',
        description:'Nombre completo de la persona',
        minLength:1

    })
    @IsString()
    @MinLength(1)
    fullName: string;
}