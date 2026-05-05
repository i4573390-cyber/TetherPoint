import React, { useEffect, useMemo, useRef, useState } from "react";

const Icon = ({ children, className = "" }) => (
  <span className={`inline-flex items-center justify-center ${className}`}>{children}</span>
);

const ArrowRightLeft = ({ className = "" }) => <Icon className={className}>⇄</Icon>;
const Calculator = ({ className = "" }) => <Icon className={className}>≡</Icon>;
const CheckCircle2 = ({ className = "" }) => <Icon className={className}>✓</Icon>;
const ChevronDown = ({ className = "" }) => <Icon className={className}>⌄</Icon>;
const ChevronLeft = ({ className = "" }) => <Icon className={className}>‹</Icon>;
const ChevronRight = ({ className = "" }) => <Icon className={className}>›</Icon>;
const Globe2 = ({ className = "" }) => <Icon className={className}>🌐</Icon>;
const MapPin = ({ className = "" }) => <Icon className={className}>⌖</Icon>;
const MessageCircle = ({ className = "" }) => <Icon className={className}>↗</Icon>;
const ShieldCheck = ({ className = "" }) => <Icon className={className}>◇</Icon>;
const Star = ({ className = "" }) => <Icon className={className}>★</Icon>;
const WalletCards = ({ className = "" }) => <Icon className={className}>▣</Icon>;
const Zap = ({ className = "" }) => <Icon className={className}>⚡</Icon>;

const TELEGRAM_URL = "https://t.me/TetherPointExchange";

const fiatCurrencies = ["RUB", "KZT", "USD", "EUR", "CNY", "AED", "TRY", "THB"];
const cryptoCurrencies = ["USDT", "BTC", "ETH", "USDC", "TON", "TRX", "BNB", "SOL", "LTC", "XRP"];
const allCurrencies = [...fiatCurrencies, ...cryptoCurrencies];

const cityNamesRu = [
  "Великий Новгород",
  "Вологда",
  "Волгоград",
  "Воронеж",
  "Екатеринбург",
  "Иваново",
  "Калуга",
  "Киров",
  "Кострома",
  "Красноярск",
  "Махачкала",
  "Москва",
  "Санкт-Петербург",
  "Саратов",
  "Смоленск",
  "Тверь",
  "Тольятти",
  "Томск",
  "Тула",
  "Чебоксары",
];

const cityNamesEn = [
  "Cheboksary",
  "Ekaterinburg",
  "Ivanovo",
  "Kaluga",
  "Kirov",
  "Kostroma",
  "Krasnoyarsk",
  "Makhachkala",
  "Moscow",
  "Saint Petersburg",
  "Saratov",
  "Smolensk",
  "Tomsk",
  "Tolyatti",
  "Tula",
  "Tver",
  "Veliky Novgorod",
  "Vologda",
  "Volgograd",
  "Voronezh",
];

const cryptoIds = {
  USDT: "tether",
  BTC: "bitcoin",
  ETH: "ethereum",
  USDC: "usd-coin",
  TON: "the-open-network",
  TRX: "tron",
  BNB: "binancecoin",
  SOL: "solana",
  LTC: "litecoin",
  XRP: "ripple",
};

const fallbackUsdPrices = {
  USDT: 1,
  USDC: 1,
  BTC: 76271,
  ETH: 2261,
  TON: 3.2,
  TRX: 0.27,
  BNB: 590,
  SOL: 138,
  LTC: 86,
  XRP: 2.2,
};

const RUB_SERVICE_BASE_PREMIUM = 3.05;

const cityRateAdjustment = {
  "Москва": 0.25,
  "Санкт-Петербург": 0.15,
  "Екатеринбург": 0.1,
  "Красноярск": 0.08,
  "Махачкала": -0.05,
};

const getLiveMarketAdjustment = () => {
  const now = new Date();
  const fiveMinuteSlot = Math.floor(now.getTime() / (5 * 60 * 1000));
  return Math.sin(fiveMinuteSlot * 12.9898) * 0.28;
};

