import { create } from "zustand";
import { persist } from 'zustand/middleware';

interface State {
  deliveryAddress: {
    name: string;
    lastname: string;
    address: string;
    otherAdress?: string;
    zipCode: string;
    city: string;
    country: string;
    mobile: string; 
  }

  setDeliveryAddress: (address: State['deliveryAddress']) => void

}

export const useDeliveryAddressStore = create<State>()(

  persist(

    (set,get) => ({
      deliveryAddress: {
        name: "",
        lastname: "",
        address: "",
        otherAdress: "",
        zipCode: "",
        city: "",
        country: "",
        mobile: ""
        
      },

      setDeliveryAddress: (address) => {
        set({deliveryAddress: address})
      }
    }),
    {
      name: 'delivery-address'
    }

  )

)