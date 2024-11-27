'use client';

import { placeOrder } from '@/actions/order/place-order';
import { useCartStore, useDeliveryAddressStore } from '@/store';
import { currencyFormatter } from '@/utils';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react'



export const PlaceOrder = () => {
  const [loaded, setLoaded] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMsg, setErrorMSg] = useState('');

  const address = useDeliveryAddressStore(state => state.deliveryAddress);
  const { cantItemsCart, subTotal, tax, total } = useCartStore(state => state.getSummaryInformation());
  const cart = useCartStore(state => state.cart);
  const clearCart = useCartStore(state => state.clearCart);

  const router = useRouter();
  
  useEffect(() => {
    setLoaded(true);
  }, [])

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);    
    

    const productToOrder = cart.map(prod =>({
      productId: prod.id,
      quantity: prod.quantity,
      size: prod.size
    }));    

    const resp = await placeOrder(productToOrder,address);
    
    if(!resp.ok){
      setIsPlacingOrder(false);
      setErrorMSg(resp.message);
      return
    }
    clearCart();
    router.replace('/orders/' + resp.order!.id); 
    
  }

  if (!loaded) {
    return (<span>Loading...</span>)
  }


  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2 font-bold">Delivery Address</h2>
      <div className="mb-5">
        <p className="text-xl">{`${address.name} ${address.lastname}`}</p>
        <p>{address.address}</p>
        <p>{address.zipCode}</p>
        <p>{`${address.city} , ${address.country}`}</p>

        <p>{address.mobile}</p>
      </div>
      <div
        className="w-full h-0.5 rounded bg-gray-200 mb-5"
      />

      <h2 className="text-2xl mb-2 font-bold">
        Order Summary
      </h2>
      <div className="grid grid-cols-2">
        <span >Total products</span>
        <span className="text-right"> {cantItemsCart === 1 ? '1 articulo' : `${cantItemsCart} articulos`} </span>

        <span >Subtotal</span>
        <span className="text-right">{currencyFormatter(subTotal)}</span>

        <span >Tax (15%)</span>
        <span className="text-right">{currencyFormatter(tax)}</span>

        <span className="mt'5 text-2xl" >Total:</span>
        <span className="mt'5 text-2xl text-right">{currencyFormatter(total)}</span>


      </div>

      <div className="mt-5 mb-2 w-full">
        <p className='text-red-500'>{errorMsg}</p>
        <button
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder
            
          })}
          disabled={isPlacingOrder}
          onClick={() => onPlaceOrder()}
        >
          Place Order
        </button>
      </div>


    </div>
  )
}

