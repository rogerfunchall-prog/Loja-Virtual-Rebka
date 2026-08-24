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
('perfumes','Perfumes','https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-14-4f336762c30dcfe4e517510461301419-1024-1024.webp',1),
('skin-care','Skin Care','https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-35-60257ccc5fa82d325917510615112074-1024-1024.webp',2),
('hidratantes','Hidratantes','https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-36-343bd0ee9014ccb1d817510614479665-1024-1024.webp',3),
('base','Base','https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-25-549aa7f465ac6240a817510617560413-1024-1024.webp',4),
('body-splash','Body Splash','https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-36-3afe51ab5dfa07698e17510588164281-1024-1024.webp',5),
('creme-de-pentear','Creme de Pentear','https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-38-e005f3951c9c899d2717510640774544-1024-1024.webp',6),
('maquiagem','Maquiagem','https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-22-f60322c8fd07c8d85b17510616264328-1024-1024.webp',7),
('aromatizantes','Aromatizantes','https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-33-e4e9b6a924636e49e217510530041532-1024-1024.webp',8),
('cabelo','Cabelo','https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-06-bf6f5ab88d2b8c603b17510639268461-1024-1024.webp',9);

INSERT INTO public.brands (name, logo_url, position) VALUES
('Marca 1','https://dcdn-us.mitiendanube.com/stores/006/384/221/themes/flex/2-slide-1750474633107-6661359434-24de33714e6c050c96c925cbfbf600851750474634-480-0.webp',1),
('Marca 2','https://dcdn-us.mitiendanube.com/stores/006/384/221/themes/flex/2-slide-1750474633107-1137262257-7134a6b392cbed7d8d165ca0917f4c721750474634-480-0.webp',2),
('Marca 3','https://dcdn-us.mitiendanube.com/stores/006/384/221/themes/flex/2-slide-1750474633107-3036665934-09f3f9e5ff7ae1f6c6dfae90f55b64be1750474635-480-0.webp',3),
('Marca 4','https://dcdn-us.mitiendanube.com/stores/006/384/221/themes/flex/2-slide-1750474633107-7823565594-04075e47d944e9db3d9b13158cb6799e1750474635-480-0.webp',4),
('Marca 5','https://dcdn-us.mitiendanube.com/stores/006/384/221/themes/flex/2-slide-1750474633107-2279993300-8ee9a68fa02700bb0609ea3fdad9b5c71750474635-480-0.webp',5),
('Marca 6','https://dcdn-us.mitiendanube.com/stores/006/384/221/themes/flex/2-slide-1750474633107-1312213609-a87b5c453971d68471b13d4dc7d121761750474635-480-0.webp',6),
('Marca 7','https://dcdn-us.mitiendanube.com/stores/006/384/221/themes/flex/2-slide-1750474633107-2067404193-fa22d040d8b2794544915d4df9bae5b41750474636-480-0.webp',7),
('Marca 8','https://dcdn-us.mitiendanube.com/stores/006/384/221/themes/flex/2-slide-1750474633107-540143322-c2611e72cb668a518630ca5fa05ca8c61750474636-480-0.webp',8),
('Marca 9','https://dcdn-us.mitiendanube.com/stores/006/384/221/themes/flex/2-slide-1750474633107-6079432296-7e0f533dc6004e919871a2a99a5676e91750474636-480-0.webp',9),
('Marca 10','https://dcdn-us.mitiendanube.com/stores/006/384/221/themes/flex/2-slide-1750474633107-2544788634-effbfd9834dcb1a9c300630feacf9acd1750474637-480-0.webp',10);

