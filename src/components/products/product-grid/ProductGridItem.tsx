'use client';

import { ProductImage } from "@/components/product/product-image/ProductImage";
import { Product } from "@/interfaces"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react";

interface Props{
  product: Product
}
export const ProductGridItem = ({ product } : Props) => {

  const [displayImg, setDisplayImg] = useState(product.images[0]);

  return (
    <div className="rounded-md overflow-hidden fade-in">
      <Link href={`/product/${product.slug}`}>
        <ProductImage          
          src={displayImg}
          alt={product.title}
          className="w-full object-cover rounded"
          width={ 500 }
          height={ 500 }
          customOnMouseEnter={() => setDisplayImg(product.images[1])}          
          customOnMouseLeave={() => setDisplayImg(product.images[0])}

        />
      </Link>
      <div className="p-4 flex flex-col ">
        <Link href={`/product/${product.slug}`} className="hover:text-blue-600">
          { product.title }
        </Link>
        <span className="font-bold">
          {`$ ${product.price}`}
        </span>
      </div>
    </div>
  )
}
