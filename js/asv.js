let provider,signer,token;
async function connectWallet(){
 provider=new ethers.providers.Web3Provider(window.ethereum);
 await provider.send("eth_requestAccounts",[]);
 signer=provider.getSigner();
 token=new ethers.Contract(ASV_CONFIG.token.address,ERC20_ABI,signer);
 updateUI();
}
async function updateUI(){
 const acct=await signer.getAddress();
 document.getElementById("account").innerText=acct;
 const net=await provider.getNetwork();
 document.getElementById("network").innerText=net.name;
 const bnb=await provider.getBalance(acct);
 document.getElementById("nativeBalance").innerText=ethers.utils.formatEther(bnb);
 const bal=await token.balanceOf(acct);
 const human=ethers.utils.formatUnits(bal,ASV_CONFIG.token.decimals);
 document.getElementById("tokenBalance").innerText=human+" ASV-A";
 setVitality(human);
}
function setVitality(h){
 const pct=Math.min(100,(h/ASV_CONFIG.vitalityScale)*100);
 document.getElementById("vitalityValue").innerText=pct.toFixed(1)+"%";
 document.querySelector("#vitalityBar span").style.width=pct+"%";
}
async function sendASV(){
 const amt=document.getElementById("amount").value;
 const value=ethers.utils.parseUnits(amt,ASV_CONFIG.token.decimals);
 await token.transfer(ASV_CONFIG.receiver,value);
 updateUI();
 alert("✅ Transferencia completada");
}
document.getElementById("connectBtn").onclick=connectWallet;
document.getElementById("sendBtn").onclick=sendASV;
