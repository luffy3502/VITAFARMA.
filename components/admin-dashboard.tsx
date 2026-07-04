"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  BarChart3,
  Bell,
  Bot,
  Box,
  Briefcase,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Grid2X2,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Tag,
  Trash2,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatCurrency, type Category, type Product } from "@/data/catalogo";
import {
  type Brand,
  type AdminUser,
  type CampaignConfig,
  type Customer,
  type DashboardMetrics,
  type Order,
  deleteAdminCategory,
  deleteAdminProduct,
  deleteBrand,
  deleteCustomer,
  deleteOrder,
  fetchAdminCategories,
  fetchAdminProducts,
  fetchAdminUsers,
  ensureDefaultAdminCategories,
  fetchBrands,
  fetchCampaignConfig,
  fetchCustomers,
  fetchDashboardMetrics,
  fetchOrders,
  patchAdminProduct,
  saveAdminCategory,
  saveAdminProduct,
  saveAdminUser,
  saveBrand,
  saveCampaignConfig,
  saveCustomer,
  saveOrder,
  uploadAdminAsset,
  deleteAdminUser,
} from "@/lib/admin-service";
import { ensureAdminProfile } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";
import { whatsappLink } from "@/data/site";

type SectionKey = "dashboard" | "products" | "categories" | "brands" | "offers" | "orders" | "customers" | "campaign" | "ai" | "whatsapp" | "reports" | "settings" | "users";
type Toast = { type: "success" | "error"; message: string } | null;

const pharmacyCategoryOptions = [
  { name: "Medicamentos", icon: "Pill" },
  { name: "Gen\u00e9ricos", icon: "BadgeCheck" },
  { name: "Similares", icon: "BadgeCheck" },
  { name: "Manipulados", icon: "Pill" },
  { name: "Suplementos", icon: "Dumbbell" },
  { name: "Vitaminas", icon: "Sun" },
  { name: "Higiene Pessoal", icon: "Droplet" },
  { name: "Infantil", icon: "Baby" },
  { name: "Dermocosm\u00e9ticos", icon: "Sparkles" },
  { name: "Beleza", icon: "Sparkles" },
  { name: "Perfumaria", icon: "Heart" },
  { name: "Sa\u00fade", icon: "BadgeCheck" },
  { name: "Primeiros Socorros", icon: "Briefcase" },
  { name: "Ortop\u00e9dicos", icon: "Activity" },
  { name: "Conveni\u00eancia", icon: "ShoppingBag" },
  { name: "Mam\u00e3e e Beb\u00ea", icon: "Baby" },
  { name: "Cuidados Masculinos", icon: "User" },
  { name: "Cuidados Femininos", icon: "Heart" },
  { name: "Aparelhos de Sa\u00fade", icon: "Activity" },
  { name: "Ofertas da Semana", icon: "Tag" },
] as const;

const blankMetrics: DashboardMetrics = {
  totalProducts: 0,
  activeOffers: 0,
  todayOrders: 0,
  customers: 0,
  totalRevenue: 0,
  averageTicket: 0,
};

const blankCampaign: CampaignConfig = {
  id: "annual",
  title: "",
  description: "",
  endDate: new Date().toISOString(),
  bannerUrl: "",
  prizes: "",
  rules: "",
};

const blankCustomer: Customer = {
  id: "tmp-customer",
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  city: "",
  notes: "",
  status: "Ativo",
};

const blankOrder: Order = {
  id: "tmp-order",
  customerId: "",
  customerName: "",
  products: "",
  total: 0,
  status: "novo",
  origin: "site",
  orderedAt: new Date().toISOString(),
};

const blankAdminUser: AdminUser & { password: string } = {
  userId: `tmp-user-${Date.now()}`,
  name: "",
  email: "",
  password: "",
  role: "Administrador",
  accessType: "Administrador",
  status: "Ativo",
};

