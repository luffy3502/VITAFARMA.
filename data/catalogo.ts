export type ProductCategory =
  | "Medicamentos"
  | "Genéricos"
  | "Vitaminas"
  | "Dermocosméticos"
  | "Higiene Pessoal"
  | "Infantil"
  | "Perfumaria"
  | "Suplementos"
  | "Ofertas da Semana";

export type Category = {
  id: string;
  name: ProductCategory | string;
  slug: string;
  icon: string;
  isActive: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  brand: string;
  categoryId: string;
  category: ProductCategory | string;
  price: number;
  promotionalPrice?: number;
  stock: number;
  sku?: string;
  barcode?: string;
  mainImageUrl: string;
  galleryImages: string[];
  videoUrl?: string;
  tags?: string[];
  images: string[];
  isActive: boolean;
  isOffer: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isWeekOffer: boolean;
  isHomeFeatured: boolean;
  views: number;
  createdAt?: string;
  updatedAt?: string;
  available: boolean;
};

export const productCategoriesList: ProductCategory[] = [
  "Medicamentos",
  "Genéricos",
  "Vitaminas",
  "Dermocosméticos",
  "Higiene Pessoal",
  "Infantil",
  "Perfumaria",
  "Suplementos",
  "Ofertas da Semana",
];

export const demoCategories: Category[] = productCategoriesList.map((name) => ({
  id: name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-"),
  name,
  slug: name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-"),
  icon: "Pill",
  isActive: true,
}));

const categoryId = (name: ProductCategory) => demoCategories.find((category) => category.name === name)?.id ?? demoCategories[0].id;

export const catalogProducts: Product[] = [
  {
    id: "101",
    name: "Dorflex 36 comprimidos",
    description: "Analgésico e relaxante muscular para dores do dia a dia.",
    brand: "Sanofi",
    categoryId: categoryId("Medicamentos"),
    category: "Medicamentos",
    price: 29.9,
    promotionalPrice: 23.9,
    stock: 42,
    mainImageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=82",
    galleryImages: ["https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=900&q=82"],
    images: [
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=900&q=82",
    ],
    isActive: true,
    isOffer: true,
    isNew: false,
    isBestSeller: true,
    isWeekOffer: true,
    isHomeFeatured: true,
    views: 128,
    available: true,
  },
  {
    id: "102",
    name: "Protetor Solar FPS 60",
    description: "Proteção alta com toque seco para uma rotina de cuidado moderna.",
    brand: "La Roche-Posay",
    categoryId: categoryId("Dermocosméticos"),
    category: "Dermocosméticos",
    price: 89.9,
    stock: 20,
    mainImageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=82",
    galleryImages: ["https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=82"],
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=82",
    ],
    isActive: true,
    isOffer: false,
    isNew: true,
    isBestSeller: false,
    isWeekOffer: false,
    isHomeFeatured: true,
    views: 94,
    available: true,
  },
  {
    id: "103",
    name: "Kit Higiene Essencial",
    description: "Itens selecionados para autocuidado, proteção e higiene pessoal.",
    brand: "Johnson&Johnson",
    categoryId: categoryId("Higiene Pessoal"),
    category: "Higiene Pessoal",
    price: 49.9,
    promotionalPrice: 34.9,
    stock: 34,
    mainImageUrl: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=900&q=82",
    galleryImages: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=82"],
    images: [
      "https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=82",
    ],
    isActive: true,
    isOffer: true,
    isNew: true,
    isBestSeller: false,
    isWeekOffer: true,
    isHomeFeatured: false,
    views: 73,
    available: true,
  },
  {
    id: "104",
    name: "Fralda Infantil Premium",
    description: "Conforto, absorção e cuidado para bebês e crianças.",
    brand: "Pampers",
    categoryId: categoryId("Infantil"),
    category: "Infantil",
    price: 64.9,
    stock: 12,
    mainImageUrl: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=82",
    galleryImages: ["https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=900&q=82"],
    images: [
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=900&q=82",
    ],
    isActive: true,
    isOffer: false,
    isNew: true,
    isBestSeller: false,
    isWeekOffer: false,
    isHomeFeatured: true,
    views: 52,
    available: true,
  },
  {
    id: "105",
    name: "Shampoo Reparação 400ml",
    description: "Cuidado diário para cabelos com brilho, maciez e proteção.",
    brand: "Pantene",
    categoryId: categoryId("Perfumaria"),
    category: "Perfumaria",
    price: 28.9,
    promotionalPrice: 22.54,
    stock: 28,
    mainImageUrl: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=900&q=82",
    galleryImages: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=82"],
    images: [
      "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=82",
    ],
    isActive: true,
    isOffer: true,
    isNew: false,
    isBestSeller: true,
    isWeekOffer: true,
    isHomeFeatured: false,
    views: 118,
    available: true,
  },
  {
    id: "106",
    name: "Whey Protein 900g",
    description: "Suplemento proteico para rotina de treino e recuperação muscular.",
    brand: "Growth",
    categoryId: categoryId("Suplementos"),
    category: "Suplementos",
    price: 119.9,
    promotionalPrice: 99.9,
    stock: 18,
    mainImageUrl: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=900&q=82",
    galleryImages: ["https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=900&q=82"],
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=900&q=82",
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=900&q=82",
    ],
    isActive: true,
    isOffer: true,
    isNew: true,
    isBestSeller: false,
    isWeekOffer: false,
    isHomeFeatured: true,
    views: 41,
    available: true,
  },
];

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
