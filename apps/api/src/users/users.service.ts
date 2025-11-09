import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model.js";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.userModel.findByPk(id);
  }

  create(payload: { name: string; email: string; passwordHash: string }) {
    return this.userModel.create(payload);
  }
}
