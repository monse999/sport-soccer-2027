import dotenv from "dotenv";
import mongoose from "mongoose";

import Team from "./models/Team.js";
import News from "./models/News.js";
import Match from "./models/Match.js";
import Sponsor from "./models/Sponsor.js";
import StarPlayer from "./models/StarPlayer.js";

dotenv.config();

const teamsData = [
{ teamId: "qat", name: "Qatar", iso: "qa", group: "A", pj: 3, dg: -4, pts: 3 },
{ teamId: "ecu", name: "Ecuador", iso: "ec", group: "A", pj: 3, dg: 2, pts: 6 },
{ teamId: "sen", name: "Senegal", iso: "sn", group: "A", pj: 3, dg: 0, pts: 4 },
{ teamId: "ned", name: "Netherlands", iso: "nl", group: "A", pj: 3, dg: 3, pts: 7 },

{ teamId: "eng", name: "England", iso: "gb-eng", group: "B", pj: 3, dg: 3, pts: 7 },
{ teamId: "irn", name: "Iran", iso: "ir", group: "B", pj: 3, dg: 2, pts: 6 },
{ teamId: "usa", name: "USA", iso: "us", group: "B", pj: 3, dg: -1, pts: 3 },
{ teamId: "wal", name: "Wales", iso: "gb-wls", group: "B", pj: 3, dg: -4, pts: 1 },

{ teamId: "arg", name: "Argentina", iso: "ar", group: "C", pj: 3, dg: 4, pts: 9 },
{ teamId: "ksa", name: "Saudi Arabia", iso: "sa", group: "C", pj: 3, dg: -1, pts: 4 },
{ teamId: "mex", name: "Mexico", iso: "mx", group: "C", pj: 3, dg: 0, pts: 4 },
{ teamId: "pol", name: "Poland", iso: "pl", group: "C", pj: 3, dg: -3, pts: 2 },

{ teamId: "fra", name: "France", iso: "fr", group: "D", pj: 3, dg: 4, pts: 9 },
{ teamId: "aus", name: "Australia", iso: "au", group: "D", pj: 3, dg: 0, pts: 4 },
{ teamId: "den", name: "Denmark", iso: "dk", group: "D", pj: 3, dg: -1, pts: 3 },
{ teamId: "tun", name: "Tunisia", iso: "tn", group: "D", pj: 3, dg: -3, pts: 2 },

{ teamId: "esp", name: "Spain", iso: "es", group: "E", pj: 3, dg: 5, pts: 7 },
{ teamId: "crc", name: "Costa Rica", iso: "cr", group: "E", pj: 3, dg: -3, pts: 3 },
{ teamId: "ger", name: "Germany", iso: "de", group: "E", pj: 3, dg: 1, pts: 4 },
{ teamId: "jpn", name: "Japan", iso: "jp", group: "E", pj: 3, dg: -3, pts: 3 },

{ teamId: "bel", name: "Belgium", iso: "be", group: "F", pj: 3, dg: 2, pts: 6 },
{ teamId: "can", name: "Canada", iso: "ca", group: "F", pj: 3, dg: -2, pts: 3 },
{ teamId: "mar", name: "Morocco", iso: "ma", group: "F", pj: 3, dg: 3, pts: 7 },
{ teamId: "cro", name: "Croatia", iso: "hr", group: "F", pj: 3, dg: -3, pts: 1 },

{ teamId: "bra", name: "Brazil", iso: "br", group: "G", pj: 3, dg: 5, pts: 9 },
{ teamId: "srb", name: "Serbia", iso: "rs", group: "G", pj: 3, dg: -2, pts: 3 },
{ teamId: "sui", name: "Switzerland", iso: "ch", group: "G", pj: 3, dg: 1, pts: 5 },
{ teamId: "cmr", name: "Cameroon", iso: "cm", group: "G", pj: 3, dg: -4, pts: 1 },

{ teamId: "por", name: "Portugal", iso: "pt", group: "H", pj: 3, dg: 4, pts: 7 },
{ teamId: "gha", name: "Ghana", iso: "gh", group: "H", pj: 3, dg: -1, pts: 4 },
{ teamId: "uru", name: "Uruguay", iso: "uy", group: "H", pj: 3, dg: 2, pts: 5 },
{ teamId: "kor", name: "South Korea", iso: "kr", group: "H", pj: 3, dg: -5, pts: 2 },
];

// Estas son las noticias que ya tienes actualmente en tu frontend.
// Se conservan sin borrar las que ya existan en MongoDB.
const newsData = [
{
title: "¡Histórico! Argentina avanza a la siguiente ronda tras un dramático empate.",
summary: "Resumen del partido y reacciones.",
body: "Resumen del partido y reacciones.",
image: "",
source: "Sport Soccer 2027",
isExternal: false,
publishedAt: new Date(Date.now() - 2 * 3600000),
},
{
title: "Mbappé rompe récord de goleo en fase de grupos con un Hat-Trick.",
summary: "Una actuación histórica del delantero francés.",
body: "Una actuación histórica del delantero francés.",
image: "",
source: "Sport Soccer 2027",
isExternal: false,
publishedAt: new Date(Date.now() - 5 * 3600000),
},
{
title: "Estadios listos: así lucen las sedes rumbo a los octavos de final.",
summary: "Un repaso visual a las sedes del torneo.",
body: "Un repaso visual a las sedes del torneo.",
image:
"https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&q=80",
source: "Sport Soccer 2027",
isExternal: false,
publishedAt: new Date(Date.now() - 24 * 3600000),
},
];

