'use server';

import prisma from "@/lib/prisma";
import bcryptjs from 'bcryptjs';
import { userAgent } from "next/server";

export const registerUser = async (name: string, email: string, password: string) => {
  try {

    const user = await prisma.user.create({
      data:{
        name: name,
        email: email.toLocaleLowerCase(),
        password: bcryptjs.hashSync(password)
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })
    return {
      ok: true,
      user: user,
      message: "Successfully registered user"
    }

  } catch (error) {
    console.log(error);
    return {
      ok: false,
      user: undefined,
      message: "Fail to register user"
    }
  }
}