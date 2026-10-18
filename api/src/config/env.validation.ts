import { plainToInstance } from 'class-transformer';
import { IsEnum, IsInt, IsString, Max, Min, validateSync } from 'class-validator';

enum Environment {
        Development = 'development',
        Production = 'production',
        Test = 'test',
}

// Variáveis de ambiente aceitas pela API. Os valores atribuídos são os defaults.
export class Env {
        @IsEnum(Environment)
        NODE_ENV: Environment = Environment.Development;

        @IsInt()
        @Min(0)
        @Max(65535)
        PORT: number = 3000;

        @IsString()
        CORS_ORIGIN: string = 'http://localhost:9000';
}

export function validateEnv(config: Record<string, unknown>): Env {
        const env = plainToInstance(Env, config, { enableImplicitConversion: true });
        const errors = validateSync(env);

        if (errors.length > 0) {
                throw new Error(`Variáveis de ambiente inválidas:\n${errors.toString()}`);
        }

        return env;
}
