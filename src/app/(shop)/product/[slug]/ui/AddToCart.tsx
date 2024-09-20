'use client';

import { SizeSelector, QuantitySelector } from '@/components';
import { CartProduct, Product, Size } from '@/interfaces';
import { useCartStore } from '@/store';
import { useState } from 'react';


interface Props {
  product: Product | null
}


export const AddToCart = ({ product } : Props ) => {

  const addProductToCart = useCartStore(state => state.addProductToCart);

  const [size, setSize] = useState<Size| undefined>()
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState<boolean>(false);

  const addToCart = () => {
    setPosted(true);
    if(!size) return

    const cartProduct : CartProduct = {
      id: product? product.id : '',
      slug:product? product.slug : '',
      title: product? product.title : '',
      price: product? product.price : 0,
      quantity: quantity ,
      size: size,
      image: product? product.images[0] : ''
    }
    
    addProductToCart(cartProduct);
    setPosted(false);
    setQuantity(1);
    setSize(undefined);

  }



  return (
    <>
      {
        posted  && !size && (
          <span className="mt-2 text-red-500 fade-in">
            Debe seleccionar una talla*
          </span>
        )
      }

      {/* Size Selector */}
      <SizeSelector availabeSizes={product?.sizes} selectedSize={size} onSizeChanged={setSize} />

      {/* Quantity Selector */}
      <QuantitySelector quantity={quantity} onQuantityChanged={setQuantity} />

      {/* Boton Agregar al carrito */}
      <button 
        onClick={addToCart}
        className="btn-primary my-5">
        Add to Cart
      </button>
    </>
  )
}
