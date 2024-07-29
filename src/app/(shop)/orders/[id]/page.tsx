

import { QuantitySelector, Title } from "@/components";
import { initialData } from "@/seed/seed";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { IoCardOutline } from "react-icons/io5";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2]
];

interface Props {
  params:{
    id: string
  }
}

export default function ({ params } : Props) {

  const {id} = params;

  //Todo verificar y redirect

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title= {`Order #${id}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Cart */}
          <div className="flex flex-col mt-5">
            <div className={
              clsx(
                "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                {
                  'bg-red-500': false,
                  'bg-green-700': true
                }
              )
            }>
              <IoCardOutline size={30} />
              <span className="mx-2">Pending</span>
            </div>        
          
            {/* Items */}
            {
              productsInCart.map(product=>(
                <div className="flex mb-5" key={product.slug}>
                  <Image
                    className="mr-5 rounded"
                    alt={product.title}
                    src={`/products/${product.images[0]}`}
                    width={100}
                    height={100}
                    style={{
                      width: '100px',
                      height: '100px'
                    }}

                  />
                  <div>
                    <p> {product.title} </p>
                    <p> {product.price} x 3</p>
                    <p className="font-bold"> {`Subtotal: ${product.price * 3}`} </p>
                    
                  </div>
                </div>
              ))
            }
          </div>

          {/* Checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2 font-bold">Delivery Address</h2>
            <div className="mb-5">
              <p className="text-xl">Nombre y Apellido</p>
              <p>Direccion</p>
              <p>Ciudad y Pais</p>
              <p>Codigo Postal</p>
              <p>Telefono</p>
            </div>
            <div
              className="w-full h-0.5 rounded bg-gray-200 mb-5"
            />

            <h2 className="text-2xl mb-2 font-bold">
              Order Summary
            </h2>
            <div className="grid grid-cols-2">
              <span >Quantity of Products</span>
              <span className="text-right"> 3 articulos</span>
              
              <span >Subtotal</span>
              <span className="text-right">$799.70</span>

              <span >Taxes (15%)</span>
              <span className="text-right">$799.70</span>              

              <span className="mt'5 text-2xl" >Total:</span>
              <span className="mt'5 text-2xl text-right">$799.70</span>
            
            </div>

            <div className="mt-5 mb-2 w-full">
              <div className={
                clsx(
                  "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                  {
                    'bg-red-500': false,
                    'bg-green-700': true
                  }
                )
              }>
                <IoCardOutline size={30} />
                <span className="mx-2">Pending</span>
              </div>       
            </div>


          </div>

        </div>
      </div>
    </div>
  );
}