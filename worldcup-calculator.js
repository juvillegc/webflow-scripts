import { sendCleverTapEventEventOnly } from "./services/event.clevertap.eventOnly.js";

const EVENT_NAME = 'wf_calculadora_mundial_web';

const WORLD_CUP_TEAMS = [
  { name: 'México', code: 'mx', flag: 'https://flagcdn.com/w40/mx.png' },
  { name: 'Estados Unidos', code: 'us', flag: 'https://flagcdn.com/w40/us.png' },
  { name: 'Canadá', code: 'ca', flag: 'https://flagcdn.com/w40/ca.png' },
  { name: 'Panamá', code: 'pa', flag: 'https://flagcdn.com/w40/pa.png' },
  { name: 'Haití', code: 'ht', flag: 'https://flagcdn.com/w40/ht.png' },
  { name: 'Curazao', code: 'cw', flag: 'https://flagcdn.com/w40/cw.png' },
  { name: 'Argentina', code: 'ar', flag: 'https://flagcdn.com/w40/ar.png' },
  { name: 'Brasil', code: 'br', flag: 'https://flagcdn.com/w40/br.png' },
  { name: 'Colombia', code: 'co', flag: 'https://flagcdn.com/w40/co.png' },
  { name: 'Uruguay', code: 'uy', flag: 'https://flagcdn.com/w40/uy.png' },
  { name: 'Ecuador', code: 'ec', flag: 'https://flagcdn.com/w40/ec.png' },
  { name: 'Paraguay', code: 'py', flag: 'https://flagcdn.com/w40/py.png' },
  { name: 'Francia', code: 'fr', flag: 'https://flagcdn.com/w40/fr.png' },
  { name: 'España', code: 'es', flag: 'https://flagcdn.com/w40/es.png' },
  { name: 'Inglaterra', code: 'gb-eng', flag: 'https://flagcdn.com/w40/gb.png' },
  { name: 'Portugal', code: 'pt', flag: 'https://flagcdn.com/w40/pt.png' },
  { name: 'Países Bajos', code: 'nl', flag: 'https://flagcdn.com/w40/nl.png' },
  { name: 'Alemania', code: 'de', flag: 'https://flagcdn.com/w40/de.png' },
  { name: 'Bélgica', code: 'be', flag: 'https://flagcdn.com/w40/be.png' },
  { name: 'Croacia', code: 'hr', flag: 'https://flagcdn.com/w40/hr.png' },
  { name: 'Suiza', code: 'ch', flag: 'https://flagcdn.com/w40/ch.png' },
  { name: 'Escocia', code: 'gb-sct', flag: 'https://flagcdn.com/w40/gb.png' },
  { name: 'Noruega', code: 'no', flag: 'https://flagcdn.com/w40/no.png' },
  { name: 'Austria', code: 'at', flag: 'https://flagcdn.com/w40/at.png' },
  { name: 'República Checa', code: 'cz', flag: 'https://flagcdn.com/w40/cz.png' },
  { name: 'Bosnia y Herzegovina', code: 'ba', flag: 'https://flagcdn.com/w40/ba.png' },
  { name: 'Suecia', code: 'se', flag: 'https://flagcdn.com/w40/se.png' },
  { name: 'Turquía', code: 'tr', flag: 'https://flagcdn.com/w40/tr.png' },
  { name: 'Japón', code: 'jp', flag: 'https://flagcdn.com/w40/jp.png' },
  { name: 'Corea del Sur', code: 'kr', flag: 'https://flagcdn.com/w40/kr.png' },
  { name: 'Irán', code: 'ir', flag: 'https://flagcdn.com/w40/ir.png' },
  { name: 'Australia', code: 'au', flag: 'https://flagcdn.com/w40/au.png' },
  { name: 'Arabia Saudita', code: 'sa', flag: 'https://flagcdn.com/w40/sa.png' },
  { name: 'Uzbekistán', code: 'uz', flag: 'https://flagcdn.com/w40/uz.png' },
  { name: 'Catar', code: 'qa', flag: 'https://flagcdn.com/w40/qa.png' },
  { name: 'Jordania', code: 'jo', flag: 'https://flagcdn.com/w40/jo.png' },
  { name: 'Irak', code: 'iq', flag: 'https://flagcdn.com/w40/iq.png' },
  { name: 'Marruecos', code: 'ma', flag: 'https://flagcdn.com/w40/ma.png' },
  { name: 'Senegal', code: 'sn', flag: 'https://flagcdn.com/w40/sn.png' },
  { name: 'Egipto', code: 'eg', flag: 'https://flagcdn.com/w40/eg.png' },
  { name: 'Costa de Marfil', code: 'ci', flag: 'https://flagcdn.com/w40/ci.png' },
  { name: 'Argelia', code: 'dz', flag: 'https://flagcdn.com/w40/dz.png' },
  { name: 'Sudáfrica', code: 'za', flag: 'https://flagcdn.com/w40/za.png' },
  { name: 'Túnez', code: 'tn', flag: 'https://flagcdn.com/w40/tn.png' },
  { name: 'Ghana', code: 'gh', flag: 'https://flagcdn.com/w40/gh.png' },
  { name: 'Cabo Verde', code: 'cv', flag: 'https://flagcdn.com/w40/cv.png' },
  { name: 'República Democrática del Congo', code: 'cd', flag: 'https://flagcdn.com/w40/cd.png' },
  { name: 'Nueva Zelanda', code: 'nz', flag: 'https://flagcdn.com/w40/nz.png' }
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
const getNumberById = (id) => Number(getElement(id)?.value);

function getTeamByCode(code) {
  return WORLD_CUP_TEAMS.find((team) => team.code === code);
}

function getWinner(homeGoals, awayGoals) {
  if (homeGoals > awayGoals) return 'team_a';
  if (homeGoals < awayGoals) return 'team_b';
  return 'draw';
}

function calculatePredictionPoints(phase, predictedHome, predictedAway, actualHome, actualAway) {
  const isPhaseOne = phase === 1;
  const exactScorePoints = isPhaseOne ? 10 : 20;
  const winnerPoints = isPhaseOne ? 5 : 10;

  const isExactScore = predictedHome === actualHome && predictedAway === actualAway;
  const predictedWinner = getWinner(predictedHome, predictedAway);
  const actualWinner = getWinner(actualHome, actualAway);

  if (isExactScore) {
    return {
      points: exactScorePoints,
      resultType: 'exact_score_and_winner',
      message: 'Acertaste marcador exacto y ganador.',
    };
  }

  if (predictedWinner === actualWinner) {
    return {
      points: winnerPoints,
      resultType: 'winner_or_draw',
      message: 'Acertaste ganador o empate.',
    };
  }

  return {
    points: 0,
    resultType: 'no_match',
    message: 'No acertaste el resultado del partido.',
  };
}

function renderTeamSelect(selectId) {
  const select = getElement(selectId);
  if (!select) return;

  select.innerHTML = WORLD_CUP_TEAMS.map((team) => {
    return `<option value="${team.code}">${team.name}</option>`;
  }).join('');
}

function updateTeamFlag(selectId, imageId) {
  const select = getElement(selectId);
  const image = getElement(imageId);
  if (!select || !image) return;

  const team = getTeamByCode(select.value);
  if (!team) return;

  image.src = team.flag;
  image.alt = `Bandera de ${team.name}`;
}

function renderResult(predictionResult, missionPoints, totalPoints) {
  getElement('wc-prediction-points').textContent = predictionResult.points;
  getElement('wc-mission-points').textContent = missionPoints;
  getElement('wc-total-points').textContent = totalPoints;
  getElement('wc-message').textContent = predictionResult.message;
  getElement('wc-result').classList.remove('is-hidden');
}

function handleCalculate() {
  const phone = getElement('wc-phone').value.trim();
  const phase = getNumberById('wc-phase');
  const missionType = getElement('wc-mission').value;

  const teamACode = getElement('wc-team-a').value;
  const teamBCode = getElement('wc-team-b').value;
  const teamA = getTeamByCode(teamACode);
  const teamB = getTeamByCode(teamBCode);

  if (!/^\d{10}$/.test(phone)) {
    alert('Ingresa un número de Nequi válido de 10 dígitos.');
    return;
  }

  if (teamACode === teamBCode) {
    alert('El equipo A y el equipo B deben ser diferentes.');
    return;
  }

  const predictedHome = getNumberById('wc-predicted-home');
  const predictedAway = getNumberById('wc-predicted-away');
  const actualHome = getNumberById('wc-actual-home');
  const actualAway = getNumberById('wc-actual-away');

  const values = [phase, predictedHome, predictedAway, actualHome, actualAway];
  const hasInvalidValue = values.some((value) => Number.isNaN(value) || value < 0);

  if (hasInvalidValue) {
    alert('Revisa los campos. Todos deben ser números válidos y positivos.');
    return;
  }

  const predictionResult = calculatePredictionPoints(
    phase,
    predictedHome,
    predictedAway,
    actualHome,
    actualAway
  );

  const missionPoints = MISSION_POINTS[missionType] || 0;
  const totalPoints = predictionResult.points + missionPoints;

  renderResult(predictionResult, missionPoints, totalPoints);

  sendCleverTapEventEventOnly(EVENT_NAME, {
    Phone: phone,
    phase,
    team_a_code: teamACode,
    team_a_name: teamA?.name || '',
    team_b_code: teamBCode,
    team_b_name: teamB?.name || '',
    predicted_team_a_goals: predictedHome,
    predicted_team_b_goals: predictedAway,
    actual_team_a_goals: actualHome,
    actual_team_b_goals: actualAway,
    mission_type: missionType,
    prediction_points: predictionResult.points,
    mission_points: missionPoints,
    total_points: totalPoints,
    result_type: predictionResult.resultType,
  });
}

function handleReset() {
  getElement('wc-predicted-home').value = 0;
  getElement('wc-predicted-away').value = 0;
  getElement('wc-actual-home').value = 0;
  getElement('wc-actual-away').value = 0;
  getElement('wc-mission').value = 'none';
  getElement('wc-team-a').value = 'co';
  getElement('wc-team-b').value = 'br';

  updateTeamFlag('wc-team-a', 'wc-team-a-flag');
  updateTeamFlag('wc-team-b', 'wc-team-b-flag');

  getElement('wc-result').classList.add('is-hidden');
}

function initWorldCupCalculator() {
  if (!getElement('wc-calculator')) return;

  renderTeamSelect('wc-team-a');
  renderTeamSelect('wc-team-b');

  getElement('wc-team-a').value = 'co';
  getElement('wc-team-b').value = 'br';

  updateTeamFlag('wc-team-a', 'wc-team-a-flag');
  updateTeamFlag('wc-team-b', 'wc-team-b-flag');

  getElement('wc-team-a').addEventListener('change', () => {
    updateTeamFlag('wc-team-a', 'wc-team-a-flag');
  });

  getElement('wc-team-b').addEventListener('change', () => {
    updateTeamFlag('wc-team-b', 'wc-team-b-flag');
  });

  getElement('wc-calculate-btn').addEventListener('click', handleCalculate);
  getElement('wc-reset-btn').addEventListener('click', handleReset);
}

document.addEventListener('DOMContentLoaded', initWorldCupCalculator);
