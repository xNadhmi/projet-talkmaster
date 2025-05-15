import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/sequelize.js'
import { Room } from './room.model.js'

export class Slot extends Model {
  public id!: number
  public date!: string       // YYYY-MM-DD
  public startTime!: string  // HH:MM
  public endTime!: string    // HH:MM
  public roomId!: number
}

Slot.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  roomId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: { model: Room, key: 'id' },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'slots',
  sequelize,
  timestamps: false,
})
