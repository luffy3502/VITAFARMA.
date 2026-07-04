"use client";

import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Activity,
  Baby,
  BadgeCheck,
  Bot,
  CalendarDays,
  ChevronRight,
  ChevronUp,
  Clock,
  Droplet,
  Edit3,
  Eye,
  EyeOff,
  Filter,
  Grid2X2,
  Gift,
  HeartHandshake,
  Instagram,
  LayoutDashboard,
  List,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  PackageCheck,
  Phone,
  Pill,
  Plus,
  Quote,
  Search,
  Send,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Stethoscope,
  Sun,
  Syringe,
  Tag,
  Ticket,
  Trophy,
  Truck,
  Trash2,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { campanhaAnual } from "@/data/campanha-anual";
import { catalogProducts, demoCategories, formatCurrency, productCategoriesList, type Category, type Product } from "@/data/catalogo";
import { ofertasSemana } from "@/data/ofertas";
import { site, whatsappLink } from "@/data/site";
import { deleteProduct, fetchCategories, fetchProducts, saveProduct as persistProduct, toggleProductActive } from "@/lib/catalog-service";
import { isSupabaseConfigured } from "@/lib/supabase";

const nav = [
  ["Início", "#inicio"],
  ["Sobre", "#sobre"],
  ["Produtos", "#produtos"],
  ["Ofertas", "#ofertas"],
  ["Serviços", "#servicos"],
  ["Diferenciais", "#diferenciais"],
  ["Admin", "/admin"],
  ["Contato", "#contato"],
] as const;

const heroHighlights = [
  ["Produtos Originais", ShieldCheck],
  ["Entrega Rápida", Truck],
  ["Atendimento Humanizado", HeartHandshake],
  ["Farmacêuticos Qualificados", BadgeCheck],
] as const;

const premiumCare = [
  ["Atendimento Humanizado", "Aqui você é nossa prioridade", HeartHandshake],
  ["Entrega Rápida", "Agilidade e segurança na entrega", Truck],
  ["Farmacêutico Qualificado", "Orientação e cuidado especializado", Stethoscope],
  ["Produtos de Qualidade", "As melhores marcas para você", BadgeCheck],
] as const;

const heroBenefits = [
  ["Medicamentos éticos e genéricos", Pill],
  ["Perfumaria das melhores marcas", Sparkles],
  ["Vitaminas e suplementos", PackageCheck],
  ["Cuidados diários para toda família", ShieldCheck],
] as const;

const productCategories = [
  {
    title: "Medicamentos",
    description: "Produtos para tratamentos, cuidados prescritos e suporte diário.",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=82",
    icon: Pill,
  },
  {
    title: "Vitaminas",
    description: "Opções para imunidade, energia, disposição e bem-estar.",
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&w=900&q=82",
    icon: Sun,
  },
  {
    title: "Perfumaria",
    description: "Autocuidado, fragrâncias e beleza para sua rotina.",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=82",
    icon: Sparkles,
  },
  {
    title: "Dermocosméticos",
    description: "Cuidados para pele com seleção moderna e confiável.",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=82",
    icon: ShieldCheck,
  },
  {
    title: "Infantil",
    description: "Produtos escolhidos para bebês, crianças e famílias.",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=82",
    icon: Baby,
  },
  {
    title: "Higiene",
    description: "Essenciais para proteção, limpeza e cuidado pessoal.",
    image: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=900&q=82",
    icon: PackageCheck,
  },
];

const benefits = [
  ["Atendimento Humanizado", HeartHandshake],
  ["Entrega Rápida", Truck],
  ["Farmacêutico Qualificado", Stethoscope],
  ["Produtos de Qualidade", BadgeCheck],
  ["Atendimento via WhatsApp", MessageCircle],
] as const;

const differentials = [
  ["Atendimento especializado", "Orientação próxima para você comprar com mais segurança.", Stethoscope],
  ["Entrega rápida", "Agilidade para simplificar o cuidado no dia a dia.", Truck],
  ["Grande variedade", "Medicamentos, perfumaria, vitaminas, higiene e muito mais.", PackageCheck],
  ["Compra fácil", "Faça seu pedido pelo WhatsApp em poucos minutos.", MessageCircle],
  ["Produtos originais", "Seleção confiável para preservar sua saúde.", ShieldCheck],
  ["Preço justo", "Ofertas da semana e opções para diferentes necessidades.", BadgeCheck],
] as const;

const testimonials = [
  {
    name: "Cliente VitaFarma",
    text: "Atendimento rápido e muito atencioso. Sempre me ajudam quando preciso.",
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Moradora de Antas",
    text: "Farmácia organizada, equipe educada e entrega que facilita bastante.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Cliente local",
    text: "Gosto da praticidade de pedir pelo WhatsApp e confirmar tudo com a equipe.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  },
];

const brandLogos = ["Eurofarma", "EMS", "NIVEA", "P&G", "Johnson&Johnson", "CIMED", "La Roche-Posay", "VICHY"];

const pharmacyServices = [
  ["Aferição de Pressão", Activity],
  ["Aplicação de Injetáveis", Syringe],
  ["Teste de Glicemia", Droplet],
  ["Orientação Farmacêutica", Stethoscope],
  ["Perfuração de Lóbulo", BadgeCheck],
] as const;

const convenioItems = ["Farmácia Popular", "hapvida", "Bradesco Saúde", "SulAmérica"];

const healthTips = [
  {
    title: "Como manter a imunidade alta no dia a dia",
    image: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=360&q=82",
  },
  {
    title: "A importância da hidratação para o corpo",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=360&q=82",
  },
  {
    title: "Vitaminas: quando e por que suplementar?",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=360&q=82",
  },
];

const visualOffers = [
  ...ofertasSemana.map((item, index) => ({ ...item, desconto: ["-20%", "-15%", "-18%"][index] ?? "-12%" })),
  {
    id: 99,
    nome: "Shampoo Pantene 400ml",
    categoria: "Perfumaria",
    descricao: "Cuidado diário para cabelos com brilho, maciez e proteção.",
    imagem: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=700&q=82",
    precoAntigo: "R$ 28,90",
    precoAtual: "R$ 22,54",
    selo: "Oferta" as const,
    mensagemWhatsApp: "Olá, VitaFarma! Tenho interesse no Shampoo Pantene 400ml.",
    desconto: "-22%",
  },
];

const campaignSteps = [
  ["Compre R$ 40,00", ShoppingCart],
  ["Receba seu cupom", Ticket],
  ["Aguarde o sorteio", CalendarDays],
  ["Concorra aos prêmios", Trophy],
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function getTimeLeft(targetDate: string) {
  const distance = Math.max(new Date(targetDate).getTime() - Date.now(), 0);
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return { days, hours, minutes, seconds };
}

type CampaignConfig = typeof campanhaAnual;

const catalogStorageKey = "vitafarma.catalog.products";
const campaignStorageKey = "vitafarma.campaign.config";

const emptyProduct: Product = {
  id: "tmp-new",
  name: "",
  description: "",
  brand: "",
  categoryId: demoCategories[0].id,
  category: "Medicamentos",
  price: 0,
  promotionalPrice: undefined,
  stock: 0,
  mainImageUrl: "",
  galleryImages: [],
  images: [],
  isActive: true,
  isOffer: false,
  isNew: false,
  isBestSeller: false,
  isWeekOffer: false,
  isHomeFeatured: false,
  views: 0,
  available: true,
};

function readLocalState<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function useLocalState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readLocalState(key, fallback));

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

function productWhatsAppMessage(product: Product) {
  return `Olá! Tenho interesse no produto: ${product.name} - ${formatCurrency(product.promotionalPrice ?? product.price)}. Poderia me passar mais informações?`;
}

function discountPercent(product: Product) {
  if (!product.promotionalPrice || product.promotionalPrice >= product.price) return null;
  return Math.round(((product.price - product.promotionalPrice) / product.price) * 100);
}

function SectionIntro({
  eyebrow,
  title,
  text,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  text: string;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65 }}
      className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-xl"}
    >
      <span className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-signal">{eyebrow}</span>
      <h2 className="mt-3 font-display text-[clamp(2rem,3.2vw,2.85rem)] font-extrabold leading-[1.08] text-midnight">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-600 md:text-[15px]">{text}</p>
    </motion.div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const compact = useTransform(scrollY, [0, 80], [0, 1]);
  const navHeight = useTransform(compact, [0, 1], [92, 76]);
  const logoScale = useTransform(compact, [0, 1], [1, 0.86]);
  const shadow = useTransform(compact, [0, 1], ["0 12px 34px rgba(6,23,47,0.04)", "0 16px 42px rgba(6,23,47,0.1)"]);

  return (
    <header className="fixed inset-x-0 top-0 z-[70]">
      <div className="bg-midnight text-white">
        <div className="container-shell flex min-h-11 items-center justify-center gap-4 text-xs font-semibold sm:justify-between md:text-sm">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} className="text-signal" />
              Antas - Bahia
            </span>
            <span className="hidden h-4 w-px bg-white/18 sm:block" />
            <span className="inline-flex items-center gap-2">
              <Clock size={16} className="text-signal" />
              Seg - Sáb: 07h às 21h
            </span>
            <span className="hidden h-4 w-px bg-white/18 lg:block" />
            <span className="hidden items-center gap-2 lg:inline-flex">
              <Truck size={16} className="text-signal" />
              Entrega rápida para Antas e região
            </span>
          </div>
          <div className="hidden items-center gap-4 lg:flex">
            <span className="h-4 w-px bg-white/18" />
            <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-signal transition hover:text-white">
              <Instagram size={17} />
            </a>
            <a href={whatsappLink("Olá, VitaFarma Antas! Quero atendimento.")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-signal transition hover:text-white">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </div>

      <motion.div style={{ height: navHeight, boxShadow: shadow }} className="overflow-hidden bg-white/96 backdrop-blur-xl">
        <div className="container-shell flex h-full items-center justify-between gap-5">
          <a href="#inicio" className="flex items-center gap-3" aria-label="VitaFarma Antas">
            <motion.div style={{ scale: logoScale }} className="origin-left">
              <Image src="/logo-vitafarma.png" alt="VitaFarma Antas" width={210} height={110} priority className="h-16 w-auto object-contain md:h-20" />
            </motion.div>
          </a>

          <nav className="hidden items-center gap-8 text-[15px] font-bold text-midnight/78 xl:flex">
            {nav.map(([label, href], index) => (
              <a key={label} href={href} className={`relative py-3 transition hover:text-royal ${index === 0 ? "text-royal" : ""}`}>
                {label}
                {index === 0 ? <span className="absolute inset-x-0 -bottom-0.5 mx-auto h-0.5 w-9 rounded-full bg-royal" /> : null}
              </a>
            ))}
          </nav>

          <a
            href={whatsappLink("Olá, VitaFarma Antas! Quero fazer um pedido.")}
            target="_blank"
            rel="noopener noreferrer"
            className="shine hidden min-h-12 items-center gap-2 rounded-full bg-signal px-7 text-sm font-extrabold text-white shadow-[0_14px_32px_rgba(229,47,63,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(229,47,63,0.3)] lg:flex"
          >
            <MessageCircle size={19} />
            Peça pelo WhatsApp
          </a>

          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-full bg-ice text-midnight shadow-lift xl:hidden"
          >
            <Menu size={22} />
          </button>
        </div>
      </motion.div>

      {open ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-midnight/70 p-4 backdrop-blur-md xl:hidden">
          <motion.div initial={{ x: 80 }} animate={{ x: 0 }} className="ml-auto flex h-full max-w-sm flex-col rounded-[8px] bg-white p-6 shadow-glow">
            <div className="flex items-center justify-between">
              <Image src="/logo-vitafarma.png" alt="VitaFarma Antas" width={150} height={78} className="h-auto w-36" />
              <button type="button" aria-label="Fechar menu" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-ice">
                <X size={21} />
              </button>
            </div>
            <div className="mt-10 grid gap-3 text-lg font-semibold">
              {nav.map(([label, href]) => (
                <a key={label} href={href} onClick={() => setOpen(false)} className="rounded-[8px] px-3 py-3 hover:bg-ice">
                  {label}
                </a>
              ))}
            </div>
            <a
              href={whatsappLink("Olá, VitaFarma Antas! Quero fazer um pedido.")}
              target="_blank"
              rel="noopener noreferrer"
              className="shine mt-auto flex items-center justify-center gap-2 rounded-full bg-signal px-5 py-4 font-bold text-white"
            >
              <MessageCircle size={20} />
              Peça pelo WhatsApp
            </a>
          </motion.div>
        </motion.div>
      ) : null}
    </header>
  );
}

