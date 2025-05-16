import { Talk, TalkAttributes, TalkCreationAttributes as ModelTalkCreationAttributes 
} from '../models/talk.model.js';
import { User } from '../models/user.model.js';
import { Status } from '../models/status.model.js';
import { Slot } from '../models/slot.model.js';
import { Op, FindOptions, Includeable, WhereOptions } from 'sequelize';

export interface TalkCreationInput extends Omit<ModelTalkCreationAttributes, 'id' | 'createdAt' | 'updatedAt'> {
  slotId?: number | null;
}

export type TalkUpdateAttributes = Partial<TalkCreationInput>;

const talkIncludes: Includeable[] = [
  { model: User, as: 'speaker', attributes: ['id', 'name', 'email', 'role'] },
  { model: Status, as: 'status', attributes: ['id', 'label'] },
  { model: Slot, as: 'slot', attributes: ['id', 'startTime', 'endTime', 'roomId'] }, 
];

export const createTalk = async (data: TalkCreationInput): Promise<Talk> => {
  return Talk.create(data as ModelTalkCreationAttributes);
};

export const findAllTalks = async (options: { 
  limit?: number; 
  offset?: number; 
  statusLabel?: string; 
  level?: 'débutant' | 'intermédiaire' | 'avancé';
  speakerId?: number;
  slotId?: number;
} = {}): Promise<{ rows: Talk[]; count: number }> => {
  const queryOptions: FindOptions<TalkAttributes> = {
    include: talkIncludes,
    order: [
      
      
      ['title', 'ASC']
    ],
  };

  if (options.limit !== undefined) queryOptions.limit = options.limit;
  if (options.offset !== undefined) queryOptions.offset = options.offset;

  const whereClause: WhereOptions<TalkAttributes> = {};
  if (options.statusLabel) {
    
    
    whereClause['$status.label$'] = { [Op.iLike]: `%${options.statusLabel}%` };
  }
  if (options.level) {
    whereClause.level = options.level;
  }
  if (options.speakerId) {
    whereClause.speakerId = options.speakerId;
  }
  if (options.slotId) {
    whereClause.slotId = options.slotId;
  }

  if (Object.keys(whereClause).length > 0) {
    queryOptions.where = whereClause;
  }

  return Talk.findAndCountAll(queryOptions);
};

export const findTalkById = async (id: number): Promise<Talk | null> => {
  return Talk.findByPk(id, {
    include: talkIncludes,
  });
};

export const updateTalk = async (id: number, data: TalkUpdateAttributes): Promise<Talk | null> => {
  const [affectedCount] = await Talk.update(data, {
    where: { id },
  });
  if (affectedCount === 0) {
    return null;
  }
  return findTalkById(id);
};

export const deleteTalk = async (id: number): Promise<number> => {
  return Talk.destroy({
    where: { id },
  });
};
