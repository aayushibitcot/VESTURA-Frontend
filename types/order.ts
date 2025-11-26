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
  date?: string;
  items?: Array<{
    id?: string;
    product?: {
      name: string;
      image?: string;
      sku?: string;
      price?: number;
    };
    quantity?: number;
    price?: number;
    selectedSize?: string;
    selectedColor?: string;
  }>;
  shippingAddress?: ShippingAddress;
  billingAddress?: BillingAddress;
  paymentMethod?: string;
  paymentStatus?: string;
  deliveryStatus?: string;
  couponCode?: string;
  stripeSessionId?: string;
  total?: number;
  subtotal?: number;
  shipping?: number;
  tax?: number;
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

// Orders List Response Types
export interface OrdersListResponse {
  success: boolean;
  message?: string;
  data?: {
    orders: OrderListItem[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: string;
}

// Order List Item (for API response)
export interface OrderListItem {
  id: string;
  orderNumber?: string;
  date?: string;
  total: number;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  paymentStatus: string;
  deliveryStatus: string;
  items?: Array<{
    id?: string;
    product?: {
      name: string;
      image?: string;
      sku?: string;
    };
    quantity?: number;
    price?: number;
    selectedSize?: string;
    selectedColor?: string;
  }>;
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

