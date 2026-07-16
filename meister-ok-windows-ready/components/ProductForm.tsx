"use client";

import { useState } from "react";
import { ImagePlus, X } from "lucide-react";

type Preview = { file: File; url: string; id: string };

export function ProductForm({ action }: { action: (data: FormData) => Promise<void> }) {
  const [photos, setPhotos] = useState<Preview[]>([]);

  function chooseFiles(files: FileList | null) {
    if (!files) return;
    const incoming = Array.from(files)
      .filter(file => ["image/jpeg", "image/png", "image/webp"].includes(file.type))
      .slice(0, Math.max(0, 8 - photos.length))
      .map(file => ({ file, url: URL.createObjectURL(file), id: crypto.randomUUID() }));
    setPhotos(current => [...current, ...incoming]);
  }

  function removePhoto(id: string) {
    setPhotos(current => {
      const removed = current.find(photo => photo.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return current.filter(photo => photo.id !== id);
    });
  }

  return <form action={action} className="card mt-4 grid gap-4 p-6 sm:grid-cols-2">
    <label><span className="label">Название *</span><input name="name" required className="field"/></label>
    <label><span className="label">Категория</span><select name="category" className="field">{["Городские","Горные","Шоссейные","BMX","Детские","Запчасти и аксессуары"].map(x=><option key={x}>{x}</option>)}</select></label>
    <label><span className="label">Цена, €</span><input name="price" type="number" min="0" step="0.01" required className="field"/></label>
    <label><span className="label">Состояние</span><select name="condition" className="field"><option value="NEW">Новый</option><option value="USED">Б/у</option></select></label>
    <label><span className="label">Марка</span><input name="brand" required className="field"/></label>
    <label><span className="label">Модель</span><input name="model" required className="field"/></label>
    <label className="sm:col-span-2"><span className="label">Короткое описание</span><input name="shortDescription" required className="field"/></label>
    <label className="sm:col-span-2"><span className="label">Полное описание</span><textarea name="fullDescription" required rows={4} className="field"/></label>
    <div className="sm:col-span-2">
      <span className="label">Фотографии (до 8)</span>
      <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-black/20 p-6 font-bold transition hover:border-yellow-500 hover:bg-yellow-50">
        <ImagePlus size={22}/> Выбрать несколько изображений
        <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={event => chooseFiles(event.target.files)}/>
      </label>
      <p className="mt-2 text-xs text-black/45">JPG, PNG или WebP, не более 8 МБ каждое. Первое фото станет главным.</p>
      {photos.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{photos.map((photo, index) => <div key={photo.id} className="relative overflow-hidden rounded-xl bg-black/5">
        <img src={photo.url} alt={`Предпросмотр ${index + 1}`} className="aspect-square w-full object-cover"/>
        <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-bold text-white">{index === 0 ? "Главное" : index + 1}</span>
        <button type="button" onClick={() => removePhoto(photo.id)} aria-label={`Удалить фото ${index + 1}`} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/75 text-white hover:bg-red-600"><X size={16}/></button>
      </div>)}</div>}
      {photos.map(photo => <input key={photo.id} type="file" name="photos" className="hidden" ref={input => { if (input) { const transfer = new DataTransfer(); transfer.items.add(photo.file); input.files = transfer.files; } }}/>) }
    </div>
    <input type="hidden" name="status" value="AVAILABLE"/>
    <label className="flex gap-2 text-sm"><input name="published" type="checkbox"/> Опубликовать</label>
    <label className="flex gap-2 text-sm"><input name="featured" type="checkbox"/> Рекомендуемый</label>
    <button className="btn btn-yellow sm:col-span-2">Сохранить велосипед</button>
  </form>;
}
