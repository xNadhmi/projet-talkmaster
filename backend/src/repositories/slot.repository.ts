import { Slot, SlotAttributes, SlotCreationAttributes } from '../models/slot.model.js';
import { Room } from '../models/room.model.js';
import { Talk } from '../models/talk.model.js';
import { FindOptions, Includeable, WhereOptions } from 'sequelize';

export type SlotUpdateAttributes = Partial<Omit<SlotCreationAttributes, 'id'>>;

const slotIncludes: Includeable[] = [
  { model: Room, as: 'room', attributes: ['id', 'name', 'capacity'] },
  { model: Talk, as: 'talk', attributes: ['id', 'title', 'speakerId'], required: false }
];

export const createSlot = async (data: SlotCreationAttributes): Promise<Slot> => {
  return Slot.create(data);
};

export const findAllSlots = async (options: {
  limit?: number;
  offset?: number;
  date?: string; // YYYY-MM-DD
  roomId?: number;
  isAvailable?: boolean;
} = {}): Promise<{ rows: Slot[]; count: number }> => {
  const queryOptions: FindOptions<SlotAttributes> = {
    include: slotIncludes,
    order: [['date', 'ASC'], ['startTime', 'ASC']],
  };

  if (options.limit !== undefined) queryOptions.limit = options.limit;
  if (options.offset !== undefined) queryOptions.offset = options.offset;

  const whereClause: WhereOptions<SlotAttributes> = {};
  if (options.date) {
    whereClause.date = options.date;
  }
  if (options.roomId) {
    whereClause.roomId = options.roomId;
  }
  if (options.isAvailable !== undefined) {
    // Pour l'instant, laissons ce filtre plus complexe pour le service si besoin.
  }


  if (Object.keys(whereClause).length > 0) {
    queryOptions.where = whereClause;
  }
  
  const results = await Slot.findAndCountAll(queryOptions);

  if (options.isAvailable !== undefined) {
    results.rows = results.rows.filter(slot => options.isAvailable ? !slot.talk : !!slot.talk);
    results.count = results.rows.length;
  }


  return results;
};

export const findSlotById = async (id: number): Promise<Slot | null> => {
  return Slot.findByPk(id, {
    include: slotIncludes,
  });
};

export const updateSlot = async (id: number, data: SlotUpdateAttributes): Promise<Slot | null> => {
  const [affectedCount] = await Slot.update(data, {
    where: { id },
  });
  if (affectedCount === 0) {
    return null;
  }
  return findSlotById(id);
};

export const deleteSlot = async (id: number): Promise<number> => {
  const slot = await Slot.findByPk(id, { include: [{ model: Talk, as: 'talk' }]});
  if (slot && slot.talk) {
    throw new Error(`Cannot delete slot ID ${id} as it is currently assigned to talk ID ${slot.talk.id}.`);
    // await Talk.update({ slotId: null }, { where: { slotId: id } });
  }
  return Slot.destroy({
    where: { id },
  });
};