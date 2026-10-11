// src/app/(site)/page.tsx
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../../keystatic.config';
import { LandingPage } from '@/components/landing-page';

// é instanciado o leitor de arquivos locais do keystatic
const reader = createReader(process.cwd(), keystaticConfig);

export default async function Page() {
  // é realizada a busca assíncrona das coleções e singletons
  const rawSpeakers = await reader.collections.speakers.all();
  const rawSchedule = await reader.collections.schedule.all();
  const rawBottons = await reader.collections.bottons.all();
  const rawSupporters = await reader.collections.supporters.all();
  const rawStore = await reader.singletons.store.read();
  const rawSettings = await reader.singletons.settings.read();

  // é feito o mapeamento para facilitar o consumo no client
  const speakers = rawSpeakers.map(s => ({
    name: s.entry.name,
    role: s.entry.role,
    bio: s.entry.bio,
    avatar: s.entry.avatar,
    lattes: s.entry.lattes,
    linkedin: s.entry.linkedin,
  }));

  const schedule = rawSchedule.map(s => ({
    title: s.entry.title,
    type: s.entry.type,
    date: s.entry.date,
    startTime: s.entry.startTime,
    endTime: s.entry.endTime,
    speakerName: s.entry.speakerName,
    location: s.entry.location,
  }));

  const bottons = rawBottons.map(b => ({
    name: b.entry.name,
    image: b.entry.image,
    soldOut: b.entry.soldOut,
  }));

  const supporters = rawSupporters.map(s => ({
    name: s.entry.name,
    logo: s.entry.logo,
  }));

  // é estabelecido um fallback de segurança para a loja
  const store = rawStore || {
    kit1Name: 'Kit Básico',
    kit1Price: 9,
    kit1OriginalPrice: 10,
    kit1Image: null,
    kit1Items: ['2 Bottons', '2 Adesivos'],
    kit1BottonCount: 2,
    kit1SoldOut: false,
    kit2Name: 'Kit SEAS',
    kit2Price: 19.9,
    kit2OriginalPrice: 24.9,
    kit2Image: null,
    kit2Items: ['1 Botton SEAS', '3 Bottons', '4 Adesivos', 'Agenda e Caneta'],
    kit2BottonCount: 3,
    kit2SoldOut: false,
    bottonPrice: 4,
    adesivoPrice: 1.5,
    adesivoSoldOut: false,
  };

  // é estabelecido um fallback de segurança para as configurações gerais
  const settings = rawSettings || {
    aboutText: 'A I Semana da Escrita Acadêmica de Sobral é uma imersão presencial de 3 dias no Campus da UFC. Nosso foco é 100% prático: oficinas de ferramentas, estruturação de artigos e desmistificação do ambiente de pesquisa, guiadas por quem já passou pelos mesmos desafios que você.',
    whatsappNumber: '5588999999999',
    googleFormsLink: '#',
  };

  return <LandingPage speakers={speakers} schedule={schedule} bottons={bottons} supporters={supporters} store={store as any} settings={settings as any} />;
}