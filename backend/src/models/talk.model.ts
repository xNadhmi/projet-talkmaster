import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/sequelize.js'
import { User } from './user.model.js'
import { Status } from './status.model.js'
import { Slot } from './slot.model.js'

export class Talk extends Model {
  public id!: number
  public title!: string
  public subject!: string
  public description!: string
  public duration!: number   // en minutes
  public level!: 'débutant' | 'intermédiaire' | 'avancé'
  public speakerId!: number
  public statusId!: number
  public slotId?: number
}

Talk.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  level: {
    type: DataTypes.ENUM('débutant', 'intermédiaire', 'avancé'),
    allowNull: false,
  },
  speakerId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: { model: User, key: 'id' },
    onDelete: 'CASCADE',
  },
  statusId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: { model: Status, key: 'id' },
    onDelete: 'RESTRICT',
  },
  slotId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: { model: Slot, key: 'id' },
    onDelete: 'SET NULL',
  },
}, {
  tableName: 'talks',
  sequelize,
  timestamps: true,
})
