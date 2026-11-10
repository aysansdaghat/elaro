const faA=n=>String(n).replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]);
const dateA=s=>new Date(s+"T12:00:00").toLocaleDateString("fa-IR",{weekday:"long",day:"numeric",month:"long"});
const timeA=m=>faA(String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0"));
document.addEventListener("DOMContentLoaded",()=>{
 const form=document.getElementById("lookup-form"),result=document.getElementById("lookup-result");
 form.onsubmit=e=>{e.preventDefault();const code=document.getElementById("lookup-code").value.trim().toUpperCase(),mobile=document.getElementById("lookup-mobile").value.trim();const a=Store.get("appointments").find(x=>x.code===code&&x.mobile===mobile);
 if(!a){result.innerHTML='<p class="error">نوبتی با این کد و شماره موبایل پیدا نشد.</p>';return;}
 const s=Store.get("services").find(x=>x.id===a.serviceId),d=Store.get("doctors").find(x=>x.id===a.doctorId);
 result.innerHTML=`<div class="form-card"><h3>جزئیات نوبت</h3><p>خدمت: ${s?.name||"—"}</p><p>پزشک: ${d?.name||"—"}</p><p>تاریخ: ${dateA(a.date)} – ساعت ${timeA(a.start)}</p><p>وضعیت: ${a.status==="active"?"فعال":"لغوشده"}</p>${a.status==="active"?`<button class="btn btn-outline" id="cancel-appointment">لغو نوبت</button>`:""}</div>`;
 const cancel=document.getElementById("cancel-appointment");if(cancel)cancel.onclick=()=>{const when=new Date(a.date+"T00:00:00").getTime()+a.start*60000;if(when-Date.now()<6*3600000){result.insertAdjacentHTML("beforeend",'<p class="error">لغو آنلاین فقط تا ۶ ساعت پیش از نوبت مجاز است.</p>');return;}const all=Store.get("appointments");const item=all.find(x=>x.code===a.code);item.status="cancelled";Store.set("appointments",all);result.innerHTML='<p class="success">نوبت در نسخه نمایشی لغو شد.</p>';};
 };
});