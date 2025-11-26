// Order Item Types
export interface OrderItem {
  productSku: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

// Address Types
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// Order Creation Types
export interface CreateOrderParams {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  paymentMethod: string;
  couponCode?: string;
  stripeSessionId?: string;
}

// Order Response Types
export interface Order {
  id?: string;
  orderNumber?: string;
  items?: OrderItem[];
  shippingAddress?: ShippingAddress;
  billingAddress?: BillingAddress;
  paymentMethod?: string;
  couponCode?: string;
  stripeSessionId?: string;
  total?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Order State Types (for Redux)
export interface OrderState {
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

// Order API Response Types
export interface OrderResponse {
  success: boolean;
  message?: string;
  data?: Order;
  error?: string;
}

// Order Summary Types (for UI display)
export interface OrderSummaryItem {
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku?: string;
  selectedSize?: string;
  selectedColor?: string;
}

export interface OrderSummary {
  orderNumber: string;
  items: OrderSummaryItem[];
  total: number;
  shippingCost?: number;
  subtotal?: number;
  tax?: number;
}

