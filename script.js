// Configuración dinámica del token ASV-A (dirección y ABI mínimas)
const tokenConfig = {
  address: "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",  // <--- Reemplazar por dirección real
  symbol: "ASV-A",
  decimals: 18,  // Se puede actualizar tras leer token.decimals()
  abi: [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function transfer(address to, uint256 amount) returns (bool)"
  ]
};

// Referencias a elementos de la UI
const connectBtn = document.getElementById('connectBtn');
const networkAlert = document.getElementById('networkAlert');
const balanceAmountEl = document.getElementById('balanceAmount');
const balanceSymbolEl = document.getElementById('balanceSymbol');
const destInput = document.getElementById('destAddress');
const amountInput = document.getElementById('amount');
const sendBtn = document.getElementById('sendBtn');
const txMessageEl = document.getElementById('txMessage');

// Variables globales para proveedor, signer y contrato
let provider, signer, tokenContract;

// Estado de conexión
let userAddress = null;

// Mostrar mensaje en la sección de mensajes de transacción
function showTxMessage(text, isError = false) {
  txMessageEl.textContent = text;
  txMessageEl.className = 'message ' + (isError ? 'error' : 'success');
}

// Mostrar alerta de red (p.ej. red incorrecta)
function showNetworkAlert(text) {
  networkAlert.textContent = text;
  networkAlert.style.display = text ? 'block' : 'none';
}

// Deshabilitar o habilitar formulario de transferencia
function setTransferEnabled(enabled) {
  destInput.disabled = !enabled;
  amountInput.disabled = !enabled;
  sendBtn.disabled = !enabled;
}

// Actualizar balance en la UI
async function updateBalance() {
  if (!tokenContract || !userAddress) return;
  try {
    const rawBal = await tokenContract.balanceOf(userAddress);
    const dec = await tokenContract.decimals();
    tokenConfig.decimals = Number(dec);  // actualizar config con decimales reales
    const formatted = ethers.formatUnits(rawBal, dec);
    balanceAmountEl.textContent = formatted;
    balanceSymbolEl.textContent = tokenConfig.symbol;
  } catch (err) {
    console.error("Error obteniendo balance:", err);
    balanceAmountEl.textContent = "?";
    showTxMessage("Error al obtener el balance.", true);
  }
}

// Función principal para conectar wallet
async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask no está instalada. Por favor, instálala para continuar.");
    return;
  }
  connectBtn.disabled = true;
  connectBtn.textContent = "Conectando...";
  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);  // Solicitar acceso a cuentas
    signer = await provider.getSigner();
    userAddress = await signer.getAddress();
    console.log("Cuenta conectada:", userAddress);

    // Verificar chainId
    const network = await provider.getNetwork();
    const chainIdHex = "0x" + network.chainId.toString(16);
    if (network.chainId !== 56n && network.chainId !== 56) {
      // No es BSC Mainnet, intentar cambiar
      showNetworkAlert("Conectando a BSC...");
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x38" }]  // 0x38 = 56
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          // Red no agregada en MetaMask, intentar agregarla
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{
                chainId: "0x38",
                chainName: "BNB Smart Chain",
                rpcUrls: ["https://bsc-dataseed.binance.org/"],
                nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
                blockExplorerUrls: ["https://bscscan.com"]
              }]
            });
          } catch (addError) {
            console.error("Error al agregar BSC:", addError);
            showNetworkAlert("No se pudo agregar la red BSC.");
            connectBtn.disabled = false;
            connectBtn.textContent = "Conectar Wallet";
            return;
          }
        } else {
          console.error("Switch chain cancelado u otro error:", switchError);
          showNetworkAlert("Debe usar BSC (Mainnet) para continuar.");
          connectBtn.disabled = false;
          connectBtn.textContent = "Conectar Wallet";
          return;
        }
      }
    }
    // Red confirmada como BSC:
    showNetworkAlert("");  // limpiar cualquier alerta de red

    // Instanciar contrato token ASV-A
    tokenContract = new ethers.Contract(tokenConfig.address, tokenConfig.abi, signer);
    balanceSymbolEl.textContent = tokenConfig.symbol;
    await updateBalance();  // obtener y mostrar balance inicial

    // UI post-conexión
    connectBtn.textContent = "Wallet Conectada";
    connectBtn.disabled = true;
    setTransferEnabled(true);
    showTxMessage(`Wallet conectada: ${userAddress.substring(0,6)}...${userAddress.slice(-4)}`);
  } catch (err) {
    console.error("Error al conectar wallet:", err);
    if (err.code === 4001) {
      // Usuario rechazó solicitud de conexión
      showTxMessage("Conexión rechazada por el usuario.", true);
    } else {
      showTxMessage("Error al conectar la wallet.", true);
    }
    connectBtn.disabled = false;
    connectBtn.textContent = "Conectar Wallet";
  }
}

// Manejador de clic en "Conectar Wallet"
connectBtn.addEventListener('click', () => {
  connectWallet();
});

// Manejador de clic en "Enviar" tokens
sendBtn.addEventListener('click', async () => {
  showTxMessage("");  // limpiar mensajes previos
  const dest = destInput.value.trim();
  const amountStr = amountInput.value.trim();
  // Validaciones previas
  if (!ethers.isAddress(dest)) {
    showTxMessage("Dirección destino inválida.", true);
    return;
  }
  if (!amountStr || isNaN(Number(amountStr)) || Number(amountStr) <= 0) {
    showTxMessage("Monto inválido.", true);
    return;
  }
  let amountWei;
  try {
    amountWei = ethers.parseUnits(amountStr, tokenConfig.decimals);
  } catch (err) {
    showTxMessage("Monto inválido para las decimales del token.", true);
    return;
  }
  try {
    sendBtn.disabled = true;
    sendBtn.textContent = "Enviando...";
    console.log(`Enviando ${amountStr} ${tokenConfig.symbol} a ${dest}...`);
    const tx = await tokenContract.transfer(dest, amountWei);
    showTxMessage("Transacción enviada, esperando confirmación...");
    await tx.wait();  // esperar minado
    showTxMessage("✅ ¡Transferencia completada!", false);
    // Actualizar balance luego de la transferencia
    await updateBalance();
  } catch (err) {
    console.error("Error en transferencia:", err);
    if (err.code === 4001) {
      showTxMessage("Transacción cancelada por el usuario.", true);
    } else {
      const errMsg = err.message || "Error desconocido";
      showTxMessage("Error al enviar: " + errMsg, true);
    }
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Enviar";
  }
});

// Inicialmente, deshabilitar formulario de transferencia hasta conectar
setTransferEnabled(false);
