import * as repository from './quality.repository';
import {
  CreateQualityRecordDTO,
  UpdateQualityRecordDTO,
} from './quality.types';

export async function getAll() {
  return repository.findAll();
}

export async function getById(id: number) {
  return repository.findById(id);
}

export async function create(data: CreateQualityRecordDTO) {
  return repository.create(data);
}

export async function update(
  id: number,
  data: UpdateQualityRecordDTO
) {
  return repository.update(id, data);
}

export async function remove(id: number) {
  return repository.remove(id);
}
