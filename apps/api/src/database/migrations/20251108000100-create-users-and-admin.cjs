"use strict";

const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

const envFiles = [".env.local", ".env"];
envFiles.forEach((file) => {
  const fullPath = path.resolve(process.cwd(), file);
  dotenv.config({ path: fullPath, override: true });
});

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@lmc.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin@123";
const ADMIN_NAME = process.env.ADMIN_NAME ?? "Administrador LMC";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("users", ["email"], {
      unique: true,
      name: "users_email_unique",
    });

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await queryInterface.bulkInsert("users", [
      {
        id: crypto.randomUUID(),
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password_hash: passwordHash,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", { email: ADMIN_EMAIL }, {});
    await queryInterface.dropTable("users");
  },
};
