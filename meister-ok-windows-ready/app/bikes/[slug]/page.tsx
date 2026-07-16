import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { settings } from "@/lib/settings";
import Link from "next/link";
import { ProductGallery } from "@/components/ProductGallery";

export default async function Product({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, site] = await Promise.all([db.product.findUnique({ where: { slug } }), settings()]);
  if (!product || !product.published) notFound();
  let images: string[] = [];
  try { images = JSON.parse(product.images || "[]"); } catch { images = []; }
  const specs = [
    ["Состояние", product.condition === "NEW" ? "Новый" : "Б/у"],
    ["Производитель", product.brand], ["Модель", product.model], ["Год", product.year],
    ["Размер рамы", product.frameSize], ["Размер колёс", product.wheelSize], ["Цвет", product.color]
  ];
  return <section className="wrap py-20">
    <Link href="/bikes" className="text-sm text-white/50">← Назад в каталог</Link>
    <div className="mt-8 grid gap-10 lg:grid-cols-2">
      <ProductGallery images={images} name={product.name}/>
      <div><div className="eyebrow">{product.category} · {product.status}</div><h1 className="display mt-4 text-6xl">{product.name}</h1><p className="mt-6 text-lg text-white/60">{product.shortDescription}</p><div className="mt-7 text-4xl font-black">€ {(product.price/100).toFixed(2)}</div><div className="mt-8 flex flex-wrap gap-3"><a href={`tel:${site.phone}`} className="btn btn-yellow">Позвонить</a><a href={`https://wa.me/${site.whatsapp}`} className="btn btn-outline">Написать в WhatsApp</a><Link href="/contacts" className="btn btn-outline">Задать вопрос</Link></div></div>
    </div>
    <div className="mt-16 grid gap-10 lg:grid-cols-2"><div><h2 className="text-3xl font-black">Описание</h2><p className="mt-4 whitespace-pre-line leading-7 text-white/60">{product.fullDescription}</p></div><div className="card p-7"><h2 className="text-2xl font-black">Характеристики</h2><dl className="mt-5">{specs.filter(item=>item[1]).map(item=><div className="flex justify-between border-t border-black/10 py-3" key={String(item[0])}><dt className="text-black/50">{item[0]}</dt><dd className="font-bold">{item[1]}</dd></div>)}</dl></div></div>
  </section>;
}
