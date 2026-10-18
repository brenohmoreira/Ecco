# Ecco API

NestJS 12 (ESM) + TypeScript. Consumida pelo app Quasar em `../app`.

## Comandos

```bash
npm install
npm run start:dev   # http://localhost:3000/api (watch)
npm run build && npm run start:prod
npm run lint        # oxlint
npm test            # vitest (unitários)
npm run test:e2e    # vitest + supertest
npm run format      # prettier
```

Documentação Swagger: http://localhost:3000/api/docs (JSON em `/api/docs-json`).

## O que já vem configurado

- Prefixo global `/api` (bate com `QCLI_API_URL` do app).
- `@nestjs/config` com validação das variáveis em `src/config/env.validation.ts`.
- `ValidationPipe` global (`class-validator` / `class-transformer`): remove/recusa campos fora do DTO e converte tipos.
- Filtro de erros global: toda resposta de erro tem o formato
  `{ statusCode, message, errors?, path, timestamp }`, e `message` é sempre string
  (o interceptor do axios no app exibe direto num Notify).
- `helmet`, CORS liberado para `CORS_ORIGIN` e shutdown hooks.
- Plugin do Swagger no `nest-cli.json`: DTOs são documentados automaticamente (comentários `@example` viram exemplos).

## Estrutura

```
src/
  main.ts                 bootstrap (prefixo, helmet, CORS, Swagger)
  app.module.ts           registra os módulos + pipe/filtro globais
  config/                 validação do .env
  common/                 código compartilhado (filtros, guards, decorators...)
  modules/                módulos de domínio, um por pasta
    health/               GET /api/health
```

Para criar um novo módulo dentro de `src/modules`:

```bash
npx nest g resource modules/nome
```

O CLI gera controller, service, DTOs e entity, e já registra o módulo no `app.module.ts`.

## Variáveis de ambiente

Copie `.env.example` para `.env`:

| Variável      | Default                 | Descrição                             |
| ------------- | ----------------------- | ------------------------------------- |
| `NODE_ENV`    | `development`           | `development` / `production` / `test` |
| `PORT`        | `3000`                  | Porta HTTP                            |
| `CORS_ORIGIN` | `http://localhost:9000` | Origens permitidas, separadas por `,` |
