"use client";

import Image from "next/image";
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Baby,
  BadgeCheck,
  BookOpen,
  ChevronRight,
  ChevronUp,
  Clock,
  CreditCard,
  Droplet,
  HeartHandshake,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  PackageCheck,
  Phone,
  Pill,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Sun,
  Syringe,
  Truck,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ofertasSemana } from "@/data/ofertas";
import { site, whatsappLink } from "@/data/site";

const nav = [
  ["Início", "#inicio"],
  ["Sobre", "#sobre"],
  ["Produtos", "#produtos"],
  ["Ofertas", "#ofertas"],
  ["Serviços", "#servicos"],
  ["Diferenciais", "#diferenciais"],
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

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

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
      className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}
    >
      <span className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-signal">{eyebrow}</span>
      <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight text-midnight md:text-4xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">{text}</p>
    </motion.div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const compact = useTransform(scrollY, [0, 80], [0, 1]);
  const navHeight = useTransform(compact, [0, 1], [92, 76]);
  const logoScale = useTransform(compact, [0, 1], [1, 0.86]);
  const shadow = useTransform(compact, [0, 1], ["0 12px 40px rgba(6,23,47,0.04)", "0 18px 52px rgba(6,23,47,0.14)"]);

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
            className="shine hidden items-center gap-2 rounded-full bg-signal px-7 py-4 text-sm font-extrabold text-white shadow-[0_16px_36px_rgba(229,47,63,0.28)] transition hover:-translate-y-0.5 lg:flex"
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

