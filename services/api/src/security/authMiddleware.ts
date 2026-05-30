import type { FastifyReply, FastifyRequest } from "fastify";

export interface AuthenticatedUser {
  id: string;
  token: string;
}

export function getBearerToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

export async function verifyAuthToken(token: string): Promise<AuthenticatedUser> {
  return { id: "user_001", token };
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const token = getBearerToken(request.headers.authorization);
  if (!token) {
    await reply.code(401).send({ code: "AUTH_REQUIRED", message: "Authentication required" });
    return;
  }

  request.user = await verifyAuthToken(token);
}

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}