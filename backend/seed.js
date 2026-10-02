import dotenv from "dotenv";
import mongoose from "mongoose";

import Team from "./models/Team.js";
import News from "./models/News.js";
import Match from "./models/Match.js";
import Sponsor from "./models/Sponsor.js";
import StarPlayer from "./models/StarPlayer.js";

dotenv.config();


// =====================================================
// EQUIPOS
// =====================================================

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
  { teamId: "kor", name: "South Korea", iso: "kr", group: "H", pj: 3, dg: -5, pts: 2 }
];


// =====================================================
// NOTICIAS
// =====================================================

const newsData = [
  {
    title: "¡Histórico! Argentina avanza a la siguiente ronda tras un dramático empate.",
    summary: "Resumen del partido y reacciones.",
    body: "Resumen del partido y reacciones.",
    image: "",
    source: "Sport Soccer 2027",
    isExternal: false,
    publishedAt: new Date(Date.now() - 2 * 3600000)
  },
  {
    title: "Mbappé rompe récord de goleo en fase de grupos con un Hat-Trick.",
    summary: "Una actuación histórica del delantero francés.",
    body: "Una actuación histórica del delantero francés.",
    image: "",
    source: "Sport Soccer 2027",
    isExternal: false,
    publishedAt: new Date(Date.now() - 5 * 3600000)
  },
  {
    title: "Estadios listos: así lucen las sedes rumbo a los octavos de final.",
    summary: "Un repaso visual a las sedes del torneo.",
    body: "Un repaso visual a las sedes del torneo.",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&q=80",
    source: "Sport Soccer 2027",
    isExternal: false,
    publishedAt: new Date(Date.now() - 24 * 3600000)
  }
];


// =====================================================
// SPONSORS
// =====================================================

const sponsorsData = [
  {
    name: "Coca-Cola",
    tier: "official",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg"
  },
  {
    name: "Nike",
    tier: "official",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
  },
  {
    name: "Adidas",
    tier: "gold",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg"
  },
  {
    name: "Visa",
    tier: "gold",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
  }
];


// =====================================================
// JUGADORES DESTACADOS
// =====================================================

const starPlayersData = [
  {
    name: "L. Messi",
    country: "Argentina",
    iso: "ar",
    goals: 0,
    rating: 0
  },
  {
    name: "K. Mbappé",
    country: "France",
    iso: "fr",
    goals: 0,
    rating: 0
  },
  {
    name: "Neymar Jr",
    country: "Brazil",
    iso: "br",
    goals: 0,
    rating: 0
  },
  {
    name: "H. Kane",
    country: "England",
    iso: "gb",
    goals: 0,
    rating: 0
  },
  {
    name: "C. Gakpo",
    country: "Netherlands",
    iso: "nl",
    goals: 0,
    rating: 0
  }
];


// =====================================================
// PARTIDOS
// =====================================================

const matchesData = [
  {
    id: "g1",
    stadium: {
      id: "st1",
      name: "Lusail Stadium",
      city: "Lusail, Qatar"
    },
    teamA: "qat",
    teamB: "ecu",
    scoreA: 2,
    scoreB: 1,
    minute: 65,
    status: "live",
    time: "13:00"
  },
  {
    id: "g2",
    stadium: {
      id: "st2",
      name: "Al Bayt Stadium",
      city: "Al Khor, Qatar"
    },
    teamA: "arg",
    teamB: "mex",
    scoreA: 0,
    scoreB: 0,
    minute: 65,
    status: "live",
    time: "16:00"
  },
  {
    id: "g3",
    stadium: {
      id: "st3",
      name: "Khalifa International",
      city: "Doha, Qatar"
    },
    teamA: "fra",
    teamB: "tun",
    scoreA: 3,
    scoreB: 1,
    minute: 65,
    status: "live",
    time: "19:00"
  },
  {
    id: "g4",
    stadium: {
      id: "st4",
      name: "Education City",
      city: "Al Rayyan, Qatar"
    },
    teamA: "bra",
    teamB: "sui",
    scoreA: 1,
    scoreB: 2,
    minute: 65,
    status: "live",
    time: "22:00"
  }
];


// =====================================================
// SEED
// =====================================================

async function seed() {

  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("❌ MONGO_URI no está configurado.");
    process.exit(1);
  }

  try {

    await mongoose.connect(uri);

    console.log("======================================");
    console.log("✅ CONECTADO A MONGODB ATLAS");
    console.log("======================================");
    console.log("🔄 Revisando datos existentes...");
    console.log("");


    // =================================================
    // EQUIPOS
    // =================================================

    let teamsInserted = 0;
    let teamsSkipped = 0;

    for (const team of teamsData) {

      const exists = await Team.findOne({
        teamId: team.teamId
      });

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


    // =================================================
    // NOTICIAS
    // =================================================

    let newsInserted = 0;
    let newsSkipped = 0;

    for (const news of newsData) {

      const exists = await News.findOne({
        title: news.title,
        source: news.source
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


    // =================================================
    // SPONSORS
    // =================================================

    const sponsorsCount = await Sponsor.countDocuments();

    if (sponsorsCount === 0) {

      await Sponsor.insertMany(sponsorsData);

      console.log("🤝 Sponsors iniciales agregados.");

    } else {

      console.log("🤝 Sponsors existentes conservados.");

    }


    // =================================================
    // JUGADORES
    // =================================================

    const playersCount = await StarPlayer.countDocuments();

    if (playersCount === 0) {

      console.log("⭐ Agregando jugadores destacados...");

      for (const player of starPlayersData) {

        console.log(
          `⭐ Guardando: ${player.name} | ${player.country} | ${player.iso}`
        );

        await StarPlayer.create({
          name: String(player.name),
          country: String(player.country),
          iso: String(player.iso),
          goals: Number(player.goals),
          rating: Number(player.rating)
        });
      }

      console.log("⭐ Jugadores iniciales agregados.");

    } else {

      console.log(
        `⭐ Jugadores existentes conservados (${playersCount}).`
      );

    }


    // =================================================
    // PARTIDOS
    // =================================================

    const matchesCount = await Match.countDocuments();

    if (matchesCount === 0) {

      await Match.insertMany(matchesData);

      console.log("⚽ Partidos iniciales agregados.");

    } else {

      console.log(
        `⚽ Partidos existentes conservados (${matchesCount}).`
      );

    }


    // =================================================
    // FINAL
    // =================================================

    console.log("");
    console.log("======================================");
    console.log("✅ SEED TERMINADO CORRECTAMENTE");
    console.log("======================================");
    console.log("🔒 NO SE ELIMINÓ NINGÚN DATO.");
    console.log("🔒 Equipos existentes conservados.");
    console.log("🔒 Noticias existentes conservadas.");
    console.log("🔒 Sponsors existentes conservados.");
    console.log("🔒 Jugadores existentes conservados.");
    console.log("🔒 Partidos existentes conservados.");
    console.log("======================================");


    await mongoose.disconnect();

    process.exit(0);

  } catch (error) {

    console.error("");
    console.error("======================================");
    console.error("❌ ERROR NUEVO EN EL SEED");
    console.error("======================================");
    console.error(error);
    console.error("======================================");

    try {
      await mongoose.disconnect();
    } catch (e) {
      console.error("Error cerrando MongoDB:", e);
    }

    process.exit(1);
  }
}


seed();