const getRubServiceRate = (marketRubRate, cityName) => {
  const base = Number(marketRubRate || 0);
  const cityAdj = cityRateAdjustment[cityName] || 0;
  const liveAdj = getLiveMarketAdjustment();
  return base > 0 ? base + RUB_SERVICE_BASE_PREMIUM + cityAdj + liveAdj : 77;
};

const fallbackFxToUsd = {
  USD: 1,
  EUR: 1.17,
  RUB: 1 / 77,
  KZT: 1 / 520,
  CNY: 1 / 6.83,
  AED: 1 / 3.6725,
  TRY: 1 / 45.18,
  THB: 1 / 32.5,
};

const exchangeMarkup = {
  fiatToCrypto: 1,
  cryptoToFiat: 1,
  cryptoToCrypto: 1,
  fiatToFiat: 1,
};

const ru = {
  nav: ["Калькулятор", "Города", "Преимущества", "Отзывы", "FAQ"],
  heroLabel: "Сеть обменников по России",
  heroTitle: "Tether Point",
  heroSubtitle: "Обмен USDT, криптовалюты и фиатных валют в городах России",
  heroText:
    "Рассчитайте ориентировочную сумму обмена, выберите город и зафиксируйте условия через Telegram.",
  calcBtn: "Рассчитать обмен",
  tgBtn: "Написать в Telegram",
  calculatorTitle: "Калькулятор обмена",
  calculatorText: "Live-расчет по рыночным данным с учетом сервисного коэффициента.",
  give: "Отдаю",
  receive: "Получаю",
  amount: "Сумма",
  city: "Город",
  result: "Вы получите примерно",
  rate: "Ориентировочный курс",
  rateNote: "Финальный курс, резерв и адрес обменного пункта подтверждаются менеджером в Telegram.",
  fixRate: "Зафиксировать курс в Telegram",
  citiesTitle: "Города присутствия",
  citiesText: "В некоторых городах доступно несколько пунктов. Адреса обменных пунктов уточняйте у менеджера в Telegram.",
  addressBtn: "Уточнить адрес",
  whyTitle: "Почему выбирают нас",
  reviewsTitle: "Отзывы клиентов",
  faqTitle: "FAQ",
  footerText: `Сервис обмена цифровых и фиатных валют, создан в 2025 году.
Все права защищены. Остерегайтесь мошенников — переходите только по официальной ссылке в Telegram.`,
  loading: "Обновляем курсы...",
  live: "Live-курсы",
  fallback: "Резервный расчет",
  lang: "EN",
};

const en = {
  nav: ["Calculator", "Cities", "Benefits", "Reviews", "FAQ"],
  heroLabel: "Exchange network across Russia",
  heroTitle: "Tether Point",
  heroSubtitle: "USDT, crypto and fiat exchange points across Russian cities",
  heroText:
    "Calculate an estimated exchange amount, choose your city and confirm the final terms via Telegram.",
  calcBtn: "Calculate exchange",
  tgBtn: "Contact on Telegram",
  calculatorTitle: "Exchange calculator",
  calculatorText: "Live market-based calculation with a service coefficient included.",
  give: "You give",
  receive: "You receive",
  amount: "Amount",
  city: "City",
  result: "Estimated amount",
  rate: "Estimated rate",
  rateNote: "The final rate, reserve and exchange point address are confirmed by a manager via Telegram.",
  fixRate: "Fix rate on Telegram",
  citiesTitle: "Available cities",
  citiesText: "Some cities have several exchange points. Please confirm office addresses with a manager on Telegram.",
  addressBtn: "Request address",
  whyTitle: "Why choose us",
  reviewsTitle: "Client reviews",
  faqTitle: "FAQ",
  footerText: `Digital and fiat currency exchange service established in 2025.
All rights reserved. Beware of scammers — use only the official Telegram link.`,
  loading: "Updating rates...",
  live: "Live rates",
  fallback: "Backup calculation",
  lang: "RU",
};

