// keystatic.config.ts
import { config, fields, collection, singleton } from '@keystatic/core';

// verifica-se se o ambiente possui as credenciais do github para ativar o storage remoto.
const hasGitHubKeys = Boolean(process.env.KEYSTATIC_GITHUB_CLIENT_ID);
const useGitHubStorage = process.env.NODE_ENV === 'production' && hasGitHubKeys;

export default config({
  storage: useGitHubStorage 
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
            { label: 'Laboratório de Simulações Numéricas', value: 'Laboratório de Simulações Numéricas' },
            { label: 'Sala de Audiovisual', value: 'Sala de Audiovisual' },
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
      },
    }),
    store: singleton({
      label: 'Configurações da Loja',
      path: 'src/content/store/config',
      format: { data: 'json' },
      schema: {
        kit1Name: fields.text({ label: 'Nome do Kit 1', defaultValue: 'Kit Básico' }),
        kit1Price: fields.integer({ label: 'Preço do Kit 1', defaultValue: 15 }),
        kit1Image: fields.image({ label: 'Imagem do Kit 1', directory: 'public/images/store', publicPath: '/images/store' }),
        kit1Items: fields.array(fields.text({ label: 'Item' }), { label: 'Itens do Kit 1', itemLabel: props => props.value }),

        kit2Name: fields.text({ label: 'Nome do Kit 2', defaultValue: 'Kit Apoiador' }),
        kit2Price: fields.integer({ label: 'Preço do Kit 2', defaultValue: 25 }),
        kit2Image: fields.image({ label: 'Imagem do Kit 2', directory: 'public/images/store', publicPath: '/images/store' }),
        kit2Items: fields.array(fields.text({ label: 'Item' }), { label: 'Itens do Kit 2', itemLabel: props => props.value }),

        bottonPrice: fields.integer({ label: 'Preço Unitário do Botton', defaultValue: 5 }),
        adesivoPrice: fields.integer({ label: 'Preço Unitário do Adesivo', defaultValue: 3 }),
      },
    }),
  },
});