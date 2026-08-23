# Novas imagens e textos do Blog

Trocar as 3 imagens da seção "Blog" pelas 3 fotos Rebka enviadas e reescrever títulos e textos para falarem sobre os produtos das fotos.

## Imagens e novos conteúdos

1. **Creme Hidratante Revitalizante 30ml** (tubo rosa sobre mármore)
   - Título: "Creme Hidratante Revitalizante: A Base de Toda Pele Saudável"
   - Texto: hidratação diária, barreira cutânea, textura leve de rápida absorção, como aplicar manhã e noite.

2. **Sérum Hidratante com Ácido Hialurônico e Niacinamida** (frasco âmbar entre bolhas)
   - Título: "Ácido Hialurônico e Niacinamida: A Dupla que Transforma a Pele"
   - Texto: o que cada ativo faz, resultado de viço e uniformidade, em que ordem usar antes do hidratante.

3. **Sérum Hidratante em splash de água** (frasco âmbar com respingos)
   - Título: "Sérum Hidratante Rebka: Como Usar para Potencializar os Resultados"
   - Texto: quantas gotas, pele levemente úmida, uso diurno e noturno, combinação com o creme hidratante.

## Detalhes técnicos

- Subir as 3 imagens enviadas para o CDN da Lovable (`lovable-assets`) e usar as URLs geradas.
- Atualizar as 3 linhas da tabela `posts` (image_url, title, slug, excerpt, content) via migração; os posts continuam vindo do banco, então a home e as páginas `/blog` e `/blog/$slug` atualizam automaticamente.
- Nenhuma mudança de layout ou de componentes.
