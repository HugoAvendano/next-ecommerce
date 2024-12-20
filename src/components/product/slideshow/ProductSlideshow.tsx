'use client'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper as SwiperObject} from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './slideshow.css';
import { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '../product-image/ProductImage';

interface Props {
  images?: string[],
  title?: string;
  className?: string
}

export const ProductSlideshow = ({ images = [], title = '', className } : Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();
  return (
    <div className={className}>
      <Swiper
        style={
          {
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
          } as React.CSSProperties
        }
        spaceBetween={10}
        navigation={true}
        autoplay={{
          delay: 3000,
          stopOnLastSlide: true
        }}
        
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2"
      >
        {
          images.length === 0 ?
          (
            
              <SwiperSlide >
                <ProductImage
                  width={500}
                  height={500}
                  alt={title}                               
                  className="rounded-lg object-fill"
                  /* priority={true} */
                />
              </SwiperSlide>
            
          ) :

          (images.map((image) => (
            <SwiperSlide key={image}>
              <ProductImage
                width={500}
                height={500}
                alt={title}
                src={image}             
                className="rounded-lg object-fill"
                /* priority={true} */
              />
            </SwiperSlide>
          )))

        }
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {
          images.length === 0 ?
          (
            
              <SwiperSlide >
                <ProductImage
                  width={500}
                  height={500}
                  alt={title}                               
                  className="rounded-lg object-fill"                  
                />
              </SwiperSlide>
            
          ) :

          (images.map((image) => (
            <SwiperSlide key={image}>
              <ProductImage
                width={500}
                height={500}
                alt={title}
                src={image}                      
                className="rounded-lg object-fill"
                
              />
            </SwiperSlide>
          )))

        }
      </Swiper>
    </div>
  )
}
