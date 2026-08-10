export interface QualityRecord {
  id: number;
  sector_id: number;
  status_id: number;
  divergence_type_id: number | null;
  product_id: number | null;
  supplier_id: number | null;
  quantity: number;
  observation: string | null;
  correction_action: string | null;
  observation_date: string | null;
  correction_date: string | null;
  responsible: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateQualityRecordDTO {
  sector_id: number;
  status_id: number;
  divergence_type_id?: number | null;
  product_id?: number | null;
  supplier_id?: number | null;
  quantity?: number;
  observation?: string | null;
  correction_action?: string | null;
  observation_date?: string | null;
  correction_date?: string | null;
  responsible?: string | null;
}

export interface UpdateQualityRecordDTO {
  sector_id?: number;
  status_id?: number;
  divergence_type_id?: number | null;
  product_id?: number | null;
  supplier_id?: number | null;
  quantity?: number;
  observation?: string | null;
  correction_action?: string | null;
  observation_date?: string | null;
  correction_date?: string | null;
  responsible?: string | null;
}
