// frontend/src/types/index.ts

export interface ProductSize {
  size: number;
  isBlocked: boolean;
}

export type Category =
  | 'skechers'
  | 'new-drops'
  | 'formal-collection'
  | 'lace-up'
  | 'chunky-formals'
  | 'best-selling'
  | 'casual-collection'
  | 'peshawari-sandals'
  | 'sandals'
  | 'slippers'
  | 'boots'
  | 'loafers'
  | 'moccasins'
  | 'sneakers'
  | 'monaco';

export const CATEGORY_LABELS: Record<Category, string> = {
  'skechers':           'Skechers',
  'new-drops':          'New Drops',
  'formal-collection':  'Formal Collection',
  'lace-up':            'Lace Up',
  'chunky-formals':     'Chunky Formals',
  'best-selling':       'Best Selling',
  'casual-collection':  'Casual Collection',
  'peshawari-sandals':  'Peshawari Sandals',
  'sandals':            'Sandals',
  'slippers':           'Slippers',
  'boots':              'Boots',
  'loafers':            'Loafers',
  'moccasins':          'Moccasins',
  'sneakers':           'Sneakers',
  'monaco':             'Monaco',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  'skechers':           '👟',
  'new-drops':          '✨',
  'formal-collection':  '👞',
  'lace-up':            '🎀',
  'chunky-formals':     '🥿',
  'best-selling':       '🔥',
  'casual-collection':  '👟',
  'peshawari-sandals':  '🩴',
  'sandals':            '🩴',
  'slippers':           '🥿',
  'boots':              '🥾',
  'loafers':            '👞',
  'moccasins':          '👞',
  'sneakers':           '👟',
  'monaco':             '✨',
};

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: Category;
  sizes: ProductSize[];
  colors: string[];
  images: string[];
  stock: number;
  isVisible: boolean;
  isDiscontinued: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  size?: number;
  color?: string;
  quantity: number;
  image: string;
  slug: string;
}

export type PaymentMethod = 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  size?: number;
  color?: string;
  quantity: number;
  image: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  customerCity: string;
  customerPostalCode?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharges: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  transactionId?: string;
  notes?: string;
  emailSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  email: string;
  role: 'superadmin' | 'admin';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    products?: T[];
    orders?: T[];
    items?: T[];
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
}

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
}

export interface CheckoutFormData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  customerCity: string;
  customerPostalCode?: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  notes?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: Category;
  sizes: ProductSize[];
  colors: string[];
  images: string[];
  stock: number;
  isVisible: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  tags: string[];
}

export type SortOption = 'newest' | 'oldest' | 'price_asc' | 'price_desc';

export interface FilterState {
  category: string;
  size: string;
  color: string;
  minPrice: string;
  maxPrice: string;
  search: string;
  sortBy: SortOption;
  page: number;
}
