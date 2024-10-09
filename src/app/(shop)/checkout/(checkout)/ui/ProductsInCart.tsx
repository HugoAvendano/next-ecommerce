
'use client'

import { QuantitySelector } from "@/components";
import { CartProduct } from "@/interfaces";
import { useCartStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { currencyFormatter } from '../../../../../utils/currencyFormatter';

export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false);
  const productsInCart : CartProduct[] = useCartStore(state => state.cart);
  const updateProductQuantity = useCartStore(state => state.updateProductQuantity);
  const removePRoduct = useCartStore(state => state.removeProduct);

  useEffect(() => {
    setLoaded(true)
  }, []);

  if (!loaded){
    return <p>Loading...</p>
  }
  

  


  return (
    <>
      {/* Items */}
      {
        productsInCart.map(product => (
          <div className="flex mb-5" key={`${product.slug} - ${product.size}`}>
            <Image
              className="mr-5 rounded"
              alt={product.title}
              src={`/products/${product.image}`}
              width={100}
              height={100}
              style={{
                width: '100px',
                height: '100px'
              }}
              priority

            />
            <div>
              <span>                
                <p> {`${product.size} - ${product.title} (${product.quantity})`} </p>
              </span>
              <p className="font-bold"> {currencyFormatter(product.price * product.quantity)} </p>
            </div>
          </div>
        ))
      }
    </>
  )
}
