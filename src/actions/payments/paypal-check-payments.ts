'use server';

import { PaypalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const authToken = await getPayPalBearerToken();  

  if (!authToken) {
    return {
      ok: false,
      message: 'Error getting token'
    }
  }

  const response = await verifyPayPalPayment(paypalTransactionId, authToken);

  if (!response) {
    return {
      ok: false,
      message: 'Error verifying payment'
    }
  }

  const {status, purchase_units} = response

  const {invoice_id : orderId} = purchase_units[0]

  if(status !== "COMPLETED") {
    return {
      ok:false,
      message: 'Has not yet been paid on PayPal'
    }
  }

  try {
    const orderUpdated = await prisma.order.update({
      where:{
        transactionId: paypalTransactionId,
        id: orderId
      },
      data:{
        isPaid: true,
        paidAt: new Date()
      }
    })
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: '500 - Error during payment'
    }
  }

  revalidatePath(`/order/${orderId}`)


}

const getPayPalBearerToken = async (): Promise<string | null> => {


  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? '';

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    'utf-8'
  ).toString('base64');

  const myHeaders = new Headers();

  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Token}`);
  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded
  };

  try {
    const result = await fetch(oauth2Url, {
      ...requestOptions,
      cache: 'no-cache'
    }).then(resp => resp.json())
    return result.access_token;
  } catch (error) {
    console.log(error);
    return null
  }



}

const verifyPayPalPayment = async (paypalTranscationId: string, bearerToken: string) : Promise<PaypalOrderStatusResponse | null > => {

  const PAYPAL_ORDERS_URL = `${process.env.PAYPAL_ORDERS_URL}/${paypalTranscationId}`;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bearerToken}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const result = await fetch(`${PAYPAL_ORDERS_URL}`, {
      ...requestOptions,
      cache: 'no-store'
    
    }).then(response => response.json());
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }   
}