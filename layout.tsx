import "./globals.css";import type {Metadata} from "next";import {Header} from "@/components/Header";import {Footer} from "@/components/Footer";
export const metadata:Metadata={title:"Meister OK — велосипеды и мастерская",description:"Велосипеды, ремонт и обслуживание без лишнего шума."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body><Header/><main>{children}</main><Footer/></body></html>}
