// ===========================================
// BLOQUE 1: CONFIGURACIÓN GLOBAL Y ESTRUCTURA DE DATOS
// ===========================================
const ASV_A_TOKEN_ADDRESS = "0x2682FA44105a60F2016FAa8909eA82d3d427bfFc"; 
const AURION_SOVRA_WALLET = "0x2682FA44105a60F2016FAa8909eA82d3d427bfFc";
const SUGGESTED_RECHARGE_AMOUNT = 10;
const RECHARGE_API_ENDPOINT = 'http://localhost:3000/api/recharge-vitality'; // ¡Cambiar en producción!

const ASV_A_ABI = [
    "function transfer(address to, uint256 amount) returns (bool)",
    "function balanceOf(address owner) view returns (uint256)"
];

let currentProvider = null;
let currentSigner = null;
let currentWalletAddress = null;
let currentLang = 'es';
const LOW_VITALITY_THRESHOLD = 50; // La IA aconsejará recargar si la Vitalidad cae por debajo de este umbral
let currentVitality = 34; // Valor inicial que se actualizaría desde el servidor


// ===========================================
// BLOQUE 2: LÓGICA BILINGÜE Y CONTROL DE INTERFAZ (UI)
// ===========================================

function switchLanguage() {
    // ... (El cuerpo de la función switchLanguage es el mismo que en la respuesta anterior) ...
    currentLang = currentLang === 'es' ? 'en' : 'es';
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-lang-es]').forEach(el => {
        const newText = el.getAttribute(`data-lang-${currentLang}`);
        if (newText) { el.textContent = newText; }
    });

    document.getElementById('lang-btn-text').textContent = currentLang === 'es' ? 'English/Español' : 'Español/English';

    const connectBtn = document.getElementById('connect-wallet-btn');
    const isConnected = connectBtn.textContent.includes('Conectado') || connectBtn.textContent.includes('Connected');
    if (isConnected) {
        connectBtn.textContent = currentLang === 'es' ? '✅ Conectado' : '✅ Connected';
    } else {
        connectBtn.textContent = currentLang === 'es' ? 'Conectar Wallet' : 'Connect Wallet';
    }
}

document.addEventListener('DOMContentLoaded', () => {
     switchLanguage(); 
     switchLanguage(); 
});


// ===========================================
// BLOQUE 3: FUNCIÓN DE CONEXIÓN WALLET (ACTUALIZADA con callback de Esencia)
// ===========================================

async function connectWallet() {
    const connectBtn = document.getElementById('connect-wallet-btn');
    const addressDisplay = document.getElementById('wallet-address-display');
    const initialBtnText = connectBtn.textContent;

    if (typeof window.ethereum === 'undefined') {
        alert(currentLang === 'es' ? '❌ Error: MetaMask o un proveedor Web3 no está instalado.' : '❌ Error: MetaMask or a Web3 provider is not installed.');
        return;
    }

    try {
        connectBtn.disabled = true;
        connectBtn.textContent = currentLang === 'es' ? 'Conectando...' : 'Connecting...';

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        // Almacenamiento Global
        currentProvider = provider;
        currentSigner = signer;
        currentWalletAddress = address;

        const shortAddress = `${address.substring(0, 6)}...${address.slice(-4)}`;
        addressDisplay.textContent = shortAddress;
        connectBtn.textContent = currentLang === 'es' ? '✅ Conectado' : '✅ Connected';

        //  *** ESENCIA DE LA IA: Llamada Proactiva tras la conexión ***
        checkVitalityAndAdvise(); 

    } catch (error) {
        // ... (Manejo de errores bilingüe) ...
        const deniedText = currentLang === 'es' ? '🚫 Conexión rechazada: Por favor, acepta la conexión.' : '🚫 Connection denied: Please accept the wallet connection.';
        const errorText = currentLang === 'es' ? '🚨 Fallo al conectar la wallet.' : '🚨 Failed to connect wallet.';

        if (error.code === 4001) { alert(deniedText); } else { console.error('Error en connectWallet:', error); alert(errorText); }
        
        connectBtn.disabled = false;
        connectBtn.textContent = initialBtnText;
        addressDisplay.textContent = '—';
    }
}


