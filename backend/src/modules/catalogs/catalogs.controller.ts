import { FastifyReply, FastifyRequest } from 'fastify';

import * as service from './catalogs.service';

export async function getSectors(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await service.getSectors();

  return reply.send({
    success: true,
    data,
  });
}

export async function getStatuses(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await service.getStatuses();

  return reply.send({
    success: true,
    data,
  });
}

export async function getDivergenceTypes(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await service.getDivergenceTypes();

  return reply.send({
    success: true,
    data,
  });
}

export async function getSuppliers(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await service.getSuppliers();

  return reply.send({
    success: true,
    data,
  });
}

export async function getProducts(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const data = await service.getProducts();

  return reply.send({
    success: true,
    data,
  });
}
