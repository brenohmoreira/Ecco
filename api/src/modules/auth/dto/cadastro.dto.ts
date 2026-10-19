import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CadastroDTO {
        @IsEmail()
        email: string;

        @IsString()
        @IsNotEmpty()
        usuario: string;

        @IsString()
        @MinLength(8)
        senha: string;
}