import { sendCleverTapEventEventOnly } from "./services/event.clevertap.eventOnly.js";
import { configurePhoneInput } from "./shared/utils.js";


const EVENT_NAME = "wf_calculadora_mundial_web";

const SELECTORS = {
  wrapper: "wc-calculator",

  phone: "wc-phone",
  phase: "wc-phase",
  mission: "wc-mission",

  teamA: {
    select: "wc-team-a",
    flag: "wc-team-a-flag",
    predictedGoals: "wc-predicted-home",
    actualGoals: "wc-actual-home",
  },

  teamB: {
    select: "wc-team-b",
    flag: "wc-team-b-flag",
    predictedGoals: "wc-predicted-away",
    actualGoals: "wc-actual-away",
  },

  result: {
    wrapper: "wc-result",
    predictionPoints: "wc-prediction-points",
    missionPoints: "wc-mission-points",
    totalPoints: "wc-total-points",
    message: "wc-message",
  },

  actions: {
    calculate: "wc-calculate-btn",
    reset: "wc-reset-btn",
  },
};

/* =========================================================
 * DATA
 * ========================================================= */

const WORLD_CUP_TEAMS = [
  { name: "México", code: "mx", flag: "https://flagcdn.com/w40/mx.png" },
  { name: "Estados Unidos", code: "us", flag: "https://flagcdn.com/w40/us.png" },
  { name: "Canadá", code: "ca", flag: "https://flagcdn.com/w40/ca.png" },
  { name: "Panamá", code: "pa", flag: "https://flagcdn.com/w40/pa.png" },
  { name: "Haití", code: "ht", flag: "https://flagcdn.com/w40/ht.png" },
  { name: "Curazao", code: "cw", flag: "https://flagcdn.com/w40/cw.png" },

  { name: "Argentina", code: "ar", flag: "https://flagcdn.com/w40/ar.png" },
  { name: "Brasil", code: "br", flag: "https://flagcdn.com/w40/br.png" },
  { name: "Colombia", code: "co", flag: "https://flagcdn.com/w40/co.png" },
  { name: "Uruguay", code: "uy", flag: "https://flagcdn.com/w40/uy.png" },
  { name: "Ecuador", code: "ec", flag: "https://flagcdn.com/w40/ec.png" },
  { name: "Paraguay", code: "py", flag: "https://flagcdn.com/w40/py.png" },

  { name: "Francia", code: "fr", flag: "https://flagcdn.com/w40/fr.png" },
  { name: "España", code: "es", flag: "https://flagcdn.com/w40/es.png" },
  { name: "Inglaterra", code: "gb-eng", flag: "https://flagcdn.com/w40/gb.png" },
  { name: "Portugal", code: "pt", flag: "https://flagcdn.com/w40/pt.png" },
  { name: "Países Bajos", code: "nl", flag: "https://flagcdn.com/w40/nl.png" },
  { name: "Alemania", code: "de", flag: "https://flagcdn.com/w40/de.png" },
  { name: "Bélgica", code: "be", flag: "https://flagcdn.com/w40/be.png" },
  { name: "Croacia", code: "hr", flag: "https://flagcdn.com/w40/hr.png" },
  { name: "Suiza", code: "ch", flag: "https://flagcdn.com/w40/ch.png" },
  { name: "Escocia", code: "gb-sct", flag: "https://flagcdn.com/w40/gb.png" },
  { name: "Noruega", code: "no", flag: "https://flagcdn.com/w40/no.png" },
  { name: "Austria", code: "at", flag: "https://flagcdn.com/w40/at.png" },
  { name: "República Checa", code: "cz", flag: "https://flagcdn.com/w40/cz.png" },
  { name: "Bosnia y Herzegovina", code: "ba", flag: "https://flagcdn.com/w40/ba.png" },
  { name: "Suecia", code: "se", flag: "https://flagcdn.com/w40/se.png" },
  { name: "Turquía", code: "tr", flag: "https://flagcdn.com/w40/tr.png" },

  { name: "Japón", code: "jp", flag: "https://flagcdn.com/w40/jp.png" },
  { name: "Corea del Sur", code: "kr", flag: "https://flagcdn.com/w40/kr.png" },
  { name: "Irán", code: "ir", flag: "https://flagcdn.com/w40/ir.png" },
  { name: "Australia", code: "au", flag: "https://flagcdn.com/w40/au.png" },
  { name: "Arabia Saudita", code: "sa", flag: "https://flagcdn.com/w40/sa.png" },
  { name: "Uzbekistán", code: "uz", flag: "https://flagcdn.com/w40/uz.png" },
  { name: "Catar", code: "qa", flag: "https://flagcdn.com/w40/qa.png" },
  { name: "Jordania", code: "jo", flag: "https://flagcdn.com/w40/jo.png" },
  { name: "Irak", code: "iq", flag: "https://flagcdn.com/w40/iq.png" },

  { name: "Marruecos", code: "ma", flag: "https://flagcdn.com/w40/ma.png" },
  { name: "Senegal", code: "sn", flag: "https://flagcdn.com/w40/sn.png" },
  { name: "Egipto", code: "eg", flag: "https://flagcdn.com/w40/eg.png" },
  { name: "Costa de Marfil", code: "ci", flag: "https://flagcdn.com/w40/ci.png" },
  { name: "Argelia", code: "dz", flag: "https://flagcdn.com/w40/dz.png" },
  { name: "Sudáfrica", code: "za", flag: "https://flagcdn.com/w40/za.png" },
  { name: "Túnez", code: "tn", flag: "https://flagcdn.com/w40/tn.png" },
  { name: "Ghana", code: "gh", flag: "https://flagcdn.com/w40/gh.png" },
  { name: "Cabo Verde", code: "cv", flag: "https://flagcdn.com/w40/cv.png" },
  { name: "República Democrática del Congo", code: "cd", flag: "https://flagcdn.com/w40/cd.png" },

  { name: "Nueva Zelanda", code: "nz", flag: "https://flagcdn.com/w40/nz.png" },
];

