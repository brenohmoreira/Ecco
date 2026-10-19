import { plainToInstance } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString, Max, Min, validateSync } from 'class-validator';

enum Environment {
        Development = 'development',
        Production = 'production',
        Test = 'test',
}

export class Env {
        @IsEnum(Environment)
        NODE_ENV: Environment = Environment.Development;

        @IsInt()
        @Min(0)
        @Max(65535)
        PORT: number = 3000;

        @IsString()
        CORS_ORIGIN: string = 'http://localhost:9000';

        @IsString()
        @IsNotEmpty()
        JWT_SECRET: string;

        @IsInt()
        @Min(60)
        JWT_EXPIRES_IN: number = 86400;
}

export function validateEnv(config: Record<string, unknown>): Env {
        const env = plainToInstance(Env, config, { enableImplicitConversion: true });
        const errors = validateSync(env);

        if (errors.length > 0) {
                throw new Error(`Variáveis de ambiente inválidas:\n${errors.toString()}`);
        }

        return env;
}
