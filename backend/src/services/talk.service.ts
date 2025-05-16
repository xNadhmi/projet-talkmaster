import * as talkRepository from '../repositories/talk.repository.js';
import { Talk } from '../models/talk.model.js';
import { User } from '../models/user.model.js';
import { Status } from '../models/status.model.js';
import { Slot } from '../models/slot.model.js';
import { ApiError } from '../utils/ApiError.js';
import { TalkCreationInput, TalkUpdateAttributes } from '../repositories/talk.repository.js';

export const createNewTalk = async (data: TalkCreationInput, currentUser: User): Promise<Talk> => {
  if (!data.title || !data.subject || !data.description || !data.duration || !data.level || !data.speakerId || !data.statusId) {
    throw new ApiError(400, 'Title, subject, description, duration, level, speakerId, and statusId are required.');
  }

  const speaker = await User.findByPk(data.speakerId);
  if (!speaker) {
    throw new ApiError(404, `Speaker with ID ${data.speakerId} not found.`);
  }

  const status = await Status.findByPk(data.statusId);
  if (!status) {
    throw new ApiError(404, `Status with ID ${data.statusId} not found.`);
  }

  if (data.slotId) {
    const slot = await Slot.findByPk(data.slotId);
    if (!slot) {
      throw new ApiError(404, `Slot with ID ${data.slotId} not found.`);
    }
  }
  
  if (currentUser.role === 'conférencier' && currentUser.id !== data.speakerId) {
      throw new ApiError(403, 'Speakers can only create talks for themselves.');
  }

  return talkRepository.createTalk(data);
};

export interface GetAllTalksOptions {
  limit?: number;
  offset?: number;
  statusLabel?: string;
  level?: 'débutant' | 'intermédiaire' | 'avancé';
  speakerId?: number;
  slotId?: number;
}

export const getAllTalks = async (options: GetAllTalksOptions = {}): Promise<{ rows: Talk[]; count: number }> => {
  return talkRepository.findAllTalks(options);
};

export const getTalkById = async (id: number): Promise<Talk> => {
  const talk = await talkRepository.findTalkById(id);
  if (!talk) {
    throw new ApiError(404, `Talk with ID ${id} not found.`);
  }
  return talk;
};

export const updateExistingTalk = async (id: number, data: TalkUpdateAttributes, currentUser: User): Promise<Talk> => {
  const talkToUpdate = await talkRepository.findTalkById(id);
  if (!talkToUpdate) {
    throw new ApiError(404, `Talk with ID ${id} not found.`);
  }

  if (currentUser.role !== 'organisateur' && talkToUpdate.speakerId !== currentUser.id) {
    throw new ApiError(403, 'Forbidden: You do not have permission to update this talk.');
  }

  if (data.speakerId) {
    const speaker = await User.findByPk(data.speakerId);
    if (!speaker) throw new ApiError(404, `Speaker with ID ${data.speakerId} not found.`);
  }
  if (data.statusId) {
    const status = await Status.findByPk(data.statusId);
    if (!status) throw new ApiError(404, `Status with ID ${data.statusId} not found.`);
  }
  if (data.slotId) {
    const slot = await Slot.findByPk(data.slotId);
    if (!slot) throw new ApiError(404, `Slot with ID ${data.slotId} not found.`);
  }

  const updatedTalk = await talkRepository.updateTalk(id, data);
  if (!updatedTalk) {
    throw new ApiError(500, `Talk with ID ${id} update failed.`);
  }
  return updatedTalk;
};

export const deleteExistingTalk = async (id: number, currentUser: User): Promise<void> => {
  const talkToDelete = await talkRepository.findTalkById(id);
  if (!talkToDelete) {
    throw new ApiError(404, `Talk with ID ${id} not found.`);
  }

  if (currentUser.role !== 'organisateur' && talkToDelete.speakerId !== currentUser.id) {
    throw new ApiError(403, 'Forbidden: You do not have permission to delete this talk.');
  }

  const affectedRows = await talkRepository.deleteTalk(id);
  if (affectedRows === 0) {
    throw new ApiError(500, `Failed to delete talk with ID ${id}.`);
  }
};