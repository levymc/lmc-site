import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service.js";
import { LoginDto } from "./dto/login.dto.js";
import { LoginResponseDto } from "./dto/login-response.dto.js";
import { User } from "../users/user.model.js";

const DEMO_USER = {
  name: "Time LMC",
  email: "demo@lmc.com",
  password: "Senha@123"
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(credentials: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(credentials);

    const payload = { sub: user.id, email: user.email };
    return {
      token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }

  private async validateUser({ email, password }: LoginDto): Promise<User> {
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      return this.seedDemoUser();
    }

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    return user;
  }

  private async seedDemoUser(): Promise<User> {
    const existing = await this.usersService.findByEmail(DEMO_USER.email);

    if (existing) {
      return existing;
    }

    const passwordHash = await bcrypt.hash(DEMO_USER.password, 10);
    return this.usersService.create({ name: DEMO_USER.name, email: DEMO_USER.email, passwordHash });
  }
}
