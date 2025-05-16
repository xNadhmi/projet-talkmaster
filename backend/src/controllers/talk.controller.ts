import { Request, Response, NextFunction } from 'express';
import * as talkService from '../services/talk.service.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { z } from 'zod';
import { TalkCreationInput, TalkUpdateAttributes } from '../repositories/talk.repository.js';

const idParamSchema = z.object({
  id: z.string().refine(val => !isNaN(parseInt(val, 10)), { message: "ID must be a number" }).transform(val => parseInt(val, 10)),
});

const createTalkSchema = z.object({
  title: z.string().min(3).max(150),
  subject: z.string().min(3).max(100),
  description: z.string().min(10),
  duration: z.number().int().positive(),
  level: z.enum(['débutant', 'intermédiaire', 'avancé']),
  speakerId: z.number().int().positive(),
  statusId: z.number().int().positive(),
  slotId: z.number().int().positive().nullish(),
});

const updateTalkSchema = createTalkSchema.partial().refine(data => Object.keys(data).length > 0, {
  message: "No fields provided for update.",
});

const getAllTalksQuerySchema = z.object({
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined).refine(val => val === undefined || (val > 0), { message: "Limit must be a positive number" }),
  offset: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined).refine(val => val === undefined || (val >= 0), { message: "Offset must be a non-negative number" }),
  statusLabel: z.string().optional(),
  level: z.enum(['débutant', 'intermédiaire', 'avancé']).optional(),
  speakerId: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined).refine(val => val === undefined || (val > 0), { message: "Speaker ID must be a positive number" }),
  slotId: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined).refine(val => val === undefined || (val > 0), { message: "Slot ID must be a positive number" }),
});


export const createTalk = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || !req.user.id) throw new ApiError(401, 'Authentication required');
    
    const currentUserInstance = await User.findByPk(req.user.id);
    if (!currentUserInstance) {
        throw new ApiError(401, 'Authenticated user not found.');
    }
    
    const validationResult = createTalkSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));
      throw new ApiError(400, 'Validation failed', errors);
    }

    const talkData = validationResult.data as TalkCreationInput; 
    const talk = await talkService.createNewTalk(talkData, currentUserInstance);
    res.status(201).json({ success: true, data: talk });
  } catch (error) {
    next(error);
  }
};

export const getAllTalks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const queryValidationResult = getAllTalksQuerySchema.safeParse(req.query);
    if (!queryValidationResult.success) {
      const errors = queryValidationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));
      throw new ApiError(400, 'Invalid query parameters', errors);
    }

    const options = queryValidationResult.data;
    const result = await talkService.getAllTalks(options);
    res.status(200).json({ success: true, data: result.rows, meta: { total: result.count, limit: options.limit, offset: options.offset } });
  } catch (error) {
    next(error);
  }
};

export const getTalkById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const paramsValidationResult = idParamSchema.safeParse(req.params);
    if (!paramsValidationResult.success) {
      const errors = paramsValidationResult.error.errors.map(err => ({ field: err.path.join('.'), message: err.message, code: err.code }));
      throw new ApiError(400, 'Invalid talk ID format.', errors);
    }
    const { id } = paramsValidationResult.data;
    
    const talk = await talkService.getTalkById(id);
    res.status(200).json({ success: true, data: talk });
  } catch (error) {
    next(error);
  }
};

export const updateTalk = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const paramsValidationResult = idParamSchema.safeParse(req.params);
    if (!paramsValidationResult.success) {
      const errors = paramsValidationResult.error.errors.map(err => ({ field: err.path.join('.'), message: err.message, code: err.code }));
      throw new ApiError(400, 'Invalid talk ID format.', errors);
    }
    const { id } = paramsValidationResult.data;

    if (!req.user || !req.user.id) throw new ApiError(401, 'Authentication required');
    const currentUserInstance = await User.findByPk(req.user.id);
    if (!currentUserInstance) {
        throw new ApiError(401, 'Authenticated user not found.');
    }

    const bodyValidationResult = updateTalkSchema.safeParse(req.body);
    if (!bodyValidationResult.success) {
      const errors = bodyValidationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));
      throw new ApiError(400, 'Validation failed', errors);
    }
    
    const talkData = bodyValidationResult.data as TalkUpdateAttributes;
    const talk = await talkService.updateExistingTalk(id, talkData, currentUserInstance);
    res.status(200).json({ success: true, data: talk });
  } catch (error) {
    next(error);
  }
};

export const deleteTalk = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const paramsValidationResult = idParamSchema.safeParse(req.params);
    if (!paramsValidationResult.success) {
      const errors = paramsValidationResult.error.errors.map(err => ({ field: err.path.join('.'), message: err.message, code: err.code }));
      throw new ApiError(400, 'Invalid talk ID format.', errors);
    }
    const { id } = paramsValidationResult.data;

    if (!req.user || !req.user.id) throw new ApiError(401, 'Authentication required');
    const currentUserInstance = await User.findByPk(req.user.id);
    if (!currentUserInstance) {
        throw new ApiError(401, 'Authenticated user not found.');
    }

    await talkService.deleteExistingTalk(id, currentUserInstance);
    res.status(200).json({ success: true, message: 'Talk deleted successfully.' });
  } catch (error) {
    next(error);
  }
};