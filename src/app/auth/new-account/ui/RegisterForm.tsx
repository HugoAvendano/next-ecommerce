'use client'


import { login, registerUser } from "@/actions";
import InputPassword from "@/components/ui/login/InputPassword";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

type FormInputs = {
  name: string;
  email: string;
  password: string;
}

const schema = yup.object({
  name: yup.string().required("* The name field is required."),
  email: yup.string().required("* The email field is required.").email("* Incorrect email format."),
  password: yup.string().required("* The password field is required.").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).\S{8,15}$/,
    "* The password must contain at least one uppercase letter, one lowercase letter, a number, a special character and a length of between 8 and 15 characters.")

})

export const RegisterForm = () => {

  const [errorMSg, setErrorMsg] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
    resolver: yupResolver(schema),
  });




  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setErrorMsg('');
    const { name, email, password } = data;



    const response = await registerUser(name, email, password);

    if (!response.ok) {
      setErrorMsg(response.message);
      return
    }

    await login(email.toLowerCase(), password);

    window.location.replace('/');



  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

      <label htmlFor="name">Name</label>
      <input
        className={
          clsx(
            "px-5 py-2 border bg-gray-200 rounded mb-1",
            {
              'border-red-500': errors.name
            }
          )
        }
        type="text"
        {...register('name')}
        autoFocus

      />
      {

        <span className="text-red-500 text-xs">{errors.name?.message}</span>
      }


      <label htmlFor="email">Email</label>
      <input
        className={
          clsx(
            "px-5 py-2 border bg-gray-200 rounded mb-1",
            {
              'border-red-500': errors.email
            }
          )
        }
        type="text"
        {...register('email')}
      />
      {
        <span className="text-red-500 text-xs ">{errors.email?.message}</span>
      }
      <InputPassword register={register} errors={errors} />

      <span className="text-red-500 ">{errorMSg}</span>

      <button
        className="btn-primary">
        Sign On
      </button>


      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link
        href="/auth/new-account"
        className="btn-secondary text-center">
        Sign In
      </Link>

    </form>
  )
}


