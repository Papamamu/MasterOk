import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function RequestPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ created?: string }> }) {
  const { token } = await params;
  const q = await searchParams;
  const req = await db.request.findUnique({ where: { token }, include: { messages: { orderBy: { createdAt: "asc" } } } });
  if (!req) notFound();
  async function reply(f: FormData) {
    "use server";
    const body = String(f.get("body") || "").trim();
    if (body.length < 2) return;
    const current = await db.request.findUnique({ where: { token } });
    if (!current) return;
    await db.message.create({ data: { requestId: current.id, author: "CLIENT", body: body.slice(0, 2000) } });
    revalidatePath(`/request/${token}`);
  }
  return <section className="wrap min-h-[680px] py-20"><div className="mx-auto max-w-3xl">
    {q.created && <div className="mb-6 rounded-2xl bg-acid p-5 font-bold text-ink">Заявка успешно отправлена. Сохраните приватную ссылку этой страницы.</div>}
    <div className="eyebrow">Заявка {req.number}</div><h1 className="display mt-4 text-5xl">ДИАЛОГ С МАСТЕРОМ.</h1>
    <div className="mt-6 flex flex-wrap gap-3 text-sm"><span className="rounded-full bg-white/10 px-4 py-2">Статус: {req.status}</span><span className="rounded-full bg-white/10 px-4 py-2">Создана: {req.createdAt.toLocaleDateString("ru")}</span></div>
    <div className="mt-8 space-y-3">{req.messages.map(m => <div key={m.id} className={`max-w-[85%] rounded-2xl p-4 ${m.author === "CLIENT" ? "ml-auto bg-acid text-ink" : "bg-white/10"}`}><p className="text-xs font-black uppercase opacity-50">{m.author === "CLIENT" ? "Вы" : "Meister OK"}</p><p className="mt-2 whitespace-pre-wrap">{m.body}</p></div>)}</div>
    <form action={reply} className="mt-6 flex gap-3"><textarea name="body" required minLength={2} className="field !bg-white/10 !text-white" placeholder="Дополнить заявку или ответить мастеру"/><button className="btn btn-yellow">Отправить</button></form>
  </div></section>;
}
