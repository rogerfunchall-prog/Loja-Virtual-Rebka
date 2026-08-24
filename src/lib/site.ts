export const site = {
  name: "Rebka",
  tagline: "Skin Care That Connects",
  logo: "/images/logo-dark.png",
  logoDark: "/images/logo-dark.png",
  logoLight: "/images/logo-light.png",
  logoPink: "/images/logo-pink.png",
  phone: "(11) 99673-9701",
  whatsapp: "5511996739701",
  email: "contato@rebka.com.br",
  city: "Limeira/SP",
  hours: "Seg. a sex. das 9h às 18h",
  instagram: "https://instagram.com/rebkalojaoficial",
  instagramHandle: "@rebkalojaoficial",
  facebook: "https://facebook.com/rebkalojaoficial",
  youtube: "https://youtube.com/@rebkalojaoficial",
};

export const announcements = [
  "Pague em até 4x sem juros",
  "Frete Grátis Sul e Sudeste a partir de R$299",
];

export const menu = [
  { label: "Perfumes", slug: "perfumes" },
  { label: "Skin Care", slug: "skin-care" },
  { label: "Maquiagem", slug: "maquiagem" },
  { label: "Cabelo", slug: "cabelo" },
  { label: "Body Splash", slug: "body-splash" },
  { label: "Aromatizantes", slug: "aromatizantes" },
];

export const advantages = [
  { title: "Para todo o Brasil", subtitle: "Via Correios e Jadlog", icon: "truck" },
  { title: "Pague em até 12x", subtitle: "no cartão de crédito", icon: "card" },
  { title: "Compra Segura", subtitle: "Seus dados protegidos", icon: "shield" },
  { title: "Primeira troca grátis", subtitle: "em até 7 dias", icon: "refresh" },
] as const;

export const advantageTexts: Record<string, string> = {
  "Ritual Completo de Skin Care":
    "Do gel de limpeza ao creme hidratante, a linha Rebka foi pensada para funcionar em conjunto e transformar sua rotina em um ritual simples e eficaz.",
  "Sérum e Tônico que Conectam":
    "Sérum Hidratante com Ácido Hialurônico e Niacinamida somado ao Tônico Facial: equilíbrio, viço e preparo da pele em dois passos.",
  "Resultados Visíveis na Pele":
    "Textura leve, absorção rápida e efeito perceptível já nas primeiras semanas de uso. Cuidado real, feito para o dia a dia da sua pele.",
  "Hidratação Profunda e Glow Natural":
    "Fórmulas veganas e livres de crueldade que devolvem hidratação e luminosidade, para uma pele saudável e um brilho natural que é só seu.",
};

export const aboutText =
  "Rebka é uma marca de skin care com a missão de conectar cuidado, ciência e autoestima. Mais que tendências passageiras, a Rebka é uma expressão de autocuidado atemporal: cada produto é desenvolvido para proporcionar uma experiência que reflete confiança e bem-estar.";

export const footerAbout =
  "A Rebka nasceu da ideia de que skin care conecta pessoas: fórmulas limpas, testadas e pensadas para todos os tipos de pele. Mais de 1000 clientes já transformaram a rotina de cuidados com a nossa curadoria.";

export const footerCategories = [
  { label: "Perfume", slug: "perfumes" },
  { label: "Body Splash", slug: "body-splash" },
  { label: "Cabelo", slug: "cabelo" },
  { label: "Maquiagem", slug: "maquiagem" },
  { label: "Aromatizante", slug: "aromatizantes" },
];

export const footerHelp = [
  { label: "Quem Somos", to: "/quem-somos" },
  { label: "Trocas e Devoluções", to: "/trocas-e-devolucoes" },
  { label: "Política de Privacidade", to: "/politica-de-privacidade" },
  { label: "Pagamento e Frete", to: "/pagamento-e-frete" },
  { label: "Blog", to: "/blog" },
  { label: "Contato", to: "/contato" },
] as const;

export const promoRibbon = [
  "20% OFF",
  "NOVIDADE",
  "SÓ HOJE",
  "APROVEITE",
  "FRETE GRÁTIS",
  "SUPER OFERTA",
];
