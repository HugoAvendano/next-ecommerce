import {authenticate,login} from './auth/login';
import {logout} from './auth/logout';
import {registerUser} from './auth/register';

import {getPaginatedProductWithImages} from './products/product-pagination';
import {getStockBySlug} from './products/get-stock-by-slug';
import {getProductBySlug} from './products/get-product-by-slug';

export {
  authenticate,
  login,
  logout,
  registerUser,
  getPaginatedProductWithImages,
  getStockBySlug,
  getProductBySlug

}


