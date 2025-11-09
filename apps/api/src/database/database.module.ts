import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { User } from "../users/user.model.js";

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db = configService.get("database");
        const connectionUrl = db?.url;

        return {
          dialect: "postgres",
          uri: connectionUrl,
          host: connectionUrl ? undefined : db?.host,
          port: connectionUrl ? undefined : db?.port,
          database: connectionUrl ? undefined : db?.name,
          username: connectionUrl ? undefined : db?.user,
          password: connectionUrl ? undefined : db?.password,
          models: [User],
          autoLoadModels: true,
          synchronize: false,
          logging: configService.get("app.nodeEnv") === "development" ? console.log : false
        };
      }
    })
  ],
  exports: [SequelizeModule]
})
export class DatabaseModule {}
