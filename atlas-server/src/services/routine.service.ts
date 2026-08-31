import * as routineRepository from '../repositories/routine.repository';
import {
  createRoutineSchema,
  CreateRoutineInput,
  updateRoutineSchema,
  RoutineTask,
} from '../models/routine.model';

export const getRoutines = async (
  frequency?: string,
): Promise<RoutineTask[]> => {
  return await routineRepository.getAllRoutines(frequency);
};

export const createRoutine = async (input: unknown): Promise<RoutineTask> => {
  const validatedData = createRoutineSchema.parse(input);
  return await routineRepository.createRoutine(validatedData);
};

export const deleteRoutine = async (id: number): Promise<boolean> => {
  return await routineRepository.deleteRoutine(id);
};

export const updateRoutine = async (id: number, input: unknown) => {
  const validatedData = updateRoutineSchema.parse(input);
  return await routineRepository.updateRoutine(id, validatedData);
};
