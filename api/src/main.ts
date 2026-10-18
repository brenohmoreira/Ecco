import helmet from 'helmet';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

import type { Env } from './config/env.validation.js';

async function bootstrap() {
        const app = await NestFactory.create(AppModule);
        const config = app.get<ConfigService<Env, true>>(ConfigService);

        app.setGlobalPrefix('api');
        app.use(helmet());
        app.enableCors({ origin: config.get('CORS_ORIGIN', { infer: true }).split(','), credentials: true });
        app.enableShutdownHooks();

        const swaggerConfig = new DocumentBuilder().setTitle('Ecco API').setVersion('0.0.1').addBearerAuth().build();
        
        SwaggerModule.setup('api/docs', app, () =>
                SwaggerModule.createDocument(app, swaggerConfig),
        );

        await app.listen(config.get('PORT', { infer: true }));
}
await bootstrap();