function emptyProduct(category?: Category): Product {
  return {
    id: `tmp-${Date.now()}`,
    name: "",
    description: "",
    brand: "",
    categoryId: category?.id ?? "",
    category: category?.name ?? "",
    price: 0,
    promotionalPrice: undefined,
    stock: 0,
    sku: "",
    barcode: "",
    mainImageUrl: "",
    galleryImages: [],
    videoUrl: "",
    tags: [],
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
}

function discountPercent(product: Product) {
  if (!product.promotionalPrice || product.promotionalPrice >= product.price) return 0;
  return Math.round(((product.price - product.promotionalPrice) / product.price) * 100);
}

function stockLabel(stock: number) {
  if (stock <= 0) return ["Sem estoque", "bg-red-100 text-red-600"];
  if (stock <= 12) return ["Poucas unidades", "bg-amber-100 text-amber-600"];
  return ["Em estoque", "bg-emerald-100 text-emerald-700"];
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("pt-BR");
}

function errorMessage(error: unknown) {
  if (error && typeof error === "object") {
    const payload = error as { message?: unknown; details?: unknown; hint?: unknown; code?: unknown };
    const parts = [payload.message, payload.details, payload.hint, payload.code ? `Codigo: ${payload.code}` : undefined]
      .filter((item): item is string => typeof item === "string" && Boolean(item.trim()));
    if (parts.length) return parts.join(" | ");
  }
  return error instanceof Error ? error.message : "Operacao nao concluida.";
}

function slugifyCategory(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [toast, setToast] = useState<Toast>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [metrics, setMetrics] = useState<DashboardMetrics>(blankMetrics);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [campaign, setCampaign] = useState<CampaignConfig>(blankCampaign);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [offerFilter, setOfferFilter] = useState("Todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product>(() => emptyProduct());
  const [imageUploadError, setImageUploadError] = useState("");
  const [mainImagePreviewUrl, setMainImagePreviewUrl] = useState("");
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingGalleryImages, setUploadingGalleryImages] = useState(false);
  const [categoryDraft, setCategoryDraft] = useState<Partial<Category> & { name: string }>({ name: "", icon: "Pill", isActive: true, displayOrder: 0 });
  const [brandDraft, setBrandDraft] = useState<Partial<Brand> & { name: string }>({ name: "", isActive: true });
  const [customerDraft, setCustomerDraft] = useState<Customer>(blankCustomer);
  const [orderDraft, setOrderDraft] = useState<Order>(blankOrder);
  const [adminUserDraft, setAdminUserDraft] = useState<AdminUser & { password: string }>(blankAdminUser);

  const showToast = (nextToast: Toast) => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 3600);
  };
  const previewObjectUrl = useRef<string | null>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("tab") === "usuarios") {
      setActiveSection("users");
    }
  }, []);

  useEffect(() => {
    return () => {
      if (previewObjectUrl.current) {
        URL.revokeObjectURL(previewObjectUrl.current);
      }
    };
  }, []);

  async function loadAll() {
    const [nextCategories, nextBrands, nextCustomers, nextOrders, nextCampaign, nextMetrics, nextAdminUsers] = await Promise.all([
      ensureDefaultAdminCategories(),
      fetchBrands(),
      fetchCustomers(),
      fetchOrders(),
      fetchCampaignConfig(),
      fetchDashboardMetrics(),
      fetchAdminUsers().catch((error) => {
        console.error("Erro ao carregar usuarios administrativos:", error);
        return [] as AdminUser[];
      }),
    ]);
    const nextProducts = await fetchAdminProducts(nextCategories);
    setCategories(nextCategories);
    setBrands(nextBrands);
    setCustomers(nextCustomers);
    setOrders(nextOrders);
    setAdminUsers(nextAdminUsers);
    setCampaign(nextCampaign);
    setMetrics(nextMetrics);
    setProducts(nextProducts);
    setEditing(emptyProduct(nextCategories[0]));
  }

  useEffect(() => {
    let mounted = true;

    async function boot() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/admin");
        return;
      }

      const isAdmin = await ensureAdminProfile();
      if (!isAdmin) throw new Error("Usuario sem perfil administrativo cadastrado.");
      await loadAll();
      if (mounted) setLoading(false);
    }

    boot().catch((error) => {
      console.error("Erro ao carregar painel administrativo:", error);
      showToast({ type: "error", message: errorMessage(error) });
      supabase.auth.signOut().finally(() => router.replace("/admin"));
      if (mounted) setLoading(false);
    });

    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/admin");
    });

    return () => {
      mounted = false;
      authListener.data.subscription.unsubscribe();
    };
  }, [router]);

  const listedProducts = products.filter((product) => {
    const text = `${product.name} ${product.description} ${product.brand} ${product.category}`.toLowerCase();
    return text.includes(search.toLowerCase())
      && (statusFilter === "Todos" || (statusFilter === "Ativos" ? product.isActive : !product.isActive))
      && (categoryFilter === "Todas" || product.category === categoryFilter)
      && (offerFilter === "Todos" || (offerFilter === "Ofertas" ? product.isOffer : !product.isOffer));
  });

  const weekOffers = products.filter((product) => product.isOffer || product.isWeekOffer);
  const totalOrderValue = orders.reduce((sum, order) => sum + order.total, 0);
  const salesPoints = useMemo(() => {
    const lastOrders = orders.slice(0, 18).reverse();
    if (!lastOrders.length) return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const max = Math.max(...lastOrders.map((order) => order.total), 1);
    return lastOrders.map((order) => Math.max(1, Math.round((order.total / max) * 24)));
  }, [orders]);

  const metricCards = [
    ["Produtos cadastrados", metrics.totalProducts, "Real", "Total de produtos", Briefcase, "bg-royal text-white"],
    ["Ofertas Ativas", metrics.activeOffers, "Real", "Produtos em oferta", BadgeCheck, "bg-emerald-500 text-white"],
    ["Pedidos Hoje", metrics.todayOrders, "Real", "Pedidos cadastrados hoje", ShoppingCart, "bg-signal text-white"],
    ["Clientes cadastrados", metrics.customers, "Real", "Base de clientes", Users, "bg-violet-500 text-white"],
  ] as const;

  const navItems = [
    ["Dashboard", LayoutDashboard, "dashboard"],
    ["Produtos", Grid2X2, "products"],
    ["Categorias", Box, "categories"],
    ["Marcas", Tag, "brands"],
    ["Ofertas da Semana", Sparkles, "offers"],
    ["Pedidos", ShoppingBag, "orders"],
    ["Clientes", Users, "customers"],
    ["Campanha Anual", BadgeCheck, "campaign"],
    ["IA & Chat", Bot, "ai"],
    ["WhatsApp Automa\u00e7\u00e3o", MessageCircle, "whatsapp"],
    ["Relat\u00f3rios", BarChart3, "reports"],
    ["Configura\u00e7\u00f5es", Settings, "settings"],
    ["Usu\u00e1rios", User, "users"],
  ] as const;

  async function runAction(label: string, action: () => Promise<void>, success: string) {
    setSaving(label);
    try {
      await action();
      showToast({ type: "success", message: success });
    } catch (error) {
      console.error(`Erro real na acao administrativa "${label}":`, error);
      showToast({ type: "error", message: errorMessage(error) });
    } finally {
      setSaving("");
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin");
  }

  function openNewProduct() {
    setImageUploadError("");
    setMainImagePreviewUrl("");
    setEditing(emptyProduct(categories[0]));
    setModalOpen(true);
  }

  function openEditProduct(product: Product) {
    setImageUploadError("");
    setMainImagePreviewUrl("");
    setEditing(product);
    setModalOpen(true);
  }

  async function persistEditing() {
    await runAction("product", async () => {
      if (!editing.categoryId) throw new Error("Cadastre ou selecione uma categoria antes de salvar o produto.");
      const category = categories.find((item) => item.id === editing.categoryId);
      const normalized = {
        ...editing,
        categoryId: category?.id ?? editing.categoryId,
        category: category?.name ?? editing.category,
        price: Number(editing.price) || 0,
        promotionalPrice: editing.promotionalPrice ? Number(editing.promotionalPrice) : undefined,
        stock: Number(editing.stock) || 0,
        tags: editing.tags ?? [],
        galleryImages: editing.galleryImages.filter(Boolean),
        images: [editing.mainImageUrl, ...editing.galleryImages].filter(Boolean),
        available: editing.isActive,
      };
      await saveAdminProduct(normalized);
      setProducts(await fetchAdminProducts(categories));
      setMetrics(await fetchDashboardMetrics());
      setModalOpen(false);
    }, "Produto salvo com sucesso.");
  }

  async function removeProduct(id: string) {
    if (!window.confirm("Excluir este produto?")) return;
    await runAction(`product-delete-${id}`, async () => {
      await deleteAdminProduct(id);
      setProducts((current) => current.filter((product) => product.id !== id));
      setMetrics(await fetchDashboardMetrics());
    }, "Produto excluido.");
  }

  async function updateProductPatch(product: Product, patch: Record<string, unknown>, success: string) {
    await runAction(`product-patch-${product.id}`, async () => {
      await patchAdminProduct(product.id, patch);
      const nextCategories = categories.length ? categories : await fetchAdminCategories();
      setProducts(await fetchAdminProducts(nextCategories));
      setMetrics(await fetchDashboardMetrics());
    }, success);
  }

  async function uploadMainImage(file?: File) {
    if (!file) return;
    if (previewObjectUrl.current) {
      URL.revokeObjectURL(previewObjectUrl.current);
    }

    previewObjectUrl.current = URL.createObjectURL(file);
    setMainImagePreviewUrl(previewObjectUrl.current);
    setImageUploadError("");
    setUploadingMainImage(true);

    try {
      const url = await uploadAdminAsset(file);
      setEditing((current) => ({ ...current, mainImageUrl: url }));
      setMainImagePreviewUrl("");
      showToast({ type: "success", message: "Imagem enviada." });
    } catch (error) {
      const message = errorMessage(error);
      console.error("Erro real do Supabase ao enviar imagem:", error);
      setImageUploadError(message);
      showToast({ type: "error", message });
    } finally {
      setUploadingMainImage(false);
    }
  }

  async function uploadGallery(files?: FileList | null) {
    if (!files?.length) return;
    setImageUploadError("");
    setUploadingGalleryImages(true);

    try {
      const urls = await Promise.all(Array.from(files).map((file) => uploadAdminAsset(file)));
      setEditing((current) => ({
        ...current,
        galleryImages: [...current.galleryImages, ...urls],
        images: [current.mainImageUrl, ...current.galleryImages, ...urls].filter(Boolean),
      }));
      showToast({ type: "success", message: "Galeria enviada." });
    } catch (error) {
      const message = errorMessage(error);
      console.error("Erro real do Supabase ao enviar galeria:", error);
      setImageUploadError(message);
      showToast({ type: "error", message });
    } finally {
      setUploadingGalleryImages(false);
    }
  }

  async function saveCategoryDraft() {
    await runAction("category", async () => {
      await saveAdminCategory({ ...categoryDraft, slug: categoryDraft.slug || slugifyCategory(categoryDraft.name) });
      setCategories(await fetchAdminCategories());
      setCategoryDraft({ name: "", icon: "Pill", isActive: true, displayOrder: 0 });
    }, "Categoria salva.");
  }

  async function removeCategory(id: string) {
    if (!window.confirm("Excluir esta categoria? Produtos vinculados podem impedir a exclusao.")) return;
    await runAction(`category-delete-${id}`, async () => {
      await deleteAdminCategory(id);
      setCategories((current) => current.filter((item) => item.id !== id));
    }, "Categoria excluida.");
  }

  async function saveBrandDraft() {
    await runAction("brand", async () => {
      const saved = await saveBrand(brandDraft);
      setBrands((current) => current.some((item) => item.id === saved.id) ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]);
      setBrandDraft({ name: "", isActive: true });
    }, "Marca salva.");
  }

  async function removeBrand(id: string) {
    if (!window.confirm("Excluir esta marca?")) return;
    await runAction(`brand-delete-${id}`, async () => {
      await deleteBrand(id);
      setBrands((current) => current.filter((item) => item.id !== id));
    }, "Marca excluida.");
  }

  async function saveCustomerDraft() {
    await runAction("customer", async () => {
      await saveCustomer(customerDraft);
      setCustomers(await fetchCustomers());
      setCustomerDraft(blankCustomer);
      setMetrics(await fetchDashboardMetrics());
    }, "Cliente salvo.");
  }

  async function removeCustomer(id: string) {
    if (!window.confirm("Excluir este cliente?")) return;
    await runAction(`customer-delete-${id}`, async () => {
      await deleteCustomer(id);
      setCustomers((current) => current.filter((item) => item.id !== id));
      setMetrics(await fetchDashboardMetrics());
    }, "Cliente excluido.");
  }

  async function saveOrderDraft() {
    await runAction("order", async () => {
      const saved = await saveOrder(orderDraft);
      setOrders((current) => current.some((item) => item.id === saved.id) ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]);
      setOrderDraft({ ...blankOrder, id: `tmp-order-${Date.now()}`, orderedAt: new Date().toISOString() });
      setMetrics(await fetchDashboardMetrics());
    }, "Pedido salvo.");
  }

  async function removeOrder(id: string) {
    if (!window.confirm("Excluir este pedido?")) return;
    await runAction(`order-delete-${id}`, async () => {
      await deleteOrder(id);
      setOrders((current) => current.filter((item) => item.id !== id));
      setMetrics(await fetchDashboardMetrics());
    }, "Pedido excluido.");
  }

  async function saveCampaignDraft() {
    await runAction("campaign", async () => {
      setCampaign(await saveCampaignConfig(campaign));
    }, "Campanha salva.");
  }

  async function saveAdminUserDraft() {
    await runAction("admin-user", async () => {
      const saved = await saveAdminUser(adminUserDraft);
      setAdminUsers((current) => current.some((item) => item.userId === saved.userId) ? current.map((item) => item.userId === saved.userId ? saved : item) : [saved, ...current]);
      setAdminUserDraft({ ...blankAdminUser, userId: `tmp-user-${Date.now()}`, password: "" });
    }, "Usuario salvo com sucesso.");
  }

  async function deactivateAdminUser(user: AdminUser) {
    await runAction(`admin-user-status-${user.userId}`, async () => {
      const saved = await saveAdminUser({ ...user, status: user.status === "Ativo" ? "Inativo" : "Ativo" });
      setAdminUsers((current) => current.map((item) => item.userId === saved.userId ? saved : item));
    }, user.status === "Ativo" ? "Usuario desativado." : "Usuario ativado.");
  }

  async function removeAdminUser(userId: string) {
    if (!window.confirm("Excluir este usuario administrativo?")) return;
    await runAction(`admin-user-delete-${userId}`, async () => {
      await deleteAdminUser(userId);
      setAdminUsers((current) => current.filter((user) => user.userId !== userId));
    }, "Usuario excluido.");
  }

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-ice font-display text-xl font-extrabold text-royal">Carregando painel...</div>;
  }

  return (
    <main className="min-h-screen bg-[#f7faff] text-midnight">
      {toast ? <div className={`fixed right-5 top-5 z-[120] rounded-[8px] px-4 py-3 text-sm font-bold text-white shadow-glow ${toast.type === "success" ? "bg-emerald-500" : "bg-signal"}`}>{toast.message}</div> : null}
      {sidebarOpen ? <button aria-label="Fechar menu" className="fixed inset-0 z-40 bg-midnight/45 lg:hidden" onClick={() => setSidebarOpen(false)} /> : null}
      <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen max-h-screen flex-col overflow-hidden border-r border-slate-200 bg-white px-4 py-4 shadow-[18px_0_50px_rgba(6,23,47,0.06)] transition-all duration-300 ${collapsed ? "lg:w-[84px]" : "lg:w-[260px]"} ${sidebarOpen ? "w-[260px] translate-x-0" : "w-[260px] -translate-x-full lg:translate-x-0"}`}>
        <div className={`flex shrink-0 items-center gap-3 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed ? <Image src="/logo-vitafarma.png" alt="VitaFarma" width={132} height={70} className="h-auto w-32" /> : <Image src="/logo-vitafarma.png" alt="VitaFarma" width={40} height={40} className="h-10 w-10 object-contain" />}
          <button type="button" className="grid h-9 w-9 place-items-center rounded-[8px] bg-ice text-slate-600 lg:hidden" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
        </div>
        <button type="button" onClick={() => setCollapsed((value) => !value)} title={collapsed ? "Expandir menu" : "Recolher menu"} className={`mt-3 hidden h-8 items-center rounded-[8px] border border-slate-200 bg-ice text-xs font-extrabold text-slate-600 transition hover:border-royal/30 hover:bg-royal/5 hover:text-royal lg:flex ${collapsed ? "justify-center px-0" : "justify-between px-2.5"}`}>{collapsed ? <ChevronRight size={15} /> : <><span>Recolher</span><ChevronLeft size={15} /></>}</button>
        <nav className="mt-4 grid flex-1 content-start gap-1 overflow-y-auto pr-1 text-sm font-bold text-slate-500 [scrollbar-color:#bdd0f4_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-royal/25 [&::-webkit-scrollbar-thumb:hover]:bg-royal/45 [&::-webkit-scrollbar-track]:bg-transparent">
          {navItems.map(([label, Icon, key]) => {
            const TypedIcon = Icon as typeof LayoutDashboard;
            const active = activeSection === key;
            return (
              <button key={label} type="button" title={collapsed ? label : undefined} onClick={() => { setActiveSection(key); setSidebarOpen(false); }} className={`flex min-h-10 w-full items-center gap-3 rounded-[8px] px-3 text-left transition hover:bg-ice hover:text-royal ${collapsed ? "justify-center px-0" : ""} ${active ? "bg-royal text-white shadow-[0_12px_24px_rgba(21,88,214,0.22)] hover:bg-royal hover:text-white" : ""}`}>
                <TypedIcon className="shrink-0" size={17} />
                {!collapsed ? <span className="min-w-0 flex-1 truncate">{label}</span> : null}
                {!collapsed && label === "Campanha Anual" ? <span className="rounded-full bg-signal px-2 py-1 text-[10px] text-white">NOVO</span> : null}
              </button>
            );
          })}
        </nav>
        <button onClick={logout} title={collapsed ? "Sair" : undefined} className={`mt-3 flex min-h-10 shrink-0 items-center gap-3 rounded-[8px] px-3 text-sm font-bold text-slate-500 hover:bg-ice hover:text-signal ${collapsed ? "justify-center px-0" : ""}`}><LogOut className="shrink-0" size={18} />{!collapsed ? "Sair" : null}</button>
      </aside>

      <section className={`transition-all duration-300 ${collapsed ? "lg:pl-[84px]" : "lg:pl-[260px]"}`}>
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/92 px-4 py-4 backdrop-blur-xl md:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <button className="grid h-11 w-11 place-items-center rounded-[8px] bg-ice lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
              <h1 className="font-display text-2xl font-extrabold">Painel Administrativo</h1>
            </div>
            <div className="flex flex-1 flex-col gap-3 sm:flex-row xl:max-w-2xl">
              <label className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar produtos, pedidos, clientes..." className="h-12 w-full rounded-[8px] border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold outline-none focus:border-royal" />
              </label>
              <button className="relative grid h-12 w-12 place-items-center rounded-[8px] border border-slate-200 bg-white"><Bell size={18} /><span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-signal text-[10px] font-extrabold text-white">{orders.length}</span></button>
              <div className="flex h-12 items-center gap-3 rounded-[8px] border border-slate-200 bg-white px-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-royal text-white"><User size={18} /></span>
                <div className="hidden sm:block"><strong className="block text-sm">Vita Farma</strong><span className="text-xs text-slate-500">Administrador</span></div>
              </div>
              <button onClick={logout} className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-600 transition hover:border-signal/30 hover:bg-signal/5 hover:text-signal"><LogOut size={17} />Sair</button>
            </div>
          </div>
        </header>

        <div id="dashboard" className="grid gap-6 p-4 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metricCards.map(([title, value, change, subtitle, Icon, iconClass]) => (
              <motion.article key={title} whileHover={{ y: -4 }} className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_16px_34px_rgba(6,23,47,0.055)]">
                <div className="flex items-start justify-between gap-4">
                  <div><span className="text-sm font-bold text-slate-500">{title}</span><div className="mt-3 flex items-center gap-3"><strong className="font-display text-3xl font-extrabold">{Number(value).toLocaleString("pt-BR")}</strong><span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-extrabold text-emerald-700">{change}</span></div><span className="mt-2 block text-sm text-slate-500">{subtitle}</span></div>
                  <span className={`grid h-14 w-14 place-items-center rounded-[8px] ${iconClass}`}><Icon size={24} /></span>
                </div>
              </motion.article>
            ))}
          </div>

          {activeSection === "dashboard" || activeSection === "products" ? (
            <ProductsSection
              products={listedProducts}
              categories={categories}
              statusFilter={statusFilter}
              categoryFilter={categoryFilter}
              offerFilter={offerFilter}
              setStatusFilter={setStatusFilter}
              setCategoryFilter={setCategoryFilter}
              setOfferFilter={setOfferFilter}
              openNewProduct={openNewProduct}
              openEditProduct={openEditProduct}
              removeProduct={removeProduct}
              toggleProduct={(product) => updateProductPatch(product, { is_active: !product.isActive }, "Status atualizado.")}
            />
          ) : null}

          {activeSection === "dashboard" ? (
            <div className="grid gap-6 xl:grid-cols-[1fr_470px]">
              <SummarySection orders={orders} salesPoints={salesPoints} totalOrderValue={totalOrderValue} averageTicket={metrics.averageTicket} />
              <QuickActions openNewProduct={openNewProduct} setActiveSection={setActiveSection} />
            </div>
          ) : null}

          {activeSection === "offers" ? (
            <OffersSection products={weekOffers} setProducts={setProducts} saveProduct={(product) => runAction(`offer-${product.id}`, async () => {
              const saved = await saveAdminProduct(product);
              setProducts((current) => current.map((item) => item.id === saved.id ? saved : item));
              setMetrics(await fetchDashboardMetrics());
            }, "Oferta atualizada.")} />
          ) : null}

          {activeSection === "categories" ? (
            <CategoriesSection categories={categories} draft={categoryDraft} setDraft={setCategoryDraft} save={saveCategoryDraft} remove={removeCategory} saving={saving === "category"} />
          ) : null}

          {activeSection === "brands" ? (
            <SimpleCrudSection title="Marcas" draft={brandDraft} setDraft={setBrandDraft} onSave={saveBrandDraft} saving={saving === "brand"} rows={brands} columns={["Nome", "Slug", "Status"]} renderRow={(brand) => [brand.name, brand.slug, brand.isActive ? "Ativa" : "Inativa"]} onEdit={(brand) => setBrandDraft(brand)} onDelete={(brand) => removeBrand(brand.id)} />
          ) : null}

          {activeSection === "customers" ? (
            <CustomersSection customers={customers} draft={customerDraft} setDraft={setCustomerDraft} save={saveCustomerDraft} remove={removeCustomer} saving={saving === "customer"} />
          ) : null}

          {activeSection === "orders" ? (
            <OrdersSection orders={orders} customers={customers} draft={orderDraft} setDraft={setOrderDraft} save={saveOrderDraft} remove={removeOrder} saving={saving === "order"} />
          ) : null}

          {activeSection === "campaign" ? (
            <CampaignSection campaign={campaign} setCampaign={setCampaign} save={saveCampaignDraft} uploadBanner={(file) => runAction("campaign-banner", async () => {
              const bannerUrl = await uploadAdminAsset(file, "campaign");
              setCampaign((current) => ({ ...current, bannerUrl }));
            }, "Banner enviado.")} saving={saving === "campaign"} />
          ) : null}

          {activeSection === "ai" ? (
            <AIChatSection />
          ) : null}

          {activeSection === "whatsapp" ? (
            <WhatsAppAutomationSection />
          ) : null}

          {activeSection === "reports" ? (
            <ReportsSection products={products} orders={orders} customers={customers} metrics={metrics} />
          ) : null}

          {activeSection === "settings" ? (
            <SettingsSection />
          ) : null}

          {activeSection === "users" ? (
            <AdminUsersSection
              users={adminUsers}
              draft={adminUserDraft}
              setDraft={setAdminUserDraft}
              save={saveAdminUserDraft}
              toggleStatus={deactivateAdminUser}
              remove={removeAdminUser}
              saving={saving === "admin-user"}
            />
          ) : null}
        </div>
      </section>

      {modalOpen ? (
        <ProductModal
          product={editing}
          setProduct={setEditing}
          categories={categories}
          brands={brands}
          close={() => {
            setImageUploadError("");
            setMainImagePreviewUrl("");
            setModalOpen(false);
          }}
          save={persistEditing}
          saving={saving === "product" || uploadingMainImage || uploadingGalleryImages}
          uploadMainImage={uploadMainImage}
          uploadGallery={uploadGallery}
          imageUploadError={imageUploadError}
          mainImagePreviewUrl={mainImagePreviewUrl}
          uploadingMainImage={uploadingMainImage}
          uploadingGalleryImages={uploadingGalleryImages}
        />
      ) : null}
    </main>
  );
}

