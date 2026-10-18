import { Module } from "@nestjs/common";
import { DatabaseService } from "../../database/database.service.js";
import { AuthController } from "./auth.controller.js";

@Module({
        providers: [DatabaseService],
        controllers: [AuthController]
})
export class AuthModule {}