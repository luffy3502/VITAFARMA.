import { catalogProducts, demoCategories, type Category, type Product } from "@/data/catalogo";
import { supabase } from "@/lib/supabase";

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
  categories?: {
    name: string;
  } | null;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon ?? "Pill",
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapProduct(row: ProductRow, categories: Category[]): Product {
  const category = categories.find((item) => item.id === row.category_id);
  const mainImageUrl = row.main_image_url ?? catalogProducts[0].mainImageUrl;
  const galleryImages = row.gallery_images ?? [];

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    brand: row.brand ?? "",
    categoryId: row.category_id,
    category: row.categories?.name ?? category?.name ?? "Medicamentos",
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

function toProductPayload(product: Product) {
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
    gallery_images: product.galleryImages,
    video_url: product.videoUrl ?? null,
    tags: product.tags ?? [],
    is_active: product.isActive,
    is_offer: product.isOffer,
    is_new: product.isNew,
    is_best_seller: product.isBestSeller,
    is_week_offer: product.isWeekOffer,
    is_home_featured: product.isHomeFeatured,
    views: product.views,
  };
}

function toCategoryPayload(category: Category) {
  return {
    name: category.name,
    slug: category.slug,
    icon: category.icon,
    is_active: category.isActive,
  };
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

export async function fetchCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error || !data?.length) return demoCategories;

  return data.map((row) => mapCategory(row as CategoryRow));
}

export async function fetchProducts(categories?: Category[]) {
  const categoryList = categories?.length ? categories : await fetchCategories();

  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  if (error || !data?.length) return catalogProducts;

  return data.map((row) => mapProduct(row as ProductRow, categoryList));
}

export async function saveProduct(product: Product) {
  const payload = toProductPayload(product);
  const { data, error } = await supabase
    .from("products")
    .upsert({ id: product.id.startsWith("tmp-") ? undefined : product.id, ...payload })
    .select("*, categories(name)")
    .single();

  if (error) throw error;
  return mapProduct(data as ProductRow, await fetchCategories());
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleProductActive(id: string, isActive: boolean) {
  const { error } = await supabase.from("products").update({ is_active: isActive }).eq("id", id);
  if (error) throw error;
}

export async function saveCategory(category: Category) {
  const { data, error } = await supabase
    .from("categories")
    .upsert({ id: category.id.startsWith("tmp-") ? undefined : category.id, ...toCategoryPayload(category) })
    .select("*")
    .single();

  if (error) throw error;
  return mapCategory(data as CategoryRow);
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadProductAsset(file: File) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error("Usuario nao autenticado.");

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Formato invalido. Envie uma imagem JPG, JPEG, PNG ou WEBP.");
  }

  const path = `products/${userData.user.id}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const { error } = await supabase.storage.from("products").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("products").getPublicUrl(path);
  return data.publicUrl;
}
