import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/sequelize.js'

export class User extends Model {
  public id!: number
  public name!: string
  public email!: string
  public password!: string
  public role!: 'conférencier' | 'organisateur'
}

User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('conférencier', 'organisateur'),
    allowNull: false,
  },
}, {
  tableName: 'users',
  sequelize,
  timestamps: true,
})