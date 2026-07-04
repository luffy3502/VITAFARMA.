import { type Category, type Product } from "@/data/catalogo";
import { supabase } from "@/lib/supabase";

export type Brand = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt?: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  notes: string;
  status: "Ativo" | "Inativo";
  createdAt?: string;
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  products: string;
  total: number;
  status: string;
  origin: string;
  orderedAt: string;
};

export type CampaignConfig = {
  id: string;
  title: string;
  description: string;
  endDate: string;
  bannerUrl: string;
  prizes: string;
  rules: string;
  updatedAt?: string;
};

export type DashboardMetrics = {
  totalProducts: number;
  activeOffers: number;
  todayOrders: number;
  customers: number;
  totalRevenue: number;
  averageTicket: number;
};

export type AdminAccessType = "Administrador" | "Funcionario" | "Operador";

export type AdminUser = {
  userId: string;
  name: string;
  email: string;
  role: string;
  accessType: AdminAccessType;
  status: "Ativo" | "Inativo";
  createdAt?: string;
};

type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  brand: string | null;
  category_id: string;
  price: number;
  promotional_price: number | null;
  stock: number | null;
  sku?: string | null;
  barcode?: string | null;
  main_image_url: string | null;
  gallery_images: string[] | null;
  video_url?: string | null;
  tags?: string[] | null;
  is_active: boolean;
  is_offer: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  is_week_offer: boolean;
  is_home_featured: boolean;
  views: number | null;
  created_at?: string;
  updated_at?: string;
  categories?: { name: string } | null;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  is_active: boolean;
  display_order?: number | null;
  created_at?: string;
  updated_at?: string;
};

type CustomerRow = {
  id: string;
  name: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  city: string | null;
  notes: string | null;
  status?: string | null;
  created_at?: string;
};

const defaultPharmacyCategories = [
  "Medicamentos",
  "Higiene Pessoal",
  "Infantil",
  "Suplementos",
  "Dermocosméticos",
  "Beleza",
  "Perfumaria",
  "Saúde",
  "Primeiros Socorros",
  "Ortopédicos",
  "Vitaminas",
  "Genéricos",
  "Manipulados",
  "Conveniência",
  "Assistência",
];

const pharmacyCategoryDefaults = [
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function requireAuthenticatedUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Erro ao verificar usuario autenticado:", error);
    throw error;
  }
  if (!data.user) throw new Error("Usuario nao autenticado.");
  return data.user;
}

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon ?? "Pill",
    isActive: row.is_active,
    displayOrder: row.display_order ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapProduct(row: ProductRow, categories: Category[]): Product {
  const category = categories.find((item) => item.id === row.category_id);
  const mainImageUrl = row.main_image_url ?? "";
  const galleryImages = row.gallery_images ?? [];

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    brand: row.brand ?? "",
    categoryId: row.category_id,
    category: row.categories?.name ?? category?.name ?? "",
    price: Number(row.price),
    promotionalPrice: row.promotional_price ? Number(row.promotional_price) : undefined,
    stock: row.stock ?? 0,
    sku: row.sku ?? "",
    barcode: row.barcode ?? "",
    mainImageUrl,
    galleryImages,
    videoUrl: row.video_url ?? "",
    tags: row.tags ?? [],
    images: [mainImageUrl, ...galleryImages].filter(Boolean),
    isActive: row.is_active,
    isOffer: row.is_offer,
    isNew: row.is_new,
    isBestSeller: row.is_best_seller,
    isWeekOffer: row.is_week_offer,
    isHomeFeatured: row.is_home_featured,
    views: row.views ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    available: row.is_active,
  };
}

function mapCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone ?? "",
    whatsapp: row.whatsapp ?? "",
    email: row.email ?? "",
    city: row.city ?? "",
    notes: row.notes ?? "",
    status: row.status === "Inativo" ? "Inativo" : "Ativo",
    createdAt: row.created_at,
  };
}

