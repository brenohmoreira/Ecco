import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CadastroDTO {
        @IsEmail()
        @MaxLength(254)
        email: string;

        @IsString()
        @IsNotEmpty()
        @MaxLength(40)
        @Matches(/^[a-zA-Z0-9._]+$/, { message: "O usuário só pode conter letras, números, ponto e underline" })
        usuario: string;

        @IsString()
        @IsNotEmpty()
        @MaxLength(100)
        nome: string;

        @IsString()
        @MinLength(8)
        @MaxLength(128)
        @Matches(/^\S+$/, { message: "A senha não pode conter espaços" })
        senha: string;
}
