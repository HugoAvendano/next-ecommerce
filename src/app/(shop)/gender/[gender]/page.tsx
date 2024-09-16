export const revalidate = 60; // 60 segundos

import { getPaginatedProductWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Category } from "@/interfaces";
import { redirect } from "next/navigation";

interface Props {
  params:{
    gender: Category
  },
  searchParams: {
    page?: string,
    take?: string
  }
}

const labels: Record<Category,string> = {
  'men': 'Men',
  'women': 'Women',
  'kid': 'Kid',
  'unisex': 'Unisex'
}

export default async function GenderPage( {params,searchParams}: Props ) {
  
  const {gender} = params;

  /* if (!labels[gender]){
    notFound();
  } */

  const page = searchParams.page ? parseInt (searchParams.page) :  1;

  const { products, currentPage, totalPages } = await getPaginatedProductWithImages({page,gender});

  if ( products.length === 0 ){
    redirect(`/gender/${ gender }`);
  }


  return (
    <>
      <Title 
        title={ `Articulos de ${labels[gender]}` }
        subtitle="Todos los productos"
        className="mb-2"
      />
      <ProductGrid 
        products={products}
      />
      <Pagination totalPages={totalPages}/>
    </>
    
  );
}