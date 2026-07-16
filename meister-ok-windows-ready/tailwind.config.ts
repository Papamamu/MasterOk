import type { Config } from "tailwindcss";
export default { content:["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}"],theme:{extend:{colors:{ink:"#0d0f0e",acid:"#ffd21c",paper:"#f2f0e9"},fontFamily:{sans:["Arial","sans-serif"]}}},plugins:[] } satisfies Config;
