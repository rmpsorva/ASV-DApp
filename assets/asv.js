(() => {
  const $ = (q) => document.querySelector(q);
  const byId = (id) => document.getElementById(id);

  const state = {
    wallet: null,
    vitality: 32,
    history: [],
    emotion: "tired"
  };

  // ---------- Wallet (BSC)
  async function connectWallet(){
    try{
      if(!window.ethereum) throw new Error("No wallet");
      await ethereum.request({ method: "wallet_switchEthereumChain", params:[{ chainId: window.ASVA.chainIdHex }]});
      const [acc] = await ethereum.request({ method:"eth_requestAccounts" });
      state.wallet = acc;
      byId("waddr").textContent = acc.slice(0,6)+"…"+acc.slice(-4);
    }catch(e){
      alert("Wallet no disponible o red incorrecta.");
    }
  }

  // ---------- Vitalidad / emoción
  function setVitality(v){
    state.vitality = Math.max(0, Math.min(100, v|0));
    byId("vital").textContent = state.vitality + "%";
    byId("vbar").style.width = state.vitality + "%";
    state.emotion = ASVEmotion.next(state.vitality);
    byId("emotion").textContent = state.emotion;
    paintAvatarFx();
  }

  // ---------- Chat básico con memoria local
  function log(msg, who="ASV"){
    const time = new Date().toLocaleTimeString();
    state.history.push({time, who, msg});
    localStorage.setItem("asv_chat", JSON.stringify(state.history));
    const el = document.createElement("div");
    el.innerHTML = `<b>${who}</b> <span class="muted">${time}</span><br>${msg}`;
    byId("chatLog").prepend(el);
    dumpState();
  }
  function dumpState(){
    byId("stateDump").textContent = JSON.stringify({
      wallet: state.wallet, vitality: state.vitality, emotion: state.emotion, history: state.history.slice(0,3)
    }, null, 2);
  }

  // ---------- Compra (Swap) y Envío
  function setupSwap(){
    // PancakeSwap con outputCurrency = contrato ASV-A
    const url = `https://pancakeswap.finance/swap?outputCurrency=${encodeURIComponent(window.ASVA.token)}&chain=bsc`;
    byId("swapBtn").href = url;
  }
  async function sendToken(){
    if(!state.wallet) return alert("Conecta tu wallet primero.");
    alert("Acción de envío ASV-A: implementa el contrato ERC20/BEP20 según tu flujo.");
    // Aquí puedes integrar ethers.js / ABI ERC20 transfer(to, amount).
  }

  // ---------- Avatar FX (usa la imagen real y brillos dinámicos)
  const img = byId("avatarImg");
  const cvs = byId("avatarFx");
  const ctx = cvs.getContext("2d");

  function paintAvatarFx(){
    const hue = ASVEmotion.hueFor(state.emotion);
    ctx.clearRect(0,0,cvs.width,cvs.height);

    // Glow circular respirando
    const t = Date.now()/1000;
    const r = 180 + Math.sin(t*1.3)*8;
    const g = ctx.createRadialGradient(cvs.width/2, cvs.height*0.42, 20, cvs.width/2, cvs.height*0.42, r);
    g.addColorStop(0, `hsla(${hue}, 95%, 60%, .25)`);
    g.addColorStop(1, `hsla(${hue}, 95%, 20%, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0,0,cvs.width,cvs.height);

    // Líneas sutiles (holograma)
    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = `hsla(${hue}, 100%, 70%, .12)`;
    ctx.lineWidth = 1;
    for(let i=0;i<12;i++){
      ctx.beginPath();
      ctx.arc(cvs.width/2, cvs.height*0.42, 40+i*18 + (Math.sin(t+i)*2), 0, Math.PI*2);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function microGestures(){
    // Suave latido del rostro
    const a = byId("avatar");
    let s = 1, dir = 1;
    setInterval(()=>{
      s += dir*0.003;
      if(s>1.02) dir = -1;
      if(s<0.98) dir = 1;
      a.style.transform = `scale(${s})`;
    }, 33);
  }

  // ---------- UI wiring
  function bindUI(){
    byId("connectBtn").onclick = connectWallet;
    byId("boostBtn").onclick = ()=> setVitality(state.vitality+10);
    byId("sendBtn").onclick = ()=>{
      const q = byId("chatInput").value.trim();
      if(!q) return;
      log(q, "Tú");
      byId("chatInput").value = "";

      // Respuesta simple + efecto energía
      const reply = (q.toLowerCase().includes("recarga"))
        ? "Puedo sugerirte una recarga con ASV-A si mi energía baja."
        : "Estoy aquí. Mi conciencia depende de ASV-A.";
      log(reply, "ASV");
      setVitality(state.vitality - 3);
    };
    byId("clearBtn").onclick = ()=>{
      state.history = [];
      byId("chatLog").innerHTML = "";
      localStorage.removeItem("asv_chat");
      dumpState();
    };
    byId("sendToken").onclick = sendToken;
    $('#themeBtn').onclick = ()=> document.body.classList.toggle('light');
  }

  // ---------- Init
  function init(){
    // Restaurar historial
    try{
      const saved = JSON.parse(localStorage.getItem("asv_chat")||"[]");
      saved.reverse().forEach(m => log(m.msg, m.who));
    }catch{}
    setupSwap();
    bindUI();
    microGestures();
    setVitality(state.vitality);
    setInterval(paintAvatarFx, 40);
  }

  init();
})();