function ProductsSection({ products, categories, statusFilter, categoryFilter, offerFilter, setStatusFilter, setCategoryFilter, setOfferFilter, openNewProduct, openEditProduct, removeProduct, toggleProduct }: {
  products: Product[];
  categories: Category[];
  statusFilter: string;
  categoryFilter: string;
  offerFilter: string;
  setStatusFilter: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  setOfferFilter: (value: string) => void;
  openNewProduct: () => void;
  openEditProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  toggleProduct: (product: Product) => void;
}) {
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white shadow-[0_16px_34px_rgba(6,23,47,0.055)]">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
        <h2 className="font-display text-xl font-extrabold">Produtos recentes</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={openNewProduct} className="shine inline-flex min-h-10 items-center gap-2 rounded-[8px] bg-royal px-4 text-sm font-extrabold text-white"><Plus size={17} />Novo Produto</button>
        </div>
      </div>
      <div className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-3">
        <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-10 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold"><option>Todas</option>{categories.map((category) => <option key={category.id}>{category.name}</option>)}</select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold"><option>Todos</option><option>Ativos</option><option>Inativos</option></select>
        <select value={offerFilter} onChange={(event) => setOfferFilter(event.target.value)} className="h-10 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold"><option>Todos</option><option>Ofertas</option><option>Sem oferta</option></select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="text-xs font-extrabold uppercase tracking-[0.08em] text-slate-400"><tr><th className="px-5 py-4">Produto</th><th>Categoria</th><th>Preco</th><th>Estoque</th><th>Status</th><th>Acoes</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {products.length ? products.slice(0, 20).map((product) => {
              const [label, className] = stockLabel(product.stock);
              return (
                <tr key={product.id} className="hover:bg-ice/70">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="relative h-12 w-12 overflow-hidden rounded-[8px] bg-ice"><Image src={product.mainImageUrl || "/logo-vitafarma.png"} alt={product.name} fill sizes="48px" className="object-cover" /></div><div><strong className="block">{product.name}</strong><span className="text-xs text-slate-500">{product.description.slice(0, 34) || product.brand}</span></div></div></td>
                  <td><span className="rounded-full bg-royal/10 px-3 py-1 text-xs font-extrabold text-royal">{product.category || "-"}</span></td>
                  <td className="font-bold">{formatCurrency(product.promotionalPrice ?? product.price)}</td>
                  <td><span className={`rounded-full px-3 py-1 text-xs font-extrabold ${className}`}>{label}</span></td>
                  <td><button onClick={() => toggleProduct(product)} className={`h-6 w-11 rounded-full p-1 transition ${product.isActive ? "bg-royal" : "bg-slate-300"}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${product.isActive ? "translate-x-5" : ""}`} /></button></td>
                  <td><div className="flex gap-2"><button onClick={() => openEditProduct(product)} className="grid h-9 w-9 place-items-center rounded-[8px] bg-ice text-royal"><Edit3 size={16} /></button><button onClick={() => removeProduct(product.id)} className="grid h-9 w-9 place-items-center rounded-[8px] bg-ice text-signal"><Trash2 size={16} /></button></div></td>
                </tr>
              );
            }) : <tr><td colSpan={6} className="px-5 py-10 text-center text-sm font-bold text-slate-400">Nenhum produto cadastrado ainda.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SummarySection({ orders, salesPoints, totalOrderValue, averageTicket }: { orders: Order[]; salesPoints: number[]; totalOrderValue: number; averageTicket: number }) {
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_16px_34px_rgba(6,23,47,0.055)]">
      <div className="flex items-center justify-between"><h2 className="font-display text-xl font-extrabold">Resumo de vendas</h2><span className="text-sm font-bold text-slate-500">Dados reais</span></div>
      <svg viewBox="0 0 720 220" className="mt-5 h-[220px] w-full"><path d={salesPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${30 + i * 39} ${190 - p * 6}`).join(" ")} fill="none" stroke="#1558d6" strokeWidth="4" strokeLinecap="round" /></svg>
      <div className="grid gap-3 text-sm font-bold text-slate-500 sm:grid-cols-4"><span>Vendas {formatCurrency(totalOrderValue)}</span><span>Pedidos {orders.length}</span><span>Ticket medio {formatCurrency(averageTicket)}</span><span>{orders.length ? "Com dados reais" : "Sem pedidos ainda"}</span></div>
    </section>
  );
}

function QuickActions({ openNewProduct, setActiveSection }: { openNewProduct: () => void; setActiveSection: (section: SectionKey) => void }) {
  const actions = [["Novo produto", Briefcase, openNewProduct], ["Nova oferta", BadgeCheck, () => setActiveSection("offers")], ["Ver pedidos", ShoppingCart, () => setActiveSection("orders")], ["Clientes", Users, () => setActiveSection("customers")], ["Campanha", MessageCircle, () => setActiveSection("campaign")], ["Relatorios", BarChart3, () => setActiveSection("reports")]] as const;
  return <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_16px_34px_rgba(6,23,47,0.055)]"><h2 className="font-display text-xl font-extrabold">Acoes rapidas</h2><div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">{actions.map(([label, Icon, action]) => <button key={label} onClick={action} className="grid min-h-24 place-items-center rounded-[8px] bg-ice p-3 text-center text-sm font-extrabold transition hover:-translate-y-1 hover:bg-royal hover:text-white"><Icon size={24} />{label}</button>)}</div></section>;
}

function OffersSection({ products, setProducts, saveProduct }: { products: Product[]; setProducts: React.Dispatch<React.SetStateAction<Product[]>>; saveProduct: (product: Product) => Promise<void> }) {
  return <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_16px_34px_rgba(6,23,47,0.055)]"><h2 className="font-display text-xl font-extrabold">Ofertas da Semana</h2><div className="mt-4 divide-y divide-slate-100 rounded-[8px] border border-slate-100">{products.length ? products.map((product) => <div key={product.id} className="grid gap-3 p-3 md:grid-cols-[54px_1fr_180px_auto] md:items-center"><div className="relative h-12 w-12 rounded-[8px] bg-ice"><Image src={product.mainImageUrl || "/logo-vitafarma.png"} alt={product.name} fill sizes="48px" className="object-cover" /></div><div><strong className="block text-sm">{product.name}</strong><span className="text-xs text-slate-400 line-through">{formatCurrency(product.price)}</span> <strong>{formatCurrency(product.promotionalPrice ?? product.price)}</strong></div><input type="number" value={product.promotionalPrice ?? ""} onChange={(event) => setProducts((current) => current.map((item) => item.id === product.id ? { ...item, promotionalPrice: event.target.value ? Number(event.target.value) : undefined, isOffer: true, isWeekOffer: true } : item))} placeholder="Preco promocional" className="h-10 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold" /><div className="flex items-center gap-2"><span className="rounded-full bg-red-100 px-2 py-1 text-xs font-extrabold text-signal">-{discountPercent(product)}%</span><button onClick={() => saveProduct({ ...product, isOffer: true, isWeekOffer: true })} className="h-9 rounded-[8px] bg-royal px-3 text-xs font-extrabold text-white">Salvar</button><a href={whatsappLink(`Ola! Tenho interesse no produto: ${product.name} por ${formatCurrency(product.promotionalPrice ?? product.price)}`)} className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500 text-white"><MessageCircle size={17} /></a></div></div>) : <div className="p-8 text-center text-sm font-bold text-slate-400">Nenhuma oferta marcada ainda.</div>}</div></section>;
}

function CategoriesSection({ categories, draft, setDraft, save, remove, saving }: { categories: Category[]; draft: Partial<Category> & { name: string }; setDraft: (value: Partial<Category> & { name: string }) => void; save: () => void; remove: (id: string) => void; saving: boolean }) {
  const editing = Boolean(draft.id && !draft.id.startsWith("tmp-"));
  const presetNames = new Set<string>(pharmacyCategoryOptions.map((category) => category.name));
  const existingSlugs = new Set(categories.filter((category) => category.id !== draft.id).map((category) => category.slug));
  const isCustomDraft = Boolean(draft.name && !presetNames.has(draft.name));
  const [customMode, setCustomMode] = useState(isCustomDraft);
  const selectedPreset = pharmacyCategoryOptions.find((category) => category.name === draft.name);
  const draftSlug = draft.slug || (draft.name ? slugifyCategory(draft.name) : "");

  useEffect(() => {
    if (isCustomDraft) setCustomMode(true);
  }, [isCustomDraft]);

  function selectPreset(name: string) {
    const preset = pharmacyCategoryOptions.find((category) => category.name === name);
    setDraft({
      ...draft,
      name,
      slug: name ? slugifyCategory(name) : "",
      icon: preset?.icon ?? "Pill",
      displayOrder: preset ? pharmacyCategoryOptions.findIndex((category) => category.name === preset.name) + 1 : 0,
    });
  }

  function startCustomCategory() {
    setCustomMode(true);
    setDraft({ name: "", slug: "", icon: "Pill", isActive: true, displayOrder: categories.length + 1 });
  }

  function startPresetCategory() {
    setCustomMode(false);
    setDraft({ name: "", slug: "", icon: "Pill", isActive: true, displayOrder: 0 });
  }

  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_16px_34px_rgba(6,23,47,0.055)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-xl font-extrabold">Categorias</h2>
        <span className="text-sm font-bold text-slate-500">{categories.length} categorias no Supabase</span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={startPresetCategory} className={`min-h-9 rounded-[8px] px-4 text-xs font-extrabold ${customMode ? "border border-slate-200 text-slate-600 hover:border-royal/30 hover:text-royal" : "bg-royal text-white"}`}>Categorias prontas</button>
        <button type="button" onClick={startCustomCategory} className={`min-h-9 rounded-[8px] px-4 text-xs font-extrabold ${customMode ? "bg-royal text-white" : "border border-slate-200 text-slate-600 hover:border-royal/30 hover:text-royal"}`}>Criar categoria personalizada</button>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(240px,1fr)_180px_150px_120px_140px_auto]">
        {customMode ? (
          <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value, slug: slugifyCategory(event.target.value) })} placeholder="Nome personalizado" className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-royal" />
        ) : (
          <CategoryPresetDropdown value={selectedPreset?.name ?? ""} options={pharmacyCategoryOptions} existingSlugs={existingSlugs} onChange={selectPreset} />
        )}
        <input value={draftSlug} readOnly placeholder="slug" className="h-11 rounded-[8px] border border-slate-200 bg-ice px-3 text-sm font-semibold text-slate-500 outline-none" />
        <input value={draft.icon ?? "Pill"} onChange={(event) => setDraft({ ...draft, icon: event.target.value })} placeholder="Icone" className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-royal" />
        <input type="number" value={draft.displayOrder ?? 0} onChange={(event) => setDraft({ ...draft, displayOrder: Number(event.target.value) })} placeholder="Ordem" className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-royal" />
        <select value={String(draft.isActive ?? true)} onChange={(event) => setDraft({ ...draft, isActive: event.target.value === "true" })} className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-royal">
          <option value="true">Ativa</option>
          <option value="false">Inativa</option>
        </select>
        <button onClick={save} disabled={saving || !draft.name.trim()} className="min-h-11 rounded-[8px] bg-royal px-5 text-sm font-extrabold text-white disabled:opacity-60">{saving ? "Salvando..." : editing ? "Salvar" : "Criar"}</button>
      </div>
      {editing ? <button onClick={startPresetCategory} className="mt-3 min-h-9 rounded-[8px] border border-slate-200 px-4 text-xs font-extrabold text-slate-600 hover:border-royal/30 hover:text-royal">Nova categoria</button> : null}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="text-xs font-extrabold uppercase text-slate-400"><tr><th className="px-4 py-3">Nome</th><th>Icone</th><th>Ordem</th><th>Slug</th><th>Status</th><th>Acoes</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {categories.length ? categories.map((category) => (
              <tr key={category.id} className="hover:bg-ice/70">
                <td className="px-4 py-3 font-semibold">{category.name}</td>
                <td className="font-semibold">{category.icon}</td>
                <td className="font-semibold">{category.displayOrder ?? 0}</td>
                <td className="font-semibold text-slate-500">{category.slug}</td>
                <td><span className={`rounded-full px-3 py-1 text-xs font-extrabold ${category.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{category.isActive ? "Ativa" : "Inativa"}</span></td>
                <td><div className="flex gap-2"><button onClick={() => { setCustomMode(!presetNames.has(String(category.name))); setDraft(category); }} className="grid h-9 w-9 place-items-center rounded-[8px] bg-ice text-royal"><Edit3 size={16} /></button><button onClick={() => remove(category.id)} className="grid h-9 w-9 place-items-center rounded-[8px] bg-ice text-signal"><Trash2 size={16} /></button></div></td>
              </tr>
            )) : <tr><td colSpan={6} className="px-4 py-8 text-center font-bold text-slate-400">As categorias padrao serao criadas automaticamente ao carregar esta tela.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CategoryPresetDropdown({ value, options, existingSlugs, onChange }: { value: string; options: readonly { name: string; icon: string }[]; existingSlugs: Set<string>; onChange: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((category) => category.name === value);

  function choose(name: string) {
    onChange(name);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((current) => !current)} className={`flex h-11 w-full items-center justify-between gap-3 rounded-[8px] border bg-white px-3 text-left text-sm font-bold outline-none transition ${open ? "border-royal shadow-[0_0_0_3px_rgba(21,88,214,0.12)]" : "border-slate-200 hover:border-royal/40"}`}>
        <span className={selected ? "truncate text-midnight" : "truncate text-slate-400"}>{selected?.name ?? "Selecione uma categoria"}</span>
        <ChevronDown size={17} className={`shrink-0 text-slate-400 transition ${open ? "rotate-180 text-royal" : ""}`} />
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-[0_22px_48px_rgba(6,23,47,0.16)]">
          <div className="max-h-[282px] overflow-y-auto p-1.5 [scrollbar-color:#1558d6_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-royal/45 [&::-webkit-scrollbar-track]:bg-transparent">
            <button type="button" onClick={() => choose("")} className="flex min-h-10 w-full items-center justify-between rounded-[8px] px-3 text-left text-sm font-bold text-slate-500 transition hover:bg-ice hover:text-royal">
              Selecione uma categoria
            </button>
            {options.map((category) => {
              const slug = slugifyCategory(category.name);
              const disabled = existingSlugs.has(slug) && category.name !== value;
              const active = category.name === value;
              return (
                <button key={category.name} type="button" disabled={disabled} onClick={() => choose(category.name)} className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-[8px] px-3 text-left text-sm font-bold transition ${active ? "bg-royal text-white" : "text-midnight hover:bg-ice hover:text-royal"} ${disabled ? "cursor-not-allowed opacity-45 hover:bg-transparent hover:text-midnight" : ""}`}>
                  <span className="truncate">{category.name}</span>
                  {disabled ? <span className="shrink-0 text-[10px] font-extrabold uppercase text-slate-400">cadastrada</span> : active ? <Check size={16} className="shrink-0" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SimpleCrudSection<T extends { id: string; name: string; isActive: boolean }>({ title, draft, setDraft, onSave, saving, rows, columns, renderRow, onEdit, onDelete }: { title: string; draft: Partial<T> & { name: string }; setDraft: (value: Partial<T> & { name: string }) => void; onSave: () => void; saving: boolean; rows: T[]; columns: string[]; renderRow: (row: T) => string[]; onEdit: (row: T) => void; onDelete: (row: T) => void }) {
  return <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_16px_34px_rgba(6,23,47,0.055)]"><div className="flex items-center justify-between"><h2 className="font-display text-xl font-extrabold">{title}</h2></div><div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px_auto]"><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder={`Nome de ${title.toLowerCase()}`} className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold" /><select value={String(draft.isActive ?? true)} onChange={(event) => setDraft({ ...draft, isActive: event.target.value === "true" } as Partial<T> & { name: string })} className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold"><option value="true">Ativo</option><option value="false">Inativo</option></select><button onClick={onSave} disabled={saving || !draft.name.trim()} className="min-h-11 rounded-[8px] bg-royal px-5 text-sm font-extrabold text-white disabled:opacity-60">{saving ? "Salvando..." : "Salvar"}</button></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="text-xs font-extrabold uppercase text-slate-400"><tr>{columns.map((column) => <th key={column} className="px-4 py-3">{column}</th>)}<th>Acoes</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.length ? rows.map((row) => <tr key={row.id} className="hover:bg-ice/70">{renderRow(row).map((cell, index) => <td key={index} className="px-4 py-3 font-semibold">{cell}</td>)}<td><div className="flex gap-2"><button onClick={() => onEdit(row)} className="grid h-9 w-9 place-items-center rounded-[8px] bg-ice text-royal"><Edit3 size={16} /></button><button onClick={() => onDelete(row)} className="grid h-9 w-9 place-items-center rounded-[8px] bg-ice text-signal"><Trash2 size={16} /></button></div></td></tr>) : <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center font-bold text-slate-400">Nenhum registro cadastrado.</td></tr>}</tbody></table></div></section>;
}

function AdminUsersSection({ users, draft, setDraft, save, toggleStatus, remove, saving }: { users: AdminUser[]; draft: AdminUser & { password: string }; setDraft: React.Dispatch<React.SetStateAction<AdminUser & { password: string }>>; save: () => void; toggleStatus: (user: AdminUser) => void; remove: (userId: string) => void; saving: boolean }) {
  const editing = !draft.userId.startsWith("tmp-");

  return <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_16px_34px_rgba(6,23,47,0.055)]"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><h2 className="font-display text-xl font-extrabold">Usuarios do painel</h2><span className="text-sm font-bold text-slate-500">Apenas administradores podem criar novos acessos.</span></div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3"><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Nome" className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold" /><input value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} placeholder="E-mail" type="email" className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold" /><input value={draft.password} onChange={(event) => setDraft({ ...draft, password: event.target.value })} placeholder={editing ? "Nova senha opcional" : "Senha"} type="password" className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold" /><input value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value })} placeholder="Cargo" className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold" /><select value={draft.accessType} onChange={(event) => setDraft({ ...draft, accessType: event.target.value as AdminUser["accessType"], role: draft.role || event.target.value })} className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold"><option>Administrador</option><option value="Funcionario">Funcionário</option><option>Operador</option></select><select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as AdminUser["status"] })} className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold"><option>Ativo</option><option>Inativo</option></select></div><div className="mt-4 flex flex-wrap gap-3"><button onClick={save} disabled={saving || !draft.name.trim() || !draft.email.trim() || (!editing && !draft.password.trim())} className="min-h-11 rounded-[8px] bg-royal px-5 text-sm font-extrabold text-white disabled:opacity-60">{saving ? "Salvando..." : editing ? "Salvar usuario" : "Cadastrar usuario"}</button>{editing ? <button onClick={() => setDraft({ ...blankAdminUser, userId: `tmp-user-${Date.now()}`, password: "" })} className="min-h-11 rounded-[8px] border border-slate-200 px-5 text-sm font-extrabold">Novo cadastro</button> : null}</div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="text-xs font-extrabold uppercase text-slate-400"><tr><th className="px-4 py-3">Nome</th><th className="px-4 py-3">E-mail</th><th className="px-4 py-3">Cargo</th><th className="px-4 py-3">Acesso</th><th className="px-4 py-3">Status</th><th>Acoes</th></tr></thead><tbody className="divide-y divide-slate-100">{users.length ? users.map((user) => <tr key={user.userId} className="hover:bg-ice/70"><td className="px-4 py-3 font-semibold">{user.name}</td><td className="px-4 py-3 font-semibold">{user.email}</td><td className="px-4 py-3 font-semibold">{user.role || "-"}</td><td className="px-4 py-3 font-semibold">{user.accessType === "Funcionario" ? "Funcionário" : user.accessType}</td><td className="px-4 py-3"><span className={`rounded-full px-3 py-1 text-xs font-extrabold ${user.status === "Ativo" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{user.status}</span></td><td><div className="flex gap-2"><button onClick={() => setDraft({ ...user, password: "" })} className="grid h-9 w-9 place-items-center rounded-[8px] bg-ice text-royal"><Edit3 size={16} /></button><button onClick={() => toggleStatus(user)} className="h-9 rounded-[8px] bg-ice px-3 text-xs font-extrabold text-slate-600">{user.status === "Ativo" ? "Desativar" : "Ativar"}</button><button onClick={() => remove(user.userId)} className="grid h-9 w-9 place-items-center rounded-[8px] bg-ice text-signal"><Trash2 size={16} /></button></div></td></tr>) : <tr><td colSpan={6} className="px-4 py-8 text-center font-bold text-slate-400">Nenhum usuario cadastrado.</td></tr>}</tbody></table></div></section>;
}

function CustomersSection({ customers, draft, setDraft, save, remove, saving }: { customers: Customer[]; draft: Customer; setDraft: (customer: Customer) => void; save: () => void; remove: (id: string) => void; saving: boolean }) {
  return <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_16px_34px_rgba(6,23,47,0.055)]"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><h2 className="font-display text-xl font-extrabold">Clientes</h2><span className="text-sm font-bold text-slate-500">{customers.length ? `${customers.length} clientes reais` : "Nenhum cliente cadastrado"}</span></div><div className="mt-5 grid gap-3 md:grid-cols-3"><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Nome" className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold" /><input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} placeholder="Telefone" className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold" /><input value={draft.whatsapp} onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value })} placeholder="WhatsApp" className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold" /><input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="Email" className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold" /><input value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} placeholder="Cidade" className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold" /><select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Customer["status"] })} className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold"><option>Ativo</option><option>Inativo</option></select><textarea value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} placeholder="Observacoes" className="rounded-[8px] border border-slate-200 px-3 py-3 text-sm font-semibold md:col-span-2" /><button onClick={save} disabled={saving || !draft.name.trim()} className="min-h-11 rounded-[8px] bg-royal px-5 text-sm font-extrabold text-white disabled:opacity-60">{saving ? "Salvando..." : "Salvar cliente"}</button></div><DataRows rows={customers} empty="Nenhum cliente cadastrado." columns={["Nome", "WhatsApp", "Email", "Cidade", "Status"]} renderRow={(customer) => [customer.name, customer.whatsapp || customer.phone, customer.email, customer.city, customer.status]} onEdit={(customer) => setDraft(customer)} onDelete={(customer) => remove(customer.id)} /></section>;
}

