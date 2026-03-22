"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const C = {
  bg:"#0d0f0e",surf:"#131614",surf2:"#161918",bdr:"#1e2320",
  muted:"#3d4840",dim:"#637060",mid:"#8a9e86",text:"#cdd9c8",
  bright:"#e8f0e4",accent:"#4ade80",warn:"#fbbf24",err:"#f87171",info:"#60a5fa",
};
const mono:React.CSSProperties  = {fontFamily:"'JetBrains Mono',monospace"};
const serif:React.CSSProperties = {fontFamily:"'Fraunces',serif"};

interface Booking {
  id:string;created_at:string;status:string;
  client_name:string;client_email:string;client_phone:string;client_intro:string;
  service:string;project_name:string;project_specifications:string;
  hardware_name:string;project_fee:number;
  prototype_due_date:string;source_code_due_date:string;
  hardware_due_date:string;documentation_due_date:string;
  meeting_date:string;meeting_time:string;
  contract_sent:boolean;contract_notes:string;
}
interface Contact    {id:string;created_at:string;name:string;email:string;service:string;budget:string;message:string;}
interface Commission {id:string;created_at:string;status:string;name:string;email:string;handle:string;service:string;description:string;budget:string;}
interface Project    {id:string;title:string;slug:string;service:string;tags:string[];featured:boolean;published:boolean;}
type Tab = "overview"|"bookings"|"commissions"|"contacts"|"projects";

const SVC:Record<string,string> = {
  "3d_printing":"3D Printing","modeling":"3D Modeling",
  "prototyping":"Prototyping","research":"Research & Eng","commissions":"Commissions","other":"Other",
};
const STATUS_C:Record<string,string> = {
  pending:C.warn,confirmed:C.accent,declined:C.err,
  new:C.accent,reviewing:C.info,quoted:C.warn,complete:C.mid,
};
const TIME_L:Record<string,string> = {
  "19:00":"7:00 PM","19:30":"7:30 PM","20:00":"8:00 PM",
  "20:30":"8:30 PM","21:00":"9:00 PM","21:30":"9:30 PM","22:00":"10:00 PM",
};

function ago(iso:string){
  const d=(Date.now()-new Date(iso).getTime())/1000;
  if(d<60)return`${Math.floor(d)}s ago`;
  if(d<3600)return`${Math.floor(d/60)}m ago`;
  if(d<86400)return`${Math.floor(d/3600)}h ago`;
  return`${Math.floor(d/86400)}d ago`;
}
function fmt(iso:string){
  if(!iso)return"—";
  return new Date(iso).toLocaleDateString("en-PH",{month:"short",day:"numeric",year:"numeric"});
}
function fmtMeeting(date:string,time:string){
  if(!date)return"—";
  const d=new Date(date+"T00:00:00").toLocaleDateString("en-PH",{weekday:"short",month:"short",day:"numeric"});
  return`${d} · ${TIME_L[time]??time}`;
}

function Badge({status}:{status:string}){
  return <span style={{...mono,fontSize:8,letterSpacing:"0.1em",textTransform:"uppercase" as const,color:C.bg,background:STATUS_C[status]??C.muted,padding:"3px 8px",borderRadius:2}}>{status}</span>;
}
function Stat({label,value,sub,hi}:{label:string;value:number|string;sub?:string;hi?:boolean}){
  return(
    <div style={{background:C.surf,border:`1px solid ${hi?C.accent+"44":C.bdr}`,borderRadius:4,padding:"1.1rem 1.25rem"}}>
      <p style={{...mono,fontSize:"0.6rem",letterSpacing:"0.12em",textTransform:"uppercase" as const,color:C.muted,marginBottom:"0.4rem"}}>{label}</p>
      <p style={{...serif,fontSize:"1.9rem",fontWeight:900,color:hi?C.accent:C.bright,letterSpacing:"-0.03em",lineHeight:1}}>{value}</p>
      {sub&&<p style={{...mono,fontSize:"0.6rem",color:C.dim,marginTop:"0.3rem"}}>{sub}</p>}
    </div>
  );
}
function Toggle({value,onChange}:{value:boolean;onChange:(v:boolean)=>void}){
  return(
    <button onClick={()=>onChange(!value)} style={{width:34,height:18,borderRadius:9,border:"none",cursor:"pointer",background:value?C.accent:C.muted,position:"relative",transition:"background 0.2s",padding:0}}>
      <span style={{position:"absolute",top:3,left:value?17:3,width:12,height:12,borderRadius:"50%",background:value?C.bg:C.dim,transition:"left 0.2s"}}/>
    </button>
  );
}
function Empty({label}:{label:string}){
  return <div style={{padding:"2.5rem",textAlign:"center" as const}}><p style={{...mono,fontSize:"0.72rem",color:C.muted}}>{label}</p></div>;
}

