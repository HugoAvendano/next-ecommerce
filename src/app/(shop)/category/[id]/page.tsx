import { ProductGrid, Title } from "@/components";
import { Category } from "@/interfaces";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

interface Props {
  params:{
    id: Category
  }
}

const labels: Record<Category,string> = {
  'men': 'Men',
  'women': 'Women',
  'kid': 'Kid',
  'unisex': 'Unisex'
}


export default function ( {params}: Props ) {
  const {id} = params;

  if (!labels[id]){
    notFound();
  }

  const productsFiltered = initialData.products.filter(prod=> prod.gender === id);


  return (
    <>
      <Title 
        title={ `Articulos de ${labels[id]}` }
        subtitle="Todos los productos"
        className="mb-2"
      />
      <ProductGrid 
        products={productsFiltered}
      />
    </>
    
  );
}