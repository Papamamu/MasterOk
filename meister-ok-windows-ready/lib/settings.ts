import {db} from "./db";
export async function settings(){return db.siteSettings.upsert({where:{id:1},update:{},create:{id:1}})}
