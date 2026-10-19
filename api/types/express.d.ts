export type JwtPayload = {
        sub: number;
        usuario: string;
        email: string;
};

declare global {
        namespace Express {
                interface Request {
                        user?: JwtPayload;
                }
        }
}