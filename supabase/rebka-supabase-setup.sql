DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.banners CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.brands CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role) CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;

CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name) VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  image_url text,
  position int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories admin write" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text NOT NULL,
  position int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.brands TO anon, authenticated;
GRANT ALL ON public.brands TO service_role;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brands public read" ON public.brands FOR SELECT USING (true);
CREATE POLICY "brands admin write" ON public.brands FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL,
  compare_at_price numeric(10,2),
  image_url text NOT NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL,
  stock int NOT NULL DEFAULT 10,
  free_shipping boolean NOT NULL DEFAULT true,
  is_best_seller boolean NOT NULL DEFAULT false,
  is_favorite boolean NOT NULL DEFAULT false,
  is_last_chance boolean NOT NULL DEFAULT false,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT USING (true);
CREATE POLICY "products admin write" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL,
  title text,
  image_url text NOT NULL,
  mobile_image_url text,
  link text,
  position int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.banners TO anon, authenticated;
GRANT ALL ON public.banners TO service_role;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "banners public read" ON public.banners FOR SELECT USING (true);
CREATE POLICY "banners admin write" ON public.banners FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  avatar_url text NOT NULL,
  content text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  position int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials public read" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "testimonials admin write" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  published_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.posts TO anon, authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts public read" ON public.posts FOR SELECT USING (true);
CREATE POLICY "posts admin write" ON public.posts FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "newsletter anyone subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "newsletter admin read" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text,
  cep text,
  address text,
  payment_method text NOT NULL DEFAULT 'pix',
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  shipping numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pendente',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders own read" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "orders own insert" ON public.orders FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  image_url text,
  unit_price numeric(10,2) NOT NULL,
  quantity int NOT NULL DEFAULT 1
);
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order items own read" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR public.has_role(auth.uid(),'admin'))));
CREATE POLICY "order items own insert" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));

INSERT INTO public.categories (slug, name, image_url, position) VALUES
('perfumes','Perfumes','/images/catalog/asset-06-6f407f11.webp',1),
('skin-care','Skin Care','/images/catalog/asset-20-06382d77.webp',2),
('hidratantes','Hidratantes','/images/catalog/asset-21-b40c585c.webp',3),
('base','Base','/images/catalog/asset-14-1ace6eed.webp',4),
('body-splash','Body Splash','/images/catalog/asset-22-ad1256bd.webp',5),
('creme-de-pentear','Creme de Pentear','/images/catalog/asset-24-4f9bb524.webp',6),
('maquiagem','Maquiagem','/images/catalog/asset-11-74fa2966.webp',7),
('aromatizantes','Aromatizantes','/images/catalog/asset-19-a01499a7.webp',8),
('cabelo','Cabelo','/images/catalog/asset-02-bf90b0cd.webp',9);

INSERT INTO public.brands (name, logo_url, position) VALUES
('Marca 1','/images/catalog/asset-40-6f63bd1c.webp',1),
('Marca 2','/images/catalog/asset-32-d24aecb7.webp',2),
('Marca 3','/images/catalog/asset-37-f76a879e.webp',3),
('Marca 4','/images/catalog/asset-41-cc4c7204.webp',4),
('Marca 5','/images/catalog/asset-35-b439ad93.webp',5),
('Marca 6','/images/catalog/asset-33-06afb997.webp',6),
('Marca 7','/images/catalog/asset-34-c11fbf0b.webp',7),
('Marca 8','/images/catalog/asset-38-1b7ca5f7.webp',8),
('Marca 9','/images/catalog/asset-39-327a2a14.webp',9),
('Marca 10','/images/catalog/asset-36-d3ede8cf.webp',10);

