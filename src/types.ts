export interface Order {
  order_date: string;
  order_number: string;
  order_items?: OrderItemsEntity[] | null;
}
export interface OrderItemsEntity {
  type: string;
  pages: number;
}

export interface Fee {
  order_item_type: string;
  fees?: FeesEntity[] | null;
  distributions?: DistributionsEntity[] | null;
}
export interface FeesEntity {
  name: string;
  amount: string;
  type: string;
}
export interface DistributionsEntity {
  name: string;
  amount: string;
}