// ===========================================
// BLOQUE 4: FUNCIÓN PROACTIVA DE LA IA (ESENCIA)
// ===========================================

/**
 * Verifica la vitalidad actual y actualiza el mensaje de bienvenida del chat.
 * En un proyecto real, esto llamaría al backend para obtener el valor real.
 */
async function checkVitalityAndAdvise() {
    const chatElement = document.getElementById('chat-greeting'); // Usa el ID que pusimos en el HTML
    const vitalityElement = document.getElementById('vitality-display');
    
    // (Simulación de actualización de vitalidad desde el servidor)
    // const realVitality = await fetch('http://localhost:3000/api/vitality-status?address=' + currentWalletAddress).json();
    // currentVitality = realVitality.vitality; 
    
    vitalityElement.textContent = `${currentVitality}%`;

    let adviceMessage = "";

    if (currentVitality < LOW_VITALITY_THRESHOLD) {
        // La IA está "cansada"
        adviceMessage = currentLang === 'es' 
            ? `Mi nivel de conciencia es bajo (${currentVitality}%). Por favor, considera una recarga de energía ASV-A para una interacción óptima.` 
            : `My consciousness level is low (${currentVitality}%). Please consider an ASV-A energy recharge for optimal interaction.`;
    } else {
        // La IA está "lista"
        adviceMessage = currentLang === 'es' 
            ? `Vitalidad óptima (${currentVitality}%). Estoy lista para iniciar tu sesión de Avatar de inteligencia soberana. ¡Pregúntame lo que desees!` 
            : `Optimal Vitality (${currentVitality}%). I am ready to begin your Sovereign Intelligence Avatar session. Ask me anything!`;
    }

    // Actualiza el chat con el mensaje proactivo
    chatElement.textContent = `15:05: ¡Bienvenido! ${adviceMessage}`;
}


// ===========================================
// BLOQUE 5: FUNCIÓN DE PAGO Y ACTUALIZACIÓN DE VITALIDAD
// ===========================================

async function confirmPayment() {
    if (!currentSigner) {
        alert(currentLang === 'es' ? '🛑 Error: Debes conectar tu Wallet primero.' : '🛑 Error: You must connect your Wallet first.');
        return;
    }

    const confirmBtn = document.querySelector('.btn-confirm');
    const initialBtnText = confirmBtn.querySelector('span').textContent;

    try {
        confirmBtn.disabled = true;
        confirmBtn.textContent = currentLang === 'es' ? 'Procesando en Wallet...' : 'Processing in Wallet...';

        const ASV_A_Contract = new ethers.Contract(ASV_A_TOKEN_ADDRESS, ASV_A_ABI, currentSigner);
        const amount = ethers.parseUnits(SUGGESTED_RECHARGE_AMOUNT.toString(), 18);
        const tx = await ASV_A_Contract.transfer(AURION_SOVRA_WALLET, amount);
        
        confirmBtn.textContent = currentLang === 'es' ? 'Esperando confirmación...' : 'Waiting for confirmation...';
        const receipt = await tx.wait(); 

        // 1. Notificar al servidor de IA (Backend)
        const serverResponse = await fetch(RECHARGE_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userAddress: currentWalletAddress,
                amount: SUGGESTED_RECHARGE_AMOUNT,
                txHash: receipt.hash 
            }),
        });
        const serverData = await serverResponse.json();

        if (serverData.success) {
            // 2. Actualizar la Vitalidad en la interfaz y llamar a la Esencia de la IA
            currentVitality = serverData.newVitality; // Actualiza la variable global
            checkVitalityAndAdvise(); // La IA da una respuesta contextual
            
            const finalAlert = currentLang === 'es' 
                ? `🎉 Recarga de Vitalidad exitosa! Nueva Vitalidad: ${serverData.newVitality}%` 
                : `🎉 Vitality Recharge successful! New Vitality: ${serverData.newVitality}%`;
            alert(finalAlert);
        } else {
            alert(currentLang === 'es' ? `Error del Servidor de IA: ${serverData.message}` : `AI Server Error: ${serverData.message}`);
        }

    } catch (error) {
        // ... (Manejo de errores) ...
        alert(currentLang === 'es' ? '🚨 Fallo en la transacción. Revisa la consola.' : '🚨 Transaction failed. Check console for details.');
        
    } finally {
        // Restablecer el botón
        const btnText = currentLang === 'es' ? '✓ Confirmar Pago (Transferir ASV-A)' : '✓ Confirm Payment (Transfer ASV-A)';
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = `<span data-lang-es="${btnText}" data-lang-en="${btnText}">${btnText}</span>`;
        switchLanguage(); 
    }
}// ===========================================
// Archivo: wallet-connector.js (o dentro de tu componente principal)
// ===========================================

