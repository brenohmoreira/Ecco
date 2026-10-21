import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";

export class UsuarioDisponivelDTO {
        @IsString()
        @IsNotEmpty()
        @MaxLength(40)
        @Matches(/^[a-zA-Z0-9._]+$/, { message: "O usuário só pode conter letras, números, ponto e underline" })
        usuario: string;
}
