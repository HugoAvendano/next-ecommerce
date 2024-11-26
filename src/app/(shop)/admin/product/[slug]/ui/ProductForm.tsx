"use client";

import { Product,ProductImage } from "@/interfaces";
import { Category } from "@/interfaces/category.interface";
import { useForm } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import clsx from "clsx";
import { IoTrashOutline } from "react-icons/io5";
import { createUpdateProduct, deleteProductImage } from "@/actions";
import { useRouter } from "next/navigation";


interface Props {
  product: Partial<Product> & {ProductImage? : ProductImage[]};
  categories: Category[];
}
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

type FormInputs = {
  title: string;
  slug: string;
  description: string;
  price: number;
  tags: string;
  gender: 'men' | 'women' | 'kid' | 'unisex';
  categoryId: string,
  inStock: number,
  sizes: string[],
  images?: FileList 
}

const schema = yup.object().shape({
  title: yup.string().required("* The title field is required."),
  slug: yup.string().required("* The slug field is required."),
  description: yup.string().required("* The description field is required."),
  price: yup.number().required("* The description field is required.").min(1),
  tags: yup.string().required("* The tags field is required."),
  gender: yup.string<'men' | 'women' | 'kid' | 'unisex'>().required("* The gender field is required."),
  categoryId: yup.string().required("* The category field is required."),
  inStock: yup.number().required("* The category field is required.").min(1, "* The number must be more 0"),
  sizes: yup.array().required("* You can choose almost one size."),
  images: yup
  .mixed<FileList>()
  .test('is-file-list', 'Debe ser una lista de archivos válida', (value) => {
    return value === undefined || value === null || value instanceof FileList;
  }),   
})



export const ProductForm = ({ product, categories }: Props) => {

  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...product,
      tags: product.tags?.join(','),
      sizes: product.sizes ?? [],
      inStock: product.inStock ?? 0,
      images: undefined
    }
  });

  watch('sizes');

  const onSubmit = async (data: FormInputs) => {
    
    const { images ,...productToSave } = data;
    
    console.log(productToSave);
    const formData = new FormData();
    if (product.id){
      formData.append('id', product.id)
    }

    
    formData.append('title', productToSave.title);
    formData.append('slug', productToSave.slug);
    formData.append('description', productToSave.description);
    formData.append('price', productToSave.price.toString());
    formData.append('tags', productToSave.tags);
    formData.append('gender', productToSave.gender);
    formData.append('categoryId', productToSave.categoryId);
    formData.append('sizes', productToSave.sizes.toString());
    formData.append('inStock', productToSave.inStock.toString());
    console.log(formData);

    if (images ) {
      for (let index = 0; index < images.length; index++) {
        const img = images[index];
        formData.append('images', img)        
      }
    }

    const {ok, product: updatedProd} = await createUpdateProduct(formData);
    
    if (!ok) {
      alert ('Could not save the product information')
      return
    }


    router.replace(`/admin/product/${updatedProd!.slug}`)





  }

  const onSizeChange = (size : string) => {
    const sizesProd = new Set(getValues('sizes'));
    sizesProd.has(size) ? sizesProd.delete(size) : sizesProd.add(size);
    setValue('sizes',Array.from(sizesProd));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3">
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register('title')}
          />
          {
            <span className="text-red-500 text-xs ">{errors.title?.message}</span>
          }
        </div>

        <div className="flex flex-col mb-2">
          <label htmlFor="slug" >Slug</label>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register('slug')}
          />
          {
            <span className="text-red-500 text-xs ">{errors.slug?.message}</span>
          }
        </div>

        <div className="flex flex-col mb-2">
          <label htmlFor="description">Description</label>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register('description')}
          >

          </textarea>
          {
            <span className="text-red-500 text-xs ">{errors.description?.message}</span>
          }
        </div>

        <div className="flex flex-col mb-2">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            step="0.01"
            className="p-2 border rounded-md bg-gray-200"
            {...register('price')}
          />
          {
            <span className="text-red-500 text-xs ">{errors.price?.message}</span>
          }
        </div>

        <div className="flex flex-col mb-2">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register('tags')}
          />
          {
            <span className="text-red-500 text-xs ">{errors.tags?.message}</span>
          }
        </div>

        <div className="flex flex-col mb-2">
          <label htmlFor="gender">Gender</label>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register('gender')}
          >
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
          {
            <span className="text-red-500 text-xs ">{errors.gender?.message}</span>
          }
        </div>

        <div className="flex flex-col mb-2">
          <label htmlFor="category">Category</label>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register('categoryId')}
          >
            <option value="">[Seleccione]</option>
            {
              categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))
            }
          </select>
          {
            <span className="text-red-500 text-xs ">{errors.categoryId?.message}</span>
          }
        </div>

        <button type="submit" className="btn-primary w-full">
          Guardar
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
            <label htmlFor="inStock">Stock</label>
            <input
              type="number"
              className="p-2 border rounded-md bg-gray-200"
              {...register("inStock")}
            />
            {
              <span className="text-red-500 text-xs ">{errors.inStock?.message}</span>
            }
          </div>
        {/* As checkboxes */}
        <div className="flex flex-col">

          <span>Sizes</span>
          <div className="flex flex-wrap">

            {
              sizes.map(size => (
                // bg-blue-500 text-white <--- si está seleccionado
                <div 
                  key={size}
                  onClick={() => onSizeChange(size)}
                  className={
                    clsx(
                      "p-2 cursor-pointer border rounded-md mr-2 mb-2 w-14 transition-all text-center",
                      {
                        "bg-blue-500 text-white": getValues('sizes').includes(size)
                      }
                    )
                  }
                >
                  <span>{size}</span>
                </div>
              ))
            }

          </div>


          <div className="flex flex-col mb-2">

            <span>Photos</span>
            <input
              type="file"
              multiple
              className="p-2 border rounded-md bg-gray-200"
              accept="image/png, image/jpeg, image/avif"
              {...register('images')}
            />

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {
              product.ProductImage?.map(image => (
                <div key={image.id} >
                  <Image
                    alt=""
                    /* src={`/products/${image.url}`} */
                    src={image.url}
                    width={300}
                    height={300}
                    className="rounded-t shadow"
                  />
                  <button 
                    type="button"
                    className="flex items-center justify-center btn-danger w-full rounded-b-xl"
                    onClick={() => deleteProductImage(image.id, image.url)}
                  >
                    <IoTrashOutline title="Remove"></IoTrashOutline>
                  </button>
                </div>
              ))
            }
          </div>

        </div>
      </div>
    </form>
  );
};