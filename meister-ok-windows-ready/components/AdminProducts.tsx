import type { Product } from "@prisma/client";

const categories = ["Городские", "Горные", "Шоссейные", "BMX", "Детские", "Запчасти и аксессуары"];

export function AdminProducts({ products, editAction, deleteAction }: { products: Product[]; editAction: (form: FormData) => Promise<void>; deleteAction: (form: FormData) => Promise<void> }) {
  if (!products.length) return null;
  return <div className="mt-4 space-y-3">{products.map(product => {
    let images: string[] = [];
    try { images = JSON.parse(product.images || "[]"); } catch { images = []; }
    return <details key={product.id} className="rounded-2xl bg-white/5 p-4">
      <summary className="flex cursor-pointer items-center justify-between gap-4">
        <span><b>{product.name}</b><span className="ml-2 text-xs text-white/40">{product.published ? "Опубликован" : "Черновик"} · € {(product.price / 100).toFixed(2)}</span></span>
        <span className="text-xs text-acid">Редактировать</span>
      </summary>
      <form action={editAction} encType="multipart/form-data" className="mt-5 grid gap-3 rounded-xl bg-white p-4 text-ink sm:grid-cols-2">
        <input type="hidden" name="id" value={product.id}/>
        <label><span className="label">Название</span><input className="field" name="name" required defaultValue={product.name}/></label>
        <label><span className="label">Категория</span><select className="field" name="category" defaultValue={product.category}>{categories.map(category => <option key={category}>{category}</option>)}</select></label>
        <label><span className="label">Цена, €</span><input className="field" name="price" type="number" min="0" step="0.01" required defaultValue={product.price / 100}/></label>
        <label><span className="label">Состояние</span><select className="field" name="condition" defaultValue={product.condition}><option value="NEW">Новый</option><option value="USED">Б/у</option></select></label>
        <label><span className="label">Марка</span><input className="field" name="brand" required defaultValue={product.brand}/></label>
        <label><span className="label">Модель</span><input className="field" name="model" required defaultValue={product.model}/></label>
        <label className="sm:col-span-2"><span className="label">Короткое описание</span><input className="field" name="shortDescription" required defaultValue={product.shortDescription}/></label>
        <label className="sm:col-span-2"><span className="label">Полное описание</span><textarea className="field" name="fullDescription" required rows={4} defaultValue={product.fullDescription}/></label>
        {images.length > 0 && <div className="sm:col-span-2"><span className="label">Текущие фотографии</span><div className="grid grid-cols-4 gap-2">{images.map(image => <img key={image} src={image} alt="" className="aspect-square w-full rounded-lg object-cover"/>)}</div></div>}
        <label className="sm:col-span-2"><span className="label">Добавить фотографии</span><input className="field" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple/></label>
        <input type="hidden" name="status" value={product.status}/>
        <label className="flex gap-2 text-sm"><input name="published" type="checkbox" defaultChecked={product.published}/> Опубликован</label>
        <label className="flex gap-2 text-sm"><input name="featured" type="checkbox" defaultChecked={product.featured}/> Рекомендуемый</label>
        <button className="btn btn-yellow sm:col-span-2">Сохранить изменения</button>
      </form>
      <form action={deleteAction} className="mt-3"><input type="hidden" name="id" value={product.id}/><button className="text-sm text-red-300">Удалить велосипед</button></form>
    </details>;
  })}</div>;
}
