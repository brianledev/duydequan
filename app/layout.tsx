import type { Metadata } from "next";
import { Playfair_Display, Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-cinzel",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Duy Dê 2 | Nhà Hàng Cao Cấp",
  description:
    "Duy Dê 2 - Thưởng thức ẩm thực dê tươi ngon, nước lẩu đậm đà với không gian sang trọng. Phục vụ tận tâm từ 10:00 - 22:00 hàng ngày.",
  keywords: ["lẩu dê", "nhà hàng dê", "duy dê 2", "ẩm thực dê", "nhà hàng cao cấp"],
  openGraph: {
    title: "Duy Dê 2 | Nhà Hàng Cao Cấp",
    description:
      "Thưởng thức ẩm thực dê tươi ngon, nước lẩu đậm đà với không gian sang trọng 5 sao.",
    type: "website",
    locale: "vi_VN",
    siteName: "Duy Dê 2",
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: "Duy Dê 2",
      description: "Nhà hàng lẩu dê cao cấp với không gian sang trọng",
      servesCuisine: "Vietnamese",
      priceRange: "$$",
      openingHours: "Mo-Su 10:00-22:00",
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${playfair.variable} ${cinzel.variable} ${cormorant.variable}`}>
      <body className="luxury-bg antialiased">{children}</body>
    </html>
  );
}
