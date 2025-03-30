import { UserModel } from "../models/auth-model";

export class UserService {
  async findById(userId: number) {
    return UserModel.findById(userId);
  }

  async findByEmail(email: string) {
    return UserModel.findByEmail(email);
  }
}
