

import { Title } from "@/components";
import { initialData } from "@/seed/seed";
import clsx from "clsx";
import Image from "next/image";
import { IoCardOutline } from "react-icons/io5";
import { getOrderById } from "@/actions";
import { currencyFormatter } from '../../../../utils/currencyFormatter';
import { CardStatus } from "./ui/CardStatus";
import { redirect } from "next/navigation";


const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2]
];


interface Props {
  params: {
    id: string
  }
}

export default async function OrdersByIdPage({ params }: Props) {

  const { id } = params;
  const {ok, order} = await getOrderById(id);

  if(!ok){
    redirect('/');
  }
  

  //Todo verificar y redirect

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Order #${id.split('-')[0]}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Cart */}
          <div className="flex flex-col mt-5">
            <CardStatus isPaid = {order!.isPaid} />

            {/* Items */}
            {
              order?.OrderItem.map(item => (
                <div className="flex mb-5" key={item.product.slug}>
                  <Image
                    className="mr-5 rounded"
                    alt={item.product.title}
                    src={`/products/${item.product.ProductImage[0].url}`}
                    width={100}
                    height={100}
                    style={{
                      width: '100px',
                      height: '100px'
                    }}

                  />
                  <div>
                    <p> {item.product.title} </p>
                    <p> {currencyFormatter(item.price)}</p>
                    <p className="font-bold"> {`Subtotal: ${item.price * item.quantity}`} </p>

                  </div>
                </div>
              ))
            }
          </div>

          {/* Checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2 font-bold">Delivery Address</h2>
            <div className="mb-5">
              <p className="text-xl">{`${order!.OrderAddress!.name} ${order!.OrderAddress!.lastname}`}</p>
              <p>{order!.OrderAddress!.address}</p>
              <p>{`${order!.OrderAddress!.city} ${order!.OrderAddress!.countryId}`}</p>
              <p> {order!.OrderAddress!.mobile}</p>
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
              <span className="text-right"> {`${order!.itemsInOrder} articulos`}</span>

              <span >Subtotal</span>
              <span className="text-right"> { currencyFormatter(order!.subTotal) } </span>

              <span >Taxes (15%)</span>
              <span className="text-right"> {currencyFormatter(order!.tax)} </span>

              <span className="mt'5 text-2xl" >Total:</span>
              <span className="mt'5 text-2xl text-right"> {currencyFormatter(order!.total)}</span>

            </div>

            <CardStatus isPaid={order!.isPaid} />


          </div>

        </div>
      </div>
    </div>
  );
}