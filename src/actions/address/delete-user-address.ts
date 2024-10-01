'use server'

import prisma from '@/lib/prisma';


export const deleteUserAddress = async (userId: string) => {
  try {

    const deletedAddress = deleteAddress(userId);

    return {
      ok: true,
      message: 'Address deleted succesfully'
    }
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Could not delete the address'
    }
  }
}

const deleteAddress = async (userId: string ) => {
  try {
    const addressToDelete = await prisma.userAddress.findUnique({
      where: {
        userId : userId
      }
    });

    if(addressToDelete){
      const addressDeleted = await prisma.userAddress.delete({
        where:{
          userId : userId
        }
      })
    }

    return


  } catch (error) {
    console.log(error);
    throw new Error('Could not delete the address');
  }
}