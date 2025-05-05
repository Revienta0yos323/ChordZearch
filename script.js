// Referencias al DOM
const instrumentUI   = document.getElementById("instrumentUI");
const result         = document.getElementById("result");
const searchButton   = document.getElementById("searchChord");
const clearButton    = document.getElementById("clearSelection");
const toggleThemeBtn = document.getElementById("toggleTheme");
const noteCountElem  = document.getElementById("noteCount");

// — Base de datos de acordes EXTENDIDA —
const chordDatabase = {
  // Para cada tónica: mayores, menores, dominantes, maj7, m7, m7b5, dim, aug, sus2, sus4, 6, m6, 9, maj9, m9
  "C":      ["C","E","G"],      "Cm":     ["C","D#","G"],
  "C7":     ["C","E","G","A#"],  "Cmaj7":  ["C","E","G","B"],
  "Cm7":    ["C","D#","G","A#"], "Cm7b5":  ["C","D#","F#","A#"],
  "Cdim":   ["C","D#","F#"],     "Caug":   ["C","E","G#"],
  "Csus2":  ["C","D","G"],       "Csus4":  ["C","F","G"],
  "C6":     ["C","E","G","A"],   "Cm6":    ["C","D#","G","A"],
  "C9":     ["C","E","G","A#","D"],  "Cmaj9": ["C","E","G","B","D"],
  "Cm9":    ["C","D#","G","A#","D"],

  "D":      ["D","F#","A"],      "Dm":     ["D","F","A"],
  "D7":     ["D","F#","A","C"],  "Dmaj7":  ["D","F#","A","C#"],
  "Dm7":    ["D","F","A","C"],   "Dm7b5":  ["D","F","G#","C"],
  "Ddim":   ["D","F","G#"],      "Daug":   ["D","F#","A#"],
  "Dsus2":  ["D","E","A"],       "Dsus4":  ["D","G","A"],
  "D6":     ["D","F#","A","B"],  "Dm6":    ["D","F","A","B"],
  "D9":     ["D","F#","A","C","E"], "Dmaj9":["D","F#","A","C#","E"],
  "Dm9":    ["D","F","A","C","E"],

  "E":      ["E","G#","B"],      "Em":     ["E","G","B"],
  "E7":     ["E","G#","B","D"],  "Emaj7":  ["E","G#","B","D#"],
  "Em7":    ["E","G","B","D"],   "Em7b5":  ["E","G","A#","D"],
  "Edim":   ["E","G","A#"],      "Eaug":   ["E","G#","C"],
  "Esus2":  ["E","F#","B"],      "Esus4":  ["E","A","B"],
  "E6":     ["E","G#","B","C#"], "Em6":    ["E","G","B","C#"],
  "E9":     ["E","G#","B","D","F#"], "Emaj9":["E","G#","B","D#","F#"],
  "Em9":    ["E","G","B","D","F#"],

  "F":      ["F","A","C"],       "Fm":     ["F","G#","C"],
  "F7":     ["F","A","C","D#"],  "Fmaj7":  ["F","A","C","E"],
  "Fm7":    ["F","G#","C","D#"], "Fm7b5":  ["F","G#","B","D#"],
  "Fdim":   ["F","G#","B"],      "Faug":   ["F","A","C#"],
  "Fsus2":  ["F","G","C"],       "Fsus4":  ["F","A#","C"],
  "F6":     ["F","A","C","D"],   "Fm6":    ["F","G#","C","D"],
  "F9":     ["F","A","C","D#","G"], "Fmaj9":["F","A","C","E","G"],
  "Fm9":    ["F","G#","C","D#","G"],

  "G":      ["G","B","D"],       "Gm":     ["G","A#","D"],
  "G7":     ["G","B","D","F"],   "Gmaj7":  ["G","B","D","F#"],
  "Gm7":    ["G","A#","D","F"],  "Gm7b5":  ["G","A#","C#","F"],
  "Gdim":   ["G","A#","C#"],     "Gaug":   ["G","B","D#"],
  "Gsus2":  ["G","A","D"],       "Gsus4":  ["G","C","D"],
  "G6":     ["G","B","D","E"],   "Gm6":    ["G","A#","D","E"],
  "G9":     ["G","B","D","F","A"], "Gmaj9":["G","B","D","F#","A"],
  "Gm9":    ["G","A#","D","F","A"],

  "A":      ["A","C#","E"],      "Am":     ["A","C","E"],
  "A7":     ["A","C#","E","G"],  "Amaj7":  ["A","C#","E","G#"],
  "Am7":    ["A","C","E","G"],   "Am7b5":  ["A","C","D#","G"],
  "Adim":   ["A","C","D#"],      "Aaug":   ["A","C#","F"],
  "Asus2":  ["A","B","E"],       "Asus4":  ["A","D","E"],
  "A6":     ["A","C#","E","F#"], "Am6":    ["A","C","E","F#"],
  "A9":     ["A","C#","E","G","B"], "Amaj9":["A","C#","E","G#","B"],
  "Am9":    ["A","C","E","G","B"],

  "B":      ["B","D#","F#"],     "Bm":     ["B","D","F#"],
  "B7":     ["B","D#","F#","A"], "Bmaj7":  ["B","D#","F#","A#"],
  "Bm7":    ["B","D","F#","A"],  "Bm7b5":  ["B","D","E","A"],
  "Bdim":   ["B","D","E"],       "Baug":   ["B","D#","G"],
  "Bsus2":  ["B","C#","F#"],     "Bsus4":  ["B","E","F#"],
  "B6":     ["B","D#","F#","G#"],"Bm6":    ["B","D","F#","G#"],
  "B9":     ["B","D#","F#","A","C#"], "Bmaj9":["B","D#","F#","A#","C#"],
  "Bm9":    ["B","D","F#","A","C#"],
};
// ——————————————————————————————————————————————————————

