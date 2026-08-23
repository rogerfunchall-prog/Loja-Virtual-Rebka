import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, RefreshCw, ShieldCheck, Star, Truck } from "lucide-react";
import {
  bannersQuery,
  brandsQuery,
  categoriesQuery,
  postsQuery,
  productsQuery,
  testimonialsQuery,
} from "@/lib/catalog";
import { ProductCarousel } from "@/components/site/ProductCarousel";
import { SectionHeading } from "@/components/site/SectionHeading";
import { aboutText, advantageTexts, advantages, promoRibbon } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rebka | Perfumes, Skin Care e Maquiagem" },
      {
        name: "description",
        content:
          "Loja de beleza e cosméticos: perfumes, skin care, maquiagem, cabelo e body splash. Até 4x sem juros e frete grátis a partir de R$299.",
      },
      {
        property: "og:title",
        content: "Rebka | Perfumes, Skin Care e Maquiagem",
      },
      {
        property: "og:description",
        content:
          "Perfumes, skin care, maquiagem e cabelo com preços especiais no Pix e frete grátis Sul e Sudeste.",
      },
    ],
  }),
  component: Home,
});

function HeroBanner() {
  return (
    <section className="overflow-hidden">
      <Link to="/produtos" className="block">
        <img
          src={heroBanner.url}
          alt="Rebka — Skin Care That Connects"
          className="w-full object-cover"
        />
      </Link>
    </section>
  );
}