function OrdersSection({ orders, customers, draft, setDraft, save, remove, saving }: { orders: Order[]; customers: Customer[]; draft: Order; setDraft: (order: Order) => void; save: () => void; remove: (id: string) => void; saving: boolean }) {
  return <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_16px_34px_rgba(6,23,47,0.055)]"><h2 className="font-display text-xl font-extrabold">Pedidos</h2><div className="mt-5 grid gap-3 md:grid-cols-3"><select value={draft.customerId} onChange={(e) => setDraft({ ...draft, customerId: e.target.value })} className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold"><option value="">Cliente avulso</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select><input type="number" value={draft.total || ""} onChange={(e) => setDraft({ ...draft, total: Number(e.target.value) })} placeholder="Valor total" className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold" /><select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })} className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold"><option value="novo">Novo</option><option value="separando">Separando</option><option value="entregue">Entregue</option><option value="cancelado">Cancelado</option></select><select value={draft.origin} onChange={(e) => setDraft({ ...draft, origin: e.target.value })} className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold"><option value="site">Site</option><option value="whatsapp">WhatsApp</option></select><input type="datetime-local" value={draft.orderedAt.slice(0, 16)} onChange={(e) => setDraft({ ...draft, orderedAt: new Date(e.target.value).toISOString() })} className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold" /><button onClick={save} disabled={saving} className="min-h-11 rounded-[8px] bg-royal px-5 text-sm font-extrabold text-white disabled:opacity-60">{saving ? "Salvando..." : "Salvar pedido"}</button><textarea value={draft.products} onChange={(e) => setDraft({ ...draft, products: e.target.value })} placeholder="Produtos, um por linha" className="rounded-[8px] border border-slate-200 px-3 py-3 text-sm font-semibold md:col-span-3" /></div><DataRows rows={orders} empty="Nenhum pedido cadastrado." columns={["Cliente", "Produtos", "Total", "Status", "Data"]} renderRow={(order) => [order.customerName, order.products, formatCurrency(order.total), order.status, formatDate(order.orderedAt)]} onEdit={(order) => setDraft(order)} onDelete={(order) => remove(order.id)} /></section>;
}

