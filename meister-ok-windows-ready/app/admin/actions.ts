"use server";

import { db } from "@/lib/db";
import { getSession, clearSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

async function guard() { if (!await getSession()) redirect("/admin/login"); }
export async function logout() { await clearSession(); redirect("/admin/login"); }
export async function saveSettings(f: FormData) { await guard(); await db.siteSettings.update({ where:{id:1}, data:{phone:String(f.get("phone")),whatsapp:String(f.get("whatsapp")),email:String(f.get("email")),address:String(f.get("address")),hours:String(f.get("hours")),heroText:String(f.get("heroText")),comingSoon:f.get("comingSoon")==="on"} }); revalidatePath("/"); }

const allowedTypes = new Map([["image/jpeg","jpg"],["image/png","png"],["image/webp","webp"]]);
function matchesImageSignature(type: string, bytes: Uint8Array) {
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (type === "image/webp") return new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
  return false;
}
async function savePhotos(form: FormData) {
  const files = form.getAll("photos").filter((value): value is File => value instanceof File && value.size > 0).slice(0, 8);
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const saved: string[] = [];
  for (const file of files) {
    const extension = allowedTypes.get(file.type);
    if (!extension || file.size > 8 * 1024 * 1024) continue;
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!matchesImageSignature(file.type, bytes)) continue;
    const filename = `${randomUUID()}.${extension}`;
    await writeFile(path.join(uploadDir, filename), bytes, { flag: "wx" });
    saved.push(`/uploads/${filename}`);
  }
  return saved;
}

export async function addProduct(f: FormData) {
  await guard();
  const name = String(f.get("name"));
  const slug = `${name.toLowerCase().replace(/[^a-zа-я0-9]+/gi,"-").replace(/^-|-$/g,"") || "bike"}-${Date.now().toString(36)}`;
  const images = await savePhotos(f);
  await db.product.create({ data:{name,slug,category:String(f.get("category")),price:Math.round(Number(f.get("price"))*100),shortDescription:String(f.get("shortDescription")),fullDescription:String(f.get("fullDescription")),condition:String(f.get("condition")),brand:String(f.get("brand")),model:String(f.get("model")),status:String(f.get("status")),published:f.get("published")==="on",featured:f.get("featured")==="on",images:JSON.stringify(images)} });
  revalidatePath("/admin"); revalidatePath("/bikes");
}
export async function editProduct(f: FormData) {
  await guard();
  const id = Number(f.get("id"));
  const current = await db.product.findUniqueOrThrow({ where: { id } });
  let existingImages: string[] = [];
  try { existingImages = JSON.parse(current.images || "[]"); } catch { existingImages = []; }
  const addedImages = await savePhotos(f);
  await db.product.update({ where: { id }, data: {
    name: String(f.get("name")), category: String(f.get("category")), price: Math.round(Number(f.get("price")) * 100),
    shortDescription: String(f.get("shortDescription")), fullDescription: String(f.get("fullDescription")),
    condition: String(f.get("condition")), brand: String(f.get("brand")), model: String(f.get("model")),
    status: String(f.get("status")), published: f.get("published") === "on", featured: f.get("featured") === "on",
    images: JSON.stringify([...existingImages, ...addedImages].slice(0, 8))
  } });
  revalidatePath("/admin"); revalidatePath("/bikes"); revalidatePath(`/bikes/${current.slug}`);
}
export async function updateRequest(f: FormData) { await guard(); const id=Number(f.get("id")); const reply=String(f.get("reply")||"").trim(); await db.request.update({where:{id},data:{status:String(f.get("status")),internalNote:String(f.get("note")||""),estimatedPrice:String(f.get("price")||""),proposedVisit:String(f.get("visit")||"")}}); if(reply) await db.message.create({data:{requestId:id,author:"ADMIN",body:reply.slice(0,2000)}}); revalidatePath("/admin"); }
export async function deleteProduct(f: FormData) { await guard(); const product=await db.product.delete({where:{id:Number(f.get("id"))}}); const images=JSON.parse(product.images||"[]") as string[]; await Promise.all(images.filter(image=>image.startsWith("/uploads/")).map(image=>unlink(path.join(process.cwd(),"public",image)).catch(()=>undefined))); revalidatePath("/admin"); revalidatePath("/bikes"); }