function AdvantagesStrip() {
  const icons = { truck: Truck, card: CreditCard, shield: ShieldCheck, refresh: RefreshCw };
  return (
    <section className="border-b border-border bg-surface py-5">
      <div className="flex-container grid grid-cols-2 gap-4 lg:grid-cols-4">
        {advantages.map((a) => {
          const Icon = icons[a.icon];
          return (
            <div key={a.title} className="flex items-center justify-center gap-2">
              <Icon className="size-5 shrink-0 text-brand" />
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-ink">
                  {a.title}
                </p>
                <p className="text-[11px] text-ink-soft">{a.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CategoryCircles() {
  const { data: categories = [] } = useQuery(categoriesQuery);
  return (
    <section className="py-10">
      <div className="flex-container">
        <div className="no-scrollbar flex gap-6 overflow-x-auto pb-2 lg:justify-center">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/categoria/$slug"
              params={{ slug: c.slug }}
              className="group flex shrink-0 flex-col items-center gap-2"
            >
              <span className="block size-[86px] overflow-hidden rounded-full border border-border bg-surface">
                {c.image_url ? (
                  <img
                    src={c.image_url}
                    alt={c.name}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : null}
              </span>
              <span className="text-center text-[11px] font-medium uppercase tracking-wide text-ink group-hover:text-brand">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoRibbon() {
  const items = [...promoRibbon, ...promoRibbon];
  return (
    <section className="overflow-hidden bg-brand py-[9px]">
      <div className="marquee-track flex w-max items-center gap-10">
        {items.map((t, i) => (
          <span
            key={i}
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

function AdvantageCards() {
  const { data: banners = [] } = useQuery(bannersQuery);
  const cards = banners.filter((b) => b.kind === "advantage");
  if (cards.length === 0) return null;
  return (
    <section className="bg-surface py-12">
      <div className="flex-container">
        <SectionHeading title="Por que escolher a Rebka?" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <article key={c.id} className="bg-card">
              <img
                src={c.image_url}
                alt={c.title ?? ""}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-ink">
                  {c.title}
                </h3>
                <p className="text-[12px] leading-[1.7] text-ink-soft">
                  {advantageTexts[c.title ?? ""] ?? ""}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoBanners() {
  const { data: banners = [] } = useQuery(bannersQuery);
  const promos = banners.filter((b) => b.kind === "promo");
  if (promos.length === 0) return null;
  return (
    <section className="py-12">
      <div className="flex-container grid gap-4 lg:grid-cols-3">
        {promos.map((b) => (
          <a key={b.id} href={b.link ?? "/"} className="block overflow-hidden">
            <img
              src={b.image_url}
              alt={b.title ?? ""}
              className="w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </a>
        ))}
      </div>
    </section>
  );
}

function PerfumeBanner() {
  const { data: banners = [] } = useQuery(bannersQuery);
  const banner = banners.find((b) => b.kind === "perfumes");
  if (!banner) return null;
  return (
    <section>
      <a href={banner.link ?? "/"} className="block">
        <picture>
          {banner.mobile_image_url ? (
            <source media="(max-width: 767px)" srcSet={banner.mobile_image_url} />
          ) : null}
          <img
            src={banner.image_url}
            alt={banner.title ?? ""}
            className="w-full object-cover"
          />
        </picture>
      </a>
    </section>
  );
}

function AboutSection() {
  const { data: banners = [] } = useQuery(bannersQuery);
  const about = banners.find((b) => b.kind === "about");
  return (
    <section className="bg-surface py-14">
      <div className="flex-container grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-heading text-[24px] leading-[1.3] uppercase tracking-[0.1em] text-ink">
            {about?.title ?? "Seja bem-vinda ao universo Rebka"}
          </h2>
          <p className="mb-6 text-[13px] leading-[1.9] text-ink-soft">{aboutText}</p>
          <Link
            to="/quem-somos"
            className="inline-block bg-ink px-7 py-3 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-brand"
          >
            Saiba mais
          </Link>
        </div>
        {about ? (
          <img
            src={about.image_url}
            alt={about.title ?? ""}
            className="w-full object-cover"
          />
        ) : null}
      </div>
    </section>
  );
}

function BrandStrip() {
  const { data: brands = [] } = useQuery(brandsQuery);
  if (brands.length === 0) return null;
  return (
    <section className="py-12">
      <div className="flex-container">
        <SectionHeading title="Marcas" />
        <div className="no-scrollbar flex items-center gap-8 overflow-x-auto lg:justify-center">
          {brands.map((b) => (
            <img
              key={b.id}
              src={b.logo_url}
              alt={b.name}
              className="h-[54px] w-auto shrink-0 object-contain opacity-80 transition-opacity hover:opacity-100"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const { data: testimonials = [] } = useQuery(testimonialsQuery);
  if (testimonials.length === 0) return null;
  return (
    <section className="bg-surface py-14">
      <div className="flex-container">
        <SectionHeading title="O que dizem nossas clientes" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <article key={t.id} className="bg-card p-5 text-center">
              <img
                src={t.avatar_url}
                alt={t.name}
                className="mx-auto mb-3 size-16 rounded-full object-cover"
              />
              <div className="mb-2 flex justify-center gap-[2px]">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="size-[13px] fill-brand text-brand" />
                ))}
              </div>
              <p className="mb-3 text-[12px] leading-[1.8] text-ink-soft">{t.content}</p>
              <p className="text-[12px] font-semibold uppercase tracking-wide text-ink">
                {t.name}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogSection() {
  const { data: posts = [] } = useQuery(postsQuery);
  if (posts.length === 0) return null;
  return (
    <section className="py-14">
      <div className="flex-container">
        <SectionHeading title="Blog" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <article key={p.id} className="group">
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="block overflow-hidden">
                <img
                  src={p.image_url}
                  alt={p.title}
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <h3 className="mt-3 text-[13px] font-semibold uppercase tracking-wide text-ink">
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="hover:text-brand">
                  {p.title}
                </Link>
              </h3>
              <p className="mt-2 line-clamp-3 text-[12px] leading-[1.7] text-ink-soft">
                {p.excerpt}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Home() {
  const { data: products = [] } = useQuery(productsQuery);
  const bestSellers = products.filter((p) => p.is_best_seller);
  const favorites = products.filter((p) => p.is_favorite);
  const lastChance = products.filter((p) => p.is_last_chance);

  return (
    <>
      <HeroCarousel />
      <AdvantagesStrip />
      <CategoryCircles />

      <section className="pb-12">
        <div className="flex-container">
          <SectionHeading title="Mais vendidos" />
          <ProductCarousel products={bestSellers.length ? bestSellers : products} />
        </div>
      </section>

      <PromoRibbon />
      <AdvantageCards />
      <PromoBanners />

      <section className="pb-12">
        <div className="flex-container">
          <SectionHeading title="Favoritos das clientes" />
          <ProductCarousel products={favorites.length ? favorites : products} />
        </div>
      </section>

      <PerfumeBanner />
      <AboutSection />

      <section className="py-12">
        <div className="flex-container">
          <SectionHeading title="Última chance" />
          <ProductCarousel products={lastChance.length ? lastChance : products} />
        </div>
      </section>

      <BrandStrip />
      <Testimonials />
      <BlogSection />
    </>
  );
}
