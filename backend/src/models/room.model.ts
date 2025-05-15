import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/sequelize.js'

export class Room extends Model {
  public id!: number
  public name!: string
  public capacity!: number
}

Room.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  capacity: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
}, {
  tableName: 'rooms',
  sequelize,
  timestamps: false,
})