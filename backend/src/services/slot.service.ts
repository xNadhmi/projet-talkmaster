import * as slotRepository from '../repositories/slot.repository.js';
import { Slot, SlotCreationAttributes } from '../models/slot.model.js';
import { Room } from '../models/room.model.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { Op } from 'sequelize';

const checkSlotOverlap = async (date: string, startTime: string, endTime: string, roomId: number, excludeSlotId?: number): Promise<void> => {
    const whereClause: any = {
        date,
        roomId,
        [Op.or]: [
            {
                startTime: { [Op.lt]: endTime },
                endTime: { [Op.gt]: startTime },
            },
        ],
    };
    if (excludeSlotId) {
        whereClause.id = { [Op.ne]: excludeSlotId };
    }

    const overlappingSlot = await Slot.findOne({ where: whereClause });

    if (overlappingSlot) {
        throw new ApiError(409, `Slot overlaps with existing slot ID ${overlappingSlot.id} in the same room at the same time.`);
    }
};


export const createNewSlot = async (data: SlotCreationAttributes, currentUser: User): Promise<Slot> => {
    if (currentUser.role !== 'organisateur') {
        throw new ApiError(403, 'Forbidden: Only organizers can create slots.');
    }

    if (!data.date || !data.startTime || !data.endTime || !data.roomId) {
        throw new ApiError(400, 'Date, startTime, endTime, and roomId are required.');
    }
    if (data.startTime >= data.endTime) {
        throw new ApiError(400, 'startTime must be before endTime.');
    }

    const room = await Room.findByPk(data.roomId);
    if (!room) {
        throw new ApiError(404, `Room with ID ${data.roomId} not found.`);
    }

    await checkSlotOverlap(data.date, data.startTime, data.endTime, data.roomId);

    return slotRepository.createSlot(data);
};

export interface GetAllSlotsOptions {
    limit?: number;
    offset?: number;
    date?: string;
    roomId?: number;
    isAvailable?: boolean;
}

export const getAllSlots = async (options: GetAllSlotsOptions = {}): Promise<{ rows: Slot[]; count: number }> => {
    return slotRepository.findAllSlots(options);
};

export const getSlotById = async (id: number): Promise<Slot> => {
    const slot = await slotRepository.findSlotById(id);
    if (!slot) {
        throw new ApiError(404, `Slot with ID ${id} not found.`);
    }
    return slot;
};

export const updateExistingSlot = async (id: number, data: slotRepository.SlotUpdateAttributes, currentUser: User): Promise<Slot> => {
    if (currentUser.role !== 'organisateur') {
        throw new ApiError(403, 'Forbidden: Only organizers can update slots.');
    }

    const slotToUpdate = await slotRepository.findSlotById(id);
    if (!slotToUpdate) {
        throw new ApiError(404, `Slot with ID ${id} not found.`);
    }
    
    const date = data.date ?? slotToUpdate.date;
    const startTime = data.startTime ?? slotToUpdate.startTime;
    const endTime = data.endTime ?? slotToUpdate.endTime;
    const roomId = data.roomId ?? slotToUpdate.roomId;

    if (data.startTime && data.endTime && data.startTime >= data.endTime) {
        throw new ApiError(400, 'startTime must be before endTime.');
    } else if (data.startTime && !data.endTime && data.startTime >= slotToUpdate.endTime) {
         throw new ApiError(400, 'startTime must be before existing endTime.');
    } else if (!data.startTime && data.endTime && slotToUpdate.startTime >= data.endTime) {
         throw new ApiError(400, 'existing startTime must be before new endTime.');
    }


    if (data.roomId) {
        const room = await Room.findByPk(data.roomId);
        if (!room) throw new ApiError(404, `Room with ID ${data.roomId} not found.`);
    }
    
    if (data.date || data.startTime || data.endTime || data.roomId) {
        await checkSlotOverlap(date, startTime, endTime, roomId, id);
    }

    const updatedSlot = await slotRepository.updateSlot(id, data);
    if (!updatedSlot) {
        throw new ApiError(500, `Slot with ID ${id} update failed.`); 
    }
    return updatedSlot;
};

export const deleteExistingSlot = async (id: number, currentUser: User): Promise<void> => {
    if (currentUser.role !== 'organisateur') {
        throw new ApiError(403, 'Forbidden: Only organizers can delete slots.');
    }

    const slotToDelete = await slotRepository.findSlotById(id);
    if (!slotToDelete) {
        throw new ApiError(404, `Slot with ID ${id} not found.`);
    }

    try {
        const affectedRows = await slotRepository.deleteSlot(id);
        if (affectedRows === 0) {
            throw new ApiError(404, `Slot with ID ${id} not found or already deleted.`);
        }
    } catch (error: any) {
    if (error.message.includes('Cannot delete slot')) {
        throw new ApiError(409, error.message);
    }
    throw error;
  }
};