// src/components/landing-page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
// é importado o componente do mapa 3d do campus
import { CampusMapSection } from "./campus-map";

// são importados os ícones com segurança do pacote react-icons/hi e fa6
import {
  HiSun,
  HiMoon,
  HiCalendar,
  HiCheckCircle,
  HiClock,
  HiLocationMarker,
  HiUserCircle,
  HiX,
  HiPlus,
  HiMinus,
  HiMenu,
  HiChevronLeft,
  HiChevronRight,
  HiArrowRight,
  HiAdjustments,
  HiQuestionMarkCircle,
  HiAcademicCap,
} from "react-icons/hi";
import { FaWhatsapp, FaLinkedin } from "react-icons/fa6";
import { BsBoxSeam, BsCashCoin, BsImage } from "react-icons/bs";
import { BiSolidSticker } from "react-icons/bi";
import { PiTarget } from "react-icons/pi";

// são definidas as interfaces dos dados
interface SpeakerData {
  name: string;
  role: string;
  bio: string;
  avatar: string | null;
  lattes: string | null;
  linkedin: string | null;
}

interface ScheduleData {
  title: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  speakerName: string;
  location: string;
}

interface BottonData {
  name: string;
  image: string | null;
  soldOut: boolean;
}

interface SupporterData {
  name: string;
  logo: string | null;
}

interface StoreData {
  kit1Name: string;
  kit1Price: number;
  kit1OriginalPrice: number | null;
  kit1Image: string | null;
  kit1Items: readonly string[];
  kit1BottonCount: number;
  kit1SoldOut: boolean;
  kit2Name: string;
  kit2Price: number;
  kit2OriginalPrice: number | null;
  kit2Image: string | null;
  kit2Items: readonly string[];
  kit2BottonCount: number;
  kit2SoldOut: boolean;
  bottonPrice: number;
  adesivoPrice: number;
  adesivoSoldOut: boolean;
}

// shared width for the store popups: limited on mobile, grows to fit the content on desktop
const storeModalClass =
  "bg-white dark:bg-seas-cardDark w-full max-w-sm md:w-auto md:min-w-md md:max-w-2xl rounded-2xl p-5 md:p-6 relative shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]";

const qtyButtonClass =
  "w-7 h-7 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed";

interface BottonRowProps {
  botton: BottonData;
  qty: number;
  subtitle: string;
  addDisabled: boolean;
  onAdd: () => void;
  onRemove: () => void;
}

