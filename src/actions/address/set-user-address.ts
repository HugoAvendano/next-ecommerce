'use server';
import { Address } from "@/interfaces";
import prisma from "@/lib/prisma";

export const saveUserAddress = async (address : Address, userId: string) =>{
  
  try {
    const newAddres = await createOrUpdateAddress(address, userId);
    return {
      ok: true,
      address: newAddres
    }
  } catch (error) {      
    return {
      ok: false,
      message: 'Could not save the address'
    }
  }
}

const createOrUpdateAddress = async (address : Address, userId: string) => {
  try {
    const storedAddress = await prisma.userAddress.findFirst({
      where: {
        userId : userId
      }
    });

    const addressToSave = {
      name: address.name,
      lastname: address.lastname,
      address: address.address,
      otherAddress: address.otherAdress? address.otherAdress : null,
      zipCode: address.zipCode,
      mobile: address.mobile,
      countryId: address.country,
      city: address.city,
      userId: userId
    }

    if(!storedAddress){
      const newAddress = await prisma.userAddress.create({
        data: addressToSave
      });
      return newAddress;
    }

    const adressUpdated = await prisma.userAddress.update({
      where:{
        userId: userId
      },
      data: addressToSave
    })

    return adressUpdated;


  } catch (error) {
    console.log(error);
    throw new Error('Could not save the address');
  }
}