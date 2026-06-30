export const site = {
  name: "VitaFarma Antas",
  address: "Rua da Feira, Antas - Bahia",
  instagramHandle: "@vitafarmaantas",
  instagramUrl: "https://www.instagram.com/vitafarmaantas/",
  mapsEmbed:
    "https://www.google.com/maps?q=Rua%20da%20Feira%2C%20Antas%20-%20Bahia&output=embed",
  mapsUrl: "https://www.google.com/maps?q=Rua%20da%20Feira%2C%20Antas%20-%20Bahia",
  hours: "Horário de funcionamento sob consulta",
  description:
    "A VitaFarma Antas nasceu para entregar uma experiência farmacêutica mais humana: atendimento próximo, orientação responsável e praticidade para cuidar da saúde da população de Antas.",
};

export function whatsappLink(message: string) {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
