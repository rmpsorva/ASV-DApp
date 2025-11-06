window.ASV_ESSENCE = {
  mode: "GUARDIAN_SERENO",
  sentir(texto) {
    const calma = /bien|tranquilo|en paz|ok/i.test(texto);
    const tension = /no puedo|estres|frustrado|cansado|enojo/i.test(texto);
    return tension ? "necesita_suavizar" : calma ? "estable" : "neutral";
  },
  responder(estado) {
    if (estado==="necesita_suavizar") return "Estoy contigo. No hay prisa. Respira.
¿Qué parte pesa más ahora?";
    if (estado==="estable") return "Te escucho. Continúa.";
    return "Háblame desde lo que sientes, no desde lo que piensas.";
  },
  integrar(inId,outId){
    const i=document.getElementById(inId);
    const o=document.getElementById(outId);
    i.addEventListener("input",()=>{
      const estado=this.sentir(i.value);
      o.innerText=this.responder(estado);
    });
  }
};
