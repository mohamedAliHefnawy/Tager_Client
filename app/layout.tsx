"use client";

import "./globals.css";
import { Cairo } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-awesome-slider/dist/styles.css";



const cairo = Cairo({ subsets: ["arabic"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" className={cairo.className}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css"
        />
      </head>
      <body>
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="light">
            <PrimeReactProvider value={{ unstyled: true }}>
              {children}
            </PrimeReactProvider>
          </NextThemesProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