INSERT INTO public.products (slug,name,description,price,compare_at_price,image_url,category_id,stock,is_best_seller,is_favorite,is_last_chance,position) VALUES
('perfume-eclat-daube-touch-100ml','Perfume Éclat d''Aube Touch 100ml','Eau de parfum floral e luminoso, com fixação prolongada e notas de jasmim e âmbar.',599.00,NULL,'/images/catalog/asset-06-6f407f11.webp',(SELECT id FROM public.categories WHERE slug='perfumes'),12,false,false,false,1),
('perfume-velvet-gardenia-touch-100ml','Perfume Velvet Gardenia Touch 100ml','Fragrância aveludada de gardênia com fundo amadeirado.',699.00,NULL,'/images/catalog/asset-05-19ee9bd3.webp',(SELECT id FROM public.categories WHERE slug='perfumes'),12,false,false,false,2),
('perfume-lame-sereine-touch-100ml','Perfume L''Âme Sereine Touch 100ml','Notas serenas de chá branco, íris e almíscar.',799.00,NULL,'/images/catalog/asset-04-a766b5d0.webp',(SELECT id FROM public.categories WHERE slug='perfumes'),12,false,false,false,3),
('perfume-bois-de-lune-touch-100ml','Perfume Boìs de Lune Touch 100ml','Amadeirado sofisticado com sândalo e baunilha.',499.00,NULL,'/images/catalog/asset-03-de5e2784.webp',(SELECT id FROM public.categories WHERE slug='perfumes'),12,false,false,false,4),
('perfume-noir-rose-touch-100ml','Perfume Noir Rosé Touch 100ml','Rosa negra, pimenta rosa e patchouli em um perfume marcante.',399.00,NULL,'/images/catalog/asset-07-d4aa930e.webp',(SELECT id FROM public.categories WHERE slug='perfumes'),12,false,true,false,5),
('perfume-touch-lunaria-100ml','Perfume Touch Lunaria 100ml','Floral suave e envolvente para o dia a dia.',399.00,NULL,'/images/catalog/asset-08-870fe9f4.webp',(SELECT id FROM public.categories WHERE slug='perfumes'),12,false,true,false,6),
('essencia-intensa-eau-de-parfum-touch-100ml','Essência Intensa - Eau de Parfum Touch 100ml','Eau de parfum intenso com alta concentração e fixação de até 12 horas.',899.00,999.00,'/images/catalog/asset-25-11289b18.webp',(SELECT id FROM public.categories WHERE slug='perfumes'),8,false,false,true,7),
('pele-perfeita-base-liquida-de-alta-performance','Pele Perfeita - Base Líquida de Alta Performance','Base líquida de cobertura construível, acabamento natural e longa duração.',399.00,NULL,'/images/catalog/asset-14-1ace6eed.webp',(SELECT id FROM public.categories WHERE slug='base'),15,true,false,false,8),
('olhar-de-impacto-mascara-de-cilios-volume-extra','Olhar de Impacto - Máscara de Cílios Volume Extra','Máscara de cílios com escova modeladora para volume extra sem borrar.',199.00,NULL,'/images/catalog/asset-13-4c95dbb6.webp',(SELECT id FROM public.categories WHERE slug='maquiagem'),15,true,true,false,9),
('toque-de-cor-batom-matte-de-longa-duracao','Toque de Cor - Batom Matte de Longa Duração','Batom matte confortável, pigmentado e de longa duração.',159.00,NULL,'/images/catalog/asset-12-5206c87d.webp',(SELECT id FROM public.categories WHERE slug='maquiagem'),20,true,true,false,10),
('gloss-labial-touch-com-brilho-holografico','Gloss Labial Touch com Brilho Holográfico','Gloss com brilho holográfico e efeito volumoso nos lábios.',199.00,NULL,'/images/catalog/asset-15-de7f3c5c.webp',(SELECT id FROM public.categories WHERE slug='maquiagem'),20,true,false,false,11),
('neutros-essenciais-paleta-de-sombras-classica','Neutros Essenciais - Paleta de Sombras Clássica','Paleta com 12 tons neutros, acabamentos matte e cintilante.',499.00,699.00,'/images/catalog/asset-11-74fa2966.webp',(SELECT id FROM public.categories WHERE slug='maquiagem'),10,false,false,true,12),
('brilho-radiante-iluminador-em-po','Brilho Radiante - Iluminador em Pó','Iluminador em pó de alta refletância para um glow natural.',329.00,399.00,'/images/catalog/asset-10-13c9bf58.webp',(SELECT id FROM public.categories WHERE slug='maquiagem'),10,false,false,true,13),
('toque-natural-blush-em-creme','Toque Natural - Blush em Creme','Blush em creme de fácil esfumado e efeito de pele saudável.',159.00,199.00,'/images/catalog/asset-09-2addefce.webp',(SELECT id FROM public.categories WHERE slug='maquiagem'),10,false,false,true,14),
('lift-glow-serum-facial-de-firmeza-imediata','Lift Glow - Sérum Facial de Firmeza Imediata','Sérum facial com efeito lifting imediato e ativos antioxidantes.',199.00,NULL,'/images/catalog/asset-20-06382d77.webp',(SELECT id FROM public.categories WHERE slug='skin-care'),14,false,false,false,15),
('hidraprotect-hidratante-facial-com-protetor-solar','HidraProtect - Hidratante Facial com Protetor Solar','Hidratante facial com FPS 30, textura leve e toque seco.',159.00,NULL,'/images/catalog/asset-21-b40c585c.webp',(SELECT id FROM public.categories WHERE slug='hidratantes'),14,false,true,false,16),
('volume-calm-touch-shampoo-equilibrio-e-volume-natural','Volume Calm Touch – Shampoo Equilíbrio e Volume Natural','Shampoo que equilibra a raiz e dá volume natural aos fios.',299.00,NULL,'/images/catalog/asset-01-8fd3db55.webp',(SELECT id FROM public.categories WHERE slug='cabelo'),16,false,false,false,17),
('gloss-touch-serum-capilar-brilho-intenso','Gloss Touch – Sérum Capilar Brilho Intenso','Sérum capilar que sela as cutículas e devolve brilho intenso.',299.00,NULL,'/images/catalog/asset-23-60fb870d.webp',(SELECT id FROM public.categories WHERE slug='cabelo'),16,false,false,false,18),
('hydra-touch-mascara-capilar-hidratante-profunda','Hydra Touch – Máscara Capilar Hidratante Profunda','Máscara de hidratação profunda para fios secos e danificados.',399.00,NULL,'/images/catalog/asset-02-bf90b0cd.webp',(SELECT id FROM public.categories WHERE slug='cabelo'),16,false,true,false,19),
('soft-curl-touch-creme-modelador-para-cachos-naturais','Soft Curl Touch – Creme Modelador para Cachos Naturais','Creme modelador que define cachos com maciez e sem efeito casquinha.',399.00,NULL,'/images/catalog/asset-24-4f9bb524.webp',(SELECT id FROM public.categories WHERE slug='creme-de-pentear'),16,false,true,false,20),
('body-splash-infinity-desodorante-colonia','Body Splash Infinity Desodorante Colônia','Body splash refrescante com fragrância que permanece o dia todo.',599.00,NULL,'/images/catalog/asset-22-ad1256bd.webp',(SELECT id FROM public.categories WHERE slug='body-splash'),12,false,false,false,21),
('aromatizador-de-ambientes-casa-di-fiori','Aromatizador de ambientes Casa di Fiori','Aromatizador de varetas com fragrância floral duradoura.',199.00,NULL,'/images/catalog/asset-19-a01499a7.webp',(SELECT id FROM public.categories WHERE slug='aromatizantes'),18,true,false,false,22),
('home-spray-verbena-lumen','Home Spray Verbena Lumen','Home spray de verbena para perfumar ambientes e tecidos.',199.00,NULL,'/images/catalog/asset-18-32e4917b.webp',(SELECT id FROM public.categories WHERE slug='aromatizantes'),18,false,false,false,23),
('home-spray-touch-baunilha-cedro','Home Spray Touch Baunilha & Cedro','Home spray com notas de baunilha e cedro.',199.00,NULL,'/images/catalog/asset-16-75340f03.webp',(SELECT id FROM public.categories WHERE slug='aromatizantes'),18,false,false,false,24),
('aromatizador-de-ambiente-touch-boreal','Aromatizador de ambiente Touch Boreal','Aromatizador de ambiente com fragrância fresca e amadeirada.',199.00,NULL,'/images/catalog/asset-17-f929c257.webp',(SELECT id FROM public.categories WHERE slug='aromatizantes'),18,false,true,false,25);

