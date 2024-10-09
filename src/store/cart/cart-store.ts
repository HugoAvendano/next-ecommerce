import type { CartProduct, SummaryInformation } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  cart: CartProduct[];
  getTotalItems: () => number;
  addProductToCart: (product: CartProduct) => void;
  updateProductQuantity: (product: CartProduct, quantity: number) => void;
  removeProduct: (product: CartProduct) => void;
  getSummaryInformation: () => SummaryInformation;
  clearCart: () => void
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      // Methods
      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      },

      addProductToCart: (product: CartProduct) => {
        const { cart } = get();

        //Valido si el proucto ya existe en el carrito con la talla seleccionada

        const productInCart = cart.some(
          (item) => (item.id === product.id && item.size === product.size)
        );

        // Si no se encuentra el producto en el carrito
        if (!productInCart) {
          set({ cart: [...cart, product] })
          return
        }

        // Si se encuentra el producto en el carrito debo actualizarlo
        const updatedCart = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: item.quantity + product.quantity }
          }
          return item

        });

        set({ cart: updatedCart })

      },

      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();
        const updatedCart = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: quantity }
          }
          return item

        });
        set({ cart: updatedCart })
      },

      removeProduct: (product: CartProduct) => {
        const { cart } = get();

        const updatedCart = cart.filter(
          (item) => item.id !== product.id || item.size !== product.size
        )

        set({ cart: updatedCart })

      },
      getSummaryInformation: () => {
        const { cart } = get();

        const subTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        const cantItemsCart = cart.reduce((total, item) => total + item.quantity, 0);

        const tax = subTotal * 0.15;
        const total = subTotal + tax;

        return {
          subTotal,
          tax,
          total,
          cantItemsCart
        }
      },
      clearCart: () => {
        set({ cart: [] })
      }


    })
    , {
      name: 'shopping-cart'
    }
  )
)