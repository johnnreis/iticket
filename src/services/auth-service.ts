import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user-model";
import { InvalidCredentialsError } from "../errors/invalid-credential-error";
export class AuthService {
  async login(email: string, password: string) {
    const userModel = await UserModel.findByEmail(email);

    if (userModel && bcrypt.compareSync(password, userModel.password)) {
      return jwt.sign({ id: userModel.id, email: userModel.email }, "123456", {
        expiresIn: "1h",
      });
    } else {
      throw new InvalidCredentialsError();
    }
  }
}