function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const smoothX = useSpring(x, { stiffness: 420, damping: 34 });
  const smoothY = useSpring(y, { stiffness: 420, damping: 34 });

  useEffect(() => {
    const move = (event: PointerEvent) => {
      x.set(event.clientX - 9);
      y.set(event.clientY - 9);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return <motion.div style={{ x: smoothX, y: smoothY }} className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-[18px] w-[18px] rounded-full border border-cyan/80 bg-white/20 mix-blend-difference md:block" />;
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
          className="scale-105 object-cover blur-[2px]"
        />
      </motion.div>
      <div className="absolute inset-0 z-[1] bg-white/72" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_48%_44%,rgba(255,255,255,0.28),transparent_30%),linear-gradient(90deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.74)_45%,rgba(255,255,255,0.88)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 z-[3] h-40 bg-gradient-to-t from-ice via-white/60 to-transparent" />

      <div className="container-shell relative z-10 grid min-h-[680px] items-center gap-8 py-7 lg:grid-cols-[1.02fr_0.86fr] xl:grid-cols-[0.98fr_0.58fr_0.82fr] xl:gap-5">
        <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }} className="min-w-0 max-w-[620px] xl:pb-8">
          <motion.span variants={fadeUp} className="inline-flex items-center gap-2 rounded-full bg-royal px-4 py-2 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(21,88,214,0.25)]">
            <MapPin size={17} />
            VitaFarma Antas
          </motion.span>

          <motion.h1 variants={fadeUp} className="mt-4 max-w-full font-display text-[clamp(2rem,9vw,4.15rem)] font-extrabold leading-[0.98] text-midnight [overflow-wrap:anywhere]">
            <span className="block">Mais <span className="text-royal">Saúde</span>,</span>
            <span className="block">cuidado e</span>
            <span className="block"><span className="text-signal">Praticidade</span></span>
            <span className="block">para</span>
            <span className="block">você todos os</span>
            <span className="block">dias.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-5 max-w-full text-base font-medium leading-7 text-slate-600 md:max-w-2xl md:text-lg">
            Medicamentos, perfumaria, vitaminas e atendimento humanizado em Antas com a agilidade que sua rotina precisa.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            {heroHighlights.map(([label, Icon]) => (
              <motion.div key={label} whileHover={{ y: -5 }} className="flex min-h-[66px] items-center gap-3 rounded-[8px] border border-white bg-white/82 p-3 shadow-[0_16px_34px_rgba(6,23,47,0.1)] backdrop-blur-xl">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-white text-royal shadow-sm ring-1 ring-royal/10">
                  <Icon size={20} />
                </span>
                <span className="text-xs font-extrabold leading-tight text-midnight sm:text-[13px]">{label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 flex flex-col gap-4 sm:flex-row">
            <a href={whatsappLink("Olá, VitaFarma Antas! Quero fazer um pedido.")} target="_blank" rel="noopener noreferrer" className="shine inline-flex w-full items-center justify-center gap-3 rounded-full bg-signal px-6 py-4 text-sm font-extrabold text-white shadow-[0_22px_44px_rgba(229,47,63,0.28)] transition hover:-translate-y-1 sm:w-auto sm:px-8 sm:text-base">
              <MessageCircle size={23} />
              Peça pelo WhatsApp
              <ChevronRight size={20} />
            </a>
            <a href="#ofertas" className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-white bg-white/86 px-6 py-4 text-sm font-extrabold text-midnight shadow-[0_18px_38px_rgba(6,23,47,0.1)] backdrop-blur-xl transition hover:-translate-y-1 hover:text-royal sm:w-auto sm:px-8 sm:text-base">
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
          className="relative mx-auto hidden min-h-[570px] w-full max-w-[360px] self-end xl:block"
        >
          <div className="absolute inset-x-8 bottom-4 h-24 rounded-full bg-royal/16 blur-2xl" />
          <Image
            src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=920&q=88"
            alt="Farmacêutica sorrindo"
            fill
            priority
            sizes="30vw"
            className="object-cover object-[50%_12%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ice via-transparent to-transparent" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/35 to-transparent" />
        </motion.div>

        <motion.aside initial={{ opacity: 0, x: 44, scale: 0.96 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.75, delay: 0.28 }} className="min-w-0 max-w-full overflow-hidden rounded-[8px] border border-white/70 bg-white/72 text-midnight shadow-[0_28px_74px_rgba(6,23,47,0.22)] backdrop-blur-2xl lg:col-span-2 xl:col-span-1">
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
              <motion.div key={title} whileHover={{ x: 4 }} className="flex items-center gap-4 rounded-[8px] bg-white p-4 shadow-[0_14px_30px_rgba(6,23,47,0.08)] ring-1 ring-slate-100">
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
    <section aria-label="Benefícios" className="relative z-20 -mt-6 bg-ice pb-12 md:-mt-8">
      <div className="container-shell rounded-[8px] border border-white bg-white/94 px-5 py-4 shadow-[0_20px_54px_rgba(6,23,47,0.12)] backdrop-blur-xl">
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
    <motion.article variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-70px" }} transition={{ delay: index * 0.07 }} whileHover={{ y: -8 }} className="group overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(6,23,47,0.08)]">
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
      <div className="container-shell grid items-center gap-10 lg:grid-cols-[0.88fr_1.5fr]">
        <div>
          <SectionIntro eyebrow="Nossos serviços" title="Tudo que você precisa para viver mais e melhor" text="Oferecemos muito mais do que medicamentos. Aqui você encontra serviços e produtos de qualidade para cuidar da sua saúde e bem-estar." />
          <a href={whatsappLink("Olá, VitaFarma! Quero conhecer os serviços disponíveis.")} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 text-sm font-extrabold text-white shadow-lift transition hover:-translate-y-1">
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

function Offers() {
  return (
    <section id="ofertas" className="bg-ice py-16">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.42fr_1fr]">
        <div className="self-center">
          <SectionIntro eyebrow="Ofertas da semana" title="Economize com nossas ofertas" text="Produtos selecionados com preços especiais para você economizar mais todos os dias." />
          <a href={whatsappLink("Olá, VitaFarma! Quero ver todas as ofertas disponíveis.")} target="_blank" rel="noopener noreferrer" className="shine mt-6 inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-extrabold text-white shadow-[0_18px_36px_rgba(229,47,63,0.22)]">
            Ver todas as ofertas
            <ChevronRight size={17} />
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {visualOffers.map((oferta, index) => (
            <motion.article key={oferta.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: index * 0.06 }} whileHover={{ y: -8 }} className="group relative overflow-hidden rounded-[8px] border border-slate-200 bg-white p-4 shadow-[0_18px_45px_rgba(6,23,47,0.08)]">
              <span className="absolute left-4 top-4 z-10 rounded-full bg-signal px-3 py-1.5 text-xs font-extrabold text-white">{oferta.desconto}</span>
              <div className="relative mx-auto aspect-[1.25] w-full overflow-hidden rounded-[8px] bg-ice">
                <Image src={oferta.imagem} alt={oferta.nome} fill sizes="(max-width: 1024px) 50vw, 20vw" className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="pt-4">
                <h3 className="min-h-[44px] font-display text-base font-extrabold leading-tight text-midnight">{oferta.nome}</h3>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-sm font-semibold text-slate-400 line-through">{oferta.precoAntigo}</span>
                  <strong className="font-display text-2xl font-extrabold text-royal">{oferta.precoAtual}</strong>
                </div>
                <a href={whatsappLink(oferta.mensagemWhatsApp)} target="_blank" rel="noopener noreferrer" className="shine mt-4 flex items-center justify-center gap-2 rounded-[8px] bg-royal px-4 py-3 text-sm font-bold text-white">
                  <MessageCircle size={17} />
                  Pedir
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Differentials() {
  return (
    <section id="diferenciais" className="bg-white py-16">
      <div className="container-shell grid gap-10 lg:grid-cols-[0.42fr_1fr]">
        <SectionIntro eyebrow="Por que escolher a VitaFarma?" title="Confiança que você sente, cuidado que você merece." text="Uma experiência desenhada para unir agilidade, segurança, atendimento humano e produtos originais." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {differentials.slice(0, 5).map(([title, text, Icon], index) => (
            <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: index * 0.05 }} whileHover={{ y: -6 }} className="rounded-[8px] border border-slate-200 bg-white p-5 text-center shadow-[0_18px_45px_rgba(6,23,47,0.06)]">
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

function Brands() {
  return (
    <section className="border-y border-slate-200 bg-white py-10">
      <div className="container-shell">
        <span className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-royal">Marcas que você confia</span>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          {brandLogos.map((brand, index) => (
            <motion.div key={brand} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="grid h-14 place-items-center rounded-[8px] bg-ice px-4 font-display text-lg font-extrabold text-royal shadow-sm">
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
    <section className="bg-ice py-16">
      <div className="container-shell grid gap-5 lg:grid-cols-4">
        <motion.article variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(6,23,47,0.06)]">
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

        <motion.article variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(6,23,47,0.06)]">
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

        <motion.article key={testimonial.name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(6,23,47,0.06)]">
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

        <motion.article variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(6,23,47,0.06)]">
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
    <section id="contato" className="bg-white py-16">
      <div className="container-shell grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-[8px] border border-slate-200 bg-ice p-7">
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
            <a href={whatsappLink("Olá, VitaFarma Antas! Quero atendimento.")} target="_blank" rel="noopener noreferrer" className="shine inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-4 font-bold text-white">
              <MessageCircle size={19} />
              Falar no WhatsApp
            </a>
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-midnight px-6 py-4 font-bold text-white">
              <MapPin size={19} />
              Como chegar
            </a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 42 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="min-h-[460px] overflow-hidden rounded-[8px] border border-slate-200 shadow-[0_22px_55px_rgba(6,23,47,0.12)]">
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
    <footer className="bg-midnight pt-12 text-white">
      <div className="container-shell grid gap-8 pb-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.35fr]">
        <div>
          <Image src="/logo-vitafarma.png" alt="VitaFarma Antas" width={170} height={90} className="h-auto w-40 brightness-0 invert" />
          <p className="mt-5 text-sm leading-6 text-white/70">Mais saúde, cuidado e praticidade para você e sua família todos os dias. Estamos sempre prontos para atender com excelência.</p>
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
        <div className="min-h-40 overflow-hidden rounded-[8px] border border-white/12">
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

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      {visible ? (
        <button type="button" aria-label="Voltar ao topo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="grid h-12 w-12 place-items-center rounded-full bg-white text-midnight shadow-lift">
          <ChevronUp size={22} />
        </button>
      ) : null}
      <a href={whatsappLink("Olá, VitaFarma Antas! Quero atendimento.")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp da VitaFarma Antas" className="grid h-14 w-14 place-items-center rounded-full bg-signal text-white shadow-glow">
        <MessageCircle size={27} />
      </a>
    </div>
  );
}

export function HomePage() {
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
      <Cursor />
      <Header />
      <main>
        <Hero />
        <BenefitsBar />
        <Products />
        <Offers />
        <Differentials />
        <Brands />
        <PharmacyHub />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
