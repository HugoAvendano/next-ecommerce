
import { initialData } from './seed';
import prisma from '../lib/prisma';
import { Category } from '../interfaces/product.interfaces';

async function main() {
  //1. Borrar registros previos
  await Promise.all([
    prisma.productImage.deleteMany(),
    prisma.category.deleteMany(),
    prisma.product.deleteMany()
        
  ]);

  const {categories, products} = initialData;

  const categoriesData = categories.map(name =>({
    name
  }));

  // Crear Categorias

  await prisma.category.createMany({
     data: 
      categoriesData     
  });

  

  const categoriesDb = await prisma.category.findMany();

  const categoriesMap = categoriesDb.reduce((map,category)=>{
    map[category.name.toLowerCase()] = category.id;
    return map
  },{} as Record<string,string>);  

  const productsData = products.map((prod) =>{             
    const {type, images,...productData} = prod;
    return {
      ...productData,
      categoryId:categoriesMap[type]
    }
  });

  products.forEach(async prod => {
    //Crear Productos
    const {type, images,...rest} = prod;

    const prodDb = await prisma.product.create({
      data:{
        ...rest,
        categoryId: categoriesMap[type]
      }
    });

    // Crear Imagenes de Productos

    const imagesProductsData = prod.images.map(img => ({
      url: img,
      productId: prodDb.id
    }));

    await prisma.productImage.createMany({
      data:
        imagesProductsData
    });    
  });
  console.log("Seed Executed successfully")

}

(()=>{
  if(process.env.NODE_ENV==="production") return;
  main();
})();