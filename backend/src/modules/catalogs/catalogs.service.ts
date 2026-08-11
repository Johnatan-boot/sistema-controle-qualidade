import * as repository from './catalogs.repository';

export async function getSectors() {
  return repository.findSectors();
}

export async function getStatuses() {
  return repository.findStatuses();
}

export async function getDivergenceTypes() {
  return repository.findDivergenceTypes();
}

export async function getSuppliers() {
  return repository.findSuppliers();
}

export async function getProducts() {
  return repository.findProducts();
}
