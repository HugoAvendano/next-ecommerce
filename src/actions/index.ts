import { authenticate, login } from './auth/login';
import { logout } from './auth/logout';
import { registerUser } from './auth/register';

import { createUpdateProduct } from './products/create-update-product';
import { getPaginatedProductWithImages } from './products/product-pagination';
import { getStockBySlug } from './products/get-stock-by-slug';
import { getProductBySlug } from './products/get-product-by-slug';
import { deleteProductImage} from './products/delete-product-image';


import { getCountries } from './country/get-countries';

import { saveUserAddress } from './address/set-user-address';
import { deleteUserAddress } from './address/delete-user-address';
import { getUserAddress } from './address/get-user-address';

import { placeOrder } from './order/place-order';
import { getOrderById } from './order/get-order-by-id';
import { getOrdersByUser } from './order/get-orders-by-user';
import { getPaginatedOrders } from './order/get-paginated-orders';

import { setTransctionId } from './payments/set-transaction-id';
import { paypalCheckPayment} from './payments/paypal-check-payments';

import { getPaginatedAllUsers } from './users/get-all-user';

import { getCategories } from './category/get-categories';

export {
  authenticate,
  login,
  logout,
  registerUser,
  getPaginatedProductWithImages,
  getStockBySlug,
  getProductBySlug,
  getCountries,
  saveUserAddress,
  deleteUserAddress,
  getUserAddress,
  placeOrder,
  getOrderById,
  getOrdersByUser,
  setTransctionId,
  paypalCheckPayment,
  getPaginatedOrders,
  getPaginatedAllUsers,
  getCategories,
  createUpdateProduct,
  deleteProductImage
}


