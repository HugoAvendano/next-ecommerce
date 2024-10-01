'use server'

import prisma from "@/lib/prisma";

export const getCountries = async () => {
  try {
    const countries = await prisma.country.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    if (!countries) return [];

    return countries;
    
  } catch (error) {
    console.log(error);
    return []
  }

}