const MISSION_POINTS = {
  none: 0,
  credit: 15,
  foreign_money: 15,
  insurance: 15,
  virtual_store: 10,
  nequi_button: 10,
  card: 10,
  armario: 8,
};


const getElement = (id) => document.getElementById(id);

const getValue = (id) => getElement(id)?.value || "";

const getNumber = (id) => Number(getValue(id));

function getTeamByCode(code) {
  return WORLD_CUP_TEAMS.find((team) => team.code === code);
}

function getWinner(teamAGoals, teamBGoals) {
  if (teamAGoals > teamBGoals) return "team_a";
  if (teamAGoals < teamBGoals) return "team_b";
  return "draw";
}


function calculatePredictionPoints({
  phase,
  predictedTeamAGoals,
  predictedTeamBGoals,
  actualTeamAGoals,
  actualTeamBGoals,
}) {
  const isPhaseOne = phase === 1;

  const exactScorePoints = isPhaseOne ? 10 : 20;
  const winnerPoints = isPhaseOne ? 5 : 10;

  const isExactScore =
    predictedTeamAGoals === actualTeamAGoals &&
    predictedTeamBGoals === actualTeamBGoals;

  const predictedWinner = getWinner(
    predictedTeamAGoals,
    predictedTeamBGoals
  );

  const actualWinner = getWinner(
    actualTeamAGoals,
    actualTeamBGoals
  );

  if (isExactScore) {
    return {
      points: exactScorePoints,
      resultType: "exact_score_and_winner",
      message: "Acertaste marcador exacto y ganador.",
    };
  }

  if (predictedWinner === actualWinner) {
    return {
      points: winnerPoints,
      resultType: "winner_or_draw",
      message: "Acertaste ganador o empate.",
    };
  }

  return {
    points: 0,
    resultType: "no_match",
    message: "No acertaste el resultado del partido.",
  };
}


function renderTeamSelect(selectId) {
  const select = getElement(selectId);
  if (!select) return;

  select.innerHTML = WORLD_CUP_TEAMS.map((team) => {
    return `<option value="${team.code}">${team.name}</option>`;
  }).join("");
}

function updateTeamFlag(selectId, imageId) {
  const select = getElement(selectId);
  const image = getElement(imageId);

  if (!select || !image) return;

  const selectedTeam = getTeamByCode(select.value);
  if (!selectedTeam) return;

  image.src = selectedTeam.flag;
  image.alt = `Bandera de ${selectedTeam.name}`;
}

function renderResult({
  predictionPoints,
  missionPoints,
  totalPoints,
  message,
}) {
  getElement(SELECTORS.result.predictionPoints).textContent =
    predictionPoints;

  getElement(SELECTORS.result.missionPoints).textContent =
    missionPoints;

  getElement(SELECTORS.result.totalPoints).textContent =
    totalPoints;

  getElement(SELECTORS.result.message).textContent =
    message;

  getElement(SELECTORS.result.wrapper)
    .classList.remove("is-hidden");
}

function hideResult() {
  getElement(SELECTORS.result.wrapper)
    .classList.add("is-hidden");
}

/* =========================================================
 * EVENTS
 * ========================================================= */