function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setShow(false), 950);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!show) return null;

  return (
    <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[80] grid place-items-center bg-white">
      <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.55 }} className="text-center">
        <Image src="/logo-vitafarma.png" alt="VitaFarma Antas" width={190} height={100} priority className="mx-auto h-auto w-44" />
        <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-ice">
          <motion.div className="h-full bg-royal" initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 0.95, ease: "easeInOut" }} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function Counter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const total = 60;
    const timer = window.setInterval(() => {
      frame += 1;
      setCount(Math.round((value * frame) / total));
      if (frame >= total) window.clearInterval(timer);
    }, 18);
    return () => window.clearInterval(timer);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <strong className="font-display text-4xl font-extrabold text-white md:text-5xl">
        +{count.toLocaleString("pt-BR")}
        {suffix}
      </strong>
      <span className="mt-2 block text-sm font-semibold uppercase tracking-[0.18em] text-white/68">{label}</span>
    </div>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 650], [0, 76]);

  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-ice pt-[136px] text-midnight lg:pt-[136px]">
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=2400&q=88"
          alt="Farmácia moderna VitaFarma"
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover blur-[1.5px]"
        />
      </motion.div>
      <div className="absolute inset-0 z-[1] bg-white/48" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.18),transparent_32%),linear-gradient(90deg,rgba(255,255,255,0.86)_0%,rgba(255,255,255,0.58)_48%,rgba(255,255,255,0.82)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 z-[3] h-40 bg-gradient-to-t from-ice via-white/60 to-transparent" />

      <div className="container-shell relative z-10 grid min-h-[610px] items-center gap-7 py-7 lg:grid-cols-[1fr_0.86fr] xl:grid-cols-[0.96fr_0.56fr_0.8fr] xl:gap-6">
        <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }} className="min-w-0 max-w-[600px] xl:pb-5">
          <motion.span variants={fadeUp} className="inline-flex items-center gap-2 rounded-full bg-royal px-4 py-2 text-sm font-extrabold text-white shadow-[0_12px_26px_rgba(21,88,214,0.22)]">
            <MapPin size={17} />
            VitaFarma Antas
          </motion.span>

          <motion.h1 variants={fadeUp} className="mt-4 max-w-full font-display text-[clamp(2rem,8.5vw,3.95rem)] font-extrabold leading-[1] text-midnight [overflow-wrap:anywhere]">
            <span className="block">Mais <span className="text-royal">Saúde</span>,</span>
            <span className="block">cuidado e</span>
            <span className="block"><span className="text-signal">Praticidade</span></span>
            <span className="block">para</span>
            <span className="block">você todos os</span>
            <span className="block">dias.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-5 max-w-[34ch] text-base font-medium leading-7 text-slate-600 md:max-w-2xl md:text-lg">
            Medicamentos, perfumaria, vitaminas e atendimento humanizado em Antas com a agilidade que sua rotina precisa.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            {heroHighlights.map(([label, Icon]) => (
              <motion.div key={label} whileHover={{ y: -4 }} className="flex min-h-[64px] items-center gap-3 rounded-[8px] border border-white/90 bg-white/84 p-3 shadow-[0_12px_28px_rgba(6,23,47,0.075)] backdrop-blur-xl">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-white text-royal shadow-sm ring-1 ring-royal/10">
                  <Icon size={20} />
                </span>
                <span className="text-xs font-extrabold leading-tight text-midnight sm:text-[13px]">{label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 flex flex-col gap-4 sm:flex-row">
            <a href={whatsappLink("Olá, VitaFarma Antas! Quero fazer um pedido.")} target="_blank" rel="noopener noreferrer" className="shine inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-signal px-6 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(229,47,63,0.24)] transition hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(229,47,63,0.3)] sm:w-auto sm:px-8 sm:text-base">
              <MessageCircle size={23} />
              Peça pelo WhatsApp
              <ChevronRight size={20} />
            </a>
            <a href="#ofertas" className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full border border-white bg-white/88 px-6 text-sm font-extrabold text-midnight shadow-[0_14px_30px_rgba(6,23,47,0.08)] backdrop-blur-xl transition hover:-translate-y-1 hover:text-royal hover:shadow-[0_18px_36px_rgba(6,23,47,0.11)] sm:w-auto sm:px-8 sm:text-base">
              <Search size={22} className="text-royal" />
              Ver Ofertas
              <ChevronRight size={20} />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.96 }}
          animate={{ opacity: 1, y: [0, -12, 0], scale: 1 }}
          transition={{ opacity: { duration: 0.7, delay: 0.18 }, scale: { duration: 0.7, delay: 0.18 }, y: { duration: 5.4, repeat: Infinity, ease: "easeInOut" } }}
          className="relative mx-auto hidden min-h-[560px] w-full max-w-[410px] self-end xl:block"
        >
          <div className="absolute inset-x-8 bottom-4 h-24 rounded-full bg-royal/14 blur-2xl" />
          <div className="absolute inset-x-4 bottom-0 h-[72%] rounded-t-full bg-white/38 blur-sm" />
          <Image
            src="/ariea.png"
            alt="Farmacêutica da VitaFarma"
            fill
            priority
            sizes="30vw"
            className="object-cover object-bottom drop-shadow-[0_24px_34px_rgba(6,23,47,0.16)]"
          />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-ice via-ice/45 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/35 to-transparent" />
        </motion.div>

        <motion.aside initial={{ opacity: 0, x: 44, scale: 0.96 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.75, delay: 0.28 }} className="min-w-0 max-w-full overflow-hidden rounded-[8px] border border-white/80 bg-white/76 text-midnight shadow-[0_24px_58px_rgba(6,23,47,0.16)] backdrop-blur-2xl lg:col-span-2 xl:col-span-1">
          <div className="relative overflow-hidden bg-midnight px-7 pb-11 pt-7 text-white">
            <div className="absolute inset-x-0 bottom-[-32px] h-20 rounded-[50%] bg-white/90" />
            <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
              <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-royal text-white shadow-[0_18px_40px_rgba(21,88,214,0.34)]">
                <MessageCircle size={40} />
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-xl font-extrabold leading-tight sm:text-2xl">Atendimento Premium</h2>
                <p className="mt-2 text-base leading-7 text-white/84 sm:text-lg">Rápido, fácil e humanizado pelo WhatsApp</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 px-5 pb-5 pt-7">
            {premiumCare.map(([title, text, Icon]) => (
              <motion.div key={title} whileHover={{ x: 4 }} className="flex items-center gap-4 rounded-[8px] bg-white p-4 shadow-[0_10px_24px_rgba(6,23,47,0.06)] ring-1 ring-slate-100">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-royal/10 text-royal">
                  <Icon size={24} />
                </span>
                <div className="min-w-0 flex-1">
                  <strong className="block font-display text-base font-extrabold text-midnight">{title}</strong>
                  <span className="mt-1 block text-sm font-medium text-slate-500">{text}</span>
                </div>
                <ChevronRight size={20} className="text-midnight/46" />
              </motion.div>
            ))}
          </div>

          <div className="mx-5 mb-5 grid grid-cols-3 rounded-[8px] bg-midnight px-3 py-4 text-white shadow-[0_18px_36px_rgba(6,23,47,0.22)]">
            {[
              ["8K+", "Clientes", HeartHandshake],
              ["3.5K+", "Entregas", Truck],
              ["5", "Avaliações", Star],
            ].map(([value, label, Icon], index) => {
              const TypedIcon = Icon as LucideIcon;
              return (
                <div key={String(label)} className={`flex items-center justify-center gap-2 px-2 text-center ${index > 0 ? "border-l border-white/16" : ""}`}>
                  <TypedIcon size={24} className="hidden text-white/58 sm:block" />
                  <div>
                    <strong className="block font-display text-lg font-extrabold leading-none">{String(value)}</strong>
                    <span className="mt-1 block text-[11px] font-bold text-white/82">{String(label)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.aside>
      </div>
    </section>
  );
}

function BenefitsBar() {
  return (
    <section aria-label="Benefícios" className="relative z-20 -mt-6 bg-ice pb-8 md:-mt-8">
      <div className="container-shell rounded-[8px] border border-white bg-white/94 px-5 py-4 shadow-[0_16px_42px_rgba(6,23,47,0.09)] backdrop-blur-xl">
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
          {heroBenefits.map(([label, Icon], index) => (
            <motion.div key={label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: index * 0.06 }} whileHover={{ y: -4 }} className={`flex items-center justify-center gap-3 px-3 py-3 text-center ${index > 0 ? "lg:border-l lg:border-slate-200" : ""}`}>
              <Icon className="shrink-0 text-royal" size={22} />
              <span className="text-sm font-extrabold text-midnight">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ item, index }: { item: (typeof productCategories)[number]; index: number }) {
  const Icon = item.icon;
  return (
    <motion.article variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-70px" }} transition={{ delay: index * 0.07 }} whileHover={{ y: -6 }} className="group overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(6,23,47,0.065)]">
      <div className="relative aspect-[1.18] overflow-hidden bg-ice">
        <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-[8px] bg-white/90 text-royal shadow-sm backdrop-blur-xl">
          <Icon size={23} />
        </div>
      </div>
      <div className="p-5 text-center">
        <h3 className="font-display text-lg font-extrabold text-midnight">{item.title}</h3>
        <p className="mt-2 text-xs leading-5 text-slate-500">{item.description}</p>
      </div>
    </motion.article>
  );
}

function Products() {
  return (
    <section id="servicos" className="bg-white py-16">
      <span id="sobre" className="block scroll-mt-40" />
      <span id="produtos" className="block scroll-mt-40" />
      <div className="container-shell grid items-center gap-12 lg:grid-cols-[0.82fr_1.5fr]">
        <div>
          <SectionIntro eyebrow="Nossos serviços" title="Tudo que você precisa para viver mais e melhor" text="Oferecemos muito mais do que medicamentos. Aqui você encontra serviços e produtos de qualidade para cuidar da sua saúde e bem-estar." />
          <a href={whatsappLink("Olá, VitaFarma! Quero conhecer os serviços disponíveis.")} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-royal px-6 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(21,88,214,0.22)] transition hover:-translate-y-1">
            Conheça nossos serviços
            <ChevronRight size={17} />
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {productCategories.slice(0, 4).map((item, index) => (
            <ProductCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CatalogCard({ product, index, viewMode = "grid" }: { product: Product; index: number; viewMode?: "grid" | "list" }) {
  const discount = discountPercent(product);
  const mainImage = product.mainImageUrl || product.images.find(Boolean) || productCategories[0].image;
  const isList = viewMode === "list";

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-70px" }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_12px_28px_rgba(6,23,47,0.055)] transition ${isList ? "grid gap-0 p-4 sm:grid-cols-[190px_1fr]" : "flex h-full flex-col p-4"}`}
    >
      <button type="button" aria-label="Favoritar produto" className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:text-signal">
        <HeartHandshake size={17} />
      </button>

      <div className={`relative overflow-hidden rounded-[8px] bg-ice ${isList ? "min-h-[180px]" : "aspect-[1.08]"}`}>
        <Image src={mainImage} alt={product.name} fill sizes={isList ? "190px" : "(max-width: 768px) 50vw, 22vw"} className="object-cover p-5 transition duration-700 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex max-w-[70%] flex-wrap gap-1.5">
          {discount ? <span className="rounded-full bg-signal px-2.5 py-1 text-[11px] font-extrabold text-white">-{discount}%</span> : null}
          {product.isOffer ? <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-extrabold text-white">Oferta</span> : null}
          {product.isNew ? <span className="rounded-full bg-royal px-2.5 py-1 text-[11px] font-extrabold text-white">Novidade</span> : null}
          {product.isBestSeller ? <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-royal shadow-sm">Mais vendido</span> : null}
        </div>
      </div>

      <div className={`flex flex-1 flex-col ${isList ? "p-5" : "pt-4"}`}>
        <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-500">
          <span>{product.brand}</span>
          <span className={product.isActive ? "text-emerald-600" : "text-slate-400"}>{product.isActive ? "em estoque" : "indisponível"}</span>
        </div>
        <h3 className="mt-2 min-h-[44px] font-display text-base font-extrabold leading-tight text-midnight">{product.name}</h3>
        <p className={`mt-2 text-sm leading-6 text-slate-600 ${isList ? "" : "line-clamp-2"}`}>{product.description}</p>
        <span className="mt-2 text-xs font-extrabold uppercase tracking-[0.12em] text-royal">{product.category}</span>

        <div className="mt-4">
          {product.promotionalPrice ? <span className="block text-sm font-semibold text-slate-400 line-through">{formatCurrency(product.price)}</span> : null}
          <strong className="font-display text-2xl font-extrabold text-royal">{formatCurrency(product.promotionalPrice ?? product.price)}</strong>
          {product.promotionalPrice ? <span className="mt-1 block text-xs font-bold text-signal">Economize {formatCurrency(product.price - product.promotionalPrice)}</span> : null}
        </div>

        <a
          href={whatsappLink(productWhatsAppMessage(product))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-emerald-500 bg-white px-4 text-sm font-extrabold text-emerald-600 transition hover:bg-emerald-500 hover:text-white"
        >
          <MessageCircle size={18} />
          Pedir no WhatsApp
        </a>
      </div>
    </motion.article>
  );
}

function DigitalCatalog({ products }: { products: Product[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Todas");
  const [brand, setBrand] = useState("Todas");
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [bestSellers, setBestSellers] = useState(false);

  const activeProducts = products.filter((product) => product.isActive);
  const brands = useMemo(() => ["Todas", ...Array.from(new Set(activeProducts.map((product) => product.brand))).sort()], [activeProducts]);
  const filtered = activeProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "Todas" || product.category === category;
    const matchesBrand = brand === "Todas" || product.brand === brand;
    const matchesOffer = !onlyOffers || product.isOffer || Boolean(product.promotionalPrice);
    const matchesBestSeller = !bestSellers || product.isBestSeller;
    return matchesSearch && matchesCategory && matchesBrand && matchesOffer && matchesBestSeller;
  });

  return (
    <section id="catalogo" className="bg-white py-20">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr]">
          <div>
            <SectionIntro eyebrow="Catálogo digital" title="Vitrine completa para vender mais pelo WhatsApp" text="Produtos organizados por categoria, marca, oferta e destaque, com galeria de fotos e chamada direta para atendimento." />
            <div className="mt-7 grid gap-3 rounded-[8px] border border-slate-200 bg-ice p-4">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Pesquisar produto" className="h-12 w-full rounded-[8px] border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-royal" />
              </label>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-12 rounded-[8px] border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-royal">
                <option>Todas</option>
                {productCategoriesList.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={brand} onChange={(event) => setBrand(event.target.value)} className="h-12 rounded-[8px] border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-royal">
                {brands.map((item) => <option key={item}>{item}</option>)}
              </select>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                <button type="button" onClick={() => setOnlyOffers((current) => !current)} className={`flex h-11 items-center justify-center gap-2 rounded-[8px] text-sm font-extrabold ${onlyOffers ? "bg-signal text-white" : "bg-white text-midnight"}`}>
                  <Tag size={17} />
                  Ofertas
                </button>
                <button type="button" onClick={() => setBestSellers((current) => !current)} className={`flex h-11 items-center justify-center gap-2 rounded-[8px] text-sm font-extrabold ${bestSellers ? "bg-royal text-white" : "bg-white text-midnight"}`}>
                  <Star size={17} />
                  Mais vendidos
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-ice px-4 py-2 text-sm font-extrabold text-midnight">
                <Filter size={17} className="text-royal" />
                {filtered.length} produto(s) encontrado(s)
              </span>
              <a href="#admin" className="inline-flex items-center gap-2 rounded-full border border-royal px-5 py-2 text-sm font-extrabold text-royal">
                <LayoutDashboard size={17} />
                Gerenciar catálogo
              </a>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product, index) => <CatalogCard key={product.id} product={product} index={index} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CatalogFiltersPanel({
  brands,
  category,
  setCategory,
  brand,
  setBrand,
  onlyOffers,
  setOnlyOffers,
  bestSellers,
  setBestSellers,
  categories,
}: {
  brands: string[];
  category: string;
  setCategory: (value: string) => void;
  brand: string;
  setBrand: (value: string) => void;
  onlyOffers: boolean;
  setOnlyOffers: (value: boolean) => void;
  bestSellers: boolean;
  setBestSellers: (value: boolean) => void;
  categories: Category[];
}) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-extrabold text-midnight">Filtros</h3>
        <button type="button" onClick={() => { setCategory("Todas"); setBrand("Todas"); setOnlyOffers(false); setBestSellers(false); }} className="text-xs font-extrabold text-royal">
          Limpar filtros
        </button>
      </div>
      <label className="grid gap-2 text-sm font-extrabold text-midnight">
        Categoria
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none focus:border-royal">
          <option>Todas</option>
          {categories.filter((item) => item.isActive).map((item) => <option key={item.id}>{item.name}</option>)}
        </select>
      </label>
      <label className="grid gap-2 text-sm font-extrabold text-midnight">
        Marca
        <select value={brand} onChange={(event) => setBrand(event.target.value)} className="h-11 rounded-[8px] border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 outline-none focus:border-royal">
          {brands.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <div className="grid gap-3 text-sm font-bold text-slate-700">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={onlyOffers} onChange={(event) => setOnlyOffers(event.target.checked)} className="h-4 w-4 accent-royal" />
          Somente ofertas
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={bestSellers} onChange={(event) => setBestSellers(event.target.checked)} className="h-4 w-4 accent-royal" />
          Mais vendidos
        </label>
      </div>
      <button type="button" className="shine min-h-11 rounded-[8px] bg-royal px-4 text-sm font-extrabold text-white">
        Aplicar filtros
      </button>
    </div>
  );
}

function PharmacyCatalog({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Todas");
  const [brand, setBrand] = useState("Todas");
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [bestSellers, setBestSellers] = useState(false);
  const [sort, setSort] = useState("Mais vendidos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const activeProducts = products.filter((product) => product.isActive);
  const brands = useMemo(() => ["Todas", ...Array.from(new Set(activeProducts.map((product) => product.brand).filter(Boolean))).sort()], [activeProducts]);
  const filtered = activeProducts
    .filter((product) => {
      const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
      return searchable.includes(searchTerm.toLowerCase())
        && (category === "Todas" || product.category === category)
        && (brand === "Todas" || product.brand === brand)
        && (!onlyOffers || product.isOffer || Boolean(product.promotionalPrice))
        && (!bestSellers || product.isBestSeller);
    })
    .sort((a, b) => {
      if (sort === "Menor preço") return (a.promotionalPrice ?? a.price) - (b.promotionalPrice ?? b.price);
      if (sort === "Maior preço") return (b.promotionalPrice ?? b.price) - (a.promotionalPrice ?? a.price);
      if (sort === "Ofertas") return Number(b.isOffer) - Number(a.isOffer);
      if (sort === "Novidades") return Number(b.isNew) - Number(a.isNew);
      return Number(b.isBestSeller) - Number(a.isBestSeller);
    });
  const featuredOffer = filtered.find((product) => product.isWeekOffer || product.isOffer) ?? filtered[0];
  const filtersProps = { brands, category, setCategory, brand, setBrand, onlyOffers, setOnlyOffers, bestSellers, setBestSellers, categories };

  return (
    <section id="catalogo" className="bg-white py-16">
      <div className="container-shell">
        <div className="sticky top-[76px] z-30 -mx-4 border-y border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-xl lg:top-[120px]">
          <div className="container-shell flex flex-col gap-3 p-0 lg:flex-row lg:items-center">
            <button type="button" className="hidden min-h-12 items-center gap-3 rounded-[8px] bg-royal px-5 text-sm font-extrabold text-white lg:inline-flex">
              <Grid2X2 size={18} />
              Categorias
            </button>
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-royal" size={22} />
              <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar produtos, marcas..." className="h-12 w-full rounded-[8px] border border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold outline-none shadow-[0_10px_26px_rgba(6,23,47,0.05)] transition focus:border-royal" />
            </label>
            <a href={whatsappLink("Olá, VitaFarma! Quero fazer um pedido pelo site.")} target="_blank" rel="noopener noreferrer" className="shine inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-signal px-6 text-sm font-extrabold text-white">
              <MessageCircle size={18} />
              Peça pelo WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[250px_1fr_250px]">
          <aside className="hidden xl:grid xl:content-start xl:gap-5">
            <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(6,23,47,0.05)]">
              <h3 className="font-display text-lg font-extrabold text-midnight">Categorias</h3>
              <div className="mt-4 grid gap-1">
                {categories.filter((item) => item.isActive).map((item) => (
                  <button key={item.id} type="button" onClick={() => setCategory(String(item.name))} className={`flex min-h-10 items-center gap-3 rounded-[8px] px-3 text-left text-sm font-bold transition ${category === item.name ? "bg-royal/10 text-royal" : "text-midnight hover:bg-ice"}`}>
                    <Pill size={17} />
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(6,23,47,0.05)]">
              <CatalogFiltersPanel {...filtersProps} />
            </div>
          </aside>

          <div className="min-w-0">
            <div className="overflow-hidden rounded-[8px] bg-[linear-gradient(135deg,#0640a8,#1558d6_50%,#06172f)] p-6 text-white shadow-glow md:p-8">
              <div className="grid items-center gap-5 md:grid-cols-[1fr_240px]">
                <div>
                  <span className="inline-flex rounded-full bg-white/14 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em]">VitaFarma</span>
                  <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-tight">Tudo que você precisa em um só lugar!</h2>
                  <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-white/82">Saúde, bem-estar, beleza e ofertas com atendimento rápido pelo WhatsApp.</p>
                </div>
                {featuredOffer ? (
                  <div className="relative mx-auto aspect-[1.6] w-full max-w-[260px]">
                    <Image src={featuredOffer.mainImageUrl || productCategories[0].image} alt={featuredOffer.name} fill sizes="260px" className="object-contain drop-shadow-2xl" />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-3xl font-extrabold text-midnight">{category === "Todas" ? "Produtos" : category}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{filtered.length} produtos encontrados</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setMobileFiltersOpen(true)} className="inline-flex min-h-10 items-center gap-2 rounded-[8px] border border-slate-200 px-4 text-sm font-extrabold text-midnight xl:hidden">
                  <Filter size={17} />
                  Filtros
                </button>
                <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-10 rounded-[8px] border border-slate-200 bg-white px-3 text-sm font-semibold text-midnight outline-none">
                  {["Mais vendidos", "Menor preço", "Maior preço", "Ofertas", "Novidades"].map((item) => <option key={item}>{item}</option>)}
                </select>
                <div className="flex rounded-[8px] border border-slate-200 p-1">
                  <button type="button" onClick={() => setViewMode("grid")} className={`grid h-8 w-9 place-items-center rounded-[6px] ${viewMode === "grid" ? "bg-royal text-white" : "text-slate-500"}`} aria-label="Ver em grade">
                    <Grid2X2 size={16} />
                  </button>
                  <button type="button" onClick={() => setViewMode("list")} className={`grid h-8 w-9 place-items-center rounded-[6px] ${viewMode === "list" ? "bg-royal text-white" : "text-slate-500"}`} aria-label="Ver em lista">
                    <List size={17} />
                  </button>
                </div>
              </div>
            </div>

            <div className={`mt-5 grid gap-4 ${viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {filtered.map((product, index) => <CatalogCard key={product.id} product={product} index={index} viewMode={viewMode} />)}
            </div>
          </div>

          <aside className="hidden xl:grid xl:content-start xl:gap-5">
            <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(6,23,47,0.05)]">
              <h3 className="font-display text-lg font-extrabold text-midnight">Por que comprar na VitaFarma?</h3>
              <div className="mt-5 grid gap-4">
                {[
                  ["Entrega rápida", Truck],
                  ["Atendimento humanizado", HeartHandshake],
                  ["Pagamento seguro", ShieldCheck],
                  ["Produtos originais", BadgeCheck],
                ].map(([label, Icon]) => {
                  const TypedIcon = Icon as LucideIcon;
                  return (
                    <div key={String(label)} className="flex gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-royal/10 text-royal"><TypedIcon size={18} /></span>
                      <strong className="pt-2 text-sm text-midnight">{String(label)}</strong>
                    </div>
                  );
                })}
              </div>
            </div>
            {featuredOffer ? (
              <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(6,23,47,0.05)]">
                <span className="font-display text-sm font-extrabold uppercase tracking-[0.12em] text-signal">Oferta da semana</span>
                <div className="relative mt-4 aspect-square rounded-[8px] bg-ice">
                  <Image src={featuredOffer.mainImageUrl || productCategories[0].image} alt={featuredOffer.name} fill sizes="220px" className="object-contain p-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-extrabold text-midnight">{featuredOffer.name}</h3>
                <strong className="mt-2 block font-display text-2xl text-royal">{formatCurrency(featuredOffer.promotionalPrice ?? featuredOffer.price)}</strong>
                <a href={whatsappLink(productWhatsAppMessage(featuredOffer))} target="_blank" rel="noopener noreferrer" className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-emerald-500 text-sm font-extrabold text-emerald-600">
                  <MessageCircle size={18} />
                  Pedir no WhatsApp
                </a>
              </div>
            ) : null}
          </aside>
        </div>
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-[90] bg-midnight/55 p-4 backdrop-blur-sm xl:hidden">
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} className="ml-auto max-h-full max-w-sm overflow-auto rounded-[8px] bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-xl font-extrabold text-midnight">Filtros</h3>
              <button type="button" onClick={() => setMobileFiltersOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-ice">
                <X size={18} />
              </button>
            </div>
            <CatalogFiltersPanel {...filtersProps} />
          </motion.div>
        </div>
      ) : null}
    </section>
  );
}

function Offers({ products }: { products: Product[] }) {
  const weeklyProducts = products.filter((product) => product.isActive && product.isWeekOffer).slice(0, 4);

  return (
    <section id="ofertas" className="bg-ice py-20">
      <div className="container-shell grid gap-10 lg:grid-cols-[0.38fr_1fr]">
        <div className="self-center">
          <SectionIntro eyebrow="Ofertas da semana" title="Economize com nossas ofertas" text="Produtos selecionados com preços especiais para você economizar mais todos os dias." />
          <a href={whatsappLink("Olá, VitaFarma! Quero ver todas as ofertas disponíveis.")} target="_blank" rel="noopener noreferrer" className="shine mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-signal px-6 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(229,47,63,0.22)]">
            Ver todas as ofertas
            <ChevronRight size={17} />
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {weeklyProducts.map((oferta, index) => {
            const discount = discountPercent(oferta);
            const image = oferta.images.find(Boolean) ?? visualOffers[index]?.imagem;

            return (
            <motion.article key={oferta.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: index * 0.06 }} whileHover={{ y: -6 }} className="group relative overflow-hidden rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_14px_34px_rgba(6,23,47,0.065)]">
              <span className="absolute left-4 top-4 z-10 rounded-full bg-signal px-3 py-1.5 text-xs font-extrabold text-white">{discount ? `-${discount}%` : "Oferta"}</span>
              <div className="relative mx-auto aspect-[1.25] w-full overflow-hidden rounded-[8px] bg-ice">
                <Image src={image} alt={oferta.name} fill sizes="(max-width: 1024px) 50vw, 20vw" className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="pt-4">
                <h3 className="min-h-[44px] font-display text-base font-extrabold leading-tight text-midnight">{oferta.name}</h3>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-sm font-semibold text-slate-400 line-through">{formatCurrency(oferta.price)}</span>
                  <strong className="font-display text-2xl font-extrabold text-royal">{formatCurrency(oferta.promotionalPrice ?? oferta.price)}</strong>
                </div>
                <a href={whatsappLink(productWhatsAppMessage(oferta))} target="_blank" rel="noopener noreferrer" className="shine mt-4 flex items-center justify-center gap-2 rounded-[8px] bg-royal px-4 py-3 text-sm font-bold text-white">
                  <MessageCircle size={17} />
                  Pedir
                </a>
              </div>
            </motion.article>
          );
          })}
        </div>
      </div>
    </section>
  );
}

function Differentials() {
  return (
    <section id="diferenciais" className="bg-white py-20">
      <div className="container-shell grid gap-12 lg:grid-cols-[0.38fr_1fr]">
        <SectionIntro eyebrow="Por que escolher a VitaFarma?" title="Confiança que você sente, cuidado que você merece." text="Uma experiência desenhada para unir agilidade, segurança, atendimento humano e produtos originais." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {differentials.slice(0, 5).map(([title, text, Icon], index) => (
            <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: index * 0.05 }} whileHover={{ y: -5 }} className="rounded-[8px] border border-slate-200 bg-white p-5 text-center shadow-[0_12px_30px_rgba(6,23,47,0.055)]">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-[8px] bg-royal/10 text-royal">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 font-display text-sm font-extrabold text-midnight">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AdminPanel({
  products,
  setProducts,
  categories,
  campaign,
  setCampaign,
}: {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[]>>;
  categories: Category[];
  campaign: CampaignConfig;
  setCampaign: Dispatch<SetStateAction<CampaignConfig>>;
}) {
  const [editing, setEditing] = useState<Product>(() => ({ ...emptyProduct, id: `tmp-${Date.now()}` }));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adminSearch, setAdminSearch] = useState("");
  const metrics = [
    ["Total de produtos", products.length, PackageCheck],
    ["Produtos ativos", products.filter((product) => product.isActive).length, Eye],
    ["Produtos em oferta", products.filter((product) => product.isOffer).length, Tag],
    ["Mais vendidos", products.filter((product) => product.isBestSeller).length, Star],
    ["Visualizações", products.reduce((total, product) => total + product.views, 0), Activity],
  ] as const;

  const saveProduct = async () => {
    const selectedCategory = categories.find((item) => item.id === editing.categoryId) ?? categories[0] ?? demoCategories[0];
    const galleryImages = editing.galleryImages.map((image) => image.trim()).filter(Boolean);
    const normalized: Product = {
      ...editing,
      id: selectedId ?? `tmp-${Date.now()}`,
      categoryId: selectedCategory.id,
      category: selectedCategory.name,
      price: Number(editing.price) || 0,
      promotionalPrice: editing.promotionalPrice ? Number(editing.promotionalPrice) : undefined,
      stock: Number(editing.stock) || 0,
      mainImageUrl: editing.mainImageUrl.trim(),
      galleryImages,
      images: [editing.mainImageUrl.trim(), ...galleryImages].filter(Boolean),
      available: editing.isActive,
    };
    const saved = await persistProduct(normalized);

    setProducts((current) => {
      const exists = current.some((product) => product.id === saved.id);
      return exists ? current.map((product) => (product.id === saved.id ? saved : product)) : [saved, ...current];
    });
    setSelectedId(null);
    setEditing({ ...emptyProduct, id: `tmp-${Date.now()}` });
  };

  const editProduct = (product: Product) => {
    setSelectedId(product.id);
    setEditing({ ...product, galleryImages: product.galleryImages.length ? product.galleryImages : [] });
  };

  const removeProduct = async (id: string) => {
    await deleteProduct(id);
    setProducts((current) => current.filter((product) => product.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
      setEditing({ ...emptyProduct, id: `tmp-${Date.now()}` });
    }
  };

  const toggleProduct = async (id: string, key: keyof Pick<Product, "isActive" | "isOffer" | "isNew" | "isBestSeller" | "isWeekOffer" | "isHomeFeatured">) => {
    const product = products.find((item) => item.id === id);
    if (product && key === "isActive") await toggleProductActive(id, !product.isActive);
    setProducts((current) => current.map((item) => (item.id === id ? { ...item, [key]: !item[key], available: key === "isActive" ? !item.isActive : item.available } : item)));
  };

  return (
    <section id="admin" className="bg-midnight py-20 text-white">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-[8px] border border-white/12 bg-white/[0.07] p-5 backdrop-blur-xl md:p-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-royal">
              <LayoutDashboard size={16} />
              Painel administrativo
            </span>
            <h2 className="mt-5 font-display text-[clamp(2rem,3.4vw,3rem)] font-extrabold leading-tight">Gerencie produtos, preços, fotos e destaques.</h2>

            <div className="mt-7 grid gap-3">
              <input value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} placeholder="Nome do produto" className="h-12 rounded-[8px] border border-white/12 bg-white px-4 text-sm font-semibold text-midnight outline-none" />
              <textarea value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} placeholder="Descrição" rows={3} className="rounded-[8px] border border-white/12 bg-white px-4 py-3 text-sm font-semibold text-midnight outline-none" />
              <div className="grid gap-3 sm:grid-cols-2">
                <select value={editing.categoryId} onChange={(event) => {
                  const nextCategory = categories.find((item) => item.id === event.target.value) ?? categories[0] ?? demoCategories[0];
                  setEditing({ ...editing, categoryId: nextCategory.id, category: nextCategory.name });
                }} className="h-12 rounded-[8px] border border-white/12 bg-white px-4 text-sm font-semibold text-midnight outline-none">
                  {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
                <input value={editing.brand} onChange={(event) => setEditing({ ...editing, brand: event.target.value })} placeholder="Marca" className="h-12 rounded-[8px] border border-white/12 bg-white px-4 text-sm font-semibold text-midnight outline-none" />
                <input type="number" value={editing.price || ""} onChange={(event) => setEditing({ ...editing, price: Number(event.target.value) })} placeholder="Preço" className="h-12 rounded-[8px] border border-white/12 bg-white px-4 text-sm font-semibold text-midnight outline-none" />
                <input type="number" value={editing.promotionalPrice ?? ""} onChange={(event) => setEditing({ ...editing, promotionalPrice: event.target.value ? Number(event.target.value) : undefined })} placeholder="Preço promocional" className="h-12 rounded-[8px] border border-white/12 bg-white px-4 text-sm font-semibold text-midnight outline-none" />
                <input type="number" value={editing.stock || ""} onChange={(event) => setEditing({ ...editing, stock: Number(event.target.value) })} placeholder="Estoque" className="h-12 rounded-[8px] border border-white/12 bg-white px-4 text-sm font-semibold text-midnight outline-none" />
              </div>
              <input value={editing.mainImageUrl} onChange={(event) => setEditing({ ...editing, mainImageUrl: event.target.value })} placeholder="Imagem principal" className="h-12 rounded-[8px] border border-white/12 bg-white px-4 text-sm font-semibold text-midnight outline-none" />
              <textarea value={editing.galleryImages.join("\n")} onChange={(event) => setEditing({ ...editing, galleryImages: event.target.value.split("\n") })} placeholder="Galeria de imagens, uma URL por linha" rows={4} className="rounded-[8px] border border-white/12 bg-white px-4 py-3 text-sm font-semibold text-midnight outline-none" />
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  ["Oferta", "isOffer"],
                  ["Novidade", "isNew"],
                  ["Mais vendido", "isBestSeller"],
                  ["Oferta semana", "isWeekOffer"],
                  ["Destaque home", "isHomeFeatured"],
                  ["Ativo", "isActive"],
                ].map(([label, key]) => (
                  <button key={key} type="button" onClick={() => setEditing({ ...editing, [key]: !editing[key as keyof Product] })} className={`min-h-10 rounded-[8px] px-3 text-xs font-extrabold ${editing[key as keyof Product] ? "bg-cyan text-midnight" : "bg-white/10 text-white"}`}>
                    {label}
                  </button>
                ))}
              </div>
              <button type="button" onClick={saveProduct} className="shine mt-2 flex min-h-12 items-center justify-center gap-2 rounded-full bg-signal px-6 text-sm font-extrabold text-white">
                <Plus size={18} />
                {selectedId ? "Salvar alterações" : "Cadastrar produto"}
              </button>
            </div>
          </motion.div>

          <div className="grid gap-5">
            <motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-[8px] border border-white/12 bg-white p-5 text-midnight shadow-glow">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-extrabold">Produtos cadastrados</h3>
                <span className="rounded-full bg-ice px-3 py-1 text-xs font-extrabold text-royal">{products.length} itens</span>
              </div>
              <div className="max-h-[420px] space-y-3 overflow-auto pr-1">
                {products.map((product) => (
                  <div key={product.id} className="grid gap-3 rounded-[8px] border border-slate-200 bg-ice p-3 md:grid-cols-[72px_1fr_auto] md:items-center">
                    <div className="relative h-16 w-16 overflow-hidden rounded-[8px] bg-white">
                      <Image src={product.mainImageUrl || product.images.find(Boolean) || productCategories[0].image} alt={product.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div>
                      <strong className="block font-display text-sm">{product.name}</strong>
                      <span className="mt-1 block text-xs font-semibold text-slate-500">{product.category} • {product.brand} • {formatCurrency(product.promotionalPrice ?? product.price)}</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(["isActive", "isOffer", "isBestSeller", "isWeekOffer"] as const).map((key) => (
                          <button key={key} type="button" onClick={() => toggleProduct(product.id, key)} className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${product[key] ? "bg-royal text-white" : "bg-white text-slate-500"}`}>
                            {key === "isActive" ? "Ativo" : key === "isOffer" ? "Oferta" : key === "isBestSeller" ? "Vendido" : "Semana"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 md:justify-end">
                      <button type="button" onClick={() => editProduct(product)} aria-label="Editar produto" className="grid h-10 w-10 place-items-center rounded-[8px] bg-white text-royal shadow-sm">
                        <Edit3 size={17} />
                      </button>
                      <button type="button" onClick={() => removeProduct(product.id)} aria-label="Excluir produto" className="grid h-10 w-10 place-items-center rounded-[8px] bg-white text-signal shadow-sm">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[8px] border border-white/12 bg-white p-5 text-midnight shadow-[0_18px_42px_rgba(6,23,47,0.16)]">
              <h3 className="font-display text-xl font-extrabold">Campanha Anual</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input value={campaign.title} onChange={(event) => setCampaign({ ...campaign, title: event.target.value })} className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-royal" />
                <input type="datetime-local" value={campaign.drawDate.slice(0, 16)} onChange={(event) => setCampaign({ ...campaign, drawDate: `${event.target.value}:00-03:00` })} className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-royal" />
                <textarea value={campaign.description} onChange={(event) => setCampaign({ ...campaign, description: event.target.value })} rows={2} className="rounded-[8px] border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-royal md:col-span-2" />
                <textarea value={campaign.highlight} onChange={(event) => setCampaign({ ...campaign, highlight: event.target.value })} rows={2} className="rounded-[8px] border border-slate-200 px-3 py-2 text-sm font-semibold outline-none focus:border-royal md:col-span-2" />
              </div>
              <button type="button" onClick={() => setCampaign({ ...campaign, active: !campaign.active })} className="mt-4 inline-flex items-center gap-2 rounded-full bg-ice px-4 py-2 text-xs font-extrabold text-royal">
                {campaign.active ? <Eye size={16} /> : <EyeOff size={16} />}
                {campaign.active ? "Campanha visível" : "Campanha oculta"}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnnualCampaignPremium({ campaign }: { campaign: CampaignConfig }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(campaign.drawDate));

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft(campaign.drawDate)), 1000);
    return () => window.clearInterval(timer);
  }, [campaign.drawDate]);

  if (!campaign.active) return null;

  const countdown = [
    ["Dias", timeLeft.days],
    ["Horas", timeLeft.hours],
    ["Min", timeLeft.minutes],
    ["Seg", timeLeft.seconds],
  ] as const;

  return (
    <section className="relative overflow-hidden bg-ice py-16 md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(21,88,214,0.11),transparent_30%),radial-gradient(circle_at_84%_28%,rgba(229,47,63,0.12),transparent_24%)]" />
      <div className="container-shell relative">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
          className="relative overflow-hidden rounded-[8px] border border-white bg-white shadow-[0_26px_70px_rgba(6,23,47,0.16)]"
        >
          <div className="absolute inset-x-0 top-0 z-10 h-1 bg-[linear-gradient(90deg,#1558d6,#ffffff,#e52f3f)]" />
          <div className="grid gap-0 lg:grid-cols-[1fr_330px]">
            <div className="relative overflow-hidden bg-midnight">
              <div className="campaign-banner-zoom relative aspect-[16/10] min-h-[300px] sm:aspect-[16/8] lg:min-h-[560px]">
                <Image
                  src="/campanha-anual-sorteio.png"
                  alt="Banner do Grande Sorteio Anual VitaFarma"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 850px"
                  className="object-cover"
                />
              </div>
              <div className="campaign-banner-shine absolute inset-0" />
              <div className="pointer-events-none absolute inset-0">
                {Array.from({ length: 12 }).map((_, index) => (
                  <span key={index} className={`campaign-confetti campaign-confetti-${index + 1}`} />
                ))}
                <span className="campaign-flash left-[18%] top-[82%]" />
                <span className="campaign-flash left-[52%] top-[38%] delay-700" />
                <span className="campaign-flash left-[84%] top-[18%] delay-1000" />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(6,23,47,0.78))] p-4 sm:p-6 lg:hidden">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-extrabold uppercase text-royal">
                  <Gift size={15} />
                  Campanha anual
                </span>
                <h2 className="mt-3 max-w-[720px] font-display text-2xl font-extrabold leading-tight text-white sm:text-4xl">{campaign.title}</h2>
              </div>
            </div>

            <aside className="bg-white p-5 text-midnight sm:p-6 lg:p-7">
              <span className="hidden items-center gap-2 rounded-full bg-royal px-4 py-2 text-xs font-extrabold uppercase text-white lg:inline-flex">
                <Gift size={16} />
                Campanha anual
              </span>
              <h2 className="mt-4 hidden font-display text-3xl font-extrabold leading-tight text-midnight lg:block">{campaign.title}</h2>
              <p className="mt-3 text-sm font-bold leading-6 text-royal">{campaign.description}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{campaign.highlight}</p>

              <div className="mt-5 rounded-[8px] border border-slate-200 bg-ice p-4">
                <span className="text-xs font-extrabold uppercase text-slate-500">Sorteio em</span>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {countdown.map(([label, value]) => (
                    <div key={label} className="rounded-[8px] bg-white px-2 py-3 text-center shadow-sm">
                      <strong className="font-display text-xl font-extrabold text-royal sm:text-2xl">{String(value).padStart(2, "0")}</strong>
                      <span className="mt-1 block text-[0.62rem] font-extrabold uppercase text-slate-500">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {campaignSteps.map(([label, Icon]) => (
                  <div key={label} className="flex items-center gap-3 rounded-[8px] border border-slate-100 bg-white px-3 py-2 shadow-sm">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-royal text-white">
                      <Icon size={18} />
                    </span>
                    <strong className="text-sm font-extrabold text-slate-700">{label}</strong>
                  </div>
                ))}
              </div>

              <a
                href={whatsappLink(campaign.buttonMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="shine mt-6 flex min-h-14 items-center justify-center gap-3 rounded-[8px] bg-signal px-5 py-4 text-center text-sm font-extrabold text-white shadow-[0_18px_34px_rgba(229,47,63,0.28)] transition hover:-translate-y-1 sm:text-base"
              >
                <MessageCircle size={21} />
                Participar pelo WhatsApp
                <ChevronRight size={20} />
              </a>
            </aside>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AnnualCampaign({ campaign }: { campaign: CampaignConfig }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(campaign.drawDate));

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft(campaign.drawDate)), 1000);
    return () => window.clearInterval(timer);
  }, [campaign.drawDate]);

  if (!campaign.active) return null;

  const countdown = [
    ["Dias", timeLeft.days],
    ["Horas", timeLeft.hours],
    ["Minutos", timeLeft.minutes],
    ["Segundos", timeLeft.seconds],
  ] as const;

  return (
    <section className="relative overflow-hidden bg-ice py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(21,88,214,0.1),transparent_32%),radial-gradient(circle_at_82%_30%,rgba(229,47,63,0.12),transparent_26%)]" />
      <div className="container-shell relative">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="overflow-hidden rounded-[8px] border border-white bg-white/82 shadow-[0_18px_48px_rgba(6,23,47,0.1)] backdrop-blur-xl"
        >
          <div className="grid gap-0 lg:grid-cols-[1.06fr_0.74fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-signal px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_12px_26px_rgba(229,47,63,0.22)]">
                <Gift size={16} />
                Campanha anual
              </span>
              <h2 className="mt-5 font-display text-[clamp(2.2rem,4vw,4rem)] font-extrabold leading-[1.02] text-midnight">
                🎉 {campaign.title}
              </h2>
              <p className="mt-5 max-w-3xl text-lg font-bold leading-8 text-royal">{campaign.description}</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">{campaign.highlight}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {campaign.prizes.map((prize, index) => (
                  <motion.article
                    key={prize.name}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    whileHover={{ y: -7, scale: 1.015 }}
                    className="group overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(6,23,47,0.07)] transition"
                  >
                    <div className="relative aspect-[1.18] overflow-hidden bg-ice">
                      <Image src={prize.image} alt={prize.name} fill sizes="(max-width: 768px) 50vw, 18vw" className="object-cover transition duration-700 group-hover:scale-105" />
                      <div className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-[8px] bg-white/92 text-royal shadow-sm backdrop-blur">
                        <Trophy size={18} />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-base font-extrabold leading-tight text-midnight">{prize.name}</h3>
                      <p className="mt-2 text-xs leading-5 text-slate-500">{prize.description}</p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            <aside className="border-t border-slate-200 bg-midnight p-6 text-white md:p-8 lg:border-l lg:border-t-0 lg:p-9">
              <h3 className="font-display text-2xl font-extrabold">Como participar</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">A participação é simples: compre, receba seu cupom e aguarde o sorteio.</p>

              <div className="mt-7 grid gap-4">
                {campaignSteps.map(([label, Icon], index) => (
                  <motion.div key={label} initial={{ opacity: 0, x: 22 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="relative flex gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[8px] bg-white text-royal">
                      <Icon size={22} />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/44">Etapa {index + 1}</span>
                      <strong className="mt-1 block font-display text-lg font-extrabold">{label}</strong>
                    </div>
                    {index < campaignSteps.length - 1 ? <span className="absolute left-6 top-14 h-5 w-px bg-white/20" /> : null}
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 rounded-[8px] border border-white/12 bg-white/[0.07] p-4 backdrop-blur">
                <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/55">Sorteio em</span>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {countdown.map(([label, value]) => (
                    <div key={label} className="rounded-[8px] bg-white px-3 py-4 text-center text-midnight">
                      <strong className="font-display text-3xl font-extrabold">{String(value).padStart(2, "0")}</strong>
                      <span className="mt-1 block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={whatsappLink(campaign.buttonMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="shine mt-7 flex min-h-14 items-center justify-center gap-3 rounded-full bg-signal px-7 text-base font-extrabold text-white shadow-[0_18px_38px_rgba(229,47,63,0.28)] transition hover:-translate-y-1"
              >
                <MessageCircle size={21} />
                {campaign.buttonText}
                <ChevronRight size={20} />
              </a>
            </aside>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Brands() {
  return (
    <section className="border-y border-slate-200 bg-white py-12">
      <div className="container-shell">
        <span className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-royal">Marcas que você confia</span>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          {brandLogos.map((brand, index) => (
            <motion.div key={brand} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="grid h-14 place-items-center rounded-[8px] border border-slate-200 bg-white px-4 font-display text-base font-extrabold text-royal shadow-[0_10px_24px_rgba(6,23,47,0.04)]">
              {brand}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PharmacyHub() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % testimonials.length), 4200);
    return () => window.clearInterval(timer);
  }, []);

  const testimonial = testimonials[active];

  return (
    <section className="bg-ice py-20">
      <div className="container-shell grid gap-5 lg:grid-cols-4">
        <motion.article variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(6,23,47,0.055)]">
          <h3 className="font-display text-sm font-extrabold uppercase tracking-[0.12em] text-royal">Serviços farmacêuticos</h3>
          <div className="mt-5 grid gap-3">
            {pharmacyServices.map(([label, Icon]) => (
              <div key={label} className="flex items-center gap-3 text-sm font-semibold text-midnight">
                <Icon size={18} className="text-royal" />
                {label}
              </div>
            ))}
          </div>
          <a href={whatsappLink("Olá, VitaFarma! Quero saber mais sobre serviços farmacêuticos.")} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-full border border-royal px-5 py-2 text-xs font-extrabold text-royal">
            Saiba mais
          </a>
        </motion.article>

        <motion.article variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(6,23,47,0.055)]">
          <h3 className="font-display text-sm font-extrabold uppercase tracking-[0.12em] text-royal">Convênios</h3>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {convenioItems.map((item) => (
              <div key={item} className="grid min-h-16 place-items-center rounded-[8px] border border-slate-200 bg-ice px-3 text-center text-sm font-extrabold text-midnight">
                {item}
              </div>
            ))}
          </div>
          <a href={whatsappLink("Olá, VitaFarma! Quero consultar convênios aceitos.")} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-full border border-royal px-5 py-2 text-xs font-extrabold text-royal">
            Ver todos convênios
          </a>
        </motion.article>

        <motion.article key={testimonial.name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(6,23,47,0.055)]">
          <h3 className="font-display text-sm font-extrabold uppercase tracking-[0.12em] text-royal">Depoimentos</h3>
          <Quote className="mt-5 text-royal" size={28} />
          <p className="mt-3 text-sm font-semibold leading-6 text-midnight">{testimonial.text}</p>
          <div className="mt-4 flex gap-1 text-signal">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} size={16} fill="currentColor" />
            ))}
          </div>
          <div className="mt-5 flex items-center gap-3">
            <Image src={testimonial.image} alt={testimonial.name} width={42} height={42} className="h-11 w-11 rounded-full object-cover" />
            <div>
              <strong className="block text-sm font-extrabold text-midnight">{testimonial.name}</strong>
              <span className="text-xs text-slate-500">Cliente VitaFarma</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            {testimonials.map((item, index) => (
              <button key={item.name} type="button" aria-label={`Ver depoimento ${index + 1}`} onClick={() => setActive(index)} className={`h-2 rounded-full transition-all ${active === index ? "w-8 bg-royal" : "w-2 bg-slate-300"}`} />
            ))}
          </div>
        </motion.article>

        <motion.article variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(6,23,47,0.055)]">
          <h3 className="font-display text-sm font-extrabold uppercase tracking-[0.12em] text-royal">Dicas de saúde</h3>
          <div className="mt-5 grid gap-4">
            {healthTips.map((tip) => (
              <a key={tip.title} href="#contato" className="grid grid-cols-[76px_1fr] gap-3">
                <Image src={tip.image} alt={tip.title} width={76} height={58} className="h-16 w-[76px] rounded-[8px] object-cover" />
                <span className="text-sm font-bold leading-5 text-midnight">
                  {tip.title}
                  <small className="mt-1 block font-extrabold text-royal">Ler mais</small>
                </span>
              </a>
            ))}
          </div>
        </motion.article>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contato" className="bg-white py-20">
      <div className="container-shell grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
        <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-[8px] border border-slate-200 bg-ice p-6 md:p-7">
          <SectionIntro eyebrow="Localização" title="Estamos na Rua da Feira, em Antas." text="Chame pelo WhatsApp, acompanhe no Instagram ou abra o mapa para chegar com facilidade." />
          <div className="mt-7 grid gap-3">
            {[
              [MessageCircle, "WhatsApp", "Atendimento e pedidos online"],
              [Instagram, "Instagram", site.instagramHandle],
              [MapPin, "Endereço", site.address],
              [Clock, "Horário", site.hours],
            ].map(([Icon, title, text]) => {
              const TypedIcon = Icon as LucideIcon;
              return (
                <div key={String(title)} className="flex items-center gap-4 rounded-[8px] border border-slate-200 bg-white p-4">
                  <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-royal/10 text-royal">
                    <TypedIcon size={21} />
                  </span>
                  <div>
                    <strong className="block font-display">{String(title)}</strong>
                    <span className="text-sm text-slate-600">{String(text)}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href={whatsappLink("Olá, VitaFarma Antas! Quero atendimento.")} target="_blank" rel="noopener noreferrer" className="shine inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-signal px-6 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(229,47,63,0.22)]">
              <MessageCircle size={19} />
              Falar no WhatsApp
            </a>
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-midnight px-6 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(6,23,47,0.16)]">
              <MapPin size={19} />
              Como chegar
            </a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 42 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="min-h-[440px] overflow-hidden rounded-[8px] border border-slate-200 shadow-[0_16px_42px_rgba(6,23,47,0.1)]">
          <iframe title="Mapa da VitaFarma Antas" src={site.mapsEmbed} loading="lazy" className="h-full min-h-[440px] w-full border-0" referrerPolicy="no-referrer-when-downgrade" />
        </motion.div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-midnight px-4 py-24 text-white">
      <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="container-shell overflow-hidden rounded-[8px] bg-[linear-gradient(135deg,#1558d6,#06172f_55%,#19c7e8)] p-8 text-center shadow-glow md:p-14">
        <h2 className="mx-auto max-w-4xl font-display text-3xl font-extrabold leading-tight md:text-5xl">
          Sua saúde merece um atendimento rápido, seguro e humanizado.
        </h2>
        <a href={whatsappLink("Olá, VitaFarma Antas! Quero falar com a equipe.")} target="_blank" rel="noopener noreferrer" className="shine mt-9 inline-flex items-center justify-center gap-3 rounded-full bg-signal px-9 py-5 text-lg font-extrabold text-white shadow-lift">
          <MessageCircle size={22} />
          Falar com a VitaFarma
        </a>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-midnight pt-14 text-white">
      <div className="container-shell grid gap-8 pb-11 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr_1.25fr]">
        <div>
          <Image src="/logo-vitafarma.png" alt="VitaFarma Antas" width={170} height={90} className="h-auto w-40 brightness-0 invert" />
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/70">Mais saúde, cuidado e praticidade para você e sua família todos os dias. Estamos sempre prontos para atender com excelência.</p>
          <div className="mt-5 flex gap-3 text-white">
            <Instagram size={18} />
            <MessageCircle size={19} />
          </div>
        </div>
        <div>
          <h3 className="font-display text-sm font-extrabold uppercase tracking-[0.12em]">Contato</h3>
          <div className="mt-5 grid gap-3 text-sm text-white/72">
            <span className="flex items-center gap-2"><Phone size={16} /> (75) 9 9999-9999</span>
            <span className="flex items-center gap-2"><MessageCircle size={16} /> (75) 3439-9999</span>
            <span className="flex items-center gap-2"><Mail size={16} /> contato@vitafarma.com.br</span>
            <span className="flex items-center gap-2"><MapPin size={16} /> Antas - Bahia</span>
          </div>
        </div>
        <div>
          <h3 className="font-display text-sm font-extrabold uppercase tracking-[0.12em]">Informações</h3>
          <div className="mt-5 grid gap-3 text-sm text-white/72">
            {nav.slice(1).map(([label, href]) => (
              <a key={label} href={href} className="hover:text-white">- {label}</a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-display text-sm font-extrabold uppercase tracking-[0.12em]">Atendimento</h3>
          <div className="mt-5 grid gap-3 text-sm text-white/72">
            <span>Segunda a Sábado: 07h às 21h</span>
            <span>Domingos e feriados: 08h às 14h</span>
            <span className="flex items-center gap-2 text-white"><HeartHandshake size={17} /> Entrega rápida para Antas e região</span>
          </div>
        </div>
        <div className="min-h-44 overflow-hidden rounded-[8px] border border-white/12 bg-white/5 p-1">
          <iframe title="Mapa VitaFarma rodapé" src={site.mapsEmbed} loading="lazy" className="h-full min-h-40 w-full border-0 grayscale" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </div>
      <div className="border-t border-white/10 py-4">
        <div className="container-shell flex flex-col gap-2 text-xs text-white/64 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} VitaFarma. Todos os direitos reservados.</span>
          <span>Desenvolvido para uma experiência premium.</span>
        </div>
      </div>
    </footer>
  );
}

function FloatingActions() {
  const [visible, setVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Olá! 👋 Sou a assistente virtual da Vita Farma. Posso ajudar você a encontrar produtos, conhecer nossas promoções, tirar dúvidas e encaminhar seu atendimento para o WhatsApp. Como posso ajudar?",
    },
  ]);
  const [question, setQuestion] = useState("");

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const quickAnswers = ["Horário de funcionamento", "Promoções da semana", "Como comprar pelo WhatsApp", "Campanha anual"];

  const answerQuestion = (text: string) => {
    const normalized = text.toLowerCase();
    if (normalized.includes("hor")) return "Atendemos de segunda a sábado, das 07h às 21h. Em domingos e feriados, confirme pelo WhatsApp antes de ir até a loja.";
    if (normalized.includes("local") || normalized.includes("endereço") || normalized.includes("mapa")) return `Estamos em ${site.address}. Posso abrir o mapa ou encaminhar você para o WhatsApp.`;
    if (normalized.includes("pagamento") || normalized.includes("pix") || normalized.includes("cart")) return "Aceitamos dinheiro, PIX e cartões. Para compras pelo WhatsApp, a equipe confirma a melhor forma de pagamento no atendimento.";
    if (normalized.includes("promo") || normalized.includes("oferta")) return "As ofertas da semana aparecem no catálogo e podem ser solicitadas pelo botão de WhatsApp em cada produto.";
    if (normalized.includes("campanha") || normalized.includes("sorteio") || normalized.includes("cupom")) return "Na campanha anual, a cada R$ 40,00 em compras você recebe 1 cupom para concorrer aos prêmios. Use o botão Quero Participar para falar com a equipe.";
    if (normalized.includes("comprar") || normalized.includes("whatsapp") || normalized.includes("pedido")) return "Escolha um produto no catálogo e toque em Solicitar pelo WhatsApp. A mensagem já vai pronta para a equipe continuar seu atendimento.";
    if (normalized.includes("serviço") || normalized.includes("pressão") || normalized.includes("glicemia")) return "A VitaFarma oferece orientação farmacêutica, aferição de pressão, teste de glicemia e outros serviços. Confirme disponibilidade pelo WhatsApp.";
    return "Posso ajudar com produtos, ofertas, localização, horários, formas de pagamento e campanha anual. Para atendimento humano, toque no botão do WhatsApp.";
  };

  const sendMessage = (text = question) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, { from: "user", text: trimmed }, { from: "bot", text: answerQuestion(trimmed) }]);
    setQuestion("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {chatOpen ? (
        <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="w-[min(360px,calc(100vw-28px))] overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-glow">
          <div className="flex items-center justify-between bg-midnight px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-cyan text-midnight">
                <Bot size={21} />
              </span>
              <div>
                <strong className="block font-display text-sm">Assistente VitaFarma</strong>
                <span className="text-xs text-white/60">Pronta para IA + WhatsApp</span>
              </div>
            </div>
            <button type="button" onClick={() => setChatOpen(false)} aria-label="Fechar assistente" className="grid h-9 w-9 place-items-center rounded-[8px] bg-white/10">
              <X size={18} />
            </button>
          </div>
          <div className="max-h-80 space-y-3 overflow-auto bg-ice p-4">
            {messages.map((message, index) => (
              <div key={index} className={`max-w-[88%] rounded-[8px] px-3 py-2 text-sm leading-5 ${message.from === "bot" ? "bg-white text-midnight shadow-sm" : "ml-auto bg-royal text-white"}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-white p-3">
            {quickAnswers.map((item) => (
              <button key={item} type="button" onClick={() => sendMessage(item)} className="rounded-full bg-ice px-3 py-1.5 text-xs font-extrabold text-royal">
                {item}
              </button>
            ))}
          </div>
          <div className="flex gap-2 border-t border-slate-200 bg-white p-3">
            <input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} placeholder="Digite sua dúvida" className="h-11 min-w-0 flex-1 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-royal" />
            <button type="button" onClick={() => sendMessage()} aria-label="Enviar mensagem" className="grid h-11 w-11 place-items-center rounded-[8px] bg-signal text-white">
              <Send size={18} />
            </button>
          </div>
          <a href={whatsappLink("Olá, VitaFarma! Conversei com a assistente virtual e quero continuar meu atendimento.")} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 bg-royal px-4 text-sm font-extrabold text-white">
            <MessageCircle size={18} />
            Continuar no WhatsApp
          </a>
        </motion.div>
      ) : null}
      {visible ? (
        <button type="button" aria-label="Voltar ao topo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="grid h-12 w-12 place-items-center rounded-full bg-white text-midnight shadow-lift">
          <ChevronUp size={22} />
        </button>
      ) : null}
      <button type="button" onClick={() => setChatOpen((current) => !current)} aria-label="Abrir assistente virtual" className="grid h-14 w-14 place-items-center rounded-full bg-signal text-white shadow-[0_18px_38px_rgba(229,47,63,0.28)] transition hover:-translate-y-1">
        {chatOpen ? <X size={25} /> : <Bot size={27} />}
      </button>
    </div>
  );
}

export function HomePage() {
  const [products, setProducts] = useLocalState<Product[]>(catalogStorageKey, catalogProducts);
  const [categories, setCategories] = useLocalState<Category[]>("vitafarma.catalog.categories", demoCategories);
  const [campaign, setCampaign] = useLocalState<CampaignConfig>(campaignStorageKey, campanhaAnual);

  useEffect(() => {
    let mounted = true;
    async function loadCatalog() {
      const nextCategories = await fetchCategories();
      const nextProducts = await fetchProducts(nextCategories);
      if (!mounted) return;
      setCategories(nextCategories);
      setProducts(nextProducts);
    }
    loadCatalog();
    return () => {
      mounted = false;
    };
  }, [setCategories, setProducts]);

  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Pharmacy",
      name: site.name,
      address: site.address,
      url: "https://vitafarmaantas.com.br",
      sameAs: [site.instagramUrl],
      areaServed: "Antas, Bahia",
    }),
    [],
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <LoadingScreen />
      <Header />
      <main>
        <Hero />
        <BenefitsBar />
        <Products />
        <PharmacyCatalog products={products} categories={categories} />
        <Offers products={products} />
        <Differentials />
        <AnnualCampaignPremium campaign={campaign} />
        <Brands />
        <PharmacyHub />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