const stepsRu = [
  ["01", "Рассчитайте сумму", "Выберите направление обмена, валюту, город и укажите сумму."],
  ["02", "Напишите в Telegram", "Менеджер подтвердит курс, резерв, адрес и доступное время."],
  ["03", "Выберите формат", "Доступны обмен в офисе, курьер и вывод на карту в офисе."],
  ["04", "Завершите обмен", "Сделка проходит по заранее согласованным условиям без предоплат."],
];

const stepsEn = [
  ["01", "Calculate the amount", "Choose the exchange direction, currency, city and enter the amount."],
  ["02", "Contact us on Telegram", "A manager will confirm the rate, reserve, address and available time."],
  ["03", "Choose the format", "Office exchange, courier service and card payout at the office are available."],
  ["04", "Complete the exchange", "The transaction follows pre-confirmed terms with no prepayments."],
];

const safetyRu = [
  ["Никаких предоплат", "Мы не просим переводить средства заранее. Условия подтверждаются до обмена."],
  ["Официальный Telegram", "Переходите только по ссылке с сайта: @TetherPointExchange."],
  ["Подтверждение условий", "Курс, резерв, город и формат обмена фиксируются перед сделкой."],
  ["Проверка реквизитов", "Перед переводом всегда сверяйте контакт и детали с менеджером."],
];

const safetyEn = [
  ["No prepayments", "We do not ask you to transfer funds in advance. Terms are confirmed before the exchange."],
  ["Official Telegram", "Use only the link from the website: @TetherPointExchange."],
  ["Terms confirmation", "Rate, reserve, city and exchange format are confirmed before the transaction."],
  ["Details check", "Always verify the contact and transaction details with the manager before transfer."],
];

const benefitsRu = [
  [Zap, "Никаких предоплат", "Вы не переводите деньги заранее. Условия подтверждаются до обмена."],
  [MapPin, "Офисы в городах", "Выберите город и уточните актуальный адрес обменного пункта через Telegram."],
  [WalletCards, "Офис, курьер и карта", "Доступны обмен в офисе, выезд курьера и вывод на карту в офисе."],
  [MessageCircle, "Telegram-заявка", "Курс, резерв и адрес удобно уточнить в одном чате."],
  [ShieldCheck, "Понятные условия", "Итоговые параметры сделки подтверждаются перед обменом."],
  [ArrowRightLeft, "Крипта и наличные", "Покупка и продажа USDT, криптовалюты и фиатных валют."],
];

const benefitsEn = [
  [Zap, "No prepayments", "You do not transfer funds in advance. Terms are confirmed before the exchange."],
  [MapPin, "City offices", "Choose your city and request the current exchange point address via Telegram."],
  [WalletCards, "Office, courier and card", "Office exchange, courier service and card payout at the office are available."],
  [MessageCircle, "Telegram request", "Rate, reserve and address can be confirmed in one chat."],
  [ShieldCheck, "Clear terms", "Final exchange terms are confirmed before the transaction."],
  [ArrowRightLeft, "Crypto and cash", "Buy and sell USDT, cryptocurrencies and fiat currencies."],
];

const reviewsRu = [
  ["Алексей", "Воронеж", "Рассчитал сумму на сайте, написал в Telegram, курс подтвердили быстро."],
  ["Марина", "Саратов", "Удобно, что есть выбор города и можно заранее понять примерную сумму обмена."],
  ["Дмитрий", "Тула", "Понравилось, что не нужно долго искать контакт — сразу перешел в Telegram."],
  ["Руслан", "Махачкала", "Обмен прошел спокойно, условия заранее согласовали."],
  ["Екатерина", "Вологда", "Уточнила адрес через Telegram, приехала в офис и получила расчет без лишних вопросов."],
  ["Игорь", "Красноярск", "Понравилось, что не просили предоплату. Сначала подтвердили курс и условия."],
  ["Антон", "Волгоград", "Выбрал город, рассчитал USDT и сразу отправил заявку менеджеру."],
];

