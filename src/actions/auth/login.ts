'use server';
 
import { signIn } from '@/auth.config';
import { AuthError } from 'next-auth';
import email from 'next-auth/providers/email';
 
// ...
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
      
    });

    return 'Success';
  } catch (error) {
    /* return 'CredentialsSignin' */
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Unknown error.';
      }
    }
    throw error;
    
  }
}

export const login = async (email: string, password: string) =>{
  try {
    await signIn('credentials',{ email,password });
    return {
      ok: true,
      message: "Session started successfully."
    }
  } catch (error) {
    console.log(error);
    return{
      ok: false,
      message: "error when logging in."
    }
  }
}