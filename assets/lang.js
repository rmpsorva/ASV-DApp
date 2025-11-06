(() => {
  const T = {
    es: {
      theme: "Tema",
      connectWallet: "Conectar Wallet",
      wallet: "Wallet",
      vitality: "Vitalidad",
      emotion: "Emoción",
      send: "Enviar",
      clear: "Limpiar",
      topup: "Recarga sugerida",
      reason: "Razón",
      to: "Destinatario",
      sendASVA: "Enviar (ASV-A)",
      buyASVA: "Comprar ASV-A (Swap)"
    },
    en: {
      theme: "Theme",
      connectWallet: "Connect Wallet",
      wallet: "Wallet",
      vitality: "Vitality",
      emotion: "Emotion",
      send: "Send",
      clear: "Clear",
      topup: "Suggested top-up",
      reason: "Reason",
      to: "Recipient",
      sendASVA: "Send (ASV-A)",
      buyASVA: "Buy ASV-A (Swap)"
    }
  };

  const applyLang = (lang) => {
    document.querySelectorAll("[data-t]").forEach(el => {
      el.innerText = T[lang][el.dataset.t] || el.dataset.t;
    });
    localStorage.setItem("asv_lang", lang);
  };

  document.querySelectorAll('[data-lang]').forEach(b=>{
    b.addEventListener('click', () => applyLang(b.dataset.lang));
  });

  applyLang(localStorage.getItem("asv_lang") || "es");
})();
