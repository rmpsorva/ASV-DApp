
const ASV_A_TOKEN_ADDRESS = "0x2682FA44105a60F2016FAa8909eA82d3d427bfFc"; 
const AURION_SOVRA_WALLET = ASV_A_TOKEN_ADDRESS;
const SUGGESTED_RECHARGE_AMOUNT = 10;

const ASV_A_ABI = [
    "function transfer(address to, uint256 amount) returns (bool)",
    "function balanceOf(address owner) view returns (uint256)"
];

let currentProvider=null, currentSigner=null, currentWalletAddress=null;
let currentLang='es', currentVitality=34;
const LOW_VITALITY_THRESHOLD=50;

function switchLanguage(){
  currentLang = currentLang==='es'?'en':'es';
  document.getElementById('lang-btn-text').textContent = currentLang==='es'?'English/Español':'Español/English';
  const btn=document.getElementById('connect-wallet-btn');
  const connected = btn.textContent.includes('✅');
  btn.textContent = connected ? (currentLang==='es'?'✅ Conectado':'✅ Connected') : (currentLang==='es'?'Conectar Wallet':'Connect Wallet');
}

async function connectWallet(){
  const btn=document.getElementById('connect-wallet-btn');
  if(typeof window.ethereum==='undefined'){alert('MetaMask requerido');return;}
  btn.textContent=currentLang==='es'?'Conectando...':'Connecting...';
  const provider=new ethers.BrowserProvider(window.ethereum);
  const signer=await provider.getSigner();
  const address=await signer.getAddress();
  currentProvider=provider; currentSigner=signer; currentWalletAddress=address;
  document.getElementById('wallet-address-display').textContent = address.substring(0,6)+'...'+address.slice(-4);
  btn.textContent=currentLang==='es'?'✅ Conectado':'✅ Connected';
  checkVitalityAndAdvise();
}
document.addEventListener('DOMContentLoaded',()=>{document.getElementById('connect-wallet-btn').onclick=connectWallet;});

function checkVitalityAndAdvise(){
  document.getElementById('vitality-display').textContent = currentVitality+'%';
  document.getElementById('chat-greeting').textContent = currentVitality<LOW_VITALITY_THRESHOLD ?
    (currentLang==='es'?'Mi vitalidad es baja.':'My vitality is low.') :
    (currentLang==='es'?'Vitalidad óptima.':'Optimal vitality.');
}

async function confirmPayment(){
  if(!currentSigner){alert('Conecta Wallet');return;}
  const btn=document.querySelector('.btn-confirm');
  btn.textContent='...';
  const c=new ethers.Contract(ASV_A_TOKEN_ADDRESS,ASV_A_ABI,currentSigner);
  const amt=ethers.parseUnits(SUGGESTED_RECHARGE_AMOUNT.toString(),18);
  await (await c.transfer(AURION_SOVRA_WALLET,amt)).wait();
  currentVitality = Math.min(100,currentVitality+15);
  checkVitalityAndAdvise();
  alert('✓ Done');
  btn.textContent=currentLang==='es'?'✓ Confirmar Pago (Transferir ASV-A)':'✓ Confirm Payment (Transfer ASV-A)';
}