const whiteOrder = ["C","D","E","F","G","A","B"];
const blackMap   = { C:"C#",D:"D#",F:"F#",G:"G#",A:"A#" };
let selectedNotes = [];
let audioInitialized = false;
const synth = new Tone.PolySynth().toDestination();

function playNote(note) {
  if (!audioInitialized) { Tone.start(); audioInitialized = true; }
  synth.triggerAttackRelease(note, "8n");
}

function updateControls() {
  noteCountElem.textContent = 
    `${selectedNotes.length} nota${selectedNotes.length!==1?'s':''} seleccionada${selectedNotes.length!==1?'s':''}`;
  searchButton.disabled = selectedNotes.length < 3;
}

function createPianoUI() {
  instrumentUI.innerHTML = ""; selectedNotes = []; updateControls();
  const startOctave = 1, numOctaves = 2;
  for (let o=startOctave; o<startOctave+numOctaves; o++) {
    const oct = document.createElement("div"); oct.className="octave";
    whiteOrder.forEach((n,i)=>{
      const full=n+o;
      const wk=document.createElement("div");
      wk.className="white-key"; wk.innerHTML=`${n}<sup>${o}</sup>`;
      wk.onclick=()=>toggleNote(full,wk); oct.appendChild(wk);
      if (blackMap[n] && n!=="E" && n!=="B") {
        const bn=blackMap[n]+o;
        const bk=document.createElement("div");
        bk.className="black-key"; bk.style.left=`${(i+1)*60-15}px`;
        bk.innerHTML=`<span class="black-key-label">${blackMap[n]}</span>`;
        bk.onclick=e=>{e.stopPropagation();toggleNote(bn,bk);};
        oct.appendChild(bk);
      }
    });
    instrumentUI.appendChild(oct);
  }
}

function toggleNote(note,el) {
  const i=selectedNotes.indexOf(note);
  if (i>=0) {selectedNotes.splice(i,1); el.classList.remove("active");}
  else if (selectedNotes.length<12) {
    selectedNotes.push(note); el.classList.add("active"); playNote(note);
  }
  updateControls();
}

function showResult() {
  if (selectedNotes.length<3) {
    result.innerHTML=`<p>Selecciona al menos 3 notas para identificar un acorde.</p>`;
    return;
  }
  const cleaned=selectedNotes.map(n=>n.replace(/\d/,""));
  const inp=cleaned.slice().sort();
  let found=null;
  for (let[name,notes] of Object.entries(chordDatabase)) {
    if(notes.length!==inp.length) continue;
    if(JSON.stringify(notes.slice().sort())===JSON.stringify(inp)){found=name;break;}
  }
  if(found){
    result.innerHTML=`
      <p>Notas: ${cleaned.join(", ")}</p>
      <p>Acorde: <strong>${found}</strong></p>`;
  } else {
    const q=encodeURIComponent(cleaned.join(" "));
    result.innerHTML=`
      <p>No lo reconozco, pero puedes buscarlo aquí:</p>
      <p><a href="https://www.google.com/search?q=chord+${q}" target="_blank">
        Buscar acorde en Google
      </a></p>`;
  }
}

function clearSelection() {
  selectedNotes=[]; 
  document.querySelectorAll(".white-key.active,.black-key.active")
    .forEach(el=>el.classList.remove("active"));
  result.innerHTML=`<p>Selecciona al menos 3 notas para identificar un acorde.</p>`;
  updateControls();
}

searchButton.addEventListener("click", showResult);
clearButton .addEventListener("click", clearSelection);
toggleThemeBtn.addEventListener("click", ()=>document.body.classList.toggle("dark-mode"));

createPianoUI();