const reviewsEn = [
  ["Alex", "Voronezh", "I calculated the amount on the website, contacted Telegram and the rate was confirmed quickly."],
  ["Marina", "Saratov", "It is convenient to choose a city and understand the estimated exchange amount in advance."],
  ["Dmitry", "Tula", "I liked that the contact is easy to find — one click to Telegram."],
  ["Ruslan", "Makhachkala", "The exchange was smooth, and the terms were agreed in advance."],
  ["Ekaterina", "Vologda", "I requested the address via Telegram, came to the office and received the calculation without extra hassle."],
  ["Igor", "Krasnoyarsk", "I liked that there was no prepayment. The rate and terms were confirmed first."],
  ["Anton", "Volgograd", "I chose the city, calculated USDT and sent the request to the manager right away."],
];

const faqRu = [
  ["Какие валюты доступны?", "RUB, KZT, USD, EUR, CNY, AED, TRY, THB и популярные криптовалюты."],
  ["Какие криптовалюты можно обменять?", "USDT, BTC, ETH, USDC, TON, TRX, BNB, SOL, LTC, XRP."],
  ["Калькулятор показывает точную сумму?", "Калькулятор показывает ориентировочный расчет. Финальный курс, резерв и условия подтверждаются через Telegram."],
  ["Где находятся обменные пункты?", "Выберите город на сайте и напишите в Telegram. Менеджер подскажет актуальный адрес."],
  ["Можно ли обменять крупную сумму?", "Да, крупные суммы согласовываются индивидуально."],
  ["Как зафиксировать курс?", "После расчета нажмите кнопку фиксации курса и отправьте заявку менеджеру в Telegram."],
];

const faqEn = [
  ["Which fiat currencies are available?", "RUB, KZT, USD, EUR, CNY, AED, TRY, THB and popular cryptocurrencies."],
  ["Which cryptocurrencies are supported?", "USDT, BTC, ETH, USDC, TON, TRX, BNB, SOL, LTC, XRP."],
  ["Is the calculator amount final?", "The calculator shows an estimated result. The final rate, reserve and terms are confirmed via Telegram."],
  ["Where are the exchange points located?", "Choose a city and contact us on Telegram. A manager will provide the current address."],
  ["Can I exchange a large amount?", "Yes, large amounts are agreed individually."],
  ["How can I fix the rate?", "After calculation, click the rate fixation button and send the request to a manager on Telegram."],
];

function isCrypto(currency) {
  return cryptoCurrencies.includes(currency);
}

function formatNumber(value, max = 6) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: max,
    minimumFractionDigits: value < 1 ? Math.min(max, 4) : 0,
  }).format(value);
}

function telegramLink({ amount, from, to, city, result }) {
  const text = `Здравствуйте. Хочу обменять ${amount} ${from} на ${to}. Город: ${city}. Расчет сайта: примерно ${formatNumber(result)} ${to}.`;
  return `${TELEGRAM_URL}?text=${encodeURIComponent(text)}`;
}

function LogoMark() {
  return (
    <div className="relative h-11 w-11 shrink-0 rounded-full bg-emerald-500/15 shadow-[0_0_36px_rgba(16,185,129,0.38)] ring-1 ring-emerald-400/40">
      <div className="absolute inset-1 rounded-full bg-[#111615]" />
      <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-[7px] border-white border-l-emerald-400 border-t-emerald-400" />
      <div className="absolute left-1/2 top-[58%] h-5 w-5 -translate-x-1/2 rotate-45 rounded-sm bg-white" />
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#111615] ring-2 ring-emerald-400/60" />
    </div>
  );
}

