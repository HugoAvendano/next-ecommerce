'use server';

import prisma from '@/lib/prisma';


export const setTransctionId = async (orderId : string, transactionId: string) => {
  
 try {
  const updatedOrder = await prisma.order.update({
    where:{
      id: orderId
    },
    data:{
      transactionId : transactionId
    }
  });

  if (!updatedOrder){
    return {
      ok: false,
      message: `Order ${orderId} not found.`
    }
  }

  return {
    ok: true,
    message: 'Order updated'
  }
  
 } catch (error) {
  console.log(error);
  return {
    ok: false,
    message: 'Could not update order'
  }
 }
}