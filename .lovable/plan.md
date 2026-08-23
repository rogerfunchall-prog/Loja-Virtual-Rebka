# Rebrand para Rebka + cantos arredondados

## Marca
- Nome da loja passa de "Flex Cosmetics" para **Rebka**, com slogan **"Skin Care That Connects"**.
- Trocar o nome em todos os títulos/descrições de páginas (home, produto, categoria, busca, carrinho, checkout, conta, blog, e páginas institucionais) e nos textos que citam "Flex" / "Tema Flex":
  - Home: "Por que escolher a Rebka?" e "Seja bem-vinda ao universo Rebka".
  - Rodapé: bloco "Porque escolher o Tema Flex?" passa a falar da Rebka.
  - Textos institucionais (Quem Somos, sobre) reescritos para a Rebka, mantendo o tom atual.
- E-mail de contato exibido passa a usar o domínio da Rebka (contato@rebka.com.br) — se você preferir outro endereço, me diga.

## Logos
- Os três arquivos enviados (branco, escuro e rosa) entram como assets do projeto.
- Cabeçalho: logo **escuro**.
- Rodapé: logo **branco** (na faixa rosa e na faixa escura), sem o filtro de inversão usado hoje.
- Logo rosa fica disponível para uso pontual (e-mails/futuras seções).
- Favicon passa a ser gerado a partir do logo rosa, quadrado e com fundo transparente.

## Cantos arredondados (15px)
Entendi "ângulo de 15º" como raio de 15px nos 4 cantos. Aplicar em:
- Todos os botões do site (hero, cards de produto, "Adicionar ao carrinho", newsletter, checkout, conta, contato, filtros).
- Barra de busca do cabeçalho (campo + botão de lupa), inclusive na versão mobile.
- Campos de e-mail/nome da newsletter, para casar com o botão OK.

## Detalhes técnicos
- Logos via `lovable-assets` (pointer `.asset.json`), referenciados em `src/lib/site.ts` (`logoDark`, `logoLight`, `logoPink`), consumidos por `Header.tsx` e `Footer.tsx`.
- Raio: novo token no `src/styles.css` (`--radius-btn: 15px`) e utilitário aplicado nas classes de botões/inputs, evitando valores soltos.
- Apenas frontend: nenhuma alteração de banco, produtos ou lógica de pedidos.