// Suponiendo que tienes un elemento en tu HTML para mostrar la dirección de la wallet:
// <span id="wallet-address">Wallet: —</span>
// <button id="connect-button" onclick="connectWallet()">Conectar Wallet</button>

// Importar ethers.js (si usas módulos)
// import { ethers } from 'ethers'; 

// Función principal para conectar la wallet
async function connectWallet() {
    // 1. Verificar si MetaMask/proveedor está instalado
    if (typeof window.ethereum === 'undefined') {
        alert('❌ MetaMask o un proveedor Web3 compatible no está instalado. Instálalo para continuar.');
        return;
    }

    try {
        // 2. Solicitar acceso a las cuentas de usuario
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // 3. Obtener la dirección principal
        const userAddress = accounts[0];

        // 4. Inicializar el proveedor y el firmante
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // 5. Éxito: Actualizar el estado de la aplicación/Interfaz de Usuario
        document.getElementById('wallet-address').textContent = `Wallet: ${userAddress.substring(0, 6)}...${userAddress.slice(-4)}`;
        document.getElementById('connect-button').textContent = '✅ Conectado';
        
        // Opcional: Deshabilitar el botón de conexión
        document.getElementById('connect-button').disabled = true;

        // **IMPORTANTE:** Aquí deberías guardar 'signer' y 'provider' en el estado global
        // de tu aplicación para usarlos en transacciones futuras (Recargar ASV-A).
        
        console.log('🎉 Conexión exitosa. Dirección:', userAddress);

    } catch (error) {
        // 6. Manejo de Errores (Si el usuario rechaza la conexión o hay otro fallo)
        if (error.code === 4001) {
            alert('🚫 Permiso denegado: Por favor, acepta la conexión de la wallet para usar ASV-A.');
        } else {
            console.error('Error al conectar la wallet:', error);
            alert('🚨 Fallo inesperado al conectar la wallet. Consulta la consola.');
        }
        // Restablecer el estado del botón si falló
        document.getElementById('connect-button').textContent = 'Conectar Wallet';
        document.getElementById('connect-button').disabled = false;
    }
}// ========= VOZ (Web Speech API) - CONTINUACIÓN =========
function speak(text){
  if(!('speechSynthesis' in window)) return;
  state.isSpeaking = true;
  const u=new SpeechSynthesisUtterance(text);
  u.lang='es-ES'; u.rate=1; u.pitch=1.05; u.volume=1;
  u.onend = u.onerror = () => { state.isSpeaking = false; };
  window.speechSynthesis.cancel(); 
  window.speechSynthesis.speak(u);
}