function productPayload(product: Product) {
  return {
    name: product.name,
    description: product.description,
    brand: product.brand,
    category_id: product.categoryId,
    price: product.price,
    promotional_price: product.promotionalPrice ?? null,
    stock: product.stock,
    sku: product.sku ?? null,
    barcode: product.barcode ?? null,
    main_image_url: product.mainImageUrl,
    gallery_images: product.galleryImages ?? [],
    video_url: product.videoUrl ?? null,
    tags: product.tags ?? [],
    is_active: product.isActive,
    is_offer: product.isOffer,
    is_new: product.isNew,
    is_best_seller: product.isBestSeller,
    is_week_offer: product.isWeekOffer,
    is_home_featured: product.isHomeFeatured,
    views: product.views ?? 0,
  };
}

function cleanRecord<T extends Record<string, unknown>>(record: T) {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined)) as Partial<T>;
}

function storageErrorMessage(error: unknown) {
  if (error && typeof error === "object") {
    const payload = error as { message?: unknown; error?: unknown; statusCode?: unknown };
    return [payload.message, payload.error, payload.statusCode ? `Status: ${payload.statusCode}` : undefined]
      .filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
      .join(" | ");
  }

  return error instanceof Error ? error.message : "Erro desconhecido do Supabase Storage.";
}

function sanitizeFileName(fileName: string) {
  const withoutPath = fileName.split(/[/\\]/).pop() ?? "imagem";
  const normalized = withoutPath
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "imagem.jpg";
}

async function adminUsersRequest<T>(method = "GET", body?: unknown): Promise<T> {
  const response = await fetch("/api/admin/users", {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("Erro real do Supabase em usuarios:", payload.error ?? payload);
    throw new Error(payload.message ?? payload.error?.message ?? "Nao foi possivel concluir a acao.");
  }

  return payload as T;
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [
    products,
    offers,
    orders,
    customers,
    orderTotals,
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_offer", true),
    supabase.from("orders").select("id", { count: "exact", head: true }).gte("ordered_at", today.toISOString()).lt("ordered_at", tomorrow.toISOString()),
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("total"),
  ]);

  for (const result of [products, offers, orders, customers, orderTotals]) {
    if (result.error) console.error("Erro ao carregar metricas administrativas:", result.error);
  }

  const totals = (orderTotals.data ?? []).map((item) => Number((item as { total: number }).total) || 0);
  const totalRevenue = totals.reduce((sum, value) => sum + value, 0);

  return {
    totalProducts: products.count ?? 0,
    activeOffers: offers.count ?? 0,
    todayOrders: orders.count ?? 0,
    customers: customers.count ?? 0,
    totalRevenue,
    averageTicket: totals.length ? totalRevenue / totals.length : 0,
  };
}

export async function fetchAdminCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("display_order", { ascending: true }).order("name");
  if (error) {
    console.error("Erro ao buscar categorias:", error);
    throw error;
  }
  return (data ?? []).map((row) => mapCategory(row as CategoryRow));
}

export async function ensureDefaultAdminCategories() {
  await requireAuthenticatedUser();
  const { data: existing, error: readError } = await supabase.from("categories").select("slug");
  if (readError) {
    console.error("Erro ao verificar categorias padrao:", readError);
    throw readError;
  }

  const existingSlugs = new Set((existing ?? []).map((row) => String(row.slug)));
  const missing = pharmacyCategoryDefaults.filter((category) => !existingSlugs.has(slugify(category.name)));

  if (missing.length) {
    const { error } = await supabase.from("categories").upsert(missing.map((category) => ({
      name: category.name,
      slug: slugify(category.name),
      icon: category.icon,
      is_active: true,
      display_order: pharmacyCategoryDefaults.findIndex((item) => item.name === category.name) + 1,
    })));

    if (error) {
      console.error("Erro ao criar categorias padrao:", error);
      throw error;
    }
  }

  return fetchAdminCategories();
}


