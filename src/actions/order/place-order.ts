'use server'

import { auth } from '@/auth.config';
import { Address, Size } from '@/interfaces';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';



interface productToOrder {
  productId: string;
  quantity: number;
  size: Size
}

export const placeOrder = async (productsId: productToOrder[], address: Address) => {

  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return {
      ok: false,
      message: '500 - There is no user session'
    }
  }

  // Obtener toda la informacion de los productos

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productsId.map(p => p.productId)
      }
    }
  })

  console.log(products);

  // Calcular cantidad de productos de la orden
  const itemsInOrder = productsId.reduce((total, item) => total + item.quantity, 0);

  // Calcular subtotal, tx y total de la orden

  const { subTotal, tax, total } = productsId.reduce((totals, item) => {

    const productQuantity = item.quantity;
    const product = products.find(prod => prod.id === item.productId);

    if (!product) throw new Error(`${item.productId} not found - 500`);

    const subTotal = productQuantity * product.price;

    totals.subTotal += subTotal;
    totals.tax += subTotal * 0.15;
    totals.total += subTotal * 1.15;
    return totals

  }, { subTotal: 0, tax: 0, total: 0 })

  //Relaizar transaccion base de datos

  try {
    const prismaTransaction = await prisma.$transaction(async (tx) => {
      //1. Actualizar stock de los productos

      const updatedProductsPromise = products.map(product => {
        //Acumular las cantidades
        const productQuantity = productsId.filter(prod =>
          prod.productId === product.id
        ).reduce((acc, item) => acc + item.quantity, 0);

        if (productQuantity === 0) {
          throw new Error(`${product.id} does not have a defined quantity.`)
        }

        return tx.product.update({
          where: {
            id: product.id
          },
          data: {
            inStock: {
              decrement: productQuantity
            }
          }
        })
      });

      const updatedProducts = await Promise.all(updatedProductsPromise);

      //Verificar valores negativos en los stocks
      updatedProducts.forEach(updatedProduct => {
        if (updatedProduct.inStock < 0) {
          throw new Error(`${updatedProduct.title} no stock`)
        }
      })


      //2. Crear la orden - Encabezado - Detalles

      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: itemsInOrder,
          subTotal: subTotal,
          tax: tax,
          total: total,
          OrderItem: {
            createMany: {
              data: productsId.map(p => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price: products.find(product => product.id === p.productId)?.price ?? 0
              }))
            }
          }
        }
      })

      console.log({ order })
      // 3. Crear la direccion de entrega de la orden

      const orderAddress = await tx.orderAddress.create({
        data: {
          name: address.name,
          lastname: address.lastname,
          address: address.address,
          otherAddress: address.otherAdress,
          zipCode: address.zipCode,
          city: address.city,
          mobile: address.mobile,
          countryId: address.country,
          orderId: order.id
        }
      })


      return {
        updatedProducts: updatedProducts,
        order: order,
        orderAddress: orderAddress
      }

    });

    return{
      ok: true,
      order: prismaTransaction.order,
      prismaTx: prismaTransaction
    }

  } catch (error: any) {
    console.log(error);
    return {
      ok: false,
      message: error?.message
    }

  }

}