UPDATE public.products SET brand_id = (SELECT id FROM public.brands ORDER BY position LIMIT 1) WHERE brand_id IS NULL;

INSERT INTO public.banners (kind,title,image_url,mobile_image_url,link,position) VALUES
('hero','Rebka - Skin Care That Connects','/images/hero-rebka.png',NULL,'/produtos',1),
('promo','Creme de Pentear','/images/catalog/asset-30-95e22e77.webp',NULL,'/produtos',1),
('promo','Lápis Multiuso','/images/catalog/asset-31-e473ee04.webp',NULL,'/produtos',2),
('promo','Revitalizante','/images/catalog/asset-42-594f515d.webp',NULL,'/categoria/cabelo',3),
('perfumes','Sérums e Cremes','/images/banner-seruns-cremes.png',NULL,'/categoria/skin-care',1),
('about','Seja bem-vinda ao nosso Universo Rebka','/images/about-rebka-v2.png',NULL,'/quem-somos',1),
('advantage','Ritual Completo de Skin Care','/images/escolher-9.webp',NULL,NULL,1),
('advantage','Sérum e Tônico que Conectam','/images/escolher-10.webp',NULL,NULL,2),
('advantage','Resultados Visíveis na Pele','/images/escolher-11.webp',NULL,NULL,3),
('advantage','Hidratação Profunda e Glow Natural','/images/escolher-12.webp',NULL,NULL,4);

