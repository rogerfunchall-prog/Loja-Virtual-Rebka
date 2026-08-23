# Clone fiel da Flex Cosmetics (loja funcional)

Réplica 100% fiel do tema Flex (flex-beauty-br.lojavirtualnuvem.com.br): mesmas cores, fontes, tamanhos, espaçamentos e seções, agora como loja própria com catálogo em banco de dados, carrinho e contas de cliente.

## Identidade visual extraída do HTML original

- Tipografia: Inter (400/500/600/700/800) para corpo e botões, Onest (400/700) para títulos — carregadas via Google Fonts.
- Cores: rosa da marca `#e64878`, vinho `#af3969`, texto `#323235` / `#181818`, fundos `#ffffff` / `#fafafa` / `#f9f9f9`, bordas `#d8d8d8`, WhatsApp `#25d366`.
- Todos esses valores entram como tokens de design (nenhuma cor solta nos componentes).

## Seções da home (na mesma ordem do original)

1. Barra superior de anúncio rotativa (frete grátis / 4x sem juros) + faixa de cookies.
2. Header: WhatsApp, telefone, e-mail, links Blog/Contato, redes sociais, logo Flex, menu (Perfumes, Skin Care, Maquiagem, Cabelo, Body Splash, Aromatizantes...), busca, conta e carrinho lateral (drawer).
3. Carrossel de banners full-width com setas e dots.
4. Círculos de categorias (8 itens).
5. Faixa de vantagens: entrega Brasil, 12x, compra segura, primeira troca grátis.
6. "BEST SELLERS" — carrossel de produtos com selo Esgotado/% OFF/Frete grátis, preço, preço no Pix, parcelamento, seletor de quantidade e botão Comprar.
7. "VANTAGENS DE COMPRAR" — 4 cards com imagem e texto.
8. "NOSSOS QUERIDINHOS" — segundo carrossel de produtos.
9. Faixa de 3 banners promocionais com fita animada de selos.
10. "ÚLTIMA OPORTUNIDADE" — grade de 4 produtos em oferta.
11. Bloco "Seja bem-vinda ao nosso universo Flex" (imagem + texto + botão).
12. "COMPRE POR MARCA" — carrossel de marcas.
13. Banner de perfumes importados.
14. "NOVIDADES E TENDÊNCIAS" — 3 posts de blog + botão.
15. "O QUE ELAS DIZEM?" — 4 depoimentos com estrelas.
16. Bloco Instagram, newsletter, footer completo (institucional, categorias, atendimento, contato, pagamentos, envio, segurança) e botão flutuante de WhatsApp.

## Demais páginas

- Categoria/listagem com filtros (preço, marca, ordenação) e paginação.
- Página de produto: galeria, variantes, quantidade, preço/Pix/parcelas, calculadora de frete (estimativa), descrição, relacionados.
- Carrinho, busca, blog (lista + post), contato, páginas institucionais.
- Login/cadastro e área "minha conta" com pedidos.

## Backend (Lovable Cloud)

- Tabelas: produtos, variantes, categorias, marcas, banners, depoimentos, posts, carrinhos/itens, pedidos/itens, newsletter, perfis e papéis (admin em tabela separada).
- RLS: leitura pública do catálogo; carrinho e pedidos apenas do próprio usuário; escrita de catálogo só para admin.
- Seed na migração com os produtos, preços, banners, marcas, depoimentos e posts reais da loja original.
- Painel admin simples para cadastrar/editar produtos e banners.
- Imagens: reutilizando as URLs originais do CDN da loja, conforme escolhido.

## Detalhes técnicos

- TanStack Start + Tailwind v4; tokens em `src/styles.css` (`@theme inline`), fontes via `<link>` no `__root.tsx`.
- Layout do tema replicado: container 1200px, grid de produtos, carrosséis próprios (Embla), drawer de carrinho, sticky header.
- Cada rota com `head()` própria (title, description, og/twitter).
- Checkout: fluxo de pedido registrado no banco. Pagamento real (Stripe/Mercado Pago) fica como etapa seguinte, quando você quiser ativar.

## Entrega em etapas

1. Design system + header/footer + home completa (fiel ao pixel).
2. Cloud: schema, RLS, seed do catálogo real.
3. Categoria, produto, busca, carrinho funcional.
4. Contas, pedidos, blog, institucionais, admin.