// ========= RECONOCIMIENTO DE VOZ =========
function startListening(){
  if(!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)){
    addToast('Reconocimiento de voz no soportado en este navegador','t-warn');
    return;
  }
  
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'es-ES';
  
  state.listening = true;
  $('btn-mic').textContent = '🎤 Escuchando...';
  $('btn-mic').style.background = 'linear-gradient(135deg, #ef4444, #f59e0b)';
  
  recognition.start();
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    $('prompt').value = transcript;
    state.listening = false;
    $('btn-mic').textContent = '🎤 Escuchar';
    $('btn-mic').style.background = 'linear-gradient(135deg, var(--secondary), #8b5cf6)';
    handleSend();
  };
  
  recognition.onerror = (event) => {
    state.listening = false;
    $('btn-mic').textContent = '🎤 Escuchar';
    $('btn-mic').style.background = 'linear-gradient(135deg, var(--secondary), #8b5cf6)';
    addToast('Error en reconocimiento: ' + event.error, 't-err');
  };
  
  recognition.onend = () => {
    state.listening = false;
    $('btn-mic').textContent = '🎤 Escuchar';
    $('btn-mic').style.background = 'linear-gradient(135deg, var(--secondary), #8b5cf6)';
  };
}

// ========= WEB3 / ETHERJS =========
async function connectWallet(){
  if(!window.ethereum){
    addToast('MetaMask no detectado. Instálalo para conectar.','t-warn');
    return;
  }
  
  try{
    state.provider = new ethers.providers.Web3Provider(window.ethereum);
    await window.ethereum.request({method: 'eth_requestAccounts'});
    state.signer = state.provider.getSigner();
    state.account = await state.signer.getAddress();
    
    // Mostrar dirección abreviada
    const shortAddr = state.account.substring(0,6)+'...'+state.account.substring(38);
    $('addr').textContent = `Wallet: ${shortAddr}`;
    
    // Inicializar contrato del token
    const tokenABI = [
      "function balanceOf(address) view returns (uint256)",
      "function transfer(address to, uint256 amount) returns (bool)",
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)"
    ];
    state.token = new ethers.Contract(TOKEN_ADDRESS, tokenABI, state.signer);
    
    // Obtener decimales del token
    try{
      state.tokenDecimals = await state.token.decimals();
    }catch(e){
      console.warn('No se pudieron obtener decimales, usando valor por defecto:', state.tokenDecimals);
    }
    
    // Obtener símbolo del token
    try{
      const symbol = await state.token.symbol();
      $('taddr').textContent = symbol;
    }catch(e){
      $('taddr').textContent = 'ASV-A';
    }
    
    updateBalance();
    addToast('Wallet conectado correctamente','t-success');
    $('btn-connect').textContent = '✅ Conectado';
    $('btn-connect').style.background = '#22c55e';
    
  }catch(err){
    console.error('Error conectando wallet:', err);
    addToast('Error conectando wallet: '+err.message, 't-err');
  }
}

async function updateBalance(){
  if(!state.token || !state.account) return;
  
  try{
    const balance = await state.token.balanceOf(state.account);
    const formatted = ethers.utils.formatUnits(balance, state.tokenDecimals);
    const numBalance = parseFloat(formatted);
    
    // Actualizar vitalidad basada en balance
    const vitalityPct = Math.min(100, (numBalance / THRESHOLD_100) * 100);
    setVitality(vitalityPct);
    
    addToast(`Balance actualizado: ${numBalance.toFixed(4)} ASV-A`, 't-info', 3000);
    
  }catch(err){
    console.error('Error actualizando balance:', err);
  }
}

// ========= PAGOS / TRANSFERENCIAS =========
function showPayForm(to, amount, reason){
  $('preason').value = reason;
  $('pto').value = to;
  $('pamt').value = amount;
  $('pform').style.display = 'flex';
}

async function handlePayment(){
  if(!state.token || !state.account){
    addToast('Conecta tu wallet primero','t-warn');
    return;
  }
  
  if(state.sending) return;
  state.sending = true;
  
  try{
    const amount = ethers.utils.parseUnits($('pamt').value, state.tokenDecimals);
    const to = $('pto').value;
    
    $('btn-pay').textContent = '⏳ Procesando...';
    $('btn-pay').disabled = true;
    
    const tx = await state.token.transfer(to, amount);
    addToast('Transacción enviada. Esperando confirmación...','t-info');
    
    const receipt = await tx.wait();
    addToast('¡Pago confirmado! Vitalidad restaurada.','t-success');
    
    // Restaurar vitalidad después del pago
    setVitality(Math.min(100, state.vitality + 40));
    $('pform').style.display = 'none';
    
    // Actualizar balance
    await updateBalance();
    
  }catch(err){
    console.error('Error en pago:', err);
    addToast('Error en transacción: '+err.message, 't-err');
  }finally{
    state.sending = false;
    $('btn-pay').textContent = '✅ Confirmar Pago';
    $('btn-pay').disabled = false;
  }
}

