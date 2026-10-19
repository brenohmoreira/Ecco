import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { AuthRepository } from "./auth.repository.js";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../config/env.validation.js";

@Module({
        imports: [
                JwtModule.registerAsync({
                        global: true,
                        inject: [ConfigService],
                        useFactory: (config: ConfigService<Env, true>) => ({
                                secret: config.get("JWT_SECRET", { infer: true }),
                                signOptions: { expiresIn: config.get("JWT_EXPIRES_IN", { infer: true })}
                        })
                })
        ],
        providers: [AuthService, AuthRepository],
        controllers: [AuthController],
        exports: [AuthService]
})
export class AuthModule {}