function handleCalculate() {
  const phone = getValue(SELECTORS.phone).trim();
  const phase = getNumber(SELECTORS.phase);
  const missionType = getValue(SELECTORS.mission);

  const teamACode = getValue(SELECTORS.teamA.select);
  const teamBCode = getValue(SELECTORS.teamB.select);

  if (phone.length !== 10) {
    alert("Ingresa un número de Nequi válido de 10 dígitos.");
    return;
  }

  if (teamACode === teamBCode) {
    alert("El equipo A y el equipo B deben ser diferentes.");
    return;
  }

  const predictedTeamAGoals = getNumber(
    SELECTORS.teamA.predictedGoals
  );

  const predictedTeamBGoals = getNumber(
    SELECTORS.teamB.predictedGoals
  );

  const actualTeamAGoals = getNumber(
    SELECTORS.teamA.actualGoals
  );

  const actualTeamBGoals = getNumber(
    SELECTORS.teamB.actualGoals
  );

  const numericValues = [
    phase,
    predictedTeamAGoals,
    predictedTeamBGoals,
    actualTeamAGoals,
    actualTeamBGoals,
  ];

  const hasInvalidValue = numericValues.some(
    (value) => Number.isNaN(value) || value < 0
  );

  if (hasInvalidValue) {
    alert("Revisa los campos. Todos deben ser números válidos.");
    return;
  }

  const teamA = getTeamByCode(teamACode);
  const teamB = getTeamByCode(teamBCode);

  const predictionResult = calculatePredictionPoints({
    phase,
    predictedTeamAGoals,
    predictedTeamBGoals,
    actualTeamAGoals,
    actualTeamBGoals,
  });

  const missionPoints = MISSION_POINTS[missionType] || 0;
  const totalPoints = predictionResult.points + missionPoints;

  renderResult({
    predictionPoints: predictionResult.points,
    missionPoints,
    totalPoints,
    message: predictionResult.message,
  });

  sendCleverTapEventEventOnly(EVENT_NAME, {
    Phone: `+57${phone}`,
    phase,

    team_a_code: teamACode,
    team_a_name: teamA?.name || "",

    team_b_code: teamBCode,
    team_b_name: teamB?.name || "",

    predicted_team_a_goals: predictedTeamAGoals,
    predicted_team_b_goals: predictedTeamBGoals,

    actual_team_a_goals: actualTeamAGoals,
    actual_team_b_goals: actualTeamBGoals,

    mission_type: missionType,

    prediction_points: predictionResult.points,
    mission_points: missionPoints,
    total_points: totalPoints,

    result_type: predictionResult.resultType,
  });
}

function handleReset() {
  getElement(SELECTORS.teamA.predictedGoals).value = 0;
  getElement(SELECTORS.teamB.predictedGoals).value = 0;
  getElement(SELECTORS.teamA.actualGoals).value = 0;
  getElement(SELECTORS.teamB.actualGoals).value = 0;

  getElement(SELECTORS.mission).value = "none";

  getElement(SELECTORS.teamA.select).value = "co";
  getElement(SELECTORS.teamB.select).value = "br";

  updateTeamFlag(
    SELECTORS.teamA.select,
    SELECTORS.teamA.flag
  );

  updateTeamFlag(
    SELECTORS.teamB.select,
    SELECTORS.teamB.flag
  );

  hideResult();
}

/* =========================================================
 * INIT
 * ========================================================= */

function initTeamSelectors() {
  renderTeamSelect(SELECTORS.teamA.select);
  renderTeamSelect(SELECTORS.teamB.select);

  getElement(SELECTORS.teamA.select).value = "co";
  getElement(SELECTORS.teamB.select).value = "br";

  updateTeamFlag(
    SELECTORS.teamA.select,
    SELECTORS.teamA.flag
  );

  updateTeamFlag(
    SELECTORS.teamB.select,
    SELECTORS.teamB.flag
  );

  getElement(SELECTORS.teamA.select)
    .addEventListener("change", () => {
      updateTeamFlag(
        SELECTORS.teamA.select,
        SELECTORS.teamA.flag
      );
    });

  getElement(SELECTORS.teamB.select)
    .addEventListener("change", () => {
      updateTeamFlag(
        SELECTORS.teamB.select,
        SELECTORS.teamB.flag
      );
    });
}

function initWorldCupCalculator() {
  if (!getElement(SELECTORS.wrapper)) return;

  configurePhoneInput(SELECTORS.phone);

  initTeamSelectors();

  getElement(SELECTORS.actions.calculate)
    .addEventListener("click", handleCalculate);

  getElement(SELECTORS.actions.reset)
    .addEventListener("click", handleReset);
}

document.addEventListener(
  "DOMContentLoaded",
  initWorldCupCalculator
);
