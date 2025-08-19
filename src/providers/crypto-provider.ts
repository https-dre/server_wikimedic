import jwt from "jsonwebtoken";
export class JwtProvider {
  private key: string = process.env.JWT_KEY!;
  generateToken(payload: object, expiresIn?: "1h") {
    return jwt.sign(payload, this.key, { expiresIn });
  }
  verifyToken(token: string) {
    try {
      const payload = jwt.verify(token, this.key)
      return payload
    } catch (err) {
      throw err
    }
  }
}