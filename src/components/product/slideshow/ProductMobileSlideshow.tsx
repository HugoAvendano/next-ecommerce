'use client'


import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Pagination} from 'swiper/modules';


import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import './slideshow.css';
import Image from 'next/image';
import { ProductImage } from '../product-image/ProductImage';

interface Props {
  images?: string[],
  title?: string;
  className?: string
}

export const ProductMobileSlideshow = ({ images = [], title = '', className } : Props) => {
  
  return (
    <div className={className}>
      <Swiper
        style={{
          width: '100vw',
          height: '500px'
        }}
        pagination
        autoplay={{
          delay: 3000,
          stopOnLastSlide: true
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="mySwiper2"
      >
        {
          images.length === 0 ?
            (
              <SwiperSlide>
                  <ProductImage
                    width={600}
                    height={500}
                    alt={title}                                       
                    className="object-fill"                
                  />
                </SwiperSlide>
            ) :

            (
              images.map((image) => (
                <SwiperSlide key={image}>
                  <ProductImage
                    width={600}
                    height={500}
                    alt={title}
                    src={`/products/${image}`}             
                    className="object-fill"                
                  />
                </SwiperSlide>
              ))
            )
        }
      </Swiper>      
    </div>
  )
}
