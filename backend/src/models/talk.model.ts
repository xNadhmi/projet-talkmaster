import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/sequelize.js'
import { User } from './user.model.js'
import { Status } from './status.model.js'
import { Slot } from './slot.model.js'

export interface TalkAttributes {
  id: number;
  title: string;
  subject: string;
  description: string;
  duration: number;
  level: 'débutant' | 'intermédiaire' | 'avancé';
  speakerId: number;
  statusId: number;
  slotId: number | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export type TalkCreationAttributes = Optional<TalkAttributes, 'id' | 'slotId' | 'createdAt' | 'updatedAt'>;

export class Talk extends Model<TalkAttributes, TalkCreationAttributes> implements TalkAttributes {
  public id!: number
  public title!: string
  public subject!: string
  public description!: string
  public duration!: number
  public level!: 'débutant' | 'intermédiaire' | 'avancé'
  public speakerId!: number
  public statusId!: number
  public slotId!: number | null
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


Talk.belongsTo(User, { foreignKey: 'speakerId', as: 'speaker' });
User.hasMany(Talk, { foreignKey: 'speakerId', as: 'talksAsSpeaker' }); 

Talk.belongsTo(Status, { foreignKey: 'statusId', as: 'status' });
Status.hasMany(Talk, { foreignKey: 'statusId', as: 'talks' });

Talk.belongsTo(Slot, { foreignKey: 'slotId', as: 'slot' });
Slot.hasOne(Talk, { foreignKey: 'slotId', as: 'talk' });