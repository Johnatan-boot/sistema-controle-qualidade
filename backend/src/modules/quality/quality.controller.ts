import { FastifyReply, FastifyRequest } from 'fastify';
import * as service from './quality.service';
import {
  CreateQualityRecordDTO,
  UpdateQualityRecordDTO,
} from './quality.types';

interface QualityParams {
  id: string;
}

export async function getAll(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const records = await service.getAll();

  return reply.send({
    success: true,
    data: records,
  });
}

export async function getById(
  request: FastifyRequest<{ Params: QualityParams }>,
  reply: FastifyReply
) {
  const id = Number(request.params.id);

  const record = await service.getById(id);

  if (!record) {
    return reply.status(404).send({
      success: false,
      message: 'Registro de qualidade não encontrado.',
    });
  }

  return reply.send({
    success: true,
    data: record,
  });
}

export async function create(
  request: FastifyRequest<{ Body: CreateQualityRecordDTO }>,
  reply: FastifyReply
) {
  const id = await service.create(request.body);

  const record = await service.getById(id);

  return reply.status(201).send({
    success: true,
    message: 'Registro de qualidade criado com sucesso.',
    data: record,
  });
}

export async function update(
  request: FastifyRequest<{
    Params: QualityParams;
    Body: UpdateQualityRecordDTO;
  }>,
  reply: FastifyReply
) {
  const id = Number(request.params.id);

  const updated = await service.update(id, request.body);

  if (!updated) {
    return reply.status(404).send({
      success: false,
      message: 'Registro de qualidade não encontrado.',
    });
  }

  const record = await service.getById(id);

  return reply.send({
    success: true,
    message: 'Registro de qualidade atualizado com sucesso.',
    data: record,
  });
}

export async function remove(
  request: FastifyRequest<{ Params: QualityParams }>,
  reply: FastifyReply
) {
  const id = Number(request.params.id);

  const removed = await service.remove(id);

  if (!removed) {
    return reply.status(404).send({
      success: false,
      message: 'Registro de qualidade não encontrado.',
    });
  }

  return reply.send({
    success: true,
    message: 'Registro de qualidade removido com sucesso.',
  });
}