export async function saveAdminCategory(category: Partial<Category> & { name: string }) {
  await requireAuthenticatedUser();
  const slug = category.slug || slugify(category.name);
  const { data: duplicate, error: duplicateError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (duplicateError) {
    console.error("Erro ao verificar categoria duplicada:", duplicateError);
    throw duplicateError;
  }

  const currentId = category.id?.startsWith("tmp-") ? undefined : category.id;
  if (duplicate && duplicate.id !== currentId) throw new Error("Esta categoria ja existe no Supabase.");

  const payload = {
    name: category.name,
    slug,
    icon: category.icon || "Pill",
    is_active: category.isActive ?? true,
    display_order: category.displayOrder ?? 0,
  };

  const { data, error } = await supabase
    .from("categories")
    .upsert(cleanRecord({ id: currentId, ...payload }))
    .select("*")
    .single();

  if (error) {
    console.error("Erro ao salvar categoria:", error);
    throw error;
  }
  return mapCategory(data as CategoryRow);
}

export async function deleteAdminCategory(id: string) {
  await requireAuthenticatedUser();
  const { count, error: countError } = await supabase.from("products").select("id", { count: "exact", head: true }).eq("category_id", id);
  if (countError) {
    console.error("Erro ao verificar produtos vinculados a categoria:", countError);
    throw countError;
  }
  if ((count ?? 0) > 0) throw new Error("Esta categoria possui produtos vinculados e nao pode ser excluida.");

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    console.error("Erro ao excluir categoria:", error);
    throw error;
  }
}

export async function fetchAdminProducts(categories?: Category[]) {
  const categoryList = categories ?? await fetchAdminCategories();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
  return (data ?? []).map((row) => mapProduct(row as ProductRow, categoryList));
}

export async function saveAdminProduct(product: Product) {
  await requireAuthenticatedUser();
  const { data, error } = await supabase
    .from("products")
    .upsert(cleanRecord({ id: product.id.startsWith("tmp-") ? undefined : product.id, ...productPayload(product) }))
    .select("*, categories(name)")
    .single();

  if (error) {
    console.error("Erro ao salvar produto:", error);
    throw error;
  }
  return mapProduct(data as ProductRow, await fetchAdminCategories());
}

export async function deleteAdminProduct(id: string) {
  await requireAuthenticatedUser();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("Erro ao excluir produto:", error);
    throw error;
  }
}

export async function patchAdminProduct(id: string, patch: Record<string, unknown>) {
  await requireAuthenticatedUser();
  const { error } = await supabase.from("products").update(patch).eq("id", id);
  if (error) {
    console.error("Erro ao atualizar produto:", error);
    throw error;
  }
}

