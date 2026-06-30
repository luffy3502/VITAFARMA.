"use client";

import Image from "next/image";
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Baby,
  BadgeCheck,
  ChevronUp,
  Clock,
  HeartHandshake,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  PackageCheck,
  Pill,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Sun,
  Truck,
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
  ["Diferenciais", "#diferenciais"],
  ["Contato", "#contato"],
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
      <span className="font-display text-sm font-bold uppercase tracking-[0.22em] text-royal">{eyebrow}</span>
      <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-midnight md:text-5xl">{title}</h2>
      <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">{text}</p>
    </motion.div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const compact = useTransform(scrollY, [0, 80], [0, 1]);
  const bg = useTransform(compact, [0, 1], ["rgba(255,255,255,0)", "rgba(255,255,255,0.78)"]);
  const height = useTransform(compact, [0, 1], [88, 72]);
  const logoScale = useTransform(compact, [0, 1], [1, 0.86]);

  return (
    <motion.header
      style={{ backgroundColor: bg, height }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 backdrop-blur-xl"
    >
      <div className="container-shell flex h-full items-center justify-between gap-5">
        <a href="#inicio" className="flex items-center gap-3" aria-label="VitaFarma Antas">
          <motion.div style={{ scale: logoScale }}>
            <Image src="/logo-vitafarma.png" alt="VitaFarma Antas" width={150} height={78} priority className="h-auto w-32 md:w-40" />
          </motion.div>
        </a>

        <nav className="hidden items-center gap-7 rounded-full border border-white/35 bg-white/40 px-6 py-3 text-sm font-semibold text-midnight/80 shadow-sm backdrop-blur-xl lg:flex">
          {nav.map(([label, href]) => (
            <a key={label} href={href} className="transition hover:text-royal">
              {label}
            </a>
          ))}
        </nav>

        <a
          href={whatsappLink("Olá, VitaFarma Antas! Quero fazer um pedido.")}
          target="_blank"
          rel="noopener noreferrer"
          className="shine hidden items-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-bold text-white shadow-lift transition hover:-translate-y-0.5 lg:flex"
        >
          <MessageCircle size={18} />
          Pedir pelo WhatsApp
        </a>

        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setOpen(true)}
          className="grid h-11 w-11 place-items-center rounded-full bg-white/80 text-midnight shadow-lift lg:hidden"
        >
          <Menu size={22} />
        </button>
      </div>

      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-midnight/70 p-4 backdrop-blur-md lg:hidden"
        >
          <motion.div initial={{ x: 80 }} animate={{ x: 0 }} className="ml-auto flex h-full max-w-sm flex-col rounded-[8px] bg-white p-6 shadow-glow">
            <div className="flex items-center justify-between">
              <Image src="/logo-vitafarma.png" alt="VitaFarma Antas" width={130} height={68} className="h-auto w-32" />
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
              Pedir pelo WhatsApp
            </a>
          </motion.div>
        </motion.div>
      ) : null}
    </motion.header>
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
  const y = useTransform(scrollY, [0, 600], [0, 90]);

  return (
    <section id="inicio" className="relative min-h-[92vh] overflow-hidden bg-midnight pt-28 text-white">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=2200&q=86"
          alt="Atendimento farmacêutico moderno"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(6,23,47,0.95),rgba(6,23,47,0.72)_44%,rgba(21,88,214,0.24))]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-ice to-transparent" />

      <div className="container-shell relative z-10 grid min-h-[calc(92vh-112px)] items-center gap-12 py-14 lg:grid-cols-[1fr_430px]">
        <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }}>
          <motion.span variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-bold backdrop-blur-xl">
            <Sparkles size={16} className="text-cyan" />
            VitaFarma Antas
          </motion.span>
          <motion.h1 variants={fadeUp} className="mt-6 max-w-4xl font-display text-4xl font-extrabold leading-[1.06] text-balance md:text-6xl">
            Mais saúde, cuidado e praticidade para você todos os dias.
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-white/78 md:text-xl">
            Medicamentos, perfumaria, vitaminas e atendimento humanizado em Antas.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={whatsappLink("Olá, VitaFarma Antas! Quero fazer um pedido.")} target="_blank" rel="noopener noreferrer" className="shine inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 py-4 font-bold text-white shadow-glow transition hover:-translate-y-1">
              <MessageCircle size={20} />
              Pedir pelo WhatsApp
            </a>
            <a href="#ofertas" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/24 bg-white/12 px-7 py-4 font-bold text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/20">
              Ver Ofertas
              <ArrowRight size={19} />
            </a>
          </motion.div>
        </motion.div>

        <motion.aside initial={{ opacity: 0, x: 60, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.75, delay: 0.25 }} className="glass rounded-[8px] p-5 text-midnight">
          <div className="flex items-center gap-4 border-b border-slate-200/80 pb-5">
            <Image src="/logo-vitafarma.png" alt="VitaFarma Antas" width={120} height={64} className="h-auto w-28" />
            <div>
              <strong className="font-display text-lg">Atendimento premium</strong>
              <p className="text-sm text-slate-600">Pedido rápido pelo WhatsApp</p>
            </div>
          </div>
          <div className="grid gap-3 py-5">
            {benefits.slice(0, 4).map(([label, Icon]) => (
              <div key={label} className="flex items-center gap-3 rounded-[8px] bg-white/80 p-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-cyan/12 text-royal">
                  <Icon size={20} />
                </span>
                <span className="font-semibold">{label}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {["8k+ clientes", "3.5k entregas", "5 estrelas"].map((item) => (
              <div key={item} className="rounded-[8px] bg-midnight px-2 py-3 text-xs font-bold uppercase tracking-wide text-white">
                {item}
              </div>
            ))}
          </div>
        </motion.aside>
      </div>
    </section>
  );
}

function BenefitsBar() {
  return (
    <section aria-label="Benefícios" className="relative z-20 -mt-8">
      <div className="container-shell glass grid gap-3 rounded-[8px] p-4 md:grid-cols-5">
        {benefits.map(([label, Icon], index) => (
          <motion.div key={label} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="flex items-center gap-3 rounded-[8px] bg-white/72 p-4">
            <Icon className="shrink-0 text-royal" size={21} />
            <span className="text-sm font-bold text-midnight">{label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="sobre" className="bg-ice py-24">
      <div className="container-shell grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <motion.div initial={{ opacity: 0, x: -48 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative min-h-[520px] overflow-hidden rounded-[8px] shadow-glow">
          <Image src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=84" alt="Cuidado farmacêutico humanizado" fill sizes="(max-width: 1024px) 100vw, 46vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 rounded-[8px] border border-white/20 bg-white/18 p-5 text-white backdrop-blur-xl">
            <strong className="font-display text-2xl">Antas, Bahia</strong>
            <p className="mt-2 text-white/78">{site.address}</p>
          </div>
        </motion.div>

        <div>
          <SectionIntro
            eyebrow="Sobre"
            title="Uma farmácia pensada para simplificar sua rotina."
            text={site.description}
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Cuidado", "Atendimento próximo para orientar com responsabilidade."],
              ["Tecnologia", "Pedido por WhatsApp com resposta ágil e objetiva."],
              ["Confiança", "Produtos selecionados para cuidar melhor de você."],
            ].map(([title, text], index) => (
              <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-display text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ item, index }: { item: (typeof productCategories)[number]; index: number }) {
  const Icon = item.icon;
  return (
    <motion.article variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-70px" }} transition={{ delay: index * 0.07 }} whileHover={{ y: -8 }} className="group overflow-hidden rounded-[8px] bg-white shadow-lift">
      <div className="relative aspect-[1.35] overflow-hidden">
        <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute left-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/88 text-royal shadow-sm backdrop-blur-xl">
          <Icon size={23} />
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-bold text-midnight">{item.title}</h3>
        <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{item.description}</p>
        <a href={whatsappLink(`Olá, VitaFarma! Quero solicitar produtos da categoria ${item.title}.`)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 font-bold text-royal transition group-hover:text-signal">
          Solicitar pelo WhatsApp
          <ArrowRight size={17} />
        </a>
      </div>
    </motion.article>
  );
}

function Products() {
  return (
    <section id="produtos" className="bg-white py-24">
      <div className="container-shell">
        <SectionIntro eyebrow="Produtos" title="Vitrine premium para o cuidado de todos os dias." text="Categorias essenciais para sua saúde, beleza, bem-estar e conveniência, com atendimento direto pelo WhatsApp." align="center" />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {productCategories.map((item, index) => (
            <ProductCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Offers() {
  return (
    <section id="ofertas" className="soft-grid bg-ice py-24">
      <div className="container-shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro eyebrow="Ofertas da semana" title="Promoções atualizadas para pedir em poucos cliques." text="A seção é renderizada a partir do arquivo de ofertas. Basta atualizar o array para trocar os produtos da semana." />
          <a href={whatsappLink("Olá, VitaFarma! Quero ver todas as ofertas disponíveis.")} target="_blank" rel="noopener noreferrer" className="shine inline-flex w-fit items-center gap-2 rounded-full bg-midnight px-6 py-4 font-bold text-white shadow-lift">
            Ver todas as ofertas
            <ArrowRight size={19} />
          </a>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {ofertasSemana.map((oferta, index) => (
            <motion.article key={oferta.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: index * 0.09 }} whileHover={{ y: -8 }} className="group overflow-hidden rounded-[8px] bg-white shadow-lift">
              <div className="relative aspect-[1.22] overflow-hidden">
                <Image src={oferta.imagem} alt={oferta.nome} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute left-4 top-4 rounded-full bg-signal px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-white">{oferta.selo}</span>
              </div>
              <div className="p-6">
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-royal">{oferta.categoria}</span>
                <h3 className="mt-3 font-display text-2xl font-bold">{oferta.nome}</h3>
                <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{oferta.descricao}</p>
                <div className="mt-5 flex items-end gap-3">
                  <span className="text-sm font-semibold text-slate-400 line-through">{oferta.precoAntigo}</span>
                  <strong className="font-display text-3xl font-extrabold text-signal">{oferta.precoAtual}</strong>
                </div>
                <a href={whatsappLink(oferta.mensagemWhatsApp)} target="_blank" rel="noopener noreferrer" className="shine mt-6 flex items-center justify-center gap-2 rounded-full bg-signal px-5 py-4 font-bold text-white">
                  <MessageCircle size={19} />
                  Pedir pelo WhatsApp
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
    <section id="diferenciais" className="bg-midnight py-24 text-white">
      <div className="container-shell">
        <SectionIntro eyebrow="Diferenciais" title="Um atendimento que combina cuidado humano e agilidade." text="A experiência foi desenhada para transmitir segurança desde o primeiro contato até a confirmação do pedido." align="center" />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {differentials.map(([title, text, Icon], index) => (
            <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: index * 0.06 }} whileHover={{ y: -6 }} className="rounded-[8px] border border-white/12 bg-white/[0.06] p-6 backdrop-blur-xl">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-cyan/14 text-cyan">
                <Icon size={23} />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/66">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = ["Escolha o produto.", "Chame no WhatsApp.", "Nossa equipe confirma.", "Receba seu pedido."];
  return (
    <section className="bg-white py-24">
      <div className="container-shell">
        <SectionIntro eyebrow="Como funciona" title="Pedido simples, rápido e acompanhado pela equipe." text="O fluxo foi pensado para reduzir atrito e acelerar sua compra com atendimento humanizado." align="center" />
        <div className="mt-14 grid gap-4 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div key={step} initial={{ opacity: 0, x: index % 2 === 0 ? -32 : 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="relative rounded-[8px] border border-slate-200 bg-ice p-6">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-royal font-display text-xl font-extrabold text-white">{index + 1}</span>
              <h3 className="mt-8 font-display text-xl font-bold text-midnight">{step}</h3>
              {index < steps.length - 1 ? <ArrowRight className="absolute right-6 top-8 hidden text-cyan lg:block" /> : null}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="bg-midnight py-20">
      <div className="container-shell grid gap-10 md:grid-cols-4">
        <Counter value={8000} label="Clientes" />
        <Counter value={3500} label="Entregas" />
        <Counter value={1500} label="Produtos" />
        <div className="text-center">
          <div className="flex justify-center gap-1 text-cyan">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} size={30} fill="currentColor" />
            ))}
          </div>
          <span className="mt-3 block text-sm font-semibold uppercase tracking-[0.18em] text-white/68">Avaliação</span>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % testimonials.length), 4200);
    return () => window.clearInterval(timer);
  }, []);

  const testimonial = testimonials[active];

  return (
    <section className="bg-ice py-24">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionIntro eyebrow="Depoimentos" title="Quem compra uma vez entende o valor do atendimento." text="Avaliações inspiradas no cuidado, na rapidez e na confiança que a VitaFarma Antas deseja entregar todos os dias." />
        <motion.article key={testimonial.name} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }} className="rounded-[8px] bg-white p-7 shadow-lift">
          <div className="flex items-center gap-4">
            <Image src={testimonial.image} alt={testimonial.name} width={74} height={74} className="h-[74px] w-[74px] rounded-full object-cover" />
            <div>
              <strong className="font-display text-xl">{testimonial.name}</strong>
              <div className="mt-2 flex gap-1 text-signal">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={17} fill="currentColor" />
                ))}
              </div>
            </div>
          </div>
          <p className="mt-7 text-2xl font-semibold leading-relaxed text-midnight">“{testimonial.text}”</p>
          <div className="mt-6 flex gap-2">
            {testimonials.map((item, index) => (
              <button key={item.name} type="button" aria-label={`Ver depoimento ${index + 1}`} onClick={() => setActive(index)} className={`h-2.5 rounded-full transition-all ${active === index ? "w-10 bg-royal" : "w-2.5 bg-slate-300"}`} />
            ))}
          </div>
        </motion.article>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contato" className="bg-white py-24">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionIntro eyebrow="Contato" title="Estamos na Rua da Feira, em Antas." text="Chame pelo WhatsApp, acompanhe no Instagram ou abra o mapa para chegar com facilidade." />
          <div className="mt-8 grid gap-3">
            {[
              [MessageCircle, "WhatsApp", "Atendimento e pedidos online"],
              [Instagram, "Instagram", site.instagramHandle],
              [MapPin, "Endereço", site.address],
              [Clock, "Horário", site.hours],
            ].map(([Icon, title, text]) => {
              const TypedIcon = Icon as LucideIcon;
              return (
                <div key={String(title)} className="flex items-center gap-4 rounded-[8px] border border-slate-200 bg-ice p-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-royal">
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
        </div>
        <motion.div initial={{ opacity: 0, x: 42 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="min-h-[440px] overflow-hidden rounded-[8px] shadow-glow">
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
    <footer className="bg-white py-10">
      <div className="container-shell flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Image src="/logo-vitafarma.png" alt="VitaFarma Antas" width={150} height={78} className="h-auto w-36" />
          <p className="mt-3 text-sm text-slate-500">© {new Date().getFullYear()} VitaFarma Antas. Todos os direitos reservados.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-bold text-midnight">
          {nav.slice(1).map(([label, href]) => (
            <a key={label} href={href} className="hover:text-royal">
              {label}
            </a>
          ))}
          <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-royal">
            Instagram
          </a>
          <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-royal">
            Mapa
          </a>
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
        <About />
        <Products />
        <Offers />
        <Differentials />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <CTA />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
