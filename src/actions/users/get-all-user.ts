'use server';

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
interface PaginationOptions {
  page?: number,
  take?: number
}

export const getPaginatedAllUsers = async ({
  page = 1,
  take = 12
} :PaginationOptions) => {
  const session = await auth();
  if (session?.user.role !== 'admin' ){
    return {
      ok:false,
      message: 'You must be logged in.'
    }
  }

  if( isNaN( Number( page)) ) page = 1
  if( page < 1 ) page = 1 
  if( isNaN( Number( take)) ) take = 12
  
  try {
    const users = await prisma.user.findMany({ 
      take:take,
      skip: (page - 1) * take
    });

    const totalUsers = await prisma.user.count();

    const totalPages = Math.ceil(totalUsers/take);
    
    return {
      ok: true,
      users : users,
      currentPage: page,
      totalPages: totalPages,
    }
  } catch (error) {
    console.log(error);
    return {
      ok:false,
      message: 'Could not find users'
    }
  }
}