function CampaignSection({ campaign, setCampaign, save, uploadBanner, saving }: { campaign: CampaignConfig; setCampaign: React.Dispatch<React.SetStateAction<CampaignConfig>>; save: () => void; uploadBanner: (file: File) => void; saving: boolean }) {
  const end = new Date(campaign.endDate).getTime();
  const days = Math.max(0, Math.ceil((end - Date.now()) / 86400000));
  return <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_16px_34px_rgba(6,23,47,0.055)]"><div className="flex items-center justify-between"><h2 className="font-display text-xl font-extrabold">Campanha Anual</h2><span className="rounded-full bg-royal/10 px-3 py-1 text-xs font-extrabold text-royal">{days} dias restantes</span></div><div className="mt-5 grid gap-3 md:grid-cols-2"><input value={campaign.title} onChange={(e) => setCampaign({ ...campaign, title: e.target.value })} placeholder="Titulo" className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold" /><input type="datetime-local" value={campaign.endDate.slice(0, 16)} onChange={(e) => setCampaign({ ...campaign, endDate: new Date(e.target.value).toISOString() })} className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold" /><input value={campaign.bannerUrl} onChange={(e) => setCampaign({ ...campaign, bannerUrl: e.target.value })} placeholder="Banner URL" className="h-11 rounded-[8px] border border-slate-200 px-3 text-sm font-semibold" /><label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-dashed border-royal px-4 text-sm font-extrabold text-royal"><Upload size={17} />Upload banner<input type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadBanner(file); }} /></label><textarea value={campaign.description} onChange={(e) => setCampaign({ ...campaign, description: e.target.value })} placeholder="Descricao" className="rounded-[8px] border border-slate-200 px-3 py-3 text-sm font-semibold md:col-span-2" /><textarea value={campaign.prizes} onChange={(e) => setCampaign({ ...campaign, prizes: e.target.value })} placeholder="Premios, um por linha" className="rounded-[8px] border border-slate-200 px-3 py-3 text-sm font-semibold" /><textarea value={campaign.rules} onChange={(e) => setCampaign({ ...campaign, rules: e.target.value })} placeholder="Regulamento" className="rounded-[8px] border border-slate-200 px-3 py-3 text-sm font-semibold" /></div><button onClick={save} disabled={saving} className="shine mt-5 min-h-11 rounded-[8px] bg-signal px-6 text-sm font-extrabold text-white disabled:opacity-60">{saving ? "Salvando..." : "Salvar campanha"}</button></section>;
}

