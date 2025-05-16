import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/sequelize.js';
import { Room } from './room.model.js';
import { Talk } from './talk.model.js'; // Importer Talk pour l'association

export interface SlotAttributes {
  id: number;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:MM
  endTime: string;    // HH:MM
  roomId: number;
  // Sequelize ajoute createdAt et updatedAt si timestamps: true, mais ici c'est false
}

// Attributs pour la création. 'id' est optionnel car auto-généré.
export type SlotCreationAttributes = Optional<SlotAttributes, 'id'>;

export class Slot extends Model<SlotAttributes, SlotCreationAttributes> implements SlotAttributes {
  public id!: number;
  public date!: string;
  public startTime!: string;
  public endTime!: string;
  public roomId!: number;

  // Associations (optionnel de les déclarer ici, mais utile pour la clarté)
  public readonly room?: Room;
  public readonly talk?: Talk; // Un slot peut avoir un talk
}

Slot.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATEONLY, // Stocke seulement la date
    allowNull: false,
  },
  startTime: {
    type: DataTypes.TIME, // Stocke seulement l'heure
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME, // Stocke seulement l'heure
    allowNull: false,
  },
  roomId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: { model: Room, key: 'id' },
    onDelete: 'CASCADE', // Si une salle est supprimée, ses créneaux le sont aussi
  },
}, {
  tableName: 'slots',
  sequelize,
  timestamps: false, // Pas de createdAt/updatedAt pour les slots selon votre modèle initial
});

// Associations
Slot.belongsTo(Room, { foreignKey: 'roomId', as: 'room' });
Room.hasMany(Slot, { foreignKey: 'roomId', as: 'slots' });