async function seed() {
const uri = process.env.MONGO_URI;

if (!uri) {
console.error("❌ No existe MONGO_URI en las variables de entorno.");
process.exit(1);
}

try {
await mongoose.connect(uri);

console.log("✅ Conectado a MongoDB Atlas");
console.log("🔄 Revisando datos existentes...");


// =====================================================
// EQUIPOS
// =====================================================

let teamsInserted = 0;
let teamsSkipped = 0;

for (const team of teamsData) {
  const exists = await Team.findOne({ teamId: team.teamId });

  if (exists) {
    teamsSkipped++;
    continue;
  }

  await Team.create(team);
  teamsInserted++;
}

console.log(
  `⚽ Equipos: ${teamsInserted} agregados, ${teamsSkipped} ya existían.`
);


// =====================================================
// NOTICIAS
// =====================================================

let newsInserted = 0;
let newsSkipped = 0;

for (const news of newsData) {
  const exists = await News.findOne({
    title: news.title,
    source: news.source,
  });

  if (exists) {
    newsSkipped++;
    continue;
  }

  await News.create(news);
  newsInserted++;
}

console.log(
  `📰 Noticias: ${newsInserted} agregadas, ${newsSkipped} ya existían.`
);


// =====================================================
// SPONSORS
// Solo se agregan si todavía no existen.
// =====================================================

const sponsorsCount = await Sponsor.countDocuments();

if (sponsorsCount === 0) {
  const sponsorsData = [
    {
      name: "Coca-Cola",
      tier: "official",
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg",
    },
    {
      name: "Nike",
      tier: "official",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    },
    {
      name: "Adidas",
      tier: "gold",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
    },
    {
      name: "Visa",
      tier: "gold",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
    },
  ];

  await Sponsor.insertMany(sponsorsData);
  console.log("🤝 Sponsors iniciales agregados.");
} else {
  console.log("🤝 Sponsors existentes conservados.");
}


// =====================================================
// JUGADORES
// Solo se agregan si todavía no existen.
// =====================================================

const playersCount = await StarPlayer.countDocuments();

if (playersCount === 0) {
  const starPlayersData = [
    {
      name: "L. Messi",
      team: "Argentina",
    },
    {
      name: "K. Mbappé",
      team: "France",
    },
    {
      name: "Neymar Jr",
      team: "Brazil",
    },
    {
      name: "H. Kane",
      team: "England",
    },
    {
      name: "C. Gakpo",
      team: "Netherlands",
    },
  ];

  await StarPlayer.insertMany(starPlayersData);
  console.log("⭐ Jugadores iniciales agregados.");
} else {
  console.log("⭐ Jugadores existentes conservados.");
}


// =====================================================
// PARTIDOS
// Solo se agregan si la colección está vacía.
// =====================================================

const matchesCount = await Match.countDocuments();

if (matchesCount === 0) {
  const matchesData = [
    {
      id: "g1",
      stadium: {
        id: "st1",
        name: "Lusail Stadium",
        city: "Lusail, Qatar",
      },
      teamA: "qat",
      teamB: "ecu",
      scoreA: 2,
      scoreB: 1,
      minute: 65,
      status: "live",
      time: "13:00",
    },
    {
      id: "g2",
      stadium: {
        id: "st2",
        name: "Al Bayt Stadium",
        city: "Al Khor, Qatar",
      },
      teamA: "arg",
      teamB: "mex",
      scoreA: 0,
      scoreB: 0,
      minute: 65,
      status: "live",
      time: "16:00",
    },
    {
      id: "g3",
      stadium: {
        id: "st3",
        name: "Khalifa International",
        city: "Doha, Qatar",
      },
      teamA: "fra",
      teamB: "tun",
      scoreA: 3,
      scoreB: 1,
      minute: 65,
      status: "live",
      time: "19:00",
    },
    {
      id: "g4",
      stadium: {
        id: "st4",
        name: "Education City",
        city: "Al Rayyan, Qatar",
      },
      teamA: "bra",
      teamB: "sui",
      scoreA: 1,
      scoreB: 2,
      minute: 65,
      status: "live",
      time: "22:00",
    },
  ];

  await Match.insertMany(matchesData);
  console.log("⚽ Partidos iniciales agregados.");
} else {
  console.log("⚽ Partidos existentes conservados.");
}


// =====================================================
// TERMINAR
// =====================================================

console.log("");
console.log("======================================");
console.log("✅ SEED TERMINADO CORRECTAMENTE");
console.log("======================================");
console.log("🔒 No se eliminó ningún dato existente.");
console.log("🔒 Los equipos existentes fueron conservados.");
console.log("🔒 Las noticias existentes fueron conservadas.");
console.log("======================================");

await mongoose.disconnect();
process.exit(0);

} catch (error) {
console.error("❌ Error durante el seed:");
console.error(error);

await mongoose.disconnect();
process.exit(1);

}
}

seed();
