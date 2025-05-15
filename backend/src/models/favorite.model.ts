import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/sequelize.js'
import { User } from './user.model.js'
import { Talk } from './talk.model.js'

export class Favorite extends Model {
  public userId!: number
  public talkId!: number
}

Favorite.init({
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    references: { model: User, key: 'id' },
    onDelete: 'CASCADE',
  },
  talkId: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    references: { model: Talk, key: 'id' },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'favorites',
  sequelize,
  timestamps: false,
})
