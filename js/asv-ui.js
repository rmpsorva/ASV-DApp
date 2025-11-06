// ===== Estado UI =====
let vitality = 32;
const bar = document.getElementById('bar');
const chatBar = document.getElementById('chat-bar');

function setVitality(p){
  vitality = Math.max(0, Math.min(100, Math.round(p)));
  bar.style.width = vitality + '%';
}
setVitality(vitality);

document.getElementById('btn-pulse').addEventListener('click', () => {
  setVitality(vitality + 10);
});

document.getElementById('btn-theme').addEventListener('click', () => {
  document.body.classList.toggle('light');
});

// ===== Wallet / Ethers =====
const TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)"
];

const TOKEN_ADDR = "0x2682FA44105a60F2016FAa8909eA82d3d427bfFc";
let provider, signer, token;

async function ensureProvider(){
  if(!window.ethereum){ alert("Instala MetaMask para continuar."); return false; }
  if(!provider){ provider = new ethers.providers.Web3Provider(window.ethereum); }
  return true;
}

async function connect(){
  if(!(await ensureProvider())) return;
  const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
  signer = provider.getSigner(accounts[0]);
  token  = new ethers.Contract(TOKEN_ADDR, TOKEN_ABI, signer);
  const addr = accounts[0];
  const label = document.getElementById('addr-label');
  label.textContent = "Wallet: " + addr.slice(0,8) + "…" + addr.slice(-4);
}
document.getElementById('btn-connect').addEventListener('click', connect);

// ===== Envío de tokens (ASV-A) =====
document.getElementById('btn-send').addEventListener('click', async () => {
  try{
    if(!signer || !token){ alert("Conecta tu wallet primero."); return; }
    const to = document.getElementById('to').value.trim();
    const amount = document.getElementById('amount').value.trim();
    if(!ethers.utils.isAddress(to)){ alert("Dirección inválida."); return; }

    let decimals = 18;
    try { decimals = await token.decimals(); } catch {}

    const value = ethers.utils.parseUnits(String(amount), decimals);
    const tx = await token.transfer(to, value);
    await tx.wait();

    alert("Transferencia confirmada ✅");
    setVitality(vitality + 15);
  }catch(e){
    alert("Error o transacción rechazada.");
  }
});

// ===== “Chat” demo: sube la barrita un poco al escribir
document.getElementById('chat-input').addEventListener('input', (e)=>{
  const len = Math.min(100, e.target.value.length);
  chatBar.style.width = (20 + len * 0.6) + '%';
});

// ===== Auto-enlace Swap (ya lo setea index.html, lo dejamos aquí por si reutilizas)
const swapBtn = document.getElementById('btn-buy');
if(swapBtn && !swapBtn.href){
  swapBtn.href = "https://pancakeswap.finance/swap?outputCurrency=" + TOKEN_ADDR + "&chain=bsc";
}
function updateAvatarVitality(v) {
    const avatar = document.getElementById('asv-avatar');

    if (v > 70) avatar.style.filter = "drop-shadow(0 0 25px #00ffea) contrast(1.4)";
    else if (v > 40) avatar.style.filter = "drop-shadow(0 0 15px #00eaff) contrast(1.2)";
    else avatar.style.filter = "drop-shadow(0 0 6px #009baf) grayscale(0.7)";
}