function ContractModal({b,onClose,onSent}:{b:Booking;onClose:()=>void;onSent:(id:string)=>void}){
  const [notes,setNotes]=useState(b.contract_notes??"");
  const [sending,setSending]=useState(false);
  const today=new Date().toLocaleDateString("en-PH",{month:"long",day:"numeric",year:"numeric"});
  const fee=Number(b.project_fee)?.toLocaleString()??"___";
  const p25=b.project_fee?(b.project_fee*0.25).toLocaleString():"___";
  const text=`${b.project_name}

This Agreement is made and entered into as of ${today}, by and between ${b.client_name}, hereinafter referred to as "Client", and Marc Anthony M. San Juan, hereinafter referred to as "Commissioner".

1. Scope of Work
Commissioner agrees to develop: ${b.project_name}

Specifications:
${b.project_specifications}

Hardware/Device: ${b.hardware_name||"N/A"}
This product includes a one-week warranty from the date of receiving.

2. Deliverables
- Fully functional prototype by ${fmt(b.prototype_due_date)}
- Final source code by ${fmt(b.source_code_due_date)}
- Hardware design & manufacturing instructions for ${b.hardware_name||"N/A"} by ${fmt(b.hardware_due_date)}
- User manuals and tutorials by ${fmt(b.documentation_due_date)}

3. Payment
Total fee: ₱${fee}
- 25% (₱${p25}) due upon signing
- 25% due at midpoint
- 25% due near completion
- Remaining balance due upon delivery
Additional hardware/component costs reimbursed upon receipt.

4. Intellectual Property
All IP rights shall be the sole property of Client upon full payment.

5. Confidentiality
Both parties agree to keep all non-public information confidential.

6. Late Payment Penalty
8% of remaining balance per week after one-week grace period.

7. Termination
Either party may terminate with written notice. Deposited amounts are non-refundable.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date above.

Client: ${b.client_name}          Commissioner: Marc Anthony M. San Juan`;

  async function send(){
    setSending(true);
    await supabase.from("bookings").update({contract_sent:true,contract_sent_at:new Date().toISOString(),contract_notes:notes}).eq("id",b.id);
    onSent(b.id);setSending(false);onClose();
  }

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.78)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
      <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:4,width:"100%",maxWidth:680,maxHeight:"90vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"1.25rem 1.5rem",borderBottom:`1px solid ${C.bdr}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <p style={{...mono,fontSize:"0.6rem",letterSpacing:"0.12em",textTransform:"uppercase" as const,color:C.accent,marginBottom:3}}>Contract preview — review before sending</p>
            <h3 style={{...serif,fontSize:"1.1rem",fontWeight:900,color:C.bright}}>{b.project_name}</h3>
          </div>
          <button onClick={onClose} style={{...mono,fontSize:20,color:C.dim,background:"none",border:"none",cursor:"pointer"}}>×</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"1.5rem"}}>
          <pre style={{...mono,fontSize:"0.7rem",lineHeight:1.85,color:C.dim,whiteSpace:"pre-wrap",wordBreak:"break-word" as const,background:C.bg,border:`1px solid ${C.bdr}`,borderRadius:3,padding:"1.25rem"}}>{text}</pre>
        </div>
        <div style={{padding:"1.25rem 1.5rem",borderTop:`1px solid ${C.bdr}`}}>
          <label style={{...mono,fontSize:"0.6rem",letterSpacing:"0.1em",textTransform:"uppercase" as const,color:C.muted,display:"block",marginBottom:6}}>Notes before sending (optional)</label>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Any additional notes or changes…" style={{...mono,fontSize:"0.73rem",color:C.text,background:C.bg,border:`1px solid ${C.bdr}`,borderRadius:3,padding:"10px 12px",width:"100%",minHeight:60,resize:"vertical" as const,outline:"none",marginBottom:"1rem"}}/>
          <div style={{display:"flex",justifyContent:"flex-end",gap:"0.75rem"}}>
            <button onClick={onClose} style={{...mono,fontSize:"0.68rem",letterSpacing:"0.08em",textTransform:"uppercase" as const,color:C.mid,background:"transparent",border:`1px solid ${C.bdr}`,borderRadius:3,padding:"10px 18px",cursor:"pointer"}}>Cancel</button>
            <button onClick={send} disabled={sending} style={{...mono,fontSize:"0.68rem",letterSpacing:"0.08em",textTransform:"uppercase" as const,color:C.bg,background:sending?C.mid:C.accent,border:"none",borderRadius:3,padding:"10px 20px",cursor:sending?"wait":"pointer"}}>
              {sending?"Sending…":"Send contract ↗"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingRow({b,onStatus,onContract}:{b:Booking;onStatus:(id:string,s:string)=>void;onContract:(b:Booking)=>void}){
  const [open,setOpen]=useState(false);
  return(
    <div style={{borderBottom:`1px solid ${C.bdr}`}}>
      <div onClick={()=>setOpen(o=>!o)} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto auto",gap:"1rem",alignItems:"center",padding:"0.9rem 1.1rem",cursor:"pointer",transition:"background 0.15s"}}
        onMouseEnter={e=>(e.currentTarget.style.background=C.surf2)}
        onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
      >
        <div>
          <p style={{...mono,fontSize:"0.78rem",color:C.text,marginBottom:2}}>{b.client_name}</p>
          <p style={{...mono,fontSize:"0.65rem",color:C.dim}}>{b.project_name}</p>
        </div>
        <span style={{...mono,fontSize:"0.65rem",color:C.mid}}>{SVC[b.service]??b.service}</span>
        <span style={{...mono,fontSize:"0.65rem",color:C.warn}}>{fmtMeeting(b.meeting_date,b.meeting_time)}</span>
        <Badge status={b.status}/>
        <span style={{...mono,fontSize:"0.62rem",color:C.muted}}>{ago(b.created_at)}</span>
      </div>
      {open&&(
        <div style={{padding:"0 1.1rem 1.25rem"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem 2rem",marginBottom:"1rem"}}>
            <div><p style={{...mono,fontSize:"0.6rem",letterSpacing:"0.1em",textTransform:"uppercase" as const,color:C.muted,marginBottom:4}}>Client intro</p><p style={{...mono,fontSize:"0.72rem",color:C.dim,lineHeight:1.75}}>{b.client_intro}</p></div>
            <div><p style={{...mono,fontSize:"0.6rem",letterSpacing:"0.1em",textTransform:"uppercase" as const,color:C.muted,marginBottom:4}}>Project specs</p><p style={{...mono,fontSize:"0.72rem",color:C.dim,lineHeight:1.75}}>{b.project_specifications}</p></div>
            {[["Email",b.client_email],["Phone",b.client_phone||"—"],["Budget",b.project_fee?`₱${Number(b.project_fee).toLocaleString()}`:"—"],["Hardware",b.hardware_name||"—"]].map(([l,v])=>(
              <div key={l}><p style={{...mono,fontSize:"0.6rem",letterSpacing:"0.1em",textTransform:"uppercase" as const,color:C.muted,marginBottom:3}}>{l}</p><p style={{...mono,fontSize:"0.72rem",color:C.mid}}>{v}</p></div>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"0.5rem",paddingTop:"0.75rem",borderTop:`1px solid ${C.bdr}`,flexWrap:"wrap" as const}}>
            <span style={{...mono,fontSize:"0.6rem",letterSpacing:"0.1em",textTransform:"uppercase" as const,color:C.muted}}>Status:</span>
            {["pending","confirmed","declined"].map(s=>(
              <button key={s} onClick={()=>onStatus(b.id,s)} style={{...mono,fontSize:8,letterSpacing:"0.08em",textTransform:"uppercase" as const,color:b.status===s?C.bg:C.dim,background:b.status===s?(STATUS_C[s]??C.muted):"transparent",border:`1px solid ${b.status===s?(STATUS_C[s]??C.muted):C.bdr}`,borderRadius:2,padding:"4px 10px",cursor:"pointer",transition:"all 0.15s"}}
                onMouseEnter={e=>{if(b.status!==s){e.currentTarget.style.borderColor=C.muted;e.currentTarget.style.color=C.text;}}}
                onMouseLeave={e=>{if(b.status!==s){e.currentTarget.style.borderColor=C.bdr;e.currentTarget.style.color=C.dim;}}}
              >{s}</button>
            ))}
            <a href={`mailto:${b.client_email}`} style={{...mono,fontSize:8,letterSpacing:"0.08em",textTransform:"uppercase" as const,color:C.info,border:`1px solid ${C.info}33`,borderRadius:2,padding:"4px 10px",textDecoration:"none"}}>Reply ↗</a>
            {b.status==="confirmed"&&!b.contract_sent&&(
              <button onClick={()=>onContract(b)} style={{...mono,fontSize:8,letterSpacing:"0.08em",textTransform:"uppercase" as const,color:C.bg,background:C.accent,border:"none",borderRadius:2,padding:"4px 10px",cursor:"pointer",marginLeft:"auto"}}>
                Review & send contract →
              </button>
            )}
            {b.contract_sent&&<span style={{...mono,fontSize:8,letterSpacing:"0.08em",textTransform:"uppercase" as const,color:C.mid,marginLeft:"auto"}}>✓ Contract sent</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage(){
  const [tab,setTab]=useState<Tab>("overview");
  const [bookings,setBookings]=useState<Booking[]>([]);
  const [contacts,setContacts]=useState<Contact[]>([]);
  const [commissions,setCommissions]=useState<Commission[]>([]);
  const [projects,setProjects]=useState<Project[]>([]);
  const [loading,setLoading]=useState(true);
  const [contractB,setContractB]=useState<Booking|null>(null);

  useEffect(()=>{
    async function load(){
      const[b,c,cm,p]=await Promise.all([
        supabase.from("bookings").select("*").order("created_at",{ascending:false}),
        supabase.from("contacts").select("*").order("created_at",{ascending:false}),
        supabase.from("commissions").select("*").order("created_at",{ascending:false}),
        supabase.from("projects").select("id,title,slug,service,tags,featured,published,sort_order").order("sort_order"),
      ]);
      if(b.data)setBookings(b.data);
      if(c.data)setContacts(c.data);
      if(cm.data)setCommissions(cm.data);
      if(p.data)setProjects(p.data);
      setLoading(false);
    }
    load();
  },[]);

  async function updateBookingStatus(id:string,status:string){
    await supabase.from("bookings").update({status}).eq("id",id);
    setBookings(bs=>bs.map(b=>b.id===id?{...b,status}:b));
  }
  async function toggleProject(id:string,field:"published"|"featured",val:boolean){
    if(field==="featured"&&val){
      await supabase.from("projects").update({featured:false}).neq("id",id);
      setProjects(ps=>ps.map(p=>({...p,featured:p.id===id})));
    }
    await supabase.from("projects").update({[field]:val}).eq("id",id);
    if(field!=="featured")setProjects(ps=>ps.map(p=>p.id===id?{...p,[field]:val}:p));
  }
  function markSent(id:string){setBookings(bs=>bs.map(b=>b.id===id?{...b,contract_sent:true}:b));}

  const pendingB=bookings.filter(b=>b.status==="pending").length;
  const newC=commissions.filter(c=>c.status==="new").length;
  const TABS:{key:Tab;label:string;badge?:number}[]=[
    {key:"overview",label:"Overview"},
    {key:"bookings",label:"Bookings",badge:pendingB},
    {key:"commissions",label:"Commissions",badge:newC},
    {key:"contacts",label:"Contacts"},
    {key:"projects",label:"Projects"},
  ];

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,900&family=JetBrains+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#0d0f0e;-webkit-font-smoothing:antialiased}
        textarea:focus,input:focus{outline:none;border-color:#4ade80!important}
        textarea::placeholder{color:#3d4840;font-family:'JetBrains Mono',monospace}
      `}</style>

      {contractB&&<ContractModal b={contractB} onClose={()=>setContractB(null)} onSent={markSent}/>}

      <div style={{minHeight:"100svh",background:C.bg,display:"flex",flexDirection:"column"}}>
        <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 1.75rem",height:54,background:C.surf,borderBottom:`1px solid ${C.bdr}`,position:"sticky",top:0,zIndex:100}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:22,height:22,border:`1px solid ${C.accent}`,borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{...mono,fontSize:7,color:C.accent}}>skm</span>
            </div>
            <span style={{...mono,fontSize:11,color:C.bright,letterSpacing:"0.04em"}}>.labs</span>
            <span style={{...mono,fontSize:10,color:C.muted,margin:"0 2px"}}>/</span>
            <span style={{...mono,fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase" as const,color:C.dim}}>Admin</span>
          </div>
          <div style={{display:"flex",gap:"1.25rem"}}>
            <a href="/book" style={{...mono,fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase" as const,color:C.dim,textDecoration:"none"}}
              onMouseEnter={e=>(e.currentTarget.style.color=C.text)} onMouseLeave={e=>(e.currentTarget.style.color=C.dim)}
            >Booking page ↗</a>
            <a href="/" style={{...mono,fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase" as const,color:C.dim,textDecoration:"none"}}
              onMouseEnter={e=>(e.currentTarget.style.color=C.text)} onMouseLeave={e=>(e.currentTarget.style.color=C.dim)}
            >View site ↗</a>
          </div>
        </header>

        <div style={{display:"flex",flex:1}}>
          <aside style={{width:192,flexShrink:0,borderRight:`1px solid ${C.bdr}`,padding:"1.25rem 0",background:C.surf}}>
            {TABS.map(t=>(
              <button key={t.key} onClick={()=>setTab(t.key)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.65rem 1.1rem",background:tab===t.key?C.bg:"transparent",border:"none",borderLeft:`2px solid ${tab===t.key?C.accent:"transparent"}`,cursor:"pointer",transition:"all 0.15s"}}>
                <span style={{...mono,fontSize:"0.7rem",letterSpacing:"0.08em",textTransform:"uppercase" as const,color:tab===t.key?C.bright:C.dim}}>{t.label}</span>
                {t.badge!==undefined&&t.badge>0&&(
                  <span style={{...mono,fontSize:9,color:C.bg,background:t.key==="bookings"?C.warn:C.accent,borderRadius:10,padding:"1px 7px"}}>{t.badge}</span>
                )}
              </button>
            ))}
          </aside>

          <main style={{flex:1,padding:"1.75rem 2rem",overflowY:"auto"}}>
            {loading?<p style={{...mono,fontSize:"0.75rem",color:C.dim}}>Loading…</p>:(
              <>
                {tab==="overview"&&(
                  <div>
                    <h1 style={{...serif,fontSize:"1.5rem",fontWeight:900,color:C.bright,letterSpacing:"-0.02em",marginBottom:"1.75rem"}}>Overview</h1>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"0.75rem",marginBottom:"2rem"}}>
                      <Stat label="Pending bookings" value={pendingB} hi={pendingB>0}/>
                      <Stat label="Total bookings" value={bookings.length} sub="all time"/>
                      <Stat label="New commissions" value={newC} hi={newC>0}/>
                      <Stat label="Live projects" value={projects.filter(p=>p.published).length} sub={`of ${projects.length}`}/>
                    </div>
                    <p style={{...mono,fontSize:"0.62rem",letterSpacing:"0.12em",textTransform:"uppercase" as const,color:C.muted,marginBottom:"0.6rem"}}>Recent bookings</p>
                    <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:4,overflow:"hidden",marginBottom:"1.75rem"}}>
                      {bookings.slice(0,4).map(b=><BookingRow key={b.id} b={b} onStatus={updateBookingStatus} onContract={setContractB}/>)}
                      {bookings.length===0&&<Empty label="No bookings yet — share your /book link!"/>}
                    </div>
                    <p style={{...mono,fontSize:"0.62rem",letterSpacing:"0.12em",textTransform:"uppercase" as const,color:C.muted,marginBottom:"0.6rem"}}>Recent commissions</p>
                    <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:4,overflow:"hidden"}}>
                      {commissions.slice(0,3).map(c=>(
                        <div key={c.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:"1rem",alignItems:"center",padding:"0.85rem 1.1rem",borderBottom:`1px solid ${C.bdr}`}}>
                          <div><p style={{...mono,fontSize:"0.75rem",color:C.text}}>{c.name}</p><p style={{...mono,fontSize:"0.62rem",color:C.dim}}>{c.email}</p></div>
                          <span style={{...mono,fontSize:"0.65rem",color:C.mid}}>{SVC[c.service]??c.service}</span>
                          <Badge status={c.status}/>
                          <span style={{...mono,fontSize:"0.62rem",color:C.muted}}>{ago(c.created_at)}</span>
                        </div>
                      ))}
                      {commissions.length===0&&<Empty label="No commissions yet"/>}
                    </div>
                  </div>
                )}
                {tab==="bookings"&&(
                  <div>
                    <h1 style={{...serif,fontSize:"1.5rem",fontWeight:900,color:C.bright,letterSpacing:"-0.02em",marginBottom:"1.75rem"}}>Bookings <span style={{color:C.dim,fontSize:"1rem"}}>({bookings.length})</span></h1>
                    <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:4,overflow:"hidden"}}>
                      {bookings.map(b=><BookingRow key={b.id} b={b} onStatus={updateBookingStatus} onContract={setContractB}/>)}
                      {bookings.length===0&&<Empty label="No bookings yet"/>}
                    </div>
                  </div>
                )}
                {tab==="commissions"&&(
                  <div>
                    <h1 style={{...serif,fontSize:"1.5rem",fontWeight:900,color:C.bright,letterSpacing:"-0.02em",marginBottom:"1.75rem"}}>Commissions <span style={{color:C.dim,fontSize:"1rem"}}>({commissions.length})</span></h1>
                    <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:4,overflow:"hidden"}}>
                      {commissions.map(c=>(
                        <div key={c.id} style={{padding:"0.9rem 1.1rem",borderBottom:`1px solid ${C.bdr}`,display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:"1rem",alignItems:"center"}}>
                          <div><p style={{...mono,fontSize:"0.78rem",color:C.text,marginBottom:2}}>{c.name}</p><p style={{...mono,fontSize:"0.65rem",color:C.dim}}>{c.email}{c.handle?` · ${c.handle}`:""}</p></div>
                          <span style={{...mono,fontSize:"0.65rem",color:C.mid}}>{SVC[c.service]??c.service}</span>
                          <Badge status={c.status}/>
                          <span style={{...mono,fontSize:"0.62rem",color:C.muted}}>{ago(c.created_at)}</span>
                        </div>
                      ))}
                      {commissions.length===0&&<Empty label="No commissions yet"/>}
                    </div>
                  </div>
                )}
                {tab==="contacts"&&(
                  <div>
                    <h1 style={{...serif,fontSize:"1.5rem",fontWeight:900,color:C.bright,letterSpacing:"-0.02em",marginBottom:"1.75rem"}}>Contacts <span style={{color:C.dim,fontSize:"1rem"}}>({contacts.length})</span></h1>
                    <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:4,overflow:"hidden"}}>
                      {contacts.map(c=>(
                        <div key={c.id} style={{padding:"0.9rem 1.1rem",borderBottom:`1px solid ${C.bdr}`}}>
                          <div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:"1rem",alignItems:"center",marginBottom:"0.4rem"}}>
                            <div><p style={{...mono,fontSize:"0.78rem",color:C.text,marginBottom:2}}>{c.name}</p><p style={{...mono,fontSize:"0.65rem",color:C.dim}}>{c.email}</p></div>
                            <span style={{...mono,fontSize:"0.65rem",color:C.mid}}>{c.service}</span>
                            <span style={{...mono,fontSize:"0.65rem",color:C.dim}}>{c.budget}</span>
                            <a href={`mailto:${c.email}`} style={{...mono,fontSize:8,color:C.accent,border:`1px solid ${C.accent}33`,borderRadius:2,padding:"3px 8px",textDecoration:"none"}}>Reply ↗</a>
                          </div>
                          <p style={{...mono,fontSize:"0.7rem",color:C.dim,lineHeight:1.7}}>{c.message}</p>
                        </div>
                      ))}
                      {contacts.length===0&&<Empty label="No contacts yet"/>}
                    </div>
                  </div>
                )}
                {tab==="projects"&&(
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.75rem"}}>
                      <h1 style={{...serif,fontSize:"1.5rem",fontWeight:900,color:C.bright,letterSpacing:"-0.02em"}}>Projects <span style={{color:C.dim,fontSize:"1rem"}}>({projects.length})</span></h1>
                      <p style={{...mono,fontSize:"0.65rem",color:C.dim}}>Add via Supabase → Table Editor</p>
                    </div>
                    <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:4,overflow:"hidden"}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto auto",gap:"1rem",padding:"0.6rem 1.1rem",background:C.bg,borderBottom:`1px solid ${C.bdr}`}}>
                        {["Title","Service","Tags","Featured","Published"].map(h=>(
                          <span key={h} style={{...mono,fontSize:"0.58rem",letterSpacing:"0.1em",textTransform:"uppercase" as const,color:C.muted}}>{h}</span>
                        ))}
                      </div>
                      {projects.map(p=>(
                        <div key={p.id} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto auto",gap:"1rem",alignItems:"center",padding:"0.8rem 1.1rem",borderBottom:`1px solid ${C.bdr}`}}>
                          <a href={`/work/${p.slug}`} style={{...mono,fontSize:"0.75rem",color:C.text,textDecoration:"none"}}
                            onMouseEnter={e=>(e.currentTarget.style.color=C.accent)}
                            onMouseLeave={e=>(e.currentTarget.style.color=C.text)}
                          >{p.title}</a>
                          <span style={{...mono,fontSize:"0.65rem",color:C.dim}}>{SVC[p.service]??p.service}</span>
                          <span style={{...mono,fontSize:"0.62rem",color:C.muted}}>{p.tags?.slice(0,2).join(", ")}</span>
                          <Toggle value={p.featured} onChange={v=>toggleProject(p.id,"featured",v)}/>
                          <Toggle value={p.published} onChange={v=>toggleProject(p.id,"published",v)}/>
                        </div>
                      ))}
                      {projects.length===0&&<Empty label="No projects yet"/>}
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
