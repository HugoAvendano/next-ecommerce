'use server';

import prisma from "@/lib/prisma";

export const getStockBySlug = async (slug : string) => {

  try {
    const stockProduct = await prisma.product.findFirst({
      select: {
        inStock: true
      },
      where:{
        slug:slug
      }
    });

    
    return stockProduct?.inStock ?? 0;
    
  } catch (error) {
    console.log(error);
    return 0;
  }

}