function SelectBox({ label, value, onChange, items }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-white/60">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-14 w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 pr-11 text-base font-semibold text-white outline-none transition focus:border-emerald-400/70"
        >
          {items.map((item) => (
            <option key={item} value={item} className="bg-[#111615]">
              {item}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
      </div>
    </label>
  );
}

function SectionTitle({ kicker, title, text }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      {kicker && <div className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">{kicker}</div>}
      <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-7 text-white/62 md:text-lg">{text}</p>}
    </div>
  );
}

export default function TetherPointSite() {
  const [lang, setLang] = useState("ru");
  const [amount, setAmount] = useState("100000");
  const [from, setFrom] = useState("RUB");
  const [to, setTo] = useState("USDT");
  const [city, setCity] = useState(cityNamesRu[0]);
  const [usdPrices, setUsdPrices] = useState(fallbackUsdPrices);
  const [fxToUsd, setFxToUsd] = useState(fallbackFxToUsd);
  const [liveRates, setLiveRates] = useState(false);
  const [loading, setLoading] = useState(false);
  const reviewsRef = useRef(null);

  const scrollReviews = (direction) => {
    if (!reviewsRef.current) return;
    reviewsRef.current.scrollBy({
      left: direction === "left" ? -380 : 380,
      behavior: "smooth",
    });
  };

  const t = lang === "ru" ? ru : en;
  const cities = lang === "ru" ? cityNamesRu : cityNamesEn;
  const benefits = lang === "ru" ? benefitsRu : benefitsEn;
  const steps = lang === "ru" ? stepsRu : stepsEn;
  const safety = lang === "ru" ? safetyRu : safetyEn;
  const reviews = lang === "ru" ? reviewsRu : reviewsEn;
  const faqs = lang === "ru" ? faqRu : faqEn;

  useEffect(() => {
    setCity((lang === "ru" ? cityNamesRu : cityNamesEn)[0]);
  }, [lang]);

  useEffect(() => {
    let isMounted = true;

    async function loadRates() {
      setLoading(true);
      try {
        const ids = Object.values(cryptoIds).join(",");
        const cryptoSymbols = [
          "BTCUSDT",
          "ETHUSDT",
          "BNBUSDT",
          "SOLUSDT",
          "LTCUSDT",
          "XRPUSDT",
          "TRXUSDT",
          "TONUSDT",
          "USDCUSDT",
        ];
        const cryptoResponse = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbols=${encodeURIComponent(JSON.stringify(cryptoSymbols))}`,
          { cache: "no-store" }
        );
        const cryptoData = await cryptoResponse.json();

        const usdPricesNext = { ...fallbackUsdPrices, USDT: 1 };
        const pairToSymbol = {
          BTCUSDT: "BTC",
          ETHUSDT: "ETH",
          BNBUSDT: "BNB",
          SOLUSDT: "SOL",
          LTCUSDT: "LTC",
          XRPUSDT: "XRP",
          TRXUSDT: "TRX",
          TONUSDT: "TON",
          USDCUSDT: "USDC",
        };
        if (Array.isArray(cryptoData)) {
          cryptoData.forEach((row) => {
            const symbol = pairToSymbol[row.symbol];
            if (symbol && row.price) usdPricesNext[symbol] = Number(row.price);
          });
        }

        const fxResponse = await fetch(`https://open.er-api.com/v6/latest/USD?t=${Date.now()}`, { cache: "no-store" });
        const fxData = await fxResponse.json();
        const rates = fxData?.rates || {};
        const marketRubRate = rates.RUB ? Number(rates.RUB) : 0;
        const serviceRubRate = getRubServiceRate(marketRubRate, city);

        const fxNext = {
          USD: 1,
          RUB: 1 / serviceRubRate,
          KZT: rates.KZT ? 1 / Number(rates.KZT) : fallbackFxToUsd.KZT,
          EUR: rates.EUR ? 1 / Number(rates.EUR) : fallbackFxToUsd.EUR,
          CNY: rates.CNY ? 1 / Number(rates.CNY) : fallbackFxToUsd.CNY,
          AED: rates.AED ? 1 / Number(rates.AED) : fallbackFxToUsd.AED,
          TRY: rates.TRY ? 1 / Number(rates.TRY) : fallbackFxToUsd.TRY,
          THB: rates.THB ? 1 / Number(rates.THB) : fallbackFxToUsd.THB,
        };

        if (isMounted) {
          setUsdPrices(usdPricesNext);
          setFxToUsd(fxNext);
          setLiveRates(true);
        }
      } catch (error) {
        if (isMounted) setLiveRates(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRates();
    const interval = setInterval(loadRates, 300000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [city]);

  const amountNumber = Number(String(amount).replace(",", ".")) || 0;

  const result = useMemo(() => {
    const fromUsd = isCrypto(from) ? usdPrices[from] : fxToUsd[from];
    const toUsd = isCrypto(to) ? usdPrices[to] : fxToUsd[to];
    let value = (amountNumber * fromUsd) / toUsd;

    if (!isCrypto(from) && isCrypto(to)) value = value / exchangeMarkup.fiatToCrypto;
    if (isCrypto(from) && !isCrypto(to)) value = value * exchangeMarkup.cryptoToFiat;
    if (isCrypto(from) && isCrypto(to)) value = value * exchangeMarkup.cryptoToCrypto;
    if (!isCrypto(from) && !isCrypto(to)) value = value * exchangeMarkup.fiatToFiat;

    return value;
  }, [amountNumber, from, to, usdPrices, fxToUsd]);

  const estimatedRate = amountNumber > 0 ? result / amountNumber : 0;
  const rateText =
    !isCrypto(from) && isCrypto(to) && estimatedRate > 0
      ? `1 ${to} ≈ ${formatNumber(1 / estimatedRate, 2)} ${from}`
      : `1 ${from} ≈ ${formatNumber(estimatedRate, 2)} ${to}`;
  const tgHref = telegramLink({ amount, from, to, city, result });

  return (
    <div className="min-h-screen bg-[#070908] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="absolute -right-20 top-80 h-[360px] w-[360px] rounded-full bg-emerald-400/10 blur-[110px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#070908]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <a href="#top" className="flex items-center gap-3">
            <LogoMark />
            <div>
              <div className="text-lg font-black tracking-tight">Tether <span className="text-emerald-400">Point</span></div>
              <div className="text-xs font-medium text-white/45">USDT • CASH • EXCHANGE</div>
            </div>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-white/70 lg:flex">
            {t.nav.map((item, index) => (
              <a key={item} href={["#calculator", "#cities", "#benefits", "#reviews", "#faq"][index]} className="transition hover:text-white">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "ru" ? "en" : "ru")}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Globe2 className="h-4 w-4" /> {t.lang}
            </button>
            <a
              href={TELEGRAM_URL}
              className="hidden h-10 items-center gap-2 rounded-full bg-emerald-400 px-4 text-sm font-black text-[#07100c] transition hover:bg-emerald-300 sm:inline-flex"
            >
              <MessageCircle className="h-4 w-4" /> Telegram
            </a>
          </div>
        </div>
      </header>

      <main id="top" className="relative z-10">
        <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-14 md:px-6 md:pb-24 md:pt-24 lg:grid-cols-[1fr_460px] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.9)]" />
              {t.heroLabel}
            </div>
            <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl lg:text-8xl">
              Tether <span className="text-emerald-400">Point</span>
            </h1>
            <p className="mt-5 max-w-2xl text-2xl font-semibold leading-tight text-white/86 md:text-3xl">
              {t.heroSubtitle}
            </p>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/58">{t.heroText}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#calculator" className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 text-base font-black text-[#07100c] transition hover:bg-emerald-300">
                <Calculator className="h-5 w-5" /> {t.calcBtn}
              </a>
              <a href={TELEGRAM_URL} className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.06] px-6 text-base font-bold text-white transition hover:bg-white/10">
                <MessageCircle className="h-5 w-5" /> {t.tgBtn}
              </a>
            </div>
            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
              {cryptoCurrencies.slice(0, 4).map((item) => (
                <div key={item} className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-center text-sm font-bold text-white/78">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LogoMark />
                  <div>
                    <div className="font-black">Tether <span className="text-emerald-400">Point</span></div>
                    <div className="text-sm text-white/50">USDT • НАЛИЧНЫЕ • ОБМЕН</div>
                  </div>
                </div>
                <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  {liveRates ? t.live : t.fallback}
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-3xl bg-[#101512] p-4">
                  <div className="mb-2 text-sm text-white/50">1 USDT</div>
                  <div className="text-4xl font-black text-white">≈ {formatNumber(usdPrices.USDT / fxToUsd.RUB, 2)} RUB</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-3xl bg-[#101512] p-4">
                    <div className="text-sm text-white/50">BTC</div>
                    <div className="mt-1 text-xl font-black">${formatNumber(usdPrices.BTC, 0)}</div>
                  </div>
                  <div className="rounded-3xl bg-[#101512] p-4">
                    <div className="text-sm text-white/50">ETH</div>
                    <div className="mt-1 text-xl font-black">${formatNumber(usdPrices.ETH, 0)}</div>
                  </div>
                </div>
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">
                  {t.rateNote}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="calculator" className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <SectionTitle kicker="Exchange" title={t.calculatorTitle} text={t.calculatorText} />
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl md:p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm text-white/60">{t.amount}</span>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputMode="decimal"
                    className="h-16 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-2xl font-black text-white outline-none transition placeholder:text-white/20 focus:border-emerald-400/70"
                    placeholder="100000"
                  />
                </label>
                <SelectBox label={t.give} value={from} onChange={setFrom} items={allCurrencies} />
                <SelectBox label={t.receive} value={to} onChange={setTo} items={allCurrencies} />
                <SelectBox label={t.city} value={city} onChange={setCity} items={cities} />
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-2 text-sm text-white/60">{loading ? t.loading : t.rate}</div>
                  <div className="text-lg font-black">{rateText}</div>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-emerald-400/15 to-white/[0.06] p-6 md:p-8">
              <div className="mb-4 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-bold text-emerald-200">
                {city}
              </div>
              <div className="text-sm text-white/55">{t.result}</div>
              <div className="mt-3 break-all text-4xl font-black tracking-tight text-white md:text-5xl">
                {formatNumber(result, 2)} <span className="text-emerald-400">{to}</span>
              </div>
              <p className="mt-5 text-sm leading-6 text-white/58">{t.rateNote}</p>
              <a href={tgHref} className="mt-7 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 text-base font-black text-[#07100c] transition hover:bg-emerald-300">
                <MessageCircle className="h-5 w-5" /> {t.fixRate}
              </a>
            </div>
          </div>
        </section>

        <section id="cities" className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <SectionTitle kicker="Russia" title={t.citiesTitle} text={t.citiesText} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((item) => (
              <div key={item} className="group rounded-3xl border border-white/8 bg-white/[0.045] p-5 transition hover:border-emerald-400/35 hover:bg-emerald-400/[0.08]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="text-lg font-black">{item}</div>
                </div>
                <a href={`${TELEGRAM_URL}?text=${encodeURIComponent(`Здравствуйте. Хочу уточнить адрес обменного пункта Tether Point. Город: ${item}.`)}`} className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-bold text-white/80 transition group-hover:border-emerald-400/35 group-hover:text-emerald-200">
                  {t.addressBtn}
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <SectionTitle
            kicker="Process"
            title={lang === "ru" ? "Как проходит обмен" : "How the exchange works"}
            text={lang === "ru" ? "Простой сценарий: расчет, подтверждение условий, выбор формата и завершение обмена." : "A simple flow: calculation, terms confirmation, format selection and exchange completion."}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(([num, title, text]) => (
              <div key={num} className="relative rounded-[1.75rem] border border-white/8 bg-white/[0.045] p-6 overflow-hidden">
                <div className="absolute -right-3 -top-5 text-7xl font-black text-emerald-400/10">{num}</div>
                <div className="mb-5 inline-flex h-11 min-w-11 items-center justify-center rounded-2xl bg-emerald-400/10 px-3 text-sm font-black text-emerald-300">
                  {num}
                </div>
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-white/58">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <SectionTitle
            kicker="Safety"
            title={lang === "ru" ? "Безопасность сделки" : "Transaction safety"}
            text={lang === "ru" ? "Главные правила, которые помогают защитить клиента и сделать обмен понятным." : "Core rules that help protect clients and make every exchange clear."}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {safety.map(([title, text]) => (
              <div key={title} className="rounded-[1.75rem] border border-emerald-400/15 bg-emerald-400/[0.07] p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-300">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-white/62">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="benefits" className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <SectionTitle kicker="Benefits" title={t.whyTitle} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map(([Icon, title, text]) => (
              <div key={title} className="rounded-[1.75rem] border border-white/8 bg-white/[0.045] p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-white/58">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="reviews" className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Reviews
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                {t.reviewsTitle}
              </h2>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <button
                type="button"
                onClick={() => scrollReviews("left")}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-2xl font-black text-white transition hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
                aria-label="Previous reviews"
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => scrollReviews("right")}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-2xl font-black text-white transition hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
                aria-label="Next reviews"
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-20 bg-gradient-to-r from-[#070908] to-transparent md:block" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-20 bg-gradient-to-l from-[#070908] to-transparent md:block" />

            <div
              ref={reviewsRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none]"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {reviews.map(([name, cityName, text]) => (
                <div
                  key={`${name}-${cityName}`}
                  className="min-w-[310px] max-w-[310px] snap-start rounded-[1.75rem] border border-white/8 bg-white/[0.045] p-6 transition hover:border-emerald-400/30 hover:bg-emerald-400/[0.07] md:min-w-[370px] md:max-w-[370px]"
                >
                  <div className="mb-4 flex gap-1 text-emerald-300">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="min-h-[126px] leading-7 text-white/72">“{text}”</p>
                  <div className="mt-5 border-t border-white/8 pt-4">
                    <div className="font-black">{name}</div>
                    <div className="text-sm text-white/45">{cityName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3 md:hidden">
            <button
              type="button"
              onClick={() => scrollReviews("left")}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-2xl font-black text-white transition hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
              aria-label="Previous reviews"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => scrollReviews("right")}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-2xl font-black text-white transition hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300"
              aria-label="Next reviews"
            >
              <ChevronRight />
            </button>
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
          <SectionTitle kicker="FAQ" title={t.faqTitle} />
          <div className="space-y-3">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group rounded-3xl border border-white/8 bg-white/[0.045] p-5 open:border-emerald-400/25">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black">
                  {question}
                  <ChevronDown className="h-5 w-5 shrink-0 text-white/40 transition group-open:rotate-180" />
                </summary>
                <p className="mt-4 leading-7 text-white/58">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
          <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-8 text-center md:p-12">
            <CheckCircle2 className="mx-auto mb-5 h-12 w-12 text-emerald-300" />
            <h2 className="text-3xl font-black md:text-5xl">Tether <span className="text-emerald-400">Point</span></h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">{t.heroText}</p>
            <a href={TELEGRAM_URL} className="mt-7 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-7 text-base font-black text-[#07100c] transition hover:bg-emerald-300">
              <MessageCircle className="h-5 w-5" /> {t.tgBtn}
            </a>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/8 px-4 py-8 md:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <div className="font-black text-white">Tether <span className="text-emerald-400">Point</span></div>
              <div className="whitespace-pre-line leading-6">{t.footerText}</div>
            </div>
          </div>
          <a href={TELEGRAM_URL} className="font-bold text-emerald-300">@TetherPointExchange</a>
        </div>
      </footer>
    </div>
  );
}
