'use client'
import { useEffect, useState } from "react";
import { useCartStore } from "@/store";
import { currencyFormatter } from "@/utils";
import { useRouter } from 'next/navigation';



export const OrderSummary = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const {cantItemsCart,subTotal,tax,total} = useCartStore(state => state.getSummaryInformation());
  

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {

    if ( cantItemsCart === 0 && loaded === true )   {
      router.replace('/empty')
    }


  },[ cantItemsCart, loaded, router ])

  if (!loaded) {
    return <p>Loading...</p>
  }
  return (
    <>

      <span >Total products</span>
      <span className="text-right"> {cantItemsCart === 1 ? '1 articulo' : `${cantItemsCart} articulos`} </span>

      <span >Subtotal</span>
      <span className="text-right">{currencyFormatter(subTotal)}</span>

      <span >Tax (15%)</span>
      <span className="text-right">{currencyFormatter(tax)}</span>

      <span className="mt'5 text-2xl" >Total:</span>
      <span className="mt'5 text-2xl text-right">{currencyFormatter(total)}</span>


    </>
  )
}
