import {
        type ArgumentsHost,
        Catch,
        type ExceptionFilter,
        HttpException,
        HttpStatus,
        Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

/**
 * Padroniza o corpo de erro de todas as respostas:
 * { statusCode, message, errors?, path, timestamp }
 *
 * `message` é sempre uma string (o front exibe direto num Notify);
 * erros de validação vêm completos em `errors`.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
        private readonly logger = new Logger(AllExceptionsFilter.name);

        catch(exception: unknown, host: ArgumentsHost) {
                const ctx = host.switchToHttp();
                const response = ctx.getResponse<Response>();
                const request = ctx.getRequest<Request>();

                let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
                let message = 'Erro interno do servidor';
                let errors: string[] | undefined;

                if (exception instanceof HttpException) {
                        status = exception.getStatus();
                        const body = exception.getResponse();

                        if (typeof body === 'string') {
                                message = body;
                        } else {
                                const raw = (body as { message?: string | string[] }).message;
                                if (Array.isArray(raw)) {
                                        errors = raw;
                                        message = raw[0] ?? exception.message;
                                } else {
                                        message = raw ?? exception.message;
                                }
                        }
                } else {
                        this.logger.error(exception);
                }

                response.status(status).json({
                        statusCode: status,
                        message,
                        errors,
                        path: request.originalUrl,
                        timestamp: new Date().toISOString(),
                });
        }
}
