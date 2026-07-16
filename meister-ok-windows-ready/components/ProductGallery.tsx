"use client";

import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  if (!images.length) return <div className="grid min-h-[430px] place-items-center rounded-[32px] bg-paper text-9xl text-ink">◯—◯</div>;
  return <div>
    <div className="overflow-hidden rounded-[32px] bg-paper"><img src={images[active]} alt={`${name}, фотография ${active + 1}`} className="aspect-[4/3] w-full object-contain"/></div>
    {images.length > 1 && <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">{images.map((src,index)=><button type="button" key={src} onClick={()=>setActive(index)} aria-label={`Показать фотографию ${index+1}`} className={`overflow-hidden rounded-xl border-2 ${active===index?"border-acid":"border-transparent"}`}><img src={src} alt="" className="aspect-square w-full object-cover"/></button>)}</div>}
  </div>;
}
