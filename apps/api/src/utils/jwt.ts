import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

type Payload = {
  sub: string;
};

export const signToken = async (payload: Payload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(secret);
};

export const verifyToken = async (token: string) => {
  try {
    const res = await jwtVerify(token, secret);
    return {
      res: true,
      sub: res.payload.sub,
    };
  } catch {
    return {
      res: false,
      sub: null,
    };
  }
};
