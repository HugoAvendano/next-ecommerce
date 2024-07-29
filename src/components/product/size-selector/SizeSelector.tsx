import { Size } from "@/interfaces"
import clsx from "clsx"

interface Props {  
  selectedSize?: Size,
  availabeSizes?: Size[]  
}

export const SizeSelector = ({ selectedSize = undefined,availabeSizes =[] }: Props) => {
  return (
    <div className="my-5">
      <h3 className="font-bold mb-4">
        Sizes available
      </h3>
      <div className="flex">
        {
          availabeSizes.map(size => (
            <button
              key={size}
              className={
                clsx(
                  "mx-2 hover:underline text-lg",
                  {"underline": size ===selectedSize }
                )
              }
            >
              {size}
            </button>
          ))
        }
      </div>

    </div>
  )
}