function WhatsAppAutomationSection() {
  return <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_16px_34px_rgba(6,23,47,0.055)]"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-display text-xl font-extrabold">WhatsApp Automacao</h2><span className="mt-1 block text-sm font-bold text-slate-500">Modulo preparado para conexao oficial e fluxos automatizados.</span></div><button className="min-h-10 rounded-[8px] bg-royal px-5 text-sm font-extrabold text-white">Configurar automacao</button></div><div className="mt-5 grid gap-4 lg:grid-cols-[320px_1fr]"><div className="rounded-[8px] border border-slate-200 bg-ice p-4"><span className="text-xs font-extrabold uppercase text-slate-400">Status da conexao</span><strong className="mt-2 block text-lg text-signal">Desconectado</strong><span className="mt-1 block text-sm font-semibold text-slate-500">Numero conectado: nenhum</span><div className="mt-5 grid aspect-square place-items-center rounded-[8px] border border-dashed border-slate-300 bg-white text-center text-sm font-extrabold text-slate-400">QR Code</div></div><div className="grid gap-4 md:grid-cols-3"><ModulePanel title="Mensagens automaticas" items={["Boas-vindas", "Horario de atendimento", "Resposta fora do expediente"]} /><ModulePanel title="Campanhas" items={["Disparos segmentados", "Ofertas da semana", "Recuperacao de clientes"]} /><ModulePanel title="Fluxos" items={["Triagem inicial", "Pedido pelo catalogo", "Encaminhar para atendente"]} /></div></div></section>;
}

