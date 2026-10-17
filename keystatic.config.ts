// keystatic.config.ts
import { config, fields, collection, singleton } from '@keystatic/core';

// é verificado se o ambiente atual é o de produção.
const isProduction = process.env.NODE_ENV === 'production';

export default config({
  storage: isProduction 
    ? { kind: 'github', repo: 'jaopaulomilitao/seas-landing-page' } 
    : { kind: 'local' },
    
  collections: {
    speakers: collection({
      label: 'Palestrantes',
      slugField: 'slug',
      path: 'src/content/speakers/*',
      format: { data: 'json' },
      schema: {
        slug: fields.text({ 
          label: 'ID / Identificador (Sem espaços)', 
          description: 'Ex: joao-paulo. Use apenas letras minúsculas e hífens.' 
        }),
        name: fields.text({ label: 'Nome Completo do Palestrante' }),
        role: fields.text({ label: 'Cargo / Título' }),
        bio: fields.text({ label: 'Biografia Curta', multiline: true }),
        avatar: fields.image({
          label: 'Foto de Perfil',
          directory: 'public/images/speakers',
          publicPath: '/images/speakers',
        }),
        // optional profile links, shown as small buttons on the speaker card
        lattes: fields.url({
          label: 'Currículo Lattes (opcional)',
          description: 'Ex: http://lattes.cnpq.br/0000000000000000',
        }),
        linkedin: fields.url({
          label: 'LinkedIn (opcional)',
          description: 'Ex: https://www.linkedin.com/in/seu-perfil',
        }),
      },
    }),
    schedule: collection({
      label: 'Cronograma',
      slugField: 'slug',
      path: 'src/content/schedule/*',
      format: { data: 'json' },
      schema: {
        slug: fields.text({ 
          label: 'ID / Identificador da Atividade', 
          description: 'Ex: palestra-abertura' 
        }),
        title: fields.text({ label: 'Título da Atividade' }),
        type: fields.select({
          label: 'Tipo',
          options: [
            { label: 'Palestra', value: 'palestra' },
            { label: 'Oficina', value: 'oficina' },
            { label: 'Roda de Conversa', value: 'roda-de-conversa' },
            { label: 'Apresentação de Trabalhos', value: 'apresentacao' },
          ],
          defaultValue: 'palestra',
        }),
        date: fields.select({
          label: 'Data',
          options: [
            { label: '19 de Outubro', value: '19/Outubro' },
            { label: '20 de Outubro', value: '20/Outubro' },
            { label: '21 de Outubro', value: '21/Outubro' },
          ],
          defaultValue: '19/Outubro',
        }),
        startTime: fields.text({ label: 'Horário de Início (ex: 14:00)' }),
        endTime: fields.text({ label: 'Horário de Fim (ex: 15:30)' }),
        speakerName: fields.text({ label: 'Nome do Ministrante' }),
        location: fields.select({
          label: 'Local',
          description: 'Selecione a sala onde ocorrerá a atividade',
          options: [
            // values must match the room titles used by the 3d map (src/components/campus-map.tsx)
            { label: 'Laboratório de Simulações Numéricas (Bloco I)', value: 'Laboratório de Simulações Numéricas' },
            { label: 'Sala de Audiovisual (Bloco III)', value: 'Sala de Audiovisual' },
          ],
          defaultValue: 'Sala de Audiovisual',
        }),
      },
    }),
    bottons: collection({
      label: 'Bottons (Loja)',
      slugField: 'slug',
      path: 'src/content/bottons/*',
      format: { data: 'json' },
      schema: {
        slug: fields.text({ 
          label: 'ID (Nome do arquivo)', 
          description: 'Use minúsculas e sem espaços. Ex: github' 
        }),
        name: fields.text({ label: 'Nome do Botton (Visível no site)' }),
        image: fields.image({
          label: 'Imagem do Botton (Quadrada)',
          directory: 'public/images/bottons',
          publicPath: '/images/bottons',
        }),
        soldOut: fields.checkbox({
          label: 'Esgotado',
          description: 'Marque quando este botton acabar. O site mostrará "Esgotado" e bloqueará a reserva.',
          defaultValue: false,
        }),
      },
    }),
    // supporters shown in the "apoio" group of the logos strip
    supporters: collection({
      label: 'Apoio (Logos)',
      slugField: 'slug',
      path: 'src/content/supporters/*',
      format: { data: 'json' },
      schema: {
        slug: fields.text({
          label: 'ID (Nome do arquivo)',
          description: 'Use minúsculas e sem espaços. Ex: buttons-express'
        }),
        name: fields.text({ label: 'Nome do Apoiador' }),
        logo: fields.image({
          label: 'Logo do Apoiador',
          directory: 'public/images/apoio',
          publicPath: '/images/apoio',
        }),
      },
    }),
  },
  singletons: {
    settings: singleton({
      label: 'Configurações do Site (Sobre e Contato)',
      path: 'src/content/settings/general',
      format: { data: 'json' },
      schema: {
        aboutText: fields.text({ 
          label: 'Texto "O que é a SEAS?"', 
          multiline: true,
          defaultValue: 'A I Semana da Escrita Acadêmica de Sobral é uma imersão presencial de 3 dias no Campus da UFC. Nosso foco é 100% prático: oficinas de ferramentas, estruturação de artigos e desmistificação do ambiente de pesquisa, guiadas por quem já passou pelos mesmos desafios que você.'
        }),
        whatsappNumber: fields.text({ 
          label: 'Número do WhatsApp para Reservas', 
          description: 'Apenas números com DDI e DDD. Ex: 5588999999999',
          defaultValue: '5588999999999'
        }),
        googleFormsLink: fields.text({ 
          label: 'Link do Google Forms (Inscrições)', 
          defaultValue: '#'
        }),
        submissionLink: fields.text({ 
          label: 'Link de Submissão de Trabalhos', 
          description: 'Link do formulário para envio de trabalhos a serem apresentados',
          defaultValue: 'https://www.even3.com.br/i-semana-da-escrita-academica-de-sobral-seas-790216/'
        }),
      },
    }),
    store: singleton({
      label: 'Configurações da Loja',
      path: 'src/content/store/config',
      format: { data: 'json' },
      schema: {
        // prices use fields.number with step 0.01 so cents (ex: 1.50) are allowed
        kit1Name: fields.text({ label: 'Nome do Kit 1', defaultValue: 'Kit Básico' }),
        kit1Price: fields.number({ label: 'Preço do Kit 1 (atual / pré-venda)', step: 0.01, defaultValue: 9, validation: { isRequired: true } }),
        kit1OriginalPrice: fields.number({
          label: 'Preço "de" do Kit 1 (opcional)',
          description: 'Preço cheio, mostrado riscado. Deixe vazio para não mostrar promoção.',
          step: 0.01,
        }),
        kit1Image: fields.image({ label: 'Imagem do Kit 1', directory: 'public/images/store', publicPath: '/images/store' }),
        kit1Items: fields.array(fields.text({ label: 'Item' }), { label: 'Itens do Kit 1', itemLabel: props => props.value }),
        kit1BottonCount: fields.integer({
          label: 'Bottons à escolha no Kit 1',
          description: 'Quantos bottons a pessoa escolhe ao reservar. Use 0 para reservar direto, sem escolha.',
          defaultValue: 2,
          validation: { isRequired: true, min: 0 },
        }),
        kit1SoldOut: fields.checkbox({ label: 'Kit 1 esgotado', defaultValue: false }),

        kit2Name: fields.text({ label: 'Nome do Kit 2', defaultValue: 'Kit SEAS' }),
        kit2Price: fields.number({ label: 'Preço do Kit 2 (atual / pré-venda)', step: 0.01, defaultValue: 19.9, validation: { isRequired: true } }),
        kit2OriginalPrice: fields.number({
          label: 'Preço "de" do Kit 2 (opcional)',
          description: 'Preço cheio, mostrado riscado. Deixe vazio para não mostrar promoção.',
          step: 0.01,
        }),
        kit2Image: fields.image({ label: 'Imagem do Kit 2', directory: 'public/images/store', publicPath: '/images/store' }),
        kit2Items: fields.array(fields.text({ label: 'Item' }), { label: 'Itens do Kit 2', itemLabel: props => props.value }),
        kit2BottonCount: fields.integer({
          label: 'Bottons à escolha no Kit 2',
          description: 'Quantos bottons a pessoa escolhe ao reservar (sem contar o botton SEAS fixo). Use 0 para reservar direto.',
          defaultValue: 3,
          validation: { isRequired: true, min: 0 },
        }),
        kit2SoldOut: fields.checkbox({ label: 'Kit 2 esgotado', defaultValue: false }),

        bottonPrice: fields.number({ label: 'Preço Unitário do Botton', step: 0.01, defaultValue: 4, validation: { isRequired: true } }),
        adesivoPrice: fields.number({ label: 'Preço Unitário do Adesivo', step: 0.01, defaultValue: 1.5, validation: { isRequired: true } }),
        adesivoSoldOut: fields.checkbox({
          label: 'Adesivos esgotados',
          description: 'Marque quando os adesivos acabarem. O site mostrará "Esgotado" e bloqueará a reserva.',
          defaultValue: false,
        }),
        adesivosSampleImage: fields.image({
          label: 'Amostra de Adesivos (Foto na mesa)',
          description: 'Foto mostrando os adesivos na mesa para exibir no dropdown "Ver amostra".',
          directory: 'public/images/store',
          publicPath: '/images/store',
        }),
      },
    }),
  },
});