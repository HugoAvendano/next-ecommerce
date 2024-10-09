'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";


export const getOrdersByUser = async ( ) => {
  const session = await auth();
  if (!session?.user ){
    return {
      ok:false,
      message: 'You must be logged in.'
    }
  }

  try {
    const orders = await prisma.order.findMany({
      select :{
        id: true,
        createdAt: true,
        isPaid: true,
        OrderAddress:{
          select:{
            name: true,
            lastname:true
          }
        }
      },
      where:{
        userId : session.user.id
      },
      
      orderBy:{
        createdAt : "desc"
      }
    });

    return {
      ok: true,
      orders : orders
    };
    
  } catch (error) {
    console.log(error);
    return null;
  }

}
