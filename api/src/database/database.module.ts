import { Global, Inject, Module, OnApplicationShutdown } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DatabaseService } from "./database.service.js";
import { DB_POOL } from "./database.constants.js";

import sql from "mssql";

@Global() 
@Module({
        providers: [
                {
                        provide: DB_POOL,
                        inject: [ConfigService],
                        useFactory: async (config: ConfigService) => {
                                const pool = new sql.ConnectionPool({
                                        server: config.getOrThrow("DB_HOST"),
                                        port: Number(config.get("DB_PORT", 1433)),
                                        user: config.getOrThrow("DB_USER"),
                                        password: config.getOrThrow("DB_PASSWORD"),
                                        database: config.getOrThrow("DB_NAME"),
                                        options: {
                                                encrypt: false,
                                                trustServerCertificate: true,
                                        },
                                        pool: { 
                                                max: 10, 
                                                min: 0, 
                                                idleTimeoutMillis: 30000,
                                        },
                                });

                                return pool.connect();
                        }
                },
                DatabaseService
        ],
        exports: [DB_POOL, DatabaseService],
})
export class DatabaseModule implements OnApplicationShutdown {
        constructor(@Inject(DB_POOL) private readonly pool: sql.ConnectionPool) {}

        async onApplicationShutdown(signal?: string) {
                await this.pool.close() 
        }
}