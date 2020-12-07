

export class Product{
  // @ts-ignore
  id?: number;
  product_name: string;
  description: string;
  category_name?: string;
  product_category_id: number;
  purchase_unit_id: number;
  purchase_unit_name?: string;
  sale_unit_id: number;
  sale_unit_name?: string;
  gst_rate?: number;
  hsn_code?: number;
  opening_balance?: number;
  isEditMode?: boolean;
}