INSERT INTO public.products (slug,name,description,price,compare_at_price,image_url,category_id,stock,is_best_seller,is_favorite,is_last_chance,position) VALUES
('perfume-eclat-daube-touch-100ml','Perfume Éclat d''Aube Touch 100ml','Eau de parfum floral e luminoso, com fixação prolongada e notas de jasmim e âmbar.',599.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-14-4f336762c30dcfe4e517510461301419-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='perfumes'),12,false,false,false,1),
('perfume-velvet-gardenia-touch-100ml','Perfume Velvet Gardenia Touch 100ml','Fragrância aveludada de gardênia com fundo amadeirado.',699.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-13-e03f897b6c5105562617510468487014-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='perfumes'),12,false,false,false,2),
('perfume-lame-sereine-touch-100ml','Perfume L''Âme Sereine Touch 100ml','Notas serenas de chá branco, íris e almíscar.',799.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-12-36d9fa1c924390059017510472118808-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='perfumes'),12,false,false,false,3),
('perfume-bois-de-lune-touch-100ml','Perfume Boìs de Lune Touch 100ml','Amadeirado sofisticado com sândalo e baunilha.',499.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-11-7179a4b83b95cac45617510473303999-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='perfumes'),12,false,false,false,4),
('perfume-noir-rose-touch-100ml','Perfume Noir Rosé Touch 100ml','Rosa negra, pimenta rosa e patchouli em um perfume marcante.',399.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-15-5175f58d7ef2e89c6917510449126516-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='perfumes'),12,false,true,false,5),
('perfume-touch-lunaria-100ml','Perfume Touch Lunaria 100ml','Floral suave e envolvente para o dia a dia.',399.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-16-868f79667ef9fab8c817510445996241-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='perfumes'),12,false,true,false,6),
('essencia-intensa-eau-de-parfum-touch-100ml','Essência Intensa - Eau de Parfum Touch 100ml','Eau de parfum intenso com alta concentração e fixação de até 12 horas.',899.00,999.00,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-9-066f860c80466e78bb17510449904687-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='perfumes'),8,false,false,true,7),
('pele-perfeita-base-liquida-de-alta-performance','Pele Perfeita - Base Líquida de Alta Performance','Base líquida de cobertura construível, acabamento natural e longa duração.',399.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-25-549aa7f465ac6240a817510617560413-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='base'),15,true,false,false,8),
('olhar-de-impacto-mascara-de-cilios-volume-extra','Olhar de Impacto - Máscara de Cílios Volume Extra','Máscara de cílios com escova modeladora para volume extra sem borrar.',199.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-24-d05aa0927de942419217510617248501-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='maquiagem'),15,true,true,false,9),
('toque-de-cor-batom-matte-de-longa-duracao','Toque de Cor - Batom Matte de Longa Duração','Batom matte confortável, pigmentado e de longa duração.',159.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-23-dae292012897445fb717510616881098-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='maquiagem'),20,true,true,false,10),
('gloss-labial-touch-com-brilho-holografico','Gloss Labial Touch com Brilho Holográfico','Gloss com brilho holográfico e efeito volumoso nos lábios.',199.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-26-2df2606a104316d66a17510571143689-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='maquiagem'),20,true,false,false,11),
('neutros-essenciais-paleta-de-sombras-classica','Neutros Essenciais - Paleta de Sombras Clássica','Paleta com 12 tons neutros, acabamentos matte e cintilante.',499.00,699.00,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-22-f60322c8fd07c8d85b17510616264328-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='maquiagem'),10,false,false,true,12),
('brilho-radiante-iluminador-em-po','Brilho Radiante - Iluminador em Pó','Iluminador em pó de alta refletância para um glow natural.',329.00,399.00,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-21-a3fc61843af115e59117510615893094-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='maquiagem'),10,false,false,true,13),
('toque-natural-blush-em-creme','Toque Natural - Blush em Creme','Blush em creme de fácil esfumado e efeito de pele saudável.',159.00,199.00,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-20-602283fd81307813fd17510615541376-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='maquiagem'),10,false,false,true,14),
('lift-glow-serum-facial-de-firmeza-imediata','Lift Glow - Sérum Facial de Firmeza Imediata','Sérum facial com efeito lifting imediato e ativos antioxidantes.',199.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-35-60257ccc5fa82d325917510615112074-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='skin-care'),14,false,false,false,15),
('hidraprotect-hidratante-facial-com-protetor-solar','HidraProtect - Hidratante Facial com Protetor Solar','Hidratante facial com FPS 30, textura leve e toque seco.',159.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-36-343bd0ee9014ccb1d817510614479665-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='hidratantes'),14,false,true,false,16),
('volume-calm-touch-shampoo-equilibrio-e-volume-natural','Volume Calm Touch – Shampoo Equilíbrio e Volume Natural','Shampoo que equilibra a raiz e dá volume natural aos fios.',299.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-02-b32bc0304b7063d22517510638046284-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='cabelo'),16,false,false,false,17),
('gloss-touch-serum-capilar-brilho-intenso','Gloss Touch – Sérum Capilar Brilho Intenso','Sérum capilar que sela as cutículas e devolve brilho intenso.',299.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-37-fa31c427079fe19ebc17510627342181-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='cabelo'),16,false,false,false,18),
('hydra-touch-mascara-capilar-hidratante-profunda','Hydra Touch – Máscara Capilar Hidratante Profunda','Máscara de hidratação profunda para fios secos e danificados.',399.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-06-bf6f5ab88d2b8c603b17510639268461-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='cabelo'),16,false,true,false,19),
('soft-curl-touch-creme-modelador-para-cachos-naturais','Soft Curl Touch – Creme Modelador para Cachos Naturais','Creme modelador que define cachos com maciez e sem efeito casquinha.',399.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-38-e005f3951c9c899d2717510640774544-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='creme-de-pentear'),16,false,true,false,20),
('body-splash-infinity-desodorante-colonia','Body Splash Infinity Desodorante Colônia','Body splash refrescante com fragrância que permanece o dia todo.',599.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-36-3afe51ab5dfa07698e17510588164281-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='body-splash'),12,false,false,false,21),
('aromatizador-de-ambientes-casa-di-fiori','Aromatizador de ambientes Casa di Fiori','Aromatizador de varetas com fragrância floral duradoura.',199.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-33-e4e9b6a924636e49e217510530041532-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='aromatizantes'),18,true,false,false,22),
('home-spray-verbena-lumen','Home Spray Verbena Lumen','Home spray de verbena para perfumar ambientes e tecidos.',199.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-32-ea1eae9999261e08bd17510643850039-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='aromatizantes'),18,false,false,false,23),
('home-spray-touch-baunilha-cedro','Home Spray Touch Baunilha & Cedro','Home spray com notas de baunilha e cedro.',199.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-29-d26c98ed7c0d8e8e6f17510665894342-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='aromatizantes'),18,false,false,false,24),
('aromatizador-de-ambiente-touch-boreal','Aromatizador de ambiente Touch Boreal','Aromatizador de ambiente com fragrância fresca e amadeirada.',199.00,NULL,'https://dcdn-us.mitiendanube.com/stores/006/384/221/products/produto-30-98be21b2dbd5cb8b9217510646483072-1024-1024.webp',(SELECT id FROM public.categories WHERE slug='aromatizantes'),18,false,true,false,25);

