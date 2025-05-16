import { Request, Response, NextFunction } from 'express';
import * as slotService from '../services/slot.service.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { z } from 'zod';
import { SlotCreationAttributes } from '../models/slot.model.js'; // Importer depuis le modèle
import { SlotUpdateAttributes } from '../repositories/slot.repository.js';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM format

const idParamSchema = z.object({
  id: z.string().refine(val => !isNaN(parseInt(val, 10)), { message: "ID must be a number" }).transform(val => parseInt(val, 10)),
});

const slotSchemaBase = {
  date: z.string().date("Invalid date format, expected YYYY-MM-DD"), // Zod .date() valide YYYY-MM-DD
  startTime: z.string().regex(timeRegex, "Invalid startTime format, expected HH:MM"),
  endTime: z.string().regex(timeRegex, "Invalid endTime format, expected HH:MM"),
  roomId: z.number().int().positive("Room ID must be a positive integer"),
};

const createSlotSchema = z.object(slotSchemaBase).refine(data => data.startTime < data.endTime, {
  message: "startTime must be before endTime",
  path: ["startTime", "endTime"],
});

const updateSlotSchema = z.object({
  date: z.string().date("Invalid date format, expected YYYY-MM-DD").optional(),
  startTime: z.string().regex(timeRegex, "Invalid startTime format, expected HH:MM").optional(),
  endTime: z.string().regex(timeRegex, "Invalid endTime format, expected HH:MM").optional(),
  roomId: z.number().int().positive("Room ID must be a positive integer").optional(),
}).partial().refine(data => Object.keys(data).length > 0, {
  message: "No fields provided for update.",
}).superRefine((data, ctx) => { // superRefine pour les validations interdépendantes
  if (data.startTime && data.endTime && data.startTime >= data.endTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "startTime must be before endTime",
      path: ["startTime", "endTime"],
    });
  }
});


const getAllSlotsQuerySchema = z.object({
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined).refine(val => val === undefined || (val > 0), { message: "Limit must be a positive number" }),
  offset: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined).refine(val => val === undefined || (val >= 0), { message: "Offset must be a non-negative number" }),
  date: z.string().date("Invalid date format for query, expected YYYY-MM-DD").optional(),
  roomId: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined).refine(val => val === undefined || (val > 0), { message: "Room ID must be a positive number" }),
  isAvailable: z.string().optional().transform(val => val === 'true' ? true : (val === 'false' ? false : undefined)).pipe(z.boolean().optional()),
});

export const createSlot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || !req.user.id) throw new ApiError(401, 'Authentication required');
    const currentUserInstance = await User.findByPk(req.user.id);
    if (!currentUserInstance) throw new ApiError(401, 'Authenticated user not found.');

    const validationResult = createSlotSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({ field: err.path.join('.'), message: err.message, code: err.code }));
      throw new ApiError(400, 'Validation failed', errors);
    }

    const slotData = validationResult.data as SlotCreationAttributes;
    const slot = await slotService.createNewSlot(slotData, currentUserInstance);
    res.status(201).json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
};

export const getAllSlots = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const queryValidationResult = getAllSlotsQuerySchema.safeParse(req.query);
    if (!queryValidationResult.success) {
      const errors = queryValidationResult.error.errors.map(err => ({ field: err.path.join('.'), message: err.message, code: err.code }));
      throw new ApiError(400, 'Invalid query parameters', errors);
    }
    const options = queryValidationResult.data;
    const result = await slotService.getAllSlots(options);
    res.status(200).json({ success: true, data: result.rows, meta: { total: result.count, limit: options.limit, offset: options.offset } });
  } catch (error) {
    next(error);
  }
};

export const getSlotById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const paramsValidationResult = idParamSchema.safeParse(req.params);
    if (!paramsValidationResult.success) {
      const errors = paramsValidationResult.error.errors.map(err => ({ field: err.path.join('.'), message: err.message, code: err.code }));
      throw new ApiError(400, 'Invalid slot ID format.', errors);
    }
    const { id } = paramsValidationResult.data;
    const slot = await slotService.getSlotById(id);
    res.status(200).json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
};

export const updateSlot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const paramsValidationResult = idParamSchema.safeParse(req.params);
    if (!paramsValidationResult.success) {
      const errors = paramsValidationResult.error.errors.map(err => ({ field: err.path.join('.'), message: err.message, code: err.code }));
      throw new ApiError(400, 'Invalid slot ID format.', errors);
    }
    const { id } = paramsValidationResult.data;

    if (!req.user || !req.user.id) throw new ApiError(401, 'Authentication required');
    const currentUserInstance = await User.findByPk(req.user.id);
    if (!currentUserInstance) throw new ApiError(401, 'Authenticated user not found.');

    const bodyValidationResult = updateSlotSchema.safeParse(req.body);
    if (!bodyValidationResult.success) {
      const errors = bodyValidationResult.error.errors.map(err => ({ field: err.path.join('.'), message: err.message, code: err.code }));
      throw new ApiError(400, 'Validation failed', errors);
    }
    
    const slotData = bodyValidationResult.data as SlotUpdateAttributes;
    const slot = await slotService.updateExistingSlot(id, slotData, currentUserInstance);
    res.status(200).json({ success: true, data: slot });
  } catch (error) {
    next(error);
  }
};

export const deleteSlot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const paramsValidationResult = idParamSchema.safeParse(req.params);
    if (!paramsValidationResult.success) {
      const errors = paramsValidationResult.error.errors.map(err => ({ field: err.path.join('.'), message: err.message, code: err.code }));
      throw new ApiError(400, 'Invalid slot ID format.', errors);
    }
    const { id } = paramsValidationResult.data;

    if (!req.user || !req.user.id) throw new ApiError(401, 'Authentication required');
    const currentUserInstance = await User.findByPk(req.user.id);
    if (!currentUserInstance) throw new ApiError(401, 'Authenticated user not found.');

    await slotService.deleteExistingSlot(id, currentUserInstance);
    res.status(200).json({ success: true, message: 'Slot deleted successfully.' });
  } catch (error) {
    next(error);
  }
};