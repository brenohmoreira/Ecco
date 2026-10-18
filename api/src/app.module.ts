import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { validateEnv } from './config/env.validation.js';
import { HealthModule } from './modules/health/health.module.js';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './modules/auth/auth.module.js';

@Module({
        imports: [
                ConfigModule.forRoot({ isGlobal: true, cache: true, validate: validateEnv }),
                DatabaseModule,
                HealthModule,
                AuthModule
        ],
        providers: [
                {
                        provide: APP_PIPE,
                        useValue: new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
                },
                { 
                        provide: APP_FILTER, 
                        useClass: AllExceptionsFilter 
                },
        ],
})
export class AppModule {}
