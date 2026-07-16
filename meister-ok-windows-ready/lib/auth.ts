import { cookies } from "next/headers"; import { SignJWT,jwtVerify } from "jose";
const secret=process.env.AUTH_SECRET;
if(process.env.NODE_ENV==="production"&&(!secret||secret.length<32)) throw new Error("AUTH_SECRET must contain at least 32 characters in production");
const key=new TextEncoder().encode(secret||"development-only-secret-not-for-production");
export async function createSession(id:number){const token=await new SignJWT({id}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("8h").sign(key); (await cookies()).set("meister_session",token,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:28800});}
export async function getSession(){try{return (await jwtVerify((await cookies()).get("meister_session")?.value||"",key)).payload as {id:number}}catch{return null}}
export async function clearSession(){(await cookies()).delete("meister_session")}
