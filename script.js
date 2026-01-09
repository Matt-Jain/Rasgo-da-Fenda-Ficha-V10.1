let characters = [];
let editingIndex = null;

const skills = [
  "Luta Corpo a Corpo","Armas Brancas","Armas de Fogo","Esquiva",
  "Percepção","Investigação","Ocultismo","Intuição",
  "Atletismo","Furtividade","Resistência",
  "Persuasão","Enganação","Intimidação","Empatia",
  "Acrobacia","Conhecimento","Diplomacia"
];

let skillValues = {};
let points = 0;

function enterApp() {
  if (!fakeUser.value.trim()) return alert("Digite um nome");
  loginScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  showScreen("menu");
}

function showScreen(id) {
  document.querySelectorAll("#appScreen .screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function goToSkills() {
  document.getElementById("step1").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");

  if (editingIndex === null) {
    skillValues = {};
    skills.forEach(s => skillValues[s] = 20);
    points = 200 - skills.length * 20;
  }

  renderSkills();
}

function renderSkills() {
  skillsContainer.innerHTML = "";
  skills.forEach(s => {
    const div = document.createElement("div");
    div.className = "skill";
    div.innerHTML = `
      <span>${s}</span>
      <button onclick="changeSkill('${s}',-1)">-</button>
      <strong>${skillValues[s]}</strong>
      <button onclick="changeSkill('${s}',1)">+</button>
    `;
    skillsContainer.appendChild(div);
  });
  pointsLeft.innerText = points;
}

function changeSkill(skill, delta) {
  if (delta > 0 && points <= 0) return;
  if (delta < 0 && skillValues[skill] <= 0) return;
  skillValues[skill] += delta;
  points -= delta;
  renderSkills();
}

function finishCharacter() {
  const data = {
    name: charName.value,
    player: playerName.value,
    appearance: appearance.value,
    history: history.value,
    goals: goals.value,
    skills: {...skillValues},
    life: 15, sanity: 15, control: 0, aura: 0,
    race: "Não Desperto"
  };

  if (editingIndex !== null) {
    characters[editingIndex] = {...characters[editingIndex], ...data};
    editingIndex = null;
  } else {
    characters.push(data);
  }

  resetForm();
  renderCharacters();
  showScreen("characters");
}

function renderCharacters() {
  characterList.innerHTML = "";
  characters.forEach((c,i) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${c.name}</strong> (${c.race})
      <button onclick="editCharacter(${i})">Editar</button>
      <button onclick="awaken(${i})">Despertar</button>
    `;
    characterList.appendChild(div);
  });
}

function editCharacter(i) {
  const c = characters[i];
  editingIndex = i;
  formTitle.innerText = "Editar Personagem";

  charName.value = c.name;
  playerName.value = c.player;
  appearance.value = c.appearance;
  history.value = c.history;
  goals.value = c.goals;

  skillValues = {...c.skills};
  points = 200 - Object.values(skillValues).reduce((a,b)=>a+b,0);

  document.getElementById("step1").classList.remove("hidden");
  document.getElementById("step2").classList.add("hidden");
  showScreen("create");
}

function awaken(i) {
  const roll = Math.floor(Math.random()*100)+1;
  let race = roll === 1 ? "Nephilis" : roll <= 10 ? "Vigilantes" : "Aureados";

  const c = characters[i];
  c.race = race;

  if (race === "Aureados") c.life += 10;
  if (race === "Vigilantes") c.life += 15;
  if (race === "Nephilis") c.life += 20;

  c.aura = Math.floor(Math.random()*51)+50;
  renderCharacters();
}

function resetForm() {
  formTitle.innerText = "Criar Personagem";
  step1.classList.remove("hidden");
  step2.classList.add("hidden");
  charName.value = playerName.value = appearance.value = history.value = goals.value = "";
}
