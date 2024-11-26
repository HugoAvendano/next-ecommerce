'use server';

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

import { revalidatePath } from "next/cache";

export const saveRole = async (newRole: string, userId : string) => {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return {
      ok: false,
      message: 'You must be logged in.'
    }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        role: newRole === 'admin' ? Role.admin : Role.user
      }
    });

    revalidatePath(`/admin/users`)

    return {
      ok: true
    }

  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: `Could not change role user ${session.user.email}`
    }
  }
}