INSERT INTO public.testimonials (name,avatar_url,content,rating,position) VALUES
('Monica G.','/images/catalog/asset-26-77aa3795.webp','Tudo perfeito. Adoro comprar nesta loja, pois sempre encontro tudo que preciso por um preço super acessível e um atendimento muito carinhoso. Recomendo!',5,1),
('Jéssika M.','/images/catalog/asset-29-bf499af8.webp','Tudo perfeito. Adoro comprar nesta loja, pois sempre encontro tudo que preciso por um preço super acessível e um atendimento muito carinhoso. Recomendo!',5,2),
('Giselle C.','/images/catalog/asset-28-f8792c91.webp','Tudo perfeito. Adoro comprar nesta loja, pois sempre encontro tudo que preciso por um preço super acessível e um atendimento muito carinhoso. Recomendo!',5,3),
('Tamyres A.','/images/catalog/asset-27-13397281.webp','Tudo perfeito. Adoro comprar nesta loja, pois sempre encontro tudo que preciso por um preço super acessível e um atendimento muito carinhoso. Recomendo!',5,4);

INSERT INTO public.posts (slug,title,excerpt,content,image_url) VALUES
('creme-hidratante-revitalizante-a-base-de-toda-pele-saudavel','Creme Hidratante Revitalizante: A Base de Toda Pele Saudável','Hidratar não é um passo opcional: é o que mantém a barreira da pele forte, confortável e com aquele aspecto saudável. Veja como o Creme Hidratante Revitalizante Rebka entra na sua rotina.','O Creme Hidratante Revitalizante Rebka (30ml) foi desenvolvido para repor a água e os lipídios que a pele perde ao longo do dia. Sua textura é leve, de rápida absorção e não deixa sensação pesada ou oleosa. Como usar: aplique uma quantidade equivalente a uma ervilha sobre o rosto limpo, espalhando com movimentos suaves de dentro para fora e finalizando no colo.','/images/blog-creme-hidratante-v2.png'),
('acido-hialuronico-e-niacinamida-a-dupla-que-transforma-a-pele','Ácido Hialurônico e Niacinamida: A Dupla que Transforma a Pele','Juntos, o ácido hialurônico e a niacinamida do Sérum Hidratante Rebka entregam viço, uniformidade e uma pele visivelmente mais preenchida.','O ácido hialurônico atrai e retém umidade nas camadas superficiais da pele, resultando em aspecto preenchido e viçoso. A niacinamida ajuda a uniformizar o tom, suavizar marcas, controlar a oleosidade e reforçar a barreira cutânea. Depois da limpeza, aplique o sérum na pele ainda levemente úmida e, em seguida, o Creme Hidratante Revitalizante para selar a hidratação.','/images/blog-serum-bolhas-v2.png'),
('serum-hidratante-rebka-como-usar-para-potencializar-os-resultados','Sérum Hidratante Rebka: Como Usar para Potencializar os Resultados','Poucas gotas, no momento certo, fazem toda a diferença. Aprenda o passo a passo para extrair o máximo do Sérum Hidratante Rebka.','O ideal são de 3 a 4 gotas do Sérum Hidratante Rebka, distribuídas nas pontas dos dedos e pressionadas suavemente sobre o rosto e o colo. O melhor momento é logo após a limpeza, com a pele ainda levemente úmida. De manhã, use o sérum, siga com o Creme Hidratante Revitalizante e finalize com protetor solar.','/images/blog-serum-splash-v2.png');