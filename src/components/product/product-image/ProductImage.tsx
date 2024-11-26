'use client';

import Image from 'next/image';
import React from 'react';

interface Props {
  src?: string,
  alt: string,
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className'],
  style?: React.StyleHTMLAttributes<HTMLImageElement>['style'],
  width: number,
  height: number,
  customOnMouseEnter?: () => void,
  customOnMouseLeave?: () => void,  


}

export const ProductImage = ({src, alt, className, width, height, style, customOnMouseEnter, customOnMouseLeave} : Props) => {

  const handleOnMouseEnter = () => {
    if(customOnMouseEnter){
      customOnMouseEnter()
    }
  }

  const hanldeOnMouseLeave = () => {
    if(customOnMouseLeave){
      customOnMouseLeave()
    }
  }
  

  const localSrc = ( src ) 
    ? src.startsWith('http') // https://urlcompletodelaimagen.jpg
      ? src
      : `/products/${ src }`
    : '/imgs/placeholder.jpg';

  return (
    <Image
      src={localSrc }
      width={width}
      height={height}
      alt={alt}
      className={className}
      style={style}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={hanldeOnMouseLeave}       
    />
  )
}