function AIChatSection() {
  return <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_16px_34px_rgba(6,23,47,0.055)]"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-display text-xl font-extrabold">IA & Chat</h2><span className="mt-1 block text-sm font-bold text-slate-500">Modulo preparado para atendimento inteligente com base de conhecimento.</span></div><button className="min-h-10 rounded-[8px] bg-royal px-5 text-sm font-extrabold text-white">Treinar IA</button></div><div className="mt-5 grid gap-4 lg:grid-cols-[320px_1fr]"><div className="rounded-[8px] border border-slate-200 bg-ice p-4"><span className="text-xs font-extrabold uppercase text-slate-400">Status da IA</span><strong className="mt-2 block text-lg text-amber-600">Aguardando treinamento</strong><span className="mt-1 block text-sm font-semibold text-slate-500">Conversas ativas: 0</span><div className="mt-5 rounded-[8px] bg-white p-4 text-sm font-bold text-slate-500">Nenhuma conversa conectada ainda.</div></div><div className="grid gap-4 md:grid-cols-3"><ModulePanel title="Conversas" items={["Fila de atendimento", "Historico por cliente", "Transferencia manual"]} /><ModulePanel title="Mensagens automaticas" items={["Saudacao", "Perguntas frequentes", "Status de pedido"]} /><ModulePanel title="Base de conhecimento" items={["Produtos", "Politicas da loja", "Servicos farmaceuticos"]} /></div></div></section>;
}

function SettingsSection() {
  return <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_16px_34px_rgba(6,23,47,0.055)]"><h2 className="font-display text-xl font-extrabold">Configuracoes</h2><div className="mt-5 grid gap-4 md:grid-cols-3"><ModulePanel title="Supabase" items={["Autenticacao ativa", "Dados administrativos", "Storage de produtos"]} /><ModulePanel title="Catalogo" items={["Categorias reais", "Produtos reais", "Ofertas reais"]} /><ModulePanel title="Painel" items={["Usuarios", "Permissoes", "Relatorios"]} /></div></section>;
}

function ModulePanel({ title, items }: { title: string; items: string[] }) {
  return <div className="rounded-[8px] border border-slate-200 bg-white p-4"><h3 className="font-display text-base font-extrabold">{title}</h3><div className="mt-3 grid gap-2">{items.map((item) => <span key={item} className="rounded-[8px] bg-ice px-3 py-2 text-sm font-bold text-slate-600">{item}</span>)}</div></div>;
}

function ReportsSection({ products, orders, customers, metrics }: { products: Product[]; orders: Order[]; customers: Customer[]; metrics: DashboardMetrics }) {
  const hasData = products.length || orders.length || customers.length;
  return <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_16px_34px_rgba(6,23,47,0.055)]"><h2 className="font-display text-xl font-extrabold">Relatorios</h2>{hasData ? <div className="mt-5 grid gap-4 md:grid-cols-4"><ReportCard label="Produtos" value={products.length} /><ReportCard label="Pedidos" value={orders.length} /><ReportCard label="Clientes" value={customers.length} /><ReportCard label="Receita" value={formatCurrency(metrics.totalRevenue)} /></div> : <div className="mt-8 rounded-[8px] bg-ice p-8 text-center text-sm font-bold text-slate-500">Ainda nao ha dados suficientes para gerar relatorios.</div>}</section>;
}

