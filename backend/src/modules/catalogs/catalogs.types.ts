export interface CatalogItem {
  id: number;
  name: string;
}

export interface ProductCatalogItem {
  id: number;
  sku: string;
  description: string;
  supplier_id: number | null;
}
