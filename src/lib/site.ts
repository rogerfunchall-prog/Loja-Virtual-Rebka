import logoDarkAsset from "@/assets/logo-dark.png.asset.json";
import logoLightAsset from "@/assets/logo-light.png.asset.json";
import logoPinkAsset from "@/assets/logo-pink.png.asset.json";

export const CDN =
  "https://dcdn-us.mitiendanube.com/stores/006/384/221";

export const site = {
  name: "Rebka",
  tagline: "Skin Care That Connects",
  logo: logoDarkAsset.url,
  logoDark: logoDarkAsset.url,
  logoLight: logoLightAsset.url,
  logoPink: logoPinkAsset.url,
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
  "Fórmulas Limpas e Sustentáveis":
    "Beleza consciente com fórmulas veganas, livres de parabenos e crueldade. Ingredientes naturais que cuidam de você e do planeta em cada aplicação.",
  "Experiência Sensorial Superior":
    "Texturas aveludadas, fragrâncias marcantes e um toque de cuidado. Cada produto transforma sua rotina em um momento de bem-estar e prazer.",
  "Personalização para Cada Tipo de Pele ou Cabelo":
    "Produtos desenvolvidos para valorizar sua individualidade, com soluções pensadas para todos os tons de pele, tipos de cabelo e necessidades reais.",
  "Atendimento Consultivo e Exclusivo":
    "Conte com um time que entende sua beleza. Consultoria especializada e orientação personalizada para escolher o produto ideal para você.",
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