UPDATE public.products SET brand_id = (SELECT id FROM public.brands ORDER BY position LIMIT 1) WHERE brand_id IS NULL;

INSERT INTO public.banners (kind,title,image_url,mobile_image_url,link,position) VALUES
('hero','Rebka - Skin Care That Connects','/images/hero-rebka.png',NULL,'/produtos',1),
('promo','Creme de Pentear','https://dcdn-us.mitiendanube.com/stores/006/384/221/themes/flex/2-slide-1750457225499-2792291752-dd484324c82d8cb653872596e83e51ca1750457226-1920-1920.webp',NULL,'/produtos',1),
('promo','Lápis Multiuso','https://dcdn-us.mitiendanube.com/stores/006/384/221/themes/flex/2-slide-1750457225499-8247958269-98588c58b2e67e78bb96d7a16991a9d51750457227-1920-1920.webp',NULL,'/produtos',2),
('promo','Revitalizante','https://dcdn-us.mitiendanube.com/stores/006/384/221/themes/flex/2-slide-1751068589304-3223196557-aaa6be7f09f9484bb52bcd90d8170feb1751068590-1920-1920.webp',NULL,'/categoria/cabelo',3),
('perfumes','Sérums e Cremes','/images/banner-seruns-cremes.png',NULL,'/categoria/skin-care',1),
('about','Seja bem-vinda ao nosso Universo Rebka','/images/about-rebka-v2.png',NULL,'/quem-somos',1),
('advantage','Ritual Completo de Skin Care','/images/escolher-9.webp',NULL,NULL,1),
('advantage','Sérum e Tônico que Conectam','/images/escolher-10.webp',NULL,NULL,2),
('advantage','Resultados Visíveis na Pele','/images/escolher-11.webp',NULL,NULL,3),
('advantage','Hidratação Profunda e Glow Natural','/images/escolher-12.webp',NULL,NULL,4);