export async function uploadAdminAsset(file: File, folder = "products") {
  const user = await requireAuthenticatedUser();
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Formato invalido. Envie uma imagem JPG, JPEG, PNG ou WEBP.");
  }

  const fileName = sanitizeFileName(file.name);
  const path = `${folder}/${user.id}/${Date.now()}-${fileName}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error("Erro ao enviar imagem:", error);
    throw new Error(storageErrorMessage(error) || "Erro ao enviar imagem para o Supabase Storage.");
  }

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function fetchBrands() {
  const { data, error } = await supabase.from("brands").select("*").order("name");
  if (error) {
    console.error("Erro ao buscar marcas:", error);
    throw error;
  }
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    isActive: row.is_active,
    createdAt: row.created_at,
  } as Brand));
}

export async function saveBrand(brand: Partial<Brand> & { name: string }) {
  await requireAuthenticatedUser();
  const { data, error } = await supabase
    .from("brands")
    .upsert(cleanRecord({
      id: brand.id?.startsWith("tmp-") ? undefined : brand.id,
      name: brand.name,
      slug: brand.slug || slugify(brand.name),
      is_active: brand.isActive ?? true,
    }))
    .select("*")
    .single();

  if (error) {
    console.error("Erro ao salvar marca:", error);
    throw error;
  }
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    isActive: data.is_active,
    createdAt: data.created_at,
  } as Brand;
}

export async function deleteBrand(id: string) {
  await requireAuthenticatedUser();
  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error) {
    console.error("Erro ao excluir marca:", error);
    throw error;
  }
}

export async function fetchCustomers() {
  const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Erro ao buscar clientes:", error);
    throw error;
  }
  return (data ?? []).map((row) => mapCustomer(row as CustomerRow));
}

export async function saveCustomer(customer: Partial<Customer> & { name: string }) {
  await requireAuthenticatedUser();
  const { data, error } = await supabase
    .from("clients")
    .upsert(cleanRecord({
      id: customer.id?.startsWith("tmp-") ? undefined : customer.id,
      name: customer.name,
      phone: customer.phone ?? null,
      whatsapp: customer.whatsapp ?? null,
      email: customer.email ?? null,
      city: customer.city ?? null,
      notes: customer.notes ?? null,
      status: customer.status ?? "Ativo",
    }))
    .select("*")
    .single();

  if (error) {
    console.error("Erro ao salvar cliente:", error);
    throw error;
  }
  return mapCustomer(data as CustomerRow);
}

export async function deleteCustomer(id: string) {
  await requireAuthenticatedUser();
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) {
    console.error("Erro ao excluir cliente:", error);
    throw error;
  }
}

export async function fetchOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, customers(name)")
    .order("ordered_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar pedidos:", error);
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    customerId: row.customer_id ?? "",
    customerName: row.customers?.name ?? "Cliente avulso",
    products: Array.isArray(row.products) ? row.products.map((item: unknown) => String(item)).join(", ") : String(row.products ?? ""),
    total: Number(row.total ?? 0),
    status: row.status ?? "novo",
    origin: row.origin ?? "site",
    orderedAt: row.ordered_at,
  } as Order));
}

export async function saveOrder(order: Partial<Order> & { total: number }) {
  await requireAuthenticatedUser();
  const products = (order.products ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const { data, error } = await supabase
    .from("orders")
    .upsert(cleanRecord({
      id: order.id?.startsWith("tmp-") ? undefined : order.id,
      customer_id: order.customerId || null,
      products,
      total: order.total,
      status: order.status ?? "novo",
      origin: order.origin ?? "site",
      ordered_at: order.orderedAt || new Date().toISOString(),
    }))
    .select("*, customers(name)")
    .single();

  if (error) {
    console.error("Erro ao salvar pedido:", error);
    throw error;
  }

  return {
    id: data.id,
    customerId: data.customer_id ?? "",
    customerName: data.customers?.name ?? "Cliente avulso",
    products: Array.isArray(data.products) ? data.products.map((item: unknown) => String(item)).join(", ") : "",
    total: Number(data.total ?? 0),
    status: data.status,
    origin: data.origin,
    orderedAt: data.ordered_at,
  } as Order;
}

export async function deleteOrder(id: string) {
  await requireAuthenticatedUser();
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) {
    console.error("Erro ao excluir pedido:", error);
    throw error;
  }
}

export async function fetchCampaignConfig() {
  const { data, error } = await supabase
    .from("campaign_settings")
    .select("*")
    .eq("id", "annual")
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar campanha:", error);
    throw error;
  }

  return {
    id: data?.id ?? "annual",
    title: data?.title ?? "",
    description: data?.description ?? "",
    endDate: data?.end_date ?? new Date().toISOString(),
    bannerUrl: data?.banner_url ?? "",
    prizes: Array.isArray(data?.prizes) ? data.prizes.join("\n") : "",
    rules: data?.rules ?? "",
    updatedAt: data?.updated_at,
  } as CampaignConfig;
}

export async function saveCampaignConfig(config: CampaignConfig) {
  await requireAuthenticatedUser();
  const { data, error } = await supabase
    .from("campaign_settings")
    .upsert({
      id: "annual",
      title: config.title,
      description: config.description,
      end_date: config.endDate,
      banner_url: config.bannerUrl || null,
      prizes: config.prizes.split("\n").map((item) => item.trim()).filter(Boolean),
      rules: config.rules,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Erro ao salvar campanha:", error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description ?? "",
    endDate: data.end_date,
    bannerUrl: data.banner_url ?? "",
    prizes: Array.isArray(data.prizes) ? data.prizes.join("\n") : "",
    rules: data.rules ?? "",
    updatedAt: data.updated_at,
  } as CampaignConfig;
}

export async function fetchAdminUsers() {
  const payload = await adminUsersRequest<{ users: AdminUser[] }>();
  return payload.users;
}

export async function saveAdminUser(user: AdminUser & { password?: string }) {
  const payload = await adminUsersRequest<{ user: AdminUser }>(user.userId.startsWith("tmp-") ? "POST" : "PATCH", user);
  return payload.user;
}

export async function deleteAdminUser(userId: string) {
  await adminUsersRequest<{ ok: boolean }>("DELETE", { userId });
}
