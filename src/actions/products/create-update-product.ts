'use server';

import prisma from '@/lib/prisma';
import { Gender, Product, Size } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';
import image from 'next/image';
import { buffer } from 'stream/consumers';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');



const validationSchemaProd = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform(val => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform(val => Number(val.toFixed(0))),
  tags: z.string(),
  gender: z.nativeEnum(Gender),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform(val => val.split(','))
});


export const createUpdateProduct = async (formData: FormData) => {

  const data = Object.fromEntries(formData);
  const productParsed = validationSchemaProd.safeParse(data);

  if (!productParsed.success) {
    console.log(productParsed.error);
    return {
      ok: false
    }
  }

  const product = productParsed.data;
  product.slug = product.slug.toLowerCase().replace(/ /g, '-' ).trim();

  const { id, ...rest } = product;

  try {

    const transcation = await prisma.$transaction(async (tx) => {
      let productUpdatedOrCreated: Product;

      const tagsArray = rest.tags.split(',').map(tag => tag.trim().toLowerCase());

      if (id) {
        //Update product
        productUpdatedOrCreated = await prisma.product.update({
          where: {
            id
          },
          data: {
            ...rest,
            tags: {
              set: tagsArray
            },
            sizes: {
              set: rest.sizes as Size[]
            }
          }
        });    


      } else {
        //Create product
        productUpdatedOrCreated = await prisma.product.create({
          data: {
            ...rest,
            tags: {
              set: tagsArray
            },
            sizes: {
              set: rest.sizes as Size[]
            }
          }
        })
        
      }

      // Save images 

      if(formData.getAll('images')){
        const images = await uploadImages(formData.getAll('images') as File[])     
        if(!images) {
          throw new Error('Could not save the image. Transaction rollback')
        }

        await prisma.productImage.createMany({
          data: images.map( img => ({
            url: img!,
            productId: productUpdatedOrCreated.id
          }))
        })
      }

      return {
        productUpdatedOrCreated
      }
    });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${product.slug}`)
    revalidatePath(`/products/${product.slug}`)

    return {
      ok: true,
      product: transcation?.productUpdatedOrCreated
    }


  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Cant not create or update de product'
    }
  }
  
}

const uploadImages = async (images: File[]) => {

  try {
    
    const uploadPromises = images.map(async image => {
      try {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');

        return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`)
              .then(r => r.secure_url)
      } catch (error) {
        console.log(error);
        return null 
      }
    });

    const uploadedImages = await Promise.all( uploadPromises);
    return uploadedImages


  } catch (error) {
    console.log(error);
    return null
  }
 
}