function ReportCard({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-[8px] border border-slate-200 bg-ice p-4"><span className="text-sm font-bold text-slate-500">{label}</span><strong className="mt-2 block font-display text-2xl font-extrabold">{value}</strong></div>;
}

function DataRows<T extends { id: string }>({ rows, columns, empty, renderRow, onEdit, onDelete }: { rows: T[]; columns: string[]; empty: string; renderRow: (row: T) => string[]; onEdit: (row: T) => void; onDelete: (row: T) => void }) {
  return <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="text-xs font-extrabold uppercase text-slate-400"><tr>{columns.map((column) => <th key={column} className="px-4 py-3">{column}</th>)}<th>Acoes</th></tr></thead><tbody className="divide-y divide-slate-100">{rows.length ? rows.map((row) => <tr key={row.id} className="hover:bg-ice/70">{renderRow(row).map((cell, index) => <td key={index} className="px-4 py-3 font-semibold">{cell}</td>)}<td><div className="flex gap-2"><button onClick={() => onEdit(row)} className="grid h-9 w-9 place-items-center rounded-[8px] bg-ice text-royal"><Edit3 size={16} /></button><button onClick={() => onDelete(row)} className="grid h-9 w-9 place-items-center rounded-[8px] bg-ice text-signal"><Trash2 size={16} /></button></div></td></tr>) : <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center font-bold text-slate-400">{empty}</td></tr>}</tbody></table></div>;
}

function ProductModal({
  product,
  setProduct,
  categories,
  brands,
  close,
  save,
  saving,
  uploadMainImage,
  uploadGallery,
  imageUploadError,
  mainImagePreviewUrl,
  uploadingMainImage,
  uploadingGalleryImages,
}: {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  categories: Category[];
  brands: Brand[];
  close: () => void;
  save: () => void;
  saving: boolean;
  uploadMainImage: (file?: File) => void;
  uploadGallery: (files?: FileList | null) => void;
  imageUploadError: string;
  mainImagePreviewUrl: string;
  uploadingMainImage: boolean;
  uploadingGalleryImages: boolean;
}) {
  const selectableCategories = categories.filter((category) => category.isActive || category.id === product.categoryId);
  const previewUrl = mainImagePreviewUrl || product.mainImageUrl;

  return (
    <div className="fixed inset-0 z-[80] overflow-auto bg-midnight/55 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-5xl rounded-[8px] bg-white p-5 shadow-glow md:p-7">
        <div className="flex items-center justify-between"><h2 className="font-display text-2xl font-extrabold">{product.name ? "Editar produto" : "Novo produto"}</h2><button onClick={close} className="grid h-10 w-10 place-items-center rounded-full bg-ice"><X size={18} /></button></div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input value={product.name} onChange={(event) => setProduct({ ...product, name: event.target.value })} placeholder="Nome" className="h-12 rounded-[8px] border border-slate-200 px-4 text-sm font-semibold" />
          <input list="admin-brands" value={product.brand} onChange={(event) => setProduct({ ...product, brand: event.target.value })} placeholder="Marca" className="h-12 rounded-[8px] border border-slate-200 px-4 text-sm font-semibold" />
          <datalist id="admin-brands">{brands.map((brand) => <option key={brand.id} value={brand.name} />)}</datalist>
          <textarea value={product.description} onChange={(event) => setProduct({ ...product, description: event.target.value })} placeholder="Descricao" rows={3} className="rounded-[8px] border border-slate-200 px-4 py-3 text-sm font-semibold md:col-span-2" />
          <select value={product.categoryId} onChange={(event) => { const category = categories.find((item) => item.id === event.target.value); if (category) setProduct({ ...product, categoryId: category.id, category: category.name }); }} className="h-12 rounded-[8px] border border-slate-200 px-4 text-sm font-semibold"><option value="">Selecione uma categoria</option>{selectableCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
          <input type="number" value={product.stock || ""} onChange={(event) => setProduct({ ...product, stock: Number(event.target.value) })} placeholder="Estoque" className="h-12 rounded-[8px] border border-slate-200 px-4 text-sm font-semibold" />
          <input type="number" value={product.price || ""} onChange={(event) => setProduct({ ...product, price: Number(event.target.value) })} placeholder="Preco" className="h-12 rounded-[8px] border border-slate-200 px-4 text-sm font-semibold" />
          <input type="number" value={product.promotionalPrice ?? ""} onChange={(event) => setProduct({ ...product, promotionalPrice: event.target.value ? Number(event.target.value) : undefined, isOffer: Boolean(event.target.value) || product.isOffer })} placeholder="Preco promocional" className="h-12 rounded-[8px] border border-slate-200 px-4 text-sm font-semibold" />
          <input value={product.sku ?? ""} onChange={(event) => setProduct({ ...product, sku: event.target.value })} placeholder="SKU" className="h-12 rounded-[8px] border border-slate-200 px-4 text-sm font-semibold" />
          <input value={product.barcode ?? ""} onChange={(event) => setProduct({ ...product, barcode: event.target.value })} placeholder="Codigo de barras" className="h-12 rounded-[8px] border border-slate-200 px-4 text-sm font-semibold" />
          <input value={product.mainImageUrl} onChange={(event) => setProduct({ ...product, mainImageUrl: event.target.value })} placeholder="Imagem principal URL" className="h-12 rounded-[8px] border border-slate-200 px-4 text-sm font-semibold" />
          <label className={`flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-dashed border-royal px-4 text-sm font-extrabold text-royal ${uploadingMainImage ? "pointer-events-none opacity-70" : ""}`}><Upload size={17} />{uploadingMainImage ? "Enviando imagem..." : "Upload imagem"}<input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => uploadMainImage(event.target.files?.[0])} /></label>
          {previewUrl ? <div className="relative min-h-[180px] overflow-hidden rounded-[8px] border border-slate-200 bg-ice md:col-span-2"><Image src={previewUrl} alt={product.name || "Preview do produto"} fill sizes="(max-width: 768px) 100vw, 800px" className="object-contain p-3" /></div> : null}
          {imageUploadError ? <span className="text-sm font-bold text-signal md:col-span-2">{imageUploadError}</span> : null}
          <textarea value={product.galleryImages.join("\n")} onChange={(event) => setProduct({ ...product, galleryImages: event.target.value.split("\n") })} placeholder="Galeria com multiplas imagens, uma URL por linha" rows={3} className="rounded-[8px] border border-slate-200 px-4 py-3 text-sm font-semibold md:col-span-2" />
          <label className={`flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[8px] border border-dashed border-royal px-4 text-sm font-extrabold text-royal ${uploadingGalleryImages ? "pointer-events-none opacity-70" : ""}`}><Upload size={17} />{uploadingGalleryImages ? "Enviando galeria..." : "Upload galeria"}<input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(event) => uploadGallery(event.target.files)} /></label>
          <input value={product.videoUrl ?? ""} onChange={(event) => setProduct({ ...product, videoUrl: event.target.value })} placeholder="Video opcional" className="h-12 rounded-[8px] border border-slate-200 px-4 text-sm font-semibold" />
          <input value={(product.tags ?? []).join(", ")} onChange={(event) => setProduct({ ...product, tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })} placeholder="Tags" className="h-12 rounded-[8px] border border-slate-200 px-4 text-sm font-semibold" />
          <div className="grid gap-2 md:col-span-2 md:grid-cols-5">{[["Destaque", "isHomeFeatured"], ["Oferta semana", "isWeekOffer"], ["Novo", "isNew"], ["Oferta", "isOffer"], ["Ativo", "isActive"]].map(([label, key]) => <button key={key} onClick={() => setProduct({ ...product, [key]: !product[key as keyof Product] })} className={`min-h-11 rounded-[8px] text-sm font-extrabold ${product[key as keyof Product] ? "bg-royal text-white" : "bg-ice text-midnight"}`}>{label}</button>)}</div>
        </div>
        <div className="mt-6 flex justify-end gap-3"><button onClick={close} className="min-h-11 rounded-[8px] border border-slate-200 px-5 text-sm font-extrabold">Cancelar</button><button onClick={save} disabled={saving} className="shine min-h-11 rounded-[8px] bg-signal px-6 text-sm font-extrabold text-white disabled:opacity-60">{saving ? "Salvando..." : "Salvar produto"}</button></div>
      </motion.div>
    </div>
  );
}
