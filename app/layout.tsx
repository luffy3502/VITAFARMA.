import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vitafarmaantas.com.br"),
  title: {
    default: "VitaFarma Antas | Farmácia, ofertas e atendimento pelo WhatsApp",
    template: "%s | VitaFarma Antas",
  },
  description:
    "VitaFarma Antas: medicamentos, perfumaria, vitaminas, dermocosméticos e atendimento humanizado em Antas, Bahia. Peça pelo WhatsApp.",
  keywords: [
    "VitaFarma Antas",
    "farmácia em Antas",
    "drogaria em Antas Bahia",
    "medicamentos",
    "perfumaria",
    "vitaminas",
    "WhatsApp farmácia",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "VitaFarma Antas | Mais saúde e praticidade todos os dias",
    description:
      "Medicamentos, perfumaria, vitaminas e atendimento humanizado com pedidos pelo WhatsApp.",
    url: "/",
    siteName: "VitaFarma Antas",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/logo-vitafarma.png",
        width: 1200,
        height: 630,
        alt: "VitaFarma Antas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VitaFarma Antas",
    description: "Farmácia em Antas, Bahia, com atendimento humanizado via WhatsApp.",
    images: ["/logo-vitafarma.png"],
  },
  icons: {
    icon: "/logo-vitafarma.png",
    apple: "/logo-vitafarma.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06172f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
