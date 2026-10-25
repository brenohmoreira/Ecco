export type JwtPayload = {
        sub: number;
        usuario: string;
        nome: string;
        email: string;
};

declare global {
        namespace Express {
                interface Request {
                        user?: JwtPayload;
                }
        }
}