import { Table, Column, Model, DataType, DefaultScope } from "sequelize-typescript";

@DefaultScope(() => ({
  attributes: { exclude: ["passwordHash"] }
}))
@Table({
  tableName: "users",
  timestamps: true,
  underscored: true
})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: "password_hash"
  })
  declare passwordHash: string;
}