INSERT INTO public.testimonials (name,avatar_url,content,rating,position) VALUES
('Monica G.','https://dcdn-us.mitiendanube.com/stores/006/384/221/themes/flex/2-img-2019880540-1704346346-fe0e6a068cf59e8ffaf9e16a29b4aad51704346347-480-0.webp','Tudo perfeito. Adoro comprar nesta loja, pois sempre encontro tudo que preciso por um preço super acessível e um atendimento muito carinhoso. Recomendo!',5,1),
('Jéssika M.','https://dcdn-us.mitiendanube.com/stores/006/384/221/themes/flex/2-img-716384495-1704346348-4017318ba929df641f9c474dfab1e6cf1704346348-480-0.webp','Tudo perfeito. Adoro comprar nesta loja, pois sempre encontro tudo que preciso por um preço super acessível e um atendimento muito carinhoso. Recomendo!',5,2),
('Giselle C.','https://dcdn-us.mitiendanube.com/stores/006/384/221/themes/flex/2-img-2081544883-1704346349-042587ebaeb3a1891483c848de267e3f1704346349-480-0.webp','Tudo perfeito. Adoro comprar nesta loja, pois sempre encontro tudo que preciso por um preço super acessível e um atendimento muito carinhoso. Recomendo!',5,3),
('Tamyres A.','https://dcdn-us.mitiendanube.com/stores/006/384/221/themes/flex/2-img-2064538070-1704346350-e2f515efb2a7e53e2141e4559747c6e71704346350-480-0.webp','Tudo perfeito. Adoro comprar nesta loja, pois sempre encontro tudo que preciso por um preço super acessível e um atendimento muito carinhoso. Recomendo!',5,4);

INSERT INTO public.posts (slug,title,excerpt,content,image_url) VALUES
('creme-hidratante-revitalizante-a-base-de-toda-pele-saudavel','Creme Hidratante Revitalizante: A Base de Toda Pele Saudável','Hidratar não é um passo opcional: é o que mantém a barreira da pele forte, confortável e com aquele aspecto saudável. Veja como o Creme Hidratante Revitalizante Rebka entra na sua rotina.','O Creme Hidratante Revitalizante Rebka (30ml) foi desenvolvido para repor a água e os lipídios que a pele perde ao longo do dia. Sua textura é leve, de rápida absorção e não deixa sensação pesada ou oleosa. Como usar: aplique uma quantidade equivalente a uma ervilha sobre o rosto limpo, espalhando com movimentos suaves de dentro para fora e finalizando no colo.','/images/blog-creme-hidratante-v2.png'),
('acido-hialuronico-e-niacinamida-a-dupla-que-transforma-a-pele','Ácido Hialurônico e Niacinamida: A Dupla que Transforma a Pele','Juntos, o ácido hialurônico e a niacinamida do Sérum Hidratante Rebka entregam viço, uniformidade e uma pele visivelmente mais preenchida.','O ácido hialurônico atrai e retém umidade nas camadas superficiais da pele, resultando em aspecto preenchido e viçoso. A niacinamida ajuda a uniformizar o tom, suavizar marcas, controlar a oleosidade e reforçar a barreira cutânea. Depois da limpeza, aplique o sérum na pele ainda levemente úmida e, em seguida, o Creme Hidratante Revitalizante para selar a hidratação.','/images/blog-serum-bolhas-v2.png'),
('serum-hidratante-rebka-como-usar-para-potencializar-os-resultados','Sérum Hidratante Rebka: Como Usar para Potencializar os Resultados','Poucas gotas, no momento certo, fazem toda a diferença. Aprenda o passo a passo para extrair o máximo do Sérum Hidratante Rebka.','O ideal são de 3 a 4 gotas do Sérum Hidratante Rebka, distribuídas nas pontas dos dedos e pressionadas suavemente sobre o rosto e o colo. O melhor momento é logo após a limpeza, com a pele ainda levemente úmida. De manhã, use o sérum, siga com o Creme Hidratante Revitalizante e finalize com protetor solar.','/images/blog-serum-splash-v2.png');