// one botton line with image, name and +/- controls, used by both store popups
function BottonRow({ botton, qty, subtitle, addDisabled, onAdd, onRemove }: BottonRowProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 p-3 border border-gray-200 dark:border-slate-700 rounded-xl ${botton.soldOut ? "opacity-60" : ""}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {botton.image ? (
          <Image
            src={botton.image}
            alt={botton.name}
            width={32}
            height={32}
            className={`w-8 h-8 shrink-0 rounded-full object-cover shadow-sm border border-gray-200 dark:border-slate-600 ${botton.soldOut ? "grayscale" : ""}`}
          />
        ) : (
          <div className="w-8 h-8 shrink-0 rounded-full bg-seas-purple/20 text-seas-purple flex items-center justify-center">
            <PiTarget className="text-sm" />
          </div>
        )}
        <div className="min-w-0">
          {/* truncated on mobile, full name on desktop */}
          <div
            className="font-bold text-xs truncate md:overflow-visible md:whitespace-nowrap"
            title={botton.name}
          >
            {botton.name}
          </div>
          {botton.soldOut ? (
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
              Esgotado
            </span>
          ) : (
            <div className="text-[10px] text-gray-500 dark:text-gray-400">
              {subtitle}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button onClick={onRemove} disabled={qty === 0} className={qtyButtonClass}>
          <HiMinus className="text-xs" />
        </button>
        <span className="font-bold w-4 text-center text-sm">{qty}</span>
        <button onClick={onAdd} disabled={addDisabled || botton.soldOut} className={qtyButtonClass}>
          <HiPlus className="text-xs" />
        </button>
      </div>
    </div>
  );
}

// formats a number as brazilian currency, ex: 1.5 -> "R$ 1,50"
const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// labels and badge colors for each schedule type registered on keystatic
const scheduleTypes: Record<string, { label: string; badge: string }> = {
  palestra: { label: "Palestra", badge: "bg-seas-purple text-white" },
  oficina: { label: "Oficina", badge: "bg-seas-teal text-gray-900" },
  "roda-de-conversa": { label: "Roda de Conversa", badge: "bg-seas-green text-gray-900" },
  apresentacao: { label: "Apresentação", badge: "bg-white text-seas-darkPurple" },
};

const getScheduleType = (type: string) =>
  scheduleTypes[type] ?? { label: type, badge: "bg-white/20 text-white" };

// building of each room, shown next to the location name
const locationBlocks: Record<string, string> = {
  "Laboratório de Simulações Numéricas": "Bloco I",
  "Sala de Audiovisual": "Bloco III",
};

const getLocationLabel = (location: string) =>
  locationBlocks[location] ? `${location} (${locationBlocks[location]})` : location;

interface SettingsData {
  aboutText: string;
  whatsappNumber: string;
  googleFormsLink: string;
}

interface LandingPageProps {
  speakers: SpeakerData[];
  schedule: ScheduleData[];
  bottons: BottonData[];
  supporters: SupporterData[];
  store: StoreData;
  settings: SettingsData;
}

// organization logos shown in the "realização e organização" group
const organizationLogos = [
  { src: "/images/organização/logo-pet-detalhado-escuro-titulo.svg", alt: "Logo PET", width: 200, height: 80 },
  { src: "/images/organização/logo_eng_comp.png", alt: "Logo Engenharia de Computação", width: 140, height: 60 },
  { src: "/images/organização/logo_ppgeec.png", alt: "Logo PPGEEC", width: 140, height: 60 },
];

// event year and timezone used to build the google calendar links
const EVENT_YEAR = 2026;
const EVENT_TIMEZONE = "America/Fortaleza";

const monthNumbers: Record<string, number> = {
  janeiro: 1, fevereiro: 2, marco: 3, abril: 4, maio: 5, junho: 6,
  julho: 7, agosto: 8, setembro: 9, outubro: 10, novembro: 11, dezembro: 12,
};

// turns "14:40" (or "14h40") into "144000"
const toCalendarTime = (time: string) => {
  const match = String(time).trim().match(/^(\d{1,2})\s*[:h]?\s*(\d{2})?/i);
  if (!match) return null;
  return `${match[1].padStart(2, "0")}${match[2] ?? "00"}00`;
};

// builds a google calendar "create event" link from a schedule item, or null if the date/time can't be parsed
const buildGoogleCalendarLink = (item: ScheduleData) => {
  const [rawDay, rawMonth = ""] = String(item.date).trim().split("/");
  const monthKey = rawMonth
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
  const day = parseInt(rawDay, 10);
  const month = monthNumbers[monthKey];
  const start = toCalendarTime(item.startTime);
  const end = toCalendarTime(item.endTime);
  if (!day || !month || !start || !end) return null;

  const datePart = `${EVENT_YEAR}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`;
  const typeLabel = getScheduleType(item.type).label;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `SEAS 2026 • ${item.title}`,
    dates: `${datePart}T${start}/${datePart}T${end}`,
    ctz: EVENT_TIMEZONE,
    details: `${typeLabel} da I Semana da Escrita Acadêmica de Sobral (SEAS).\nMinistrante: ${item.speakerName}\nHorário: ${item.startTime} às ${item.endTime}`,
    location: `${getLocationLabel(item.location)} - UFC Campus Sobral`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const painPoints = [
  "Dificuldade em organizar as ideias para o TCC?",
  "Não aguenta mais formatar artigo na ABNT?",
  "Quer entender como publicar revistas?",
  "Planos de fazer mestrado ou doutorado?",
];

export function LandingPage({
  speakers,
  schedule,
  bottons,
  supporters,
  store,
  settings,
}: LandingPageProps) {
  const [isDark, setIsDark] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [painPointIndex, setPainPointIndex] = useState(0);
  const [painPointOpacity, setPainPointOpacity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // controls the "como montar minha programação?" tip
  const [isAgendaTipOpen, setIsAgendaTipOpen] = useState(false);

  // é gerenciado o estado do menu mobile (hambúrguer)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // é gerenciado o estado da paginação da seção "Quem vai te guiar"
  const [speakerPage, setSpeakerPage] = useState(1);
  const speakersPerPage = 4;

  // é gerenciado o estado do carrinho personalizado com base nos bottons cadastrados
  const [adesivoQty, setAdesivoQty] = useState(0);
  const [bottonQty, setBottonQty] = useState<Record<string, number>>({});

  // é adicionado o estado para gerenciar o foco da câmera do mapa 3d
  const [activeMapLocation, setActiveMapLocation] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPainPointOpacity(0);
      setTimeout(() => {
        setPainPointIndex((prev) => (prev + 1) % painPoints.length);
        setPainPointOpacity(1);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
      setIsDark(true);
    }
  };

  const openWhatsApp = (itemName: string, price: number) => {
    const phone = settings?.whatsappNumber || "5588999999999";
    const msg = `Olá! Gostaria de reservar o *${itemName}* (${formatPrice(price)}) da SEAS. Como realizo o pagamento? Sei que a retirada será presencial no dia do evento!`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  // kit reservation popup: which kit is open and the bottons chosen for it
  const [selectedKit, setSelectedKit] = useState<1 | 2 | null>(null);
  const [kitBottonQty, setKitBottonQty] = useState<Record<string, number>>({});

  const kitOptions = {
    1: { name: store.kit1Name, price: store.kit1Price, bottonCount: store.kit1BottonCount },
    2: { name: store.kit2Name, price: store.kit2Price, bottonCount: store.kit2BottonCount },
  };
  const activeKit = selectedKit ? kitOptions[selectedKit] : null;
  const kitBottonsChosen = Object.values(kitBottonQty).reduce((acc, val) => acc + val, 0);

  // opens the botton picker, or goes straight to whatsapp when the kit has no bottons to choose
  const reserveKit = (kit: 1 | 2) => {
    if (kitOptions[kit].bottonCount > 0) {
      setKitBottonQty({});
      setSelectedKit(kit);
    } else {
      openWhatsApp(kitOptions[kit].name, kitOptions[kit].price);
    }
  };

  const updateKitBottonQty = (bottonName: string, change: number) => {
    setKitBottonQty((prev) => {
      const newQty = (prev[bottonName] || 0) + change;
      if (newQty < 0) return prev;
      return { ...prev, [bottonName]: newQty };
    });
  };

  const sendKitReservation = () => {
    if (!activeKit) return;
    const phone = settings?.whatsappNumber || "5588999999999";
    let msg = `Olá! Gostaria de reservar o *${activeKit.name}* (${formatPrice(activeKit.price)}) da SEAS com os bottons:\n\n`;

    Object.entries(kitBottonQty).forEach(([name, qty]) => {
      if (qty > 0) {
        msg += `- ${qty}x ${name}\n`;
      }
    });

    msg += `\nComo realizo o pagamento? Sei que a retirada será presencial no dia do evento!`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
    setSelectedKit(null);
    setKitBottonQty({});
  };

  // é atualizada a quantidade de um botton específico
  const updateBottonQty = (bottonName: string, change: number) => {
    setBottonQty((prev) => {
      const currentQty = prev[bottonName] || 0;
      const newQty = currentQty + change;
      if (newQty < 0) return prev;
      return { ...prev, [bottonName]: newQty };
    });
  };

  const updateAdesivoQty = (change: number) => {
    setAdesivoQty((prev) => {
      const newQty = prev + change;
      return newQty >= 0 ? newQty : prev;
    });
  };

  const calculateTotal = () => {
    const totalBottons = Object.values(bottonQty).reduce(
      (acc, val) => acc + val,
      0,
    );
    return totalBottons * store.bottonPrice + adesivoQty * store.adesivoPrice;
  };

  const sendCustomKit = () => {
    const total = calculateTotal();
    const phone = settings?.whatsappNumber || "5588999999999";
    let msg = `Olá! Montei um *Kit Personalizado* da SEAS e gostaria de reservar:\n\n`;

    Object.entries(bottonQty).forEach(([name, qty]) => {
      if (qty > 0) {
        msg += `- ${qty}x Botton: ${name}\n`;
      }
    });

    if (adesivoQty > 0) {
      msg += `- ${adesivoQty}x Adesivos Diversos\n`;
    }

    msg += `\n*Total: ${formatPrice(total)}*\n\nComo realizo o pagamento da reserva? Sei que a retirada é presencial no evento!`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
    setIsModalOpen(false);
    setBottonQty({});
    setAdesivoQty(0);
  };

  // é criada a função de ancoragem suave para o mapa
  const handleViewOnMap = (locationTitle: string) => {
    setActiveMapLocation(locationTitle);
    document.getElementById("mapa")?.scrollIntoView({ behavior: "smooth" });
  };

  // Lógica de paginação para os palestrantes
  const totalSpeakerPages = Math.ceil(speakers.length / speakersPerPage);
  const paginatedSpeakers = speakers.slice(
    (speakerPage - 1) * speakersPerPage,
    speakerPage * speakersPerPage,
  );

  const filteredSchedule = schedule.filter(
    (item) => activeFilter === "all" || item.type === activeFilter,
  );

  const sortedSchedule = [...filteredSchedule].sort((a, b) => {
    const dateA = String(a.date).trim();
    const dateB = String(b.date).trim();
    if (dateA !== dateB) return dateA > dateB ? 1 : -1;
    return String(a.startTime).trim() > String(b.startTime).trim() ? 1 : -1;
  });

  const groupedScheduleArray = sortedSchedule.reduce(
    (acc, item) => {
      const dateKey = String(item.date).trim();
      const existingGroup = acc.find((g) => g.date === dateKey);
      if (existingGroup) {
        existingGroup.items.push(item);
      } else {
        acc.push({ date: dateKey, items: [item] });
      }
      return acc;
    },
    [] as { date: string; items: ScheduleData[] }[],
  );

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-seas-bgDark/80 backdrop-blur-md border-b border-seas-borderLight dark:border-seas-borderDark transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Image
              src="/ui/logo-horizontal-centralizada-vertical.svg"
              alt="Logo Oficial SEAS"
              width={130}
              height={45}
              className="h-8 sm:h-9 w-auto"
              priority
            />
            {/* Links para Desktop */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a
                href="#sobre"
                className="hover:text-seas-purple transition-colors"
              >
                Sobre
              </a>
              <a
                href="#palestrantes"
                className="hover:text-seas-purple transition-colors"
              >
                Palestrantes
              </a>
              <a
                href="#cronograma"
                className="hover:text-seas-purple transition-colors"
              >
                Programação
              </a>
              <a
                href="#mapa"
                className="hover:text-seas-purple transition-colors"
              >
                Mapa
              </a>
              <a
                href="#kits"
                className="hover:text-seas-purple transition-colors"
              >
                Lojinha
              </a>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:text-seas-purple dark:text-gray-400 dark:hover:text-seas-teal transition-colors focus:outline-none"
              >
                {isDark ? (
                  <HiSun className="text-xl" />
                ) : (
                  <HiMoon className="text-xl" />
                )}
              </button>
              <a
                href={settings?.googleFormsLink || "#inscricao"}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex bg-seas-darkPurple dark:bg-seas-purple text-white px-4 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-all text-sm"
              >
                Inscreva-se
              </a>
              {/* Botão Hambúrguer Mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 dark:text-gray-200 focus:outline-none"
                aria-label="Abrir Menu"
              >
                {isMobileMenuOpen ? (
                  <HiX className="text-2xl" />
                ) : (
                  <HiMenu className="text-2xl" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu Dropdown Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-seas-cardDark border-b border-seas-borderLight dark:border-seas-borderDark px-4 pt-3 pb-5 space-y-3 shadow-xl animate-in slide-in-from-top-4 duration-200">
            <a
              href="#sobre"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-seas-purple py-1.5"
            >
              Sobre
            </a>
            <a
              href="#palestrantes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-seas-purple py-1.5"
            >
              Palestrantes
            </a>
            <a
              href="#cronograma"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-seas-purple py-1.5"
            >
              Programação
            </a>
            <a
              href="#mapa"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-seas-purple py-1.5"
            >
              Mapa
            </a>
            <a
              href="#kits"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-seas-purple py-1.5"
            >
              Lojinha
            </a>
            <div className="pt-2">
              <a
                href={settings?.googleFormsLink || "#inscricao"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full inline-block text-center bg-seas-darkPurple dark:bg-seas-purple text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md"
              >
                Inscreva-se
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-24 pb-12 sm:pt-28 sm:pb-16 px-4 sm:px-6 lg:px-8 min-h-[90vh] flex flex-col justify-center relative overflow-hidden bg-seas-bgLight dark:bg-seas-bgDark transition-colors duration-300">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 pointer-events-none z-0 hidden md:block h-[20vh] lg:h-[25vh] xl:h-[55vh] w-auto opacity-40 lg:opacity-100 transition-all duration-500">
          <Image
            src="/ui/formas-esquerda.svg"
            alt=""
            width={400}
            height={800}
            className="h-full w-auto object-contain object-left"
            priority
          />
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none z-0 hidden md:block h-[20vh] lg:h-[25vh] xl:h-[55vh] w-auto opacity-40 lg:opacity-100 transition-all duration-500">
          <Image
            src="/ui/formas-direita.svg"
            alt=""
            width={200}
            height={800}
            className="h-full w-auto object-contain object-right"
            priority
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* mobile/tablet logo: swaps to the white-text version in dark mode */}
          <div className="flex md:hidden justify-center items-center mb-6">
            <Image
              src="/ui/logo-tipografica.svg"
              alt="Logo SEAS"
              width={160}
              height={55}
              className="h-20 w-auto object-contain dark:hidden"
              priority
            />
            <Image
              src="/ui/logo-tipografica-dark.svg"
              alt="Logo SEAS"
              width={160}
              height={55}
              className="h-20 w-auto object-contain hidden dark:block"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-seas-teal/10 text-seas-teal dark:text-seas-teal text-sm font-bold mb-6 border border-seas-teal/20 uppercase tracking-widest backdrop-blur-sm">
            <HiCalendar className="text-base" />
            19 a 21 de Outubro • UFC Sobral
          </div>

          <div className="pointer-events-none z-0 hidden md:flex justify-center items-center w-full my-6 h-[10vh] lg:h-[8vh] xl:h-[12vh] relative">
            <Image
              src="/ui/logo-tipografica.svg"
              alt="Logo SEAS"
              width={500}
              height={300}
              className="absolute h-full w-auto object-contain object-center transition-opacity duration-500 opacity-100 dark:opacity-0"
              priority
            />
            <Image
              src="/ui/logo-tipografica-dark.svg"
              alt="Logo SEAS"
              width={500}
              height={300}
              className="absolute h-full w-auto object-contain object-center transition-opacity duration-500 opacity-0 dark:opacity-100"
              priority
            />
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 leading-[1.1] text-gray-900 dark:text-white">
            Onde sua{" "}
            <span className="text-seas-purple dark:text-seas-purple">
              pesquisa
            </span>{" "}
            <br className="hidden md:block" /> ganha forma e voz.
          </h1>

          <div className="h-10 md:h-14 mb-8 overflow-hidden relative w-full flex justify-center items-center text-base md:text-xl text-gray-600 dark:text-gray-300 font-medium">
            <p
              style={{ opacity: painPointOpacity }}
              className="transition-opacity duration-500 absolute w-full text-center"
            >
              {painPoints[painPointIndex]}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={settings?.googleFormsLink || "#inscricao"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-seas-green text-gray-900 px-6 py-3 rounded-full font-bold text-base hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-seas-green/20"
            >
              Garantir Vaga Gratuita <HiArrowRight />
            </a>
            <a
              href="#cronograma"
              className="w-full sm:w-auto bg-white/80 dark:bg-seas-cardDark/80 backdrop-blur-md border border-seas-borderLight dark:border-seas-borderDark text-gray-700 dark:text-gray-200 px-6 py-3 rounded-full font-bold text-base hover:bg-white dark:hover:bg-slate-800 transition-all"
            >
              Ver Programação
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE LOGOS DA ORGANIZAÇÃO */}
      <section className="py-6 sm:py-8 bg-white/80 dark:bg-slate-900/60 border-y border-seas-borderLight dark:border-slate-800 backdrop-blur-sm overflow-hidden transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* desktop: two groups side by side, split by a faint vertical line */}
          <div className="hidden md:flex items-stretch justify-center gap-12 py-2">
            <div className="flex flex-col items-center">
              <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-400 mb-6">
                Realização e Organização
              </p>
              <div className="flex items-center justify-center gap-16 flex-1">
                {organizationLogos.map((logo) => (
                  <div key={logo.src} className="h-16 w-auto flex items-center justify-center">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={logo.width}
                      height={logo.height}
                      className="h-16 w-auto object-contain grayscale opacity-75 dark:opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {supporters.length > 0 && (
              <>
                <div className="w-px self-stretch bg-gray-400/25 dark:bg-gray-500/25" />
                <div className="flex flex-col items-center">
                  <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-400 mb-6">
                    Apoio
                  </p>
                  <div className="flex items-center justify-center gap-16 flex-1">
                    {supporters.map((supporter) => (
                      <div key={supporter.name} className="h-16 w-auto flex items-center justify-center">
                        {supporter.logo ? (
                          <Image
                            src={supporter.logo}
                            alt={`Logo ${supporter.name}`}
                            width={200}
                            height={80}
                            className="h-16 w-auto object-contain grayscale opacity-75 dark:opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                          />
                        ) : (
                          // fallback while no logo was uploaded on keystatic
                          <span className="text-lg font-display font-bold text-gray-400">
                            {supporter.name}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* mobile: marquee with both groups, each label scrolls along with its logos */}
          <div className="md:hidden flex overflow-hidden relative w-full whitespace-nowrap">
            <div
              className="flex items-center shrink-0 py-2"
              style={{
                display: "flex",
                width: "max-content",
                animation: "marquee 25s linear infinite",
              }}
            >
              {/* the list is rendered twice so the loop looks seamless */}
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  className="flex items-center gap-12 pr-12"
                  aria-hidden={copy === 1}
                >
                  <div className="w-px h-10 bg-gray-400/25 dark:bg-gray-500/25" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 -mr-6">
                    Realização e Organização
                  </span>
                  {organizationLogos.map((logo) => (
                    <Image
                      key={logo.src}
                      src={logo.src}
                      alt={copy === 0 ? logo.alt : ""}
                      width={100}
                      height={40}
                      className="h-10 w-auto object-contain grayscale opacity-75 dark:opacity-60"
                    />
                  ))}
                  {supporters.length > 0 && (
                    <>
                      <div className="w-px h-10 bg-gray-400/25 dark:bg-gray-500/25" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 -mr-6">
                        Apoio
                      </span>
                      {supporters.map((supporter) =>
                        supporter.logo ? (
                          <Image
                            key={supporter.name}
                            src={supporter.logo}
                            alt={copy === 0 ? `Logo ${supporter.name}` : ""}
                            width={100}
                            height={40}
                            className="h-10 w-auto object-contain grayscale opacity-75 dark:opacity-60"
                          />
                        ) : (
                          <span
                            key={supporter.name}
                            className="text-base font-display font-bold text-gray-400"
                          >
                            {supporter.name}
                          </span>
                        ),
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </section>

      {/* SESSÃO SOBRE */}
      <section
        id="sobre"
        className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-seas-bgAltLight dark:bg-seas-bgAltDark transition-colors duration-300"
      >
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 sm:mb-12">
            <h2 className="text-2xl md:text-4xl font-display font-bold mb-4">
              Ajudamos você a <br />
              <span className="text-seas-teal">descomplicar a ciência.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[minmax(220px,auto)]">
            <div className="bg-white dark:bg-seas-cardDark rounded-3xl p-6 md:col-span-2 row-span-2 border border-seas-borderLight dark:border-seas-borderDark shadow-sm flex flex-col justify-between group overflow-hidden relative">
              <div className="relative z-10">
                <div className="w-32 h-32 rounded-2xl bg-seas-purple/10 flex items-center justify-center mb-6">
                  <Image
                    src="/ui/logo-simbolo.svg"
                    alt="Símbolo SEAS"
                    width={40}
                    height={40}
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <h3 className="text-xl font-display font-bold mb-4">
                  O que é a SEAS?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed max-w-xl">
                  {settings?.aboutText}
                </p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-seas-purple/5 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
            </div>

            <div className="bg-seas-purple text-white rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden">
              <h3 className="text-lg font-display font-bold mb-4 relative z-10">
                Para quem é?
              </h3>
              <ul className="space-y-3 text-sm font-medium relative z-10">
                <li className="flex items-center gap-2">
                  <HiCheckCircle className="text-seas-teal text-lg" />{" "}
                  Graduandos (UFC, UVA, IFCE)
                </li>
                <li className="flex items-center gap-2">
                  <HiCheckCircle className="text-seas-teal text-lg" />{" "}
                  Pesquisadores iniciantes
                </li>
                <li className="flex items-center gap-2">
                  <HiCheckCircle className="text-seas-teal text-lg" /> Futuros
                  Mestrandos
                </li>
              </ul>
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-[4rem]"></div>
            </div>

            <div className="bg-seas-teal text-gray-900 rounded-3xl p-6 flex flex-col justify-center">
              <h3 className="text-lg font-display font-bold mb-2">
                Nosso Objetivo
              </h3>
              <p className="font-medium text-gray-800 leading-snug text-base">
                Acelerar sua escrita, otimizar formatações chatas e construir
                uma rede forte de apoio acadêmico em Sobral.
              </p>
              <div className="mt-auto pt-5">
                <span className="text-3xl font-display font-bold tracking-tighter">
                  3 Dias
                </span>
                <span className="block text-xs font-bold uppercase tracking-wider opacity-80 mt-1">
                  de puro conteúdo prático
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SESSÃO: PALESTRANTES */}
      <section
        id="palestrantes"
        className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-seas-bgLight dark:bg-seas-bgDark transition-colors duration-300"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-display font-bold mb-3">
                Quem vai te <br />
                <span className="text-seas-darkPurple dark:text-seas-purple">
                  guiar
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm max-w-lg">
                Professores, pesquisadores e especialistas trazendo a realidade
                nua e crua (e prática) da vida acadêmica.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedSpeakers.length > 0 ? (
              paginatedSpeakers.map((speaker, idx) => (
                <div key={idx} className="group">
                  <div className="bg-seas-bgAltLight dark:bg-seas-cardDark rounded-[1.5rem] p-5 text-center border border-seas-borderLight dark:border-seas-borderDark hover:border-seas-green dark:hover:border-seas-green transition-colors h-full flex flex-col">
                    {/* grayscale only on mouse devices; touch screens can't hover, so they always see the photo in color */}
                    <img
                      src={
                        speaker.avatar ||
                        `https://placehold.co/400x400/22c55e/ffffff?text=${speaker.name.charAt(0)}`
                      }
                      alt={speaker.name}
                      className="w-28 h-28 rounded-full mx-auto mb-5 object-cover border-4 border-white dark:border-slate-800 shadow-md pointer-fine:grayscale pointer-fine:group-hover:grayscale-0 transition-all"
                    />
                    <h4 className="text-lg font-display font-bold mb-1">
                      {speaker.name}
                    </h4>
                    <p className="text-seas-green font-semibold text-xs mb-3">
                      {speaker.role}
                    </p>
                    {speaker.bio && (
                      <p className="text-gray-600 dark:text-gray-400 text-xs">
                        {speaker.bio}
                      </p>
                    )}
                    {/* optional profile links registered on keystatic */}
                    {(speaker.lattes || speaker.linkedin) && (
                      <div className="flex items-center justify-center gap-2 mt-auto pt-4">
                        {speaker.lattes && (
                          <a
                            href={speaker.lattes}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-seas-borderLight dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-seas-green hover:text-seas-green transition-colors"
                          >
                            <HiAcademicCap className="text-sm" /> Lattes
                          </a>
                        )}
                        {speaker.linkedin && (
                          <a
                            href={speaker.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-seas-borderLight dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-seas-green hover:text-seas-green transition-colors"
                          >
                            <FaLinkedin className="text-sm" /> LinkedIn
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center text-gray-500 py-10">
                Cadastre os palestrantes no painel Admin (/keystatic)
              </div>
            )}
          </div>

          {totalSpeakerPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button
                onClick={() => setSpeakerPage((prev) => Math.max(prev - 1, 1))}
                disabled={speakerPage === 1}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-seas-bgAltLight dark:bg-seas-cardDark border border-seas-borderLight dark:border-slate-700 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-seas-purple transition-all flex items-center gap-1"
              >
                <HiChevronLeft /> Anterior
              </button>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                Página {speakerPage} de {totalSpeakerPages}
              </span>
              <button
                onClick={() =>
                  setSpeakerPage((prev) =>
                    Math.min(prev + 1, totalSpeakerPages),
                  )
                }
                disabled={speakerPage === totalSpeakerPages}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-seas-bgAltLight dark:bg-seas-cardDark border border-seas-borderLight dark:border-slate-700 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-seas-purple transition-all flex items-center gap-1"
              >
                Próxima <HiChevronRight />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SESSÃO CRONOGRAMA */}
      <section
        id="cronograma"
        className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-seas-darkPurple dark:bg-[#150a25] text-white transition-colors duration-300"
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <h2 className="text-2xl md:text-4xl font-display font-bold">
              Programação
            </h2>

            <div className="flex bg-black/20 p-1 rounded-full border border-white/10">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${activeFilter === "all" ? "bg-white text-seas-darkPurple" : "text-gray-300 hover:text-white"}`}
              >
                Tudo
              </button>
              <button
                onClick={() => setActiveFilter("palestra")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${activeFilter === "palestra" ? "bg-white text-seas-darkPurple" : "text-gray-300 hover:text-white"}`}
              >
                Palestras
              </button>
              <button
                onClick={() => setActiveFilter("oficina")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${activeFilter === "oficina" ? "bg-white text-seas-darkPurple" : "text-gray-300 hover:text-white"}`}
              >
                Oficinas
              </button>
            </div>
          </div>

          {/* tip explaining how to build a personal agenda (click-based so it also works on touch screens) */}
          <div className="mb-10 -mt-4">
            <button
              onClick={() => setIsAgendaTipOpen((prev) => !prev)}
              aria-expanded={isAgendaTipOpen}
              className="flex items-center gap-2 text-sm font-semibold text-seas-green hover:text-seas-teal transition-colors"
            >
              <HiQuestionMarkCircle className="text-lg" />
              Como montar minha programação?
            </button>
            {isAgendaTipOpen && (
              <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-300 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                Escolha as atividades que mais combinam com você e toque em{" "}
                <strong className="text-white">Adicionar à agenda</strong> em
                cada uma delas. O Google Agenda abre com o nome, horário, local e
                ministrante já preenchidos, é só salvar! Assim você monta sua
                programação antes do evento e recebe os lembretes no celular.
              </div>
            )}
          </div>

          <div className="relative pl-6 md:pl-8">
            <div className="absolute left-[11px] md:left-[15px] top-4 bottom-10 w-px bg-white/20"></div>

            <div className="space-y-10">
              {groupedScheduleArray.length > 0 ? (
                groupedScheduleArray.map((group) => (
                  <div key={group.date} className="relative">
                    <div className="absolute left-[-20.5px] md:left-[-24.5px] top-1.5 w-4 h-4 rounded-full bg-seas-green shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
                    <h3 className="text-lg font-display font-bold text-seas-green mb-5 ml-2">
                      {group.date}
                    </h3>

                    <div className="space-y-4 ml-2 mb-6">
                      {group.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row justify-between gap-3">
                            {/* the text column takes the remaining space so the location column keeps its width */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span
                                  className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider shadow-sm ${getScheduleType(item.type).badge}`}
                                >
                                  {getScheduleType(item.type).label}
                                </span>
                                <span className="text-gray-300 text-xs font-medium flex items-center gap-1">
                                  <HiClock /> {item.startTime} as {item.endTime}
                                </span>
                              </div>
                              <h4 className="text-lg font-bold mb-1">
                                {item.title}
                              </h4>
                              <p className="text-gray-300 text-xs flex items-center gap-2">
                                <HiUserCircle className="text-base" />{" "}
                                {item.speakerName}
                              </p>
                            </div>
                            <div className="sm:text-right flex flex-col items-start sm:items-end gap-2 sm:shrink-0">
                              <span className="text-xs font-medium text-gray-300 bg-black/40 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1 sm:whitespace-nowrap">
                                <HiLocationMarker /> {getLocationLabel(item.location)}
                              </span>
                              <button
                                onClick={() => handleViewOnMap(item.location)}
                                className="text-[10px] uppercase tracking-wider font-bold text-seas-green hover:text-seas-teal transition-colors flex items-center gap-1"
                              >
                                Ver no mapa 3D <HiArrowRight />
                              </button>
                              {(() => {
                                const calendarLink = buildGoogleCalendarLink(item);
                                return calendarLink ? (
                                  <a
                                    href={calendarLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] uppercase tracking-wider font-bold text-white bg-white/10 hover:bg-seas-green hover:text-gray-900 border border-white/15 px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                                  >
                                    <HiCalendar /> Adicionar à agenda
                                  </a>
                                ) : null;
                              })()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm py-4 ml-2">
                  Nenhuma atividade cadastrada para este filtro.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SESSÃO DO MAPA 3D */}
      <CampusMapSection
        schedule={schedule}
        activeLocation={activeMapLocation}
        onLocationSelect={setActiveMapLocation}
      />

      {/* SESSÃO KITS / LOJINHA */}
      <section
        id="kits"
        className="py-0 pb-20 sm:py-6 px-4 sm:px-6 lg:px-8 bg-seas-bgLight dark:bg-seas-bgDark transition-colors duration-300"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-display font-bold mb-4">
              Apoie a <span className="text-seas-teal">SEAS</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xl mx-auto">
              A inscrição é gratuita. Comprar um kit nos ajuda a cobrir custos
              essenciais e possibilita que o evento aconteça mais vezes, além de
              garantir souvenirs exclusivos da nossa 1ª edição!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-seas-cardDark border-2 border-seas-borderLight dark:border-seas-borderDark rounded-[1.5rem] p-6 flex flex-col hover:border-seas-purple transition-colors relative">
              <div className="w-full h-32 bg-gray-50 dark:bg-slate-800/50 rounded-xl mb-5 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 overflow-hidden">
                {store.kit1Image ? (
                  <Image
                    src={store.kit1Image}
                    alt={store.kit1Name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center text-gray-400 gap-2">
                    <BsImage className="text-2xl" />
                    <span className="text-sm">[Imagem {store.kit1Name}]</span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-display font-bold mb-1">
                {store.kit1Name}
              </h3>
              {/* shows the crossed-out "de" price only when it is higher than the current one */}
              <div className="mb-5">
                {store.kit1OriginalPrice != null &&
                  store.kit1OriginalPrice > store.kit1Price && (
                    <span className="block text-xs text-gray-400 line-through">
                      de {formatPrice(store.kit1OriginalPrice)}
                    </span>
                  )}
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-seas-purple">
                    {formatPrice(store.kit1Price)}
                  </span>
                  {store.kit1OriginalPrice != null &&
                    store.kit1OriginalPrice > store.kit1Price && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-seas-purple/10 text-seas-purple px-2 py-0.5 rounded-full">
                        Pré-venda
                      </span>
                    )}
                </div>
              </div>
              <ul className="space-y-2.5 mb-6 flex-grow text-gray-600 dark:text-gray-300 font-medium text-xs">
                {store.kit1Items &&
                  store.kit1Items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <HiCheckCircle className="text-seas-purple text-base" />{" "}
                      {item}
                    </li>
                  ))}
              </ul>
              <button
                onClick={() => reserveKit(1)}
                disabled={store.kit1SoldOut}
                className="w-full bg-seas-bgAltLight dark:bg-slate-800 text-gray-900 dark:text-white font-bold py-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors border border-seas-borderLight dark:border-slate-600 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {store.kit1SoldOut ? (
                  "Esgotado"
                ) : (
                  <>
                    <FaWhatsapp className="text-green-500 text-lg" /> Reservar
                  </>
                )}
              </button>
            </div>

            <div className="bg-seas-darkPurple dark:bg-[#2e154f] text-white rounded-[1.5rem] p-6 flex flex-col relative transform md:-translate-y-4 shadow-xl border-2 border-seas-purple">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-seas-green text-gray-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Mais Popular
              </div>

              <div className="w-full h-32 bg-black/20 rounded-xl mb-5 flex items-center justify-center border border-dashed border-white/20 overflow-hidden">
                {store.kit2Image ? (
                  <Image
                    src={store.kit2Image}
                    alt={store.kit2Name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center text-white/50 gap-2">
                    <BsImage className="text-2xl" />
                    <span className="text-sm">[Imagem {store.kit2Name}]</span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-display font-bold mb-1">
                {store.kit2Name}
              </h3>
              <div className="mb-5">
                {store.kit2OriginalPrice != null &&
                  store.kit2OriginalPrice > store.kit2Price && (
                    <span className="block text-xs text-gray-300 line-through">
                      de {formatPrice(store.kit2OriginalPrice)}
                    </span>
                  )}
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-seas-green">
                    {formatPrice(store.kit2Price)}
                  </span>
                  {store.kit2OriginalPrice != null &&
                    store.kit2OriginalPrice > store.kit2Price && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-seas-green/15 text-seas-green px-2 py-0.5 rounded-full">
                        Pré-venda
                      </span>
                    )}
                </div>
              </div>
              <ul className="space-y-2.5 mb-6 flex-grow text-gray-200 font-medium text-xs">
                {store.kit2Items &&
                  store.kit2Items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <HiCheckCircle className="text-seas-green text-base" />{" "}
                      {item}
                    </li>
                  ))}
              </ul>
              <button
                onClick={() => reserveKit(2)}
                disabled={store.kit2SoldOut}
                className="w-full bg-seas-green text-gray-900 font-bold py-2.5 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {store.kit2SoldOut ? (
                  "Esgotado"
                ) : (
                  <>
                    <FaWhatsapp className="text-lg" /> Reservar
                  </>
                )}
              </button>
            </div>

            <div className="bg-white dark:bg-seas-cardDark border-2 border-seas-borderLight dark:border-seas-borderDark rounded-[1.5rem] p-6 flex flex-col hover:border-seas-teal transition-colors">
              <div className="w-full h-32 bg-gray-100 dark:bg-slate-800 rounded-xl mb-5 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 flex-wrap gap-2 p-4">
                <div className="w-6 h-6 rounded-full bg-seas-purple border-2 border-white dark:border-slate-800"></div>
                <div className="w-6 h-6 bg-seas-teal transform rotate-12 border-2 border-white dark:border-slate-800"></div>
                <div className="w-6 h-6 rounded-full bg-seas-green border-2 border-white dark:border-slate-800"></div>
                <span className="text-gray-400 text-[10px] w-full text-center mt-1">
                  Escolha solta
                </span>
              </div>

              <h3 className="text-xl font-display font-bold mb-1">
                Monte o Seu
              </h3>
              <div className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-5">
                A partir de {formatPrice(Math.min(store.adesivoPrice, store.bottonPrice))}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-6 flex-grow">
                Quer bottons específicos ou mais adesivos para o seu notebook?
                Personalize as quantidades.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-seas-teal text-gray-900 font-bold py-2.5 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <HiAdjustments className="text-lg" /> Montar Agora
              </button>
            </div>
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 opacity-80">
            <div className="flex items-center gap-3 text-xs font-medium text-gray-600 dark:text-gray-400">
              <FaWhatsapp className="text-xl text-seas-green" />
              <span>1. Reserva via WhatsApp</span>
            </div>
            <HiChevronRight className="text-gray-300 dark:text-gray-600 hidden md:block" />
            <div className="flex items-center gap-3 text-xs font-medium text-gray-600 dark:text-gray-400">
              <BsCashCoin className="text-xl text-seas-green" />
              <span>2. Pagamento Antecipado</span>
            </div>
            <HiChevronRight className="text-gray-300 dark:text-gray-600 hidden md:block" />
            <div className="flex items-center gap-3 text-xs font-medium text-gray-600 dark:text-gray-400">
              <BsBoxSeam className="text-xl text-seas-green" />
              <span>3. Retirada presencial na SEAS</span>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL DE KITS PERSONALIZADOS */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center px-4 transition-opacity duration-300">
          <div className={storeModalClass}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <HiX className="text-xl" />
            </button>

            <h3 className="text-xl font-display font-bold mb-2">
              Seu Kit Personalizado
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-5">
              Adicione os itens desejados.
            </p>

            <div className="space-y-4 mb-5">
              <h4 className="font-bold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider">
                Adesivos
              </h4>

              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-seas-teal/20 text-seas-teal flex items-center justify-center">
                    <BiSolidSticker className="text-sm" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">Adesivos Diversos</div>
                    {store.adesivoSoldOut ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                        Esgotado
                      </span>
                    ) : (
                      <div className="text-[10px] text-gray-500 dark:text-gray-400">
                        {formatPrice(store.adesivoPrice)} un.
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateAdesivoQty(-1)}
                    className="w-7 h-7 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <HiMinus className="text-xs" />
                  </button>
                  <span className="font-bold w-4 text-center text-sm">
                    {adesivoQty}
                  </span>
                  <button
                    onClick={() => updateAdesivoQty(1)}
                    disabled={store.adesivoSoldOut}
                    className="w-7 h-7 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <HiPlus className="text-xs" />
                  </button>
                </div>
              </div>

              <h4 className="font-bold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider mt-5">
                Bottons
              </h4>

              {bottons.length > 0 ? (
                // sold-out bottons are listed last and can't be added
                [...bottons]
                  .sort((a, b) => Number(a.soldOut) - Number(b.soldOut))
                  .map((botton) => (
                    <BottonRow
                      key={botton.name}
                      botton={botton}
                      qty={bottonQty[botton.name] || 0}
                      subtitle={`${formatPrice(store.bottonPrice)} un.`}
                      addDisabled={false}
                      onAdd={() => updateBottonQty(botton.name, 1)}
                      onRemove={() => updateBottonQty(botton.name, -1)}
                    />
                  ))
              ) : (
                <div className="text-xs text-gray-500 italic p-2">
                  Nenhum botton cadastrado na loja ainda.
                </div>
              )}
            </div>

            <div className="flex justify-between items-end mb-5 bg-gray-50 dark:bg-slate-800 p-3 rounded-lg">
              <span className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">
                Total a pagar:
              </span>
              <span className="text-xl font-display font-bold text-seas-green">
                {formatPrice(calculateTotal())}
              </span>
            </div>

            <button
              onClick={sendCustomKit}
              disabled={calculateTotal() === 0}
              className="w-full bg-seas-green text-gray-900 font-bold py-2.5 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              <FaWhatsapp className="text-lg" /> Enviar Pedido
            </button>
          </div>
        </div>
      )}

      {/* kit reservation popup: pick exactly the number of bottons the kit includes */}
      {activeKit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center px-4 transition-opacity duration-300">
          <div className={storeModalClass}>
            <button
              onClick={() => setSelectedKit(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <HiX className="text-xl" />
            </button>

            <h3 className="text-xl font-display font-bold mb-1 pr-8">
              {activeKit.name}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-5">
              Escolha {activeKit.bottonCount}{" "}
              {activeKit.bottonCount === 1 ? "botton" : "bottons"} para o seu
              kit. Pode repetir!
            </p>

            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider">
                Bottons
              </h4>
              <span
                className={`text-xs font-bold ${kitBottonsChosen === activeKit.bottonCount ? "text-seas-green" : "text-gray-500 dark:text-gray-400"}`}
              >
                {kitBottonsChosen} de {activeKit.bottonCount} escolhidos
              </span>
            </div>

            <div className="space-y-3 mb-5">
              {bottons.length > 0 ? (
                [...bottons]
                  .sort((a, b) => Number(a.soldOut) - Number(b.soldOut))
                  .map((botton) => (
                    <BottonRow
                      key={botton.name}
                      botton={botton}
                      qty={kitBottonQty[botton.name] || 0}
                      subtitle="Incluso no kit"
                      addDisabled={kitBottonsChosen >= activeKit.bottonCount}
                      onAdd={() => updateKitBottonQty(botton.name, 1)}
                      onRemove={() => updateKitBottonQty(botton.name, -1)}
                    />
                  ))
              ) : (
                <div className="text-xs text-gray-500 italic p-2">
                  Nenhum botton cadastrado na loja ainda.
                </div>
              )}
            </div>

            <div className="flex justify-between items-end mb-5 bg-gray-50 dark:bg-slate-800 p-3 rounded-lg">
              <span className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">
                Total a pagar:
              </span>
              <span className="text-xl font-display font-bold text-seas-green">
                {formatPrice(activeKit.price)}
              </span>
            </div>

            <button
              onClick={sendKitReservation}
              disabled={kitBottonsChosen !== activeKit.bottonCount}
              className="w-full bg-seas-green text-gray-900 font-bold py-2.5 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              <FaWhatsapp className="text-lg" />
              {kitBottonsChosen === activeKit.bottonCount
                ? "Reservar Kit"
                : `Escolha mais ${activeKit.bottonCount - kitBottonsChosen}`}
            </button>
          </div>
        </div>
      )}

      {/* SESSÃO INSCRIÇÃO / INGRESSO FINAL */}
      <section
        id="inscricao"
        className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-seas-bgAltLight dark:bg-[#0a0f1d] transition-colors duration-300 relative overflow-hidden flex flex-col items-center justify-center min-h-[80vh]"
      >
        <div className="text-center mb-8 z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Transforme sua <br /> jornada acadêmica.
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Vagas limitadas. Garanta seu lugar gratuitamente agora.
          </p>
        </div>

        <div className="max-w-3xl w-full mx-auto relative z-10 flex flex-col md:flex-row filter drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500">
          <div className="bg-seas-darkPurple dark:bg-slate-900 text-white p-6 md:p-10 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none flex-grow relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-6 -bottom-6 opacity-20 pointer-events-none filter brightness-0 invert">
              <Image
                src="/ui/logo-simbolo.svg"
                alt=""
                width={150}
                height={150}
                className="w-[150px] h-[150px] object-contain"
              />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-seas-darkPurple font-bold text-xs">
                    S
                  </div>
                  <span className="font-display font-bold tracking-widest text-xs uppercase">
                    Passe Oficial
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-seas-teal font-bold uppercase tracking-widest mb-1">
                    Local
                  </span>
                  <span className="block text-sm font-medium">
                    UFC Campus Sobral
                  </span>
                </div>
              </div>

              <h3 className="text-3xl md:text-5xl font-display font-bold mb-1">
                SEAS 2026
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                I Semana da Escrita Acadêmica
              </p>

              <div className="flex gap-6">
                <div>
                  <span className="block text-[10px] text-seas-teal font-bold uppercase tracking-widest mb-1">
                    Data
                  </span>
                  <span className="block text-sm font-medium">19-21 Out</span>
                </div>
                <div>
                  <span className="block text-[10px] text-seas-teal font-bold uppercase tracking-widest mb-1">
                    Horário
                  </span>
                  <span className="block text-sm font-medium">
                    14:00 às 18:00
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none ticket-stub w-full md:w-64 flex flex-col justify-between relative">
            <div className="absolute -top-3 md:-left-3 md:top-1/2 md:-translate-y-1/2 left-1/2 -translate-x-1/2 md:translate-x-0 w-6 h-6 bg-seas-bgAltLight dark:bg-[#0a0f1d] rounded-full"></div>

            <div>
              <div className="flex justify-between items-center mb-5">
                <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
                  Grátis
                </span>
                <HiCheckCircle className="text-seas-green text-xl" />
              </div>

              <div className="flex gap-1 justify-center mb-2 h-10 opacity-70">
                <div className="w-1 bg-gray-800 dark:bg-gray-300 h-full"></div>
                <div className="w-2 bg-gray-800 dark:bg-gray-300 h-full"></div>
                <div className="w-1 bg-gray-800 dark:bg-gray-300 h-full"></div>
                <div className="w-3 bg-gray-800 dark:bg-gray-300 h-full"></div>
                <div className="w-1 bg-gray-800 dark:bg-gray-300 h-full"></div>
                <div className="w-1 bg-gray-800 dark:bg-gray-300 h-full"></div>
                <div className="w-2 bg-gray-800 dark:bg-gray-300 h-full"></div>
                <div className="w-4 bg-gray-800 dark:bg-gray-300 h-full"></div>
                <div className="w-1 bg-gray-800 dark:bg-gray-300 h-full"></div>
                <div className="w-2 bg-gray-800 dark:bg-gray-300 h-full"></div>
              </div>
              <p className="text-[10px] text-center text-gray-400 font-mono tracking-widest mb-8">
                UFC-SBL-2026-001
              </p>
            </div>

            <a
              href={settings?.googleFormsLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-seas-green text-gray-900 font-bold py-4 rounded-xl text-center hover:bg-opacity-90 transition-all shadow-lg shadow-seas-green/30 block"
            >
              Inscrever-se Agora
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-seas-cardDark border-t border-seas-borderLight dark:border-seas-borderDark py-10 px-4 transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
            <div className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
              <Image
                src="/ui/logo-horizontal.svg"
                alt="Logo SEAS"
                width={120}
                height={40}
                className="h-6 w-auto"
              />
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-slate-600"></div>
            <span className="text-sm font-medium">UFC Campus Sobral</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-right">
            &copy; 2026 Organização SEAS. <br className="md:hidden" />
            <span className="text-xs mt-1 inline-block">
              Realização: PET | Apoio: Coordenação de Curso
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
