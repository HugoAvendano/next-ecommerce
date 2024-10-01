'use server';

import prisma from '@/lib/prisma';


export const getUserAddress = async (userId : string) => {
  try {
    const userAddress = await prisma.userAddress.findUnique({
      where: {
        userId: userId
      }
    })

    if (!userAddress) return null

    const {countryId, otherAddress, ...rest} = userAddress;
    return {
      ...rest,
      country: countryId,
      otherAddress: otherAddress ? otherAddress : '',      
    }

  } catch (error) {
    console.log(error);
    return null;
  }


}