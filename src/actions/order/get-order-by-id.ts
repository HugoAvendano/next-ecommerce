'use server';

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";



export const getOrderById = async (id: string ) =>  {

  const session = await auth();
  if (!session ){
    return {
      ok:false,
      message: 'You must be logged in.'
    }
  }

  try {
    const order = await prisma.order.findUnique({
      where:{
        id : id
      },
      select:{
        id:true,
        userId: true,       
        isPaid:true,
        tax:true,
        subTotal:true,
        total:true,
        itemsInOrder:true,
        OrderAddress: true,
        OrderItem:{
          select:{
            price:true,
            quantity: true,
            size: true,
            product:{
              select:{
                title:true,
                slug: true,

                ProductImage:{
                  select:{
                    url:true
                  },
                  take:1
                }
              }
            },
            

          }
        }        
      }
           
    });

    if (!order) {
      throw new Error(`Order #${id} not found,`)
    }

    if (session.user.role === 'user ' && session.user.id === order.userId) {
      throw new Error(`${session.user.id} does not have permission to see order #${id}`);
    }

    return {
      ok: true,
      order : order
    }

    

  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Order not found'
    }
  }
}