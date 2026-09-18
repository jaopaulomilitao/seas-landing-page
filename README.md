# Landing Page SEAS 2026

Este é o repositório do site oficial da Semana da Escrita Acadêmica de Sobral (SEAS), desenvolvido com Next.js, Tailwind CSS e Keystatic para o gerenciamento de conteúdo.

## Organização do Projeto

A estrutura principal funciona da seguinte maneira:

- `src/app/` e `src/components/`: Contêm a lógica das páginas e os componentes visuais do site.
- `src/content/`: Guarda todos os dados dinâmicos em arquivos JSON. É aqui que ficam salvos os textos e configurações gerados pelo painel administrativo.
- `public/`: Armazena os arquivos estáticos, contendo as pastas `assets` (modelo 3D do mapa), `images` (fotos de palestrantes e produtos) e `ui` (logos do evento).
- `keystatic.config.ts`: Arquivo raiz que configura os campos do painel administrativo.

## Como rodar o projeto localmente

Para testar o site no seu computador e visualizar alterações antes de colocar no ar:

1. Abra o terminal na pasta do projeto.
2. Instale as dependências:
   ```bash
   pnpm install
   ```
3. Inicie o servidor:
   ```bash
   pnpm dev
   ```
4. Acesse `http://localhost:3000` no seu navegador.

## Como editar o conteúdo do site (Painel Keystatic)

Você não precisa mexer no código para atualizar o site. Toda a edição de textos, links e imagens é feita por uma interface visual local.

1. Com o site rodando no terminal, acesse `http://localhost:3000/keystatic`.
2. Você verá o painel de controle com duas categorias:
   - **Collections (Listas):** Para gerenciar Palestrantes, Cronograma e itens da Lojinha.
   - **Singletons (Únicos):** Para gerenciar os dados fixos, como link de Inscrição, número do WhatsApp e os detalhes gerais da Loja.
3. Altere o que precisar e clique em Salvar (Save).
4. Verifique no `http://localhost:3000` se a alteração ficou do jeito que queria.
5. Faça o commit dos arquivos alterados no GitHub e o site oficial será atualizado.

### Exemplo Prático: Adicionando uma nova Atividade no Cronograma

1. Abra o painel (`http://localhost:3000/keystatic`).
2. Clique na aba **Cronograma** e depois em **Add new** (Adicionar novo).
3. Preencha os dados:
   - **ID:** `minicurso-latex` (sempre minúsculo e sem espaço)
   - **Título:** Minicurso de LaTeX
   - **Tipo:** Oficina
   - **Data:** Selecione o dia
   - **Horário:** 14:00 às 16:00
   - **Local:** Laboratório de Simulações Numéricas
4. Clique em **Create** e depois em **Save**.
5. Resultado: O sistema criará um arquivo JSON automaticamente e a atividade aparecerá listada no site no dia correspondente e já vinculada ao mapa 3D.