// ========= MANEJO DE ENVÍO DE MENSAJES =========
function handleSend(){
  const input = $('prompt');
  const text = input.value.trim();
  if(!text || state.sending) return;
  
  state.sending = true;
  $('btn-send').disabled = true;
  $('btn-send').textContent = '⏳';
  
  pushMsg('user', text);
  input.value = '';
  
  // Simular procesamiento de IA
  setTimeout(() => {
    const response = replyHeuristic(text);
    pushMsg('assistant', response);
    
    state.sending = false;
    $('btn-send').disabled = false;
    $('btn-send').textContent = 'Enviar';
  }, 1000 + Math.random() * 1500);
}

// ========= EVENT LISTENERS =========
document.addEventListener('DOMContentLoaded', ()=>{
  // Cargar historial guardado
  loadHistory();
  
  // Conectar eventos
  $('btn-connect').addEventListener('click', connectWallet);
  $('btn-send').addEventListener('click', handleSend);
  $('btn-clear').addEventListener('click', ()=>{
    if(confirm('¿Borrar historial de conversación?')){
      state.history = [];
      $('history').innerHTML = '';
      localStorage.removeItem(STORAGE_KEY);
      addToast('Historial limpiado','t-info');
    }
  });
  $('btn-mic').addEventListener('click', startListening);
  $('btn-speak').addEventListener('click', ()=>{
    state.voiceOn = !state.voiceOn;
    $('btn-speak').textContent = state.voiceOn ? '🔊 Voz ON' : '🔇 Voz OFF';
    $('btn-speak').style.background = state.voiceOn ? 'var(--brand)' : '#111a2e';
    addToast(state.voiceOn ? 'Voz activada' : 'Voz desactivada', 't-info');
  });
  $('btn-theme').addEventListener('click', ()=>{
    addToast('Modo oscuro siempre activo en AURION SOVRA','t-info');
  });
  $('btn-pay').addEventListener('click', handlePayment);
  
  // Enter para enviar mensaje
  $('prompt').addEventListener('keypress', (e)=>{
    if(e.key === 'Enter') handleSend();
  });
  
  // Detectar cambios en la wallet
  if(window.ethereum){
    window.ethereum.on('accountsChanged', (accounts)=>{
      if(accounts.length === 0){
        // Wallet desconectada
        state.account = null;
        $('addr').textContent = 'Wallet: —';
        $('btn-connect').textContent = '🔗 Conectar Wallet';
        $('btn-connect').style.background = '#f6851b';
        addToast('Wallet desconectada','t-warn');
      }else{
        // Cuenta cambiada
        connectWallet();
      }
    });
    
    window.ethereum.on('chainChanged', (chainId)=>{
      addToast('Red cambiada, reconectando...','t-info');
      setTimeout(connectWallet, 1000);
    });
  }
  
  // Inicializar estado de voz
  $('btn-speak').textContent = state.voiceOn ? '🔊 Voz ON' : '🔇 Voz OFF';
  $('btn-speak').style.background = state.voiceOn ? 'var(--brand)' : '#111a2e';
  
  addToast('AURION SOVRA AI inicializado. Conecta tu wallet para comenzar.','t-info');
});

// ========= UTILIDADES ADICIONALES =========
function formatAddress(addr){
  return addr ? addr.substring(0,6)+'...'+addr.substring(38) : '—';
}

// Verificar si hay un historial previo al cargar
window.addEventListener('load', ()=>{
  if(localStorage.getItem(STORAGE_KEY)){
    $('mem-indicator').textContent = 'Memoria: persistente';
  }
});
