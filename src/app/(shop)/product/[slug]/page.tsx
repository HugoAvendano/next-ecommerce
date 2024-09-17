export const revalidate = 604800; // 7 dias

import type { Metadata, ResolvingMetadata } from 'next'

import notFound from "../not-found";
import { titleFont } from "@/config/fonts";
import { ProductMobileSlideshow, ProductSlideshow, QuantitySelector, SizeSelector } from "@/components";
import { getProductBySlug } from "@/actions";
import { StockLabel } from "@/components/product/stock-label/StockLabel";



interface Props {
  params: {
    slug: string
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = params.slug
 
  // fetch data
  const product = await getProductBySlug(slug);
 
  // optionally access and extend (rather than replace) parent metadata
  //const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: product?.title ?? '',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? '',
      description: product?.description ?? '',
      //images: ['/some-specific-page-image.jpg', ...previousImages],
      images: [`/products/${product?.images[1]}`]
    },
  }
}

export default async function ProductBySlugPage({ params } : Props) {
  const {slug} = params;  

  const product = await getProductBySlug(slug);

  if(!product){
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
      {/* Slideshow */}
      <div className="col-span-1 md:col-span-2 justify-items-center">
        
        {/* Mobile Slideshow */}
        <ProductMobileSlideshow
          title={product?.title}
          images={product?.images}
          className="block md:hidden"

        />
        {/* Desktop Slideshow */}
        <ProductSlideshow
          title={product?.title}
          images={product?.images}
          className="hidden md:block"

        />

        
      </div>

      {/* Details */}
      <div className="col-span-1 px-5">

        <StockLabel slug={slug} />
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product?.title}
        </h1>

        <p className="text-lg mb-5">$ {product?.price}</p>
        
        {/* Size Selector */}
        <SizeSelector availabeSizes={product?.sizes} selectedSize={'S'}/>

        {/* Quantity Selector */}
        <QuantitySelector quantity={2} />

        {/* Boton Agregar al carrito */}
        <button className="btn-primary my-5">
          Add to Cart
        </button>

        {/* Description */}
        <h3 className="font-bold text-sm">Description</h3>
        <p className="font-light">
          { product?.description }
        </p>
      </div>

    </div>
  );
}