
export const revalidate = 0;

import { getPaginatedOrders } from '@/actions';
import { Title } from '@/components';
import clsx from 'clsx';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IoCardOutline } from 'react-icons/io5';




export default async function OrdersPage() {

  const resp = await getPaginatedOrders();

  if(!resp?.ok){
    redirect('/auth/login');
  }

  const orders = resp!.orders;



  return (
    <>
      <Title title="Orders" />

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                #ID
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Date
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Name
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                State
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Options
              </th>
            </tr>
          </thead>
          <tbody>

            {
              orders!.map((order) => (

                <tr key={order.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id.split('-')[0]}</td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {order.createdAt.toDateString()}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {`${order.OrderAddress!.name} ${order.OrderAddress!.lastname} `}
                  </td>
                  <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">

                    <IoCardOutline color={order.isPaid ? 'Green' : 'Red'} /* className={
                      
                      
                    } */ />
                    <span className={
                      clsx(
                        'ml-1',
                        {
                          'text-red-500': !order.isPaid,
                          'text-green-700': order.isPaid
                        }

                      )
                    }>{order.isPaid ? 'Approved' : 'Pending'}</span>

                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 ">
                    <Link href={`/orders/${order.id}`} className="hover:underline">
                      Ver orden
                    </Link>
                  </td>

                </tr>

              ))


            }



          </tbody>
        </table>
      </div>
    </>
  );
}