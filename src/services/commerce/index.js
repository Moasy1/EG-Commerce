import { ProductService } from '../ProductService.js';
import { CartService } from '../CartService.js';
import { OrderService } from '../OrderService.js';
import { MerchantService } from '../MerchantService.js';
import { attributionService } from '../analytics/attributionService.js';

export const commerceService = {
  products: ProductService,
  cart: CartService,
  orders: OrderService,
  merchant: MerchantService,
  attribution: attributionService
};

export { ProductService, CartService, OrderService, MerchantService, attributionService };
