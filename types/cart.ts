import { Product } from "./products";

export interface AddToCartParams {
  productSku: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface CartItemFromAPI {
  id: string;
  product: {
    sku: string;
    name: string;
    description?: string;
    price: number;
    currency?: string;
    image: string;
  };
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  subtotal: number;
}

export interface CartData {
  items: CartItemFromAPI[];
  total: number;
  currency?: string;
}