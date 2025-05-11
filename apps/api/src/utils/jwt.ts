import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

type Payload = {
  sub: string;
};

export const signAccessToken = async (payload: Payload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(secret);
};

export const signRefreshToken = async (payload: Payload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
};

export const verifyAccessToken = async (token: string) => {
  return await jwtVerify(token, secret);
};
