'use client'

import { Address, Country } from "@/interfaces";
import { yupResolver } from "@hookform/resolvers/yup"
import clsx from "clsx";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form"
import * as yup from 'yup';
import {useDeliveryAddressStore} from '@/store'
import { deleteUserAddress, saveUserAddress } from "@/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type FormInputs = {
  name: string,
  lastname: string,
  address: string,
  otherAddress?: string | undefined,
  zipCode: string,
  city: string,
  country: string,
  mobile: string,
  remeberAdrress: boolean
}


const schema = yup.object().shape({
  name: yup.string().required("* The Name field is required."),
  lastname: yup.string().required("* The Lastname field is required."),
  address: yup.string().required("* The Address field is required."),
  otherAddress: yup.string().optional(),
  zipCode: yup.string().required("* The Zip Code field is required."),
  city: yup.string().required("* The City Code field is required."),
  country: yup.string().required("* The Country field is required."),
  mobile: yup.string().required("* The Mobile Code field is required."),
  remeberAdrress: yup.boolean().required()
});

interface Props {
  countries: Country[];
  userStoreAddress?: Partial<Address> | null
}
export default function AddressForm({ countries, userStoreAddress = {} } : Props) {

  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues:{
      ...userStoreAddress,
      remeberAdrress: true
    }
  });

  const router = useRouter();

  const setAddress = useDeliveryAddressStore(state => state.setDeliveryAddress);
  const address = useDeliveryAddressStore(state => state.deliveryAddress);

  const {data: session} = useSession({
    required:true
  })

  useEffect(() => {    
    if(address.name){
      reset(address)
    }   
  }, [])
  

 

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {   
    setAddress(data);

    const { remeberAdrress, ...restAddress } = data

    if (remeberAdrress){
      const newAddress = await saveUserAddress(restAddress,session!.user.id)
      console.log(newAddress)
    }else {
      await deleteUserAddress(session!.user.id);
    }
    router.push('/checkout');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2">


      <div className="flex flex-col mb-2">
        <span>Name</span>
        <input
          type="text"
          className={ clsx(
            "p-2 border rounded-md bg-gray-200",
            {
              'border-red-500': errors.name
            }
          )}
          {...register('name')}
        />
        {
          <span className="text-red-500 text-xs">{errors.name?.message}</span>
        }
      </div>

      <div className="flex flex-col mb-2">
        <span>Lastname</span>
        <input
          type="text"
          className={ clsx(
            "p-2 border rounded-md bg-gray-200",
            {
              'border-red-500': errors.lastname
            }
          )}
          {...register('lastname')}
        />
        {
          <span className="text-red-500 text-xs">{errors.lastname?.message}</span>
        }
      </div>

      <div className="flex flex-col mb-2">
        <span>Address</span>
        <input
          type="text"
          className={ clsx(
            "p-2 border rounded-md bg-gray-200",
            {
              'border-red-500': errors.address
            }
          )}
          {...register('address')}
        />
        {
          <span className="text-red-500 text-xs">{errors.address?.message}</span>
        }
      </div>

      <div className="flex flex-col mb-2">
        <span>Address 2 (optional)</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          {...register('otherAddress')}
        />
        {
          <span className="text-red-500 text-xs">{errors.otherAddress?.message}</span>
        }
      </div>


      <div className="flex flex-col mb-2">
        <span>Zip Code</span>
        <input
          type="text"
          className={ clsx(
            "p-2 border rounded-md bg-gray-200",
            {
              'border-red-500': errors.zipCode
            }
          )}
          {...register('zipCode')}
        />
        {
          <span className="text-red-500 text-xs">{errors.zipCode?.message}</span>
        }
      </div>

      <div className="flex flex-col mb-2">
        <span>City</span>
        <input
          type="text"
          className={ clsx(
            "p-2 border rounded-md bg-gray-200",
            {
              'border-red-500': errors.city
            }
          )}
          {...register('city')}
        />
        {
          <span className="text-red-500 text-xs">{errors.city?.message}</span>
        }
      </div>

      <div className="flex flex-col mb-2">
        <span>Country</span>
        <select
          className={ clsx(
            "p-2 border rounded-md bg-gray-200",
            {
              'border-red-500': errors.country
            }
          )}
          {...register('country')}
        >
          <option value="">[ Select ]</option>
          {countries.map( country =>(
            <option key={country.id} value={country.id}>{country.name}</option>
          ))}
        </select>
        {
          <span className="text-red-500 text-xs">{errors.country?.message}</span>
        }
      </div>

      <div className="flex flex-col mb-2">
        <span>Mobile</span>
        <input
          type="text"
          className={ clsx(
            "p-2 border rounded-md bg-gray-200",
            {
              'border-red-500': errors.mobile
            }
          )}
          {...register('mobile')}
        />
        {
          <span className="text-red-500 text-xs">{errors.mobile?.message}</span>
        }
      </div>



      <div className="flex flex-col mb-2 sm:mt-1">
        <div className="inline-flex items-center mb-10">
          <label
            className="relative flex cursor-pointer items-center rounded-full p-3"
            htmlFor="checkbox"
          >
            <input
              type="checkbox"
              className="border-gray-500 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
              id="checkbox"
              
              {...register('remeberAdrress')}
            />
            <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </label>
          <span>Remember address?</span>
        </div>
        <button
          /* href='/checkout' */
          type="submit"
          disabled={!isValid}
          //className="btn-primary flex w-full sm:w-1/2 justify-center ">
          className={clsx({
            "btn-primary" : isValid,
            "btn-disabled" : !isValid
          })}>
          Next
        </button>
      </div>


    </form>
  )
}


