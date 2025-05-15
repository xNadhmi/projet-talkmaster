import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/sequelize.js'

export class Status extends Model {
  public id!: number
  public name!: 'en_attente' | 'accepté' | 'refusé' | 'planifié'
}

Status.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.ENUM('en_attente', 'accepté', 'refusé', 'planifié'),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'statuses',
  sequelize,
  timestamps: false,
})