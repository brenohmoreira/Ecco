import type { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('API (e2e)', () => {
        let app: INestApplication<App>;

        beforeEach(async () => {
                const moduleFixture: TestingModule = await Test.createTestingModule({
                        imports: [AppModule],
                }).compile();

                app = moduleFixture.createNestApplication();
                app.setGlobalPrefix('api');
                await app.init();
        });

        it('GET /api/health', () => {
                return request(app.getHttpServer())
                        .get('/api/health')
                        .expect(200)
                        .expect((res) => expect(res.body).toMatchObject({ status: 'ok' }));
        });

        it('rota inexistente retorna o formato padrão de erro', () => {
                return request(app.getHttpServer())
                        .get('/api/nao-existe')
                        .expect(404)
                        .expect((res) => {
                                expect(res.body).toMatchObject({
                                        statusCode: 404,
                                        path: '/api/nao-existe',
                                });
                                expect(typeof res.body.message).toBe('string');
                        });
        });

        afterEach(async () => {
                await app.close();
        });
});
