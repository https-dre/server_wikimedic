import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    contextData?: {
      token?: string;
      jwtPayload?: {
        email: string
      }
    }
  }
}