const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

let isDrawing = false;
let currentPhase = 'draw'; // 'draw', 'setup', 'play'

// Region Data Store
let regions = []; 
let activeRegion = null;

// --- 1. DRAWING PHASE ---
canvas.addEventListener('mousedown', () => { if (currentPhase === 'draw') isDrawing = true; });
canvas.addEventListener('mouseup', () => { isDrawing = false; ctx.beginPath(); });
canvas.addEventListener('mousemove', draw);

function draw(e) {
  if (!isDrawing || currentPhase !== 'draw') return;
  const rect = canvas.getBoundingClientRect();
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000000';

  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

// --- 2. TRANSITION TO SETUP ---
document.getElementById('finishDrawingBtn').addEventListener('click', () => {
  currentPhase = 'setup';
  document.getElementById('drawPhase').classList.add('hidden');
  document.getElementById('setupPhase').classList.remove('hidden');
});

// --- 3. COMBAT RESOLUTION ---
function executeAttack(attackerRegion, defenderRegion, troopsSent) {
  if (troopsSent > attackerRegion.military) {
    alert("You don't have enough troops!");
    return;
  }

  // Combat calculation
  if (troopsSent > defenderRegion.military) {
    // Attacker wins
    attackerRegion.military -= troopsSent; // Deduct sent troops from home base
    defenderRegion.owner = attackerRegion.owner; // Claim land
    defenderRegion.military = troopsSent - defenderRegion.military; // Remaining troops stay in new land
    
    document.getElementById('battleLog').innerText = 
      `${attackerRegion.owner} captured the territory!`;
  } else {
    // Defender wins
    defenderRegion.military -= troopsSent;
    attackerRegion.military -= troopsSent;
    
    document.getElementById('battleLog').innerText = 
      `Attack failed! Defender has ${defenderRegion.military} troops left.`;
  }

  checkWinCondition();
}

function checkWinCondition() {
  const owners = new Set(regions.map(r => r.owner));
  if (owners.size === 1) {
    const winner = Array.from(owners)[0];
    alert(`Game Over! ${winner} controls the entire map!`);
  }
}
