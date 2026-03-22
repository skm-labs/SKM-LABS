"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

const C = {
  bg:"#0d0f0e", surf:"#131614", bdr:"#1e2320", bdrHi:"#2a3029",
  muted:"#3d4840", dim:"#637060", mid:"#8a9e86", text:"#cdd9c8",
  bright:"#e8f0e4", accent:"#4ade80", err:"#f87171", warn:"#fbbf24",
};
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
const serif: React.CSSProperties = { fontFamily: "'Fraunces', serif" };

// ── Services ──────────────────────────────────────────────────────────────────
const SERVICES = [
  { id:"3d_printing",  glyph:"▣", label:"3D Printing",            sub:"FDM · Resin · SLA" },
  { id:"modeling",     glyph:"◈", label:"3D Modeling",             sub:"Fusion 360 · Blender" },
  { id:"prototyping",  glyph:"⬡", label:"Prototyping",             sub:"IoT · Mechatronics · Electronics" },
  { id:"research",     glyph:"◎", label:"Research & Engineering",  sub:"Analysis · Validation · Docs" },
  { id:"commissions",  glyph:"◇", label:"Custom Commission",       sub:"Bespoke · One-off · Short-run" },
];

// ── Time slots ────────────────────────────────────────────────────────────────
const TIME_SLOTS = ["19:00","19:30","20:00","20:30","21:00","21:30","22:00"];
const TIME_LABELS: Record<string,string> = {
  "19:00":"7:00 PM","19:30":"7:30 PM","20:00":"8:00 PM",
  "20:30":"8:30 PM","21:00":"9:00 PM","21:30":"9:30 PM","22:00":"10:00 PM",
};

// ── Budget options by scope ───────────────────────────────────────────────────
const STUDENT_BUDGETS = ["₱5,000 – ₱10,000","₱10,000 – ₱20,000","₱20,000+"];
const NON_STUDENT_BUDGETS = ["₱15,000 – ₱20,000","₱20,000 – ₱50,000","₱50,000+"];
const SCOPES = [
  { id:"student",  label:"Student",      sub:"School / thesis / capstone project" },
  { id:"personal", label:"Personal",     sub:"Hobbyist or personal build" },
  { id:"startup",  label:"Startup",      sub:"Early-stage company or MVP" },
  { id:"business", label:"Business",     sub:"Established company or enterprise" },
];

// ── Calendar helpers ───────────────────────────────────────────────────────────
function getDaysInMonth(y:number,m:number){return new Date(y,m+1,0).getDate();}
function getFirstDay(y:number,m:number){return new Date(y,m,1).getDay();}
function isoDate(y:number,m:number,d:number){
  return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}
function isPast(y:number,m:number,d:number){
  const t=new Date();t.setHours(0,0,0,0);return new Date(y,m,d)<t;
}
function weeksFromNow(iso:string):number{
  if(!iso)return 99;
  const diff=new Date(iso).getTime()-Date.now();
  return diff/(1000*60*60*24*7);
}

function Calendar({selected,onSelect}:{selected:string;onSelect:(d:string)=>void}){
  const now=new Date();
  const [view,setView]=useState({year:now.getFullYear(),month:now.getMonth()});
  const days=getDaysInMonth(view.year,view.month);
  const firstDay=getFirstDay(view.year,view.month);
  const MONTHS=["January","February","March","April","May","June","July","August",
    "September","October","November","December"];
  const DAYS=["Su","Mo","Tu","We","Th","Fr","Sa"];
  function prev(){setView(v=>v.month===0?{year:v.year-1,month:11}:{...v,month:v.month-1});}
  function next(){setView(v=>v.month===11?{year:v.year+1,month:0}:{...v,month:v.month+1});}
  return(
    <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:4,padding:"1.25rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
        <button onClick={prev} type="button" style={{...mono,fontSize:14,color:C.mid,background:"none",border:"none",cursor:"pointer",padding:"4px 8px"}}>←</button>
        <span style={{...mono,fontSize:"0.75rem",letterSpacing:"0.08em",color:C.text}}>{MONTHS[view.month]} {view.year}</span>
        <button onClick={next} type="button" style={{...mono,fontSize:14,color:C.mid,background:"none",border:"none",cursor:"pointer",padding:"4px 8px"}}>→</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
        {DAYS.map(d=><div key={d} style={{...mono,fontSize:"0.6rem",letterSpacing:"0.08em",color:C.muted,textAlign:"center",padding:"4px 0"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {Array.from({length:firstDay}).map((_,i)=><div key={`e${i}`}/>)}
        {Array.from({length:days}).map((_,i)=>{
          const day=i+1;
          const iso=isoDate(view.year,view.month,day);
          const past=isPast(view.year,view.month,day);
          const sel=selected===iso;
          return(
            <button key={day} type="button" disabled={past} onClick={()=>onSelect(iso)} style={{
              ...mono,fontSize:"0.72rem",
              color:past?C.muted:sel?C.bg:C.text,
              background:sel?C.accent:"transparent",
              border:`1px solid ${sel?C.accent:"transparent"}`,
              borderRadius:3,padding:"7px 4px",
              cursor:past?"not-allowed":"pointer",
              transition:"all 0.15s",textAlign:"center",
            }}
              onMouseEnter={e=>{if(!past&&!sel)e.currentTarget.style.borderColor=C.bdrHi;}}
              onMouseLeave={e=>{if(!sel)e.currentTarget.style.borderColor="transparent";}}
            >{day}</button>
          );
        })}
      </div>
    </div>
  );
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  ...mono,fontSize:"0.8rem",color:C.text,
  background:C.bg,border:`1px solid ${C.bdr}`,
  borderRadius:3,padding:"11px 14px",width:"100%",
  outline:"none",transition:"border-color 0.2s",lineHeight:1.6,
};

function Label({children,error,optional}:{children:React.ReactNode;error?:string;optional?:boolean}){
  return(
    <label style={{...mono,fontSize:"0.68rem",letterSpacing:"0.1em",textTransform:"uppercase",color:C.mid,display:"block",marginBottom:7}}>
      {children}
      {optional&&<span style={{color:C.muted,marginLeft:6,textTransform:"none",letterSpacing:0}}>(optional)</span>}
      {error&&<span style={{color:C.err,marginLeft:8,textTransform:"none",letterSpacing:0}}>— {error}</span>}
    </label>
  );
}

function TextInput({value,onChange,placeholder,error}:{value:string;onChange:(v:string)=>void;placeholder?:string;error?:string}){
  return <input style={{...inputStyle,borderColor:error?C.err:C.bdr}} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>;
}

function TextArea({value,onChange,placeholder,minHeight=110}:{value:string;onChange:(v:string)=>void;placeholder?:string;minHeight?:number}){
  return <textarea style={{...inputStyle,minHeight,resize:"vertical"}} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>;
}

function SelectBox({value,onChange,options,placeholder}:{value:string;onChange:(v:string)=>void;options:string[];placeholder?:string}){
  return(
    <select value={value} onChange={e=>onChange(e.target.value)} style={{...inputStyle,appearance:"none",cursor:"pointer"}}>
      {placeholder&&<option value="" disabled>{placeholder}</option>}
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function RadioCards({options,value,onChange}:{
  options:{id:string;label:string;sub?:string}[];
  value:string;
  onChange:(v:string)=>void;
}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
      {options.map(o=>(
        <button key={o.id} type="button" onClick={()=>onChange(o.id)} style={{
          display:"flex",alignItems:"center",justifyContent:"space-between",
          background:value===o.id?C.surf:"transparent",
          border:`1px solid ${value===o.id?C.accent:C.bdr}`,
          borderRadius:4,padding:"0.9rem 1.1rem",cursor:"pointer",textAlign:"left",transition:"all 0.15s",
        }}
          onMouseEnter={e=>{if(value!==o.id)e.currentTarget.style.borderColor=C.bdrHi;}}
          onMouseLeave={e=>{if(value!==o.id)e.currentTarget.style.borderColor=C.bdr;}}
        >
          <div>
            <p style={{...mono,fontSize:"0.8rem",color:value===o.id?C.bright:C.text,marginBottom:o.sub?2:0}}>{o.label}</p>
            {o.sub&&<p style={{...mono,fontSize:"0.62rem",color:C.dim}}>{o.sub}</p>}
          </div>
          {value===o.id&&<span style={{...mono,fontSize:11,color:C.accent}}>✓</span>}
        </button>
      ))}
    </div>
  );
}

function FileDropZone({files,onFiles,accept,hint}:{files:File[];onFiles:(f:File[])=>void;accept:string;hint:string}){
  const ref=useRef<HTMLInputElement>(null);
  return(
    <div>
      <div onClick={()=>ref.current?.click()} style={{
        border:`1px dashed ${C.bdr}`,borderRadius:3,padding:"1.25rem",
        cursor:"pointer",textAlign:"center",transition:"border-color 0.2s",
      }}
        onMouseEnter={e=>(e.currentTarget.style.borderColor=C.muted)}
        onMouseLeave={e=>(e.currentTarget.style.borderColor=C.bdr)}
      >
        <p style={{...mono,fontSize:"0.73rem",color:files.length?C.text:C.dim}}>
          {files.length?files.map(f=>f.name).join(", "):"Click to attach files"}
        </p>
        <p style={{...mono,fontSize:"0.62rem",color:C.muted,marginTop:4}}>{hint}</p>
      </div>
      <input ref={ref} type="file" multiple accept={accept} style={{display:"none"}}
        onChange={e=>onFiles(Array.from(e.target.files??[]))}/>
    </div>
  );
}

function StepHead({n,title,sub}:{n:string;title:string;sub:string}){
  return(
    <div style={{marginBottom:"1.5rem"}}>
      <span style={{...mono,fontSize:"0.62rem",letterSpacing:"0.14em",color:C.accent,display:"block",marginBottom:5}}>{n}</span>
      <h2 style={{...serif,fontSize:"1.4rem",fontWeight:900,color:C.bright,letterSpacing:"-0.02em",marginBottom:4}}>{title}</h2>
      <p style={{...mono,fontSize:"0.72rem",color:C.dim}}><span style={{color:C.mid}}>// </span>{sub}</p>
    </div>
  );
}

function Progress({step,total=6}:{step:number;total?:number}){
  const labels=["Service","About you","Project details","Scope & budget","Schedule & terms","Confirm"];
  return(
    <div style={{display:"flex",gap:0,marginBottom:"2rem"}}>
      {labels.map((label,i)=>{
        const n=i+1,active=step===n,done=step>n;
        return(
          <div key={label} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{width:"100%",height:2,background:done||active?C.accent:C.bdr,transition:"background 0.3s"}}/>
            <span style={{...mono,fontSize:"0.52rem",letterSpacing:"0.08em",textTransform:"uppercase",color:active?C.accent:done?C.mid:C.muted,transition:"color 0.3s",textAlign:"center"}}>
              {String(n).padStart(2,"0")}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function PrimaryBtn({onClick,children,disabled,type="button"}:{onClick?:()=>void;children:React.ReactNode;disabled?:boolean;type?:"button"|"submit"}){
  return(
    <button type={type} onClick={onClick} disabled={disabled} style={{
      ...mono,fontSize:"0.72rem",letterSpacing:"0.1em",textTransform:"uppercase",
      color:C.bg,background:disabled?C.mid:C.accent,border:"none",borderRadius:3,
      padding:"13px 28px",cursor:disabled?"not-allowed":"pointer",transition:"opacity 0.2s",
    }}
      onMouseEnter={e=>{if(!disabled)e.currentTarget.style.opacity="0.82";}}
      onMouseLeave={e=>{e.currentTarget.style.opacity="1";}}
    >{children}</button>
  );
}

function GhostBtn({onClick,children}:{onClick:()=>void;children:React.ReactNode}){
  return(
    <button type="button" onClick={onClick} style={{
      ...mono,fontSize:"0.72rem",letterSpacing:"0.1em",textTransform:"uppercase",
      color:C.mid,background:"transparent",border:`1px solid ${C.bdr}`,
      borderRadius:3,padding:"13px 20px",cursor:"pointer",transition:"border-color 0.2s,color 0.2s",
    }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.muted;e.currentTarget.style.color=C.text;}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=C.bdr;e.currentTarget.style.color=C.mid;}}
    >{children}</button>
  );
}

function InfoBox({children,color=C.warn}:{children:React.ReactNode;color?:string}){
  return(
    <div style={{background:`${color}10`,border:`1px solid ${color}33`,borderRadius:3,padding:"0.9rem 1rem"}}>
      <p style={{...mono,fontSize:"0.75rem",color,lineHeight:1.8}}>{children}</p>
    </div>
  );
}

function Toggle({label,checked,onChange,sub}:{label:string;checked:boolean;onChange:(v:boolean)=>void;sub?:string}){
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.9rem 1.1rem",background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:4}}>
      <div>
        <p style={{...mono,fontSize:"0.8rem",color:C.text,marginBottom:sub?2:0}}>{label}</p>
        {sub&&<p style={{...mono,fontSize:"0.62rem",color:C.dim}}>{sub}</p>}
      </div>
      <button type="button" onClick={()=>onChange(!checked)} style={{
        width:38,height:20,borderRadius:10,border:"none",cursor:"pointer",
        background:checked?C.accent:C.muted,position:"relative",transition:"background 0.2s",padding:0,flexShrink:0,
      }}>
        <span style={{position:"absolute",top:3,left:checked?19:3,width:14,height:14,borderRadius:"50%",background:checked?C.bg:C.dim,transition:"left 0.2s"}}/>
      </button>
    </div>
  );
}

// ── Form state ─────────────────────────────────────────────────────────────────
interface FormState {
  // Step 1
  service: string;
  // Step 2
  client_name: string; client_email: string; client_phone: string; client_intro: string;
  // Step 3 — 3D Printing
  print_what: string; print_material: string; print_color: string;
  // Step 3 — 3D Modeling
  model_what: string; model_material: string; model_dimensions: string; model_has_cad: string;
  // Step 3 — Prototyping
  proto_what: string; proto_type: string; proto_description: string;
  // Step 3 — Research
  research_topic: string; research_scope: string; research_deliverable: string;
  research_background: string; research_institution: string;
  // Step 3 — Commissions
  comm_what: string; comm_description: string; comm_hardware: string; comm_materials: string;
  // Step 4
  client_scope: string; budget: string;
  // Step 5
  deadline: string; rush_fee_agreed: boolean; nda_required: boolean; nda_notes: string;
  // Step 6 — meeting slot
  meeting_date: string; meeting_time: string;
  // shared
  project_name: string; project_specifications: string;
}

const EMPTY: FormState = {
  service:"", client_name:"", client_email:"", client_phone:"", client_intro:"",
  print_what:"", print_material:"", print_color:"",
  model_what:"", model_material:"", model_dimensions:"", model_has_cad:"",
  proto_what:"", proto_type:"", proto_description:"",
  research_topic:"", research_scope:"", research_deliverable:"", research_background:"", research_institution:"",
  comm_what:"", comm_description:"", comm_hardware:"", comm_materials:"",
  client_scope:"", budget:"",
  deadline:"", rush_fee_agreed:false, nda_required:false, nda_notes:"",
  meeting_date:"", meeting_time:"",
  project_name:"", project_specifications:"",
};

type Status = "idle"|"loading"|"success"|"error";

// ── Page ───────────────────────────────────────────────────────────────────────
export default function BookPage(){
  const [step,setStep]=useState(1);
  const [form,setForm]=useState<FormState>(EMPTY);
  const [errors,setErrors]=useState<Record<string,string>>({});
  const [status,setStatus]=useState<Status>("idle");
  const [printFiles,setPrintFiles]=useState<File[]>([]);
  const [refFiles,setRefFiles]=useState<File[]>([]);
  const [cadFiles,setCadFiles]=useState<File[]>([]);

  function set(key:keyof FormState,value:string|boolean){
    setForm(f=>({...f,[key]:value}));
    setErrors(e=>{const n={...e};delete n[key as string];return n;});
  }

  const isRush = form.deadline ? weeksFromNow(form.deadline)<5 : false;
  const budgets = form.client_scope==="student" ? STUDENT_BUDGETS : NON_STUDENT_BUDGETS;

  // ── Validation ────────────────────────────────────────────────────────────
  function validate(s:number):boolean{
    const e:Record<string,string>={};
    if(s===1&&!form.service) e.service="Please select a service";
    if(s===2){
      if(!form.client_name.trim())  e.client_name="Required";
      if(!form.client_email.trim()) e.client_email="Required";
      else if(!/\S+@\S+\.\S+/.test(form.client_email)) e.client_email="Invalid email";
      if(!form.client_intro.trim()) e.client_intro="Required";
    }
    if(s===3){
      if(form.service==="3d_printing"){
        if(!form.print_what.trim())     e.print_what="Required";
        if(!form.print_material.trim()) e.print_material="Required";
        if(!form.print_color.trim())    e.print_color="Required";
        if(printFiles.length===0)       e.print_files="Please attach an STL or 3MF file";
      }
      if(form.service==="modeling"){
        if(!form.model_what.trim())       e.model_what="Required";
        if(!form.model_dimensions.trim()) e.model_dimensions="Required";
        if(!form.model_has_cad)           e.model_has_cad="Required";
      }
      if(form.service==="prototyping"){
        if(!form.proto_what.trim())        e.proto_what="Required";
        if(!form.proto_type)               e.proto_type="Required";
        if(!form.proto_description.trim()) e.proto_description="Required";
      }
      if(form.service==="research"){
        if(!form.research_topic.trim())       e.research_topic="Required";
        if(!form.research_scope.trim())       e.research_scope="Required";
        if(!form.research_deliverable.trim()) e.research_deliverable="Required";
      }
      if(form.service==="commissions"){
        if(!form.comm_what.trim())        e.comm_what="Required";
        if(!form.comm_description.trim()) e.comm_description="Required";
      }
    }
    if(s===4){
      if(!form.client_scope) e.client_scope="Required";
      if(!form.budget)       e.budget="Required";
    }
    if(s===5){
      if(!form.deadline) e.deadline="Required";
      if(isRush&&!form.rush_fee_agreed) e.rush_fee_agreed="You must acknowledge the rush fee to proceed";
    }
    if(s===6){
      if(!form.meeting_date) e.meeting_date="Pick a date";
      if(!form.meeting_time) e.meeting_time="Pick a time";
    }
    setErrors(e);
    return Object.keys(e).length===0;
  }

  function next(){if(validate(step))setStep(s=>Math.min(s+1,6));}
  function back(){setErrors({});setStep(s=>Math.max(s-1,1));}

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    if(!validate(6))return;
    setStatus("loading");
    try{
      // Build unified project_name + project_specifications from service fields
      let pName="",pSpec="";
      if(form.service==="3d_printing"){ pName=form.print_what; pSpec=`Material: ${form.print_material}\nColor: ${form.print_color}`; }
      if(form.service==="modeling"){    pName=form.model_what; pSpec=`Dimensions: ${form.model_dimensions}\nMaterial: ${form.model_material}\nHas CAD: ${form.model_has_cad}`; }
      if(form.service==="prototyping"){ pName=form.proto_what; pSpec=`Type: ${form.proto_type}\n${form.proto_description}`; }
      if(form.service==="research"){    pName=form.research_topic; pSpec=`Scope: ${form.research_scope}\nDeliverable: ${form.research_deliverable}\nBackground: ${form.research_background}`; }
      if(form.service==="commissions"){ pName=form.comm_what; pSpec=`${form.comm_description}\nHardware: ${form.comm_hardware}\nMaterials: ${form.comm_materials}`; }

      const payload={
        service:form.service,
        client_name:form.client_name, client_email:form.client_email,
        client_phone:form.client_phone||null, client_intro:form.client_intro,
        project_name:pName, project_specifications:pSpec,
        budget:form.budget, client_scope:form.client_scope,
        deadline:form.deadline||null,
        rush_fee_agreed:form.rush_fee_agreed,
        nda_required:form.nda_required, nda_notes:form.nda_notes||null,
        meeting_date:form.meeting_date, meeting_time:form.meeting_time,
      };
      const{error}=await supabase.from("bookings").insert(payload);
      if(error)throw error;
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-booking-emails`,{
        method:"POST",
        headers:{"Content-Type":"application/json","Authorization":`Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`},
        body:JSON.stringify(payload),
      });
      setStatus("success");
    }catch(err){
      console.error(err);
      setStatus("error");
    }
  }

  // ── Success ───────────────────────────────────────────────────────────────
  if(status==="success"){
    const dateLabel=new Date(form.meeting_date+"T00:00:00").toLocaleDateString("en-PH",{weekday:"long",month:"long",day:"numeric",year:"numeric"});
    return(
      <main style={{minHeight:"100svh",background:C.bg,padding:"5rem 2rem 4rem",display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{width:"100%",maxWidth:600,textAlign:"center",paddingTop:"3rem"}}>
          <div style={{...mono,fontSize:40,color:C.accent,marginBottom:"1.25rem"}}>✓</div>
          <h2 style={{...serif,fontSize:"1.75rem",fontWeight:900,color:C.bright,marginBottom:"0.6rem",letterSpacing:"-0.02em"}}>Booking request sent</h2>
          <p style={{...mono,fontSize:"0.78rem",color:C.dim,lineHeight:1.8,maxWidth:400,margin:"0 auto 1.5rem"}}>
            Thanks {form.client_name.split(" ")[0]}. I&apos;ll review your brief and confirm your meeting slot within 24 hours.
            {form.nda_required&&" I&apos;ll reach out regarding the NDA before we begin."}
          </p>
          <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:4,padding:"1.25rem",maxWidth:380,margin:"0 auto 2rem",textAlign:"left"}}>
            <p style={{...mono,fontSize:"0.62rem",letterSpacing:"0.12em",textTransform:"uppercase",color:C.muted,marginBottom:"0.5rem"}}>Requested meeting slot</p>
            <p style={{...mono,fontSize:"0.85rem",color:C.warn}}>{dateLabel}</p>
            <p style={{...mono,fontSize:"0.85rem",color:C.warn}}>{TIME_LABELS[form.meeting_time]} PH time</p>
            {form.nda_required&&<p style={{...mono,fontSize:"0.7rem",color:C.mid,marginTop:"0.75rem"}}>⚑ NDA / Disclosure requested</p>}
            {form.rush_fee_agreed&&<p style={{...mono,fontSize:"0.7rem",color:C.warn,marginTop:"0.4rem"}}>⚡ Rush fee acknowledged</p>}
          </div>
          <a href="/" style={{...mono,fontSize:"0.7rem",letterSpacing:"0.1em",textTransform:"uppercase",color:C.bg,background:C.accent,padding:"12px 24px",borderRadius:3,textDecoration:"none",display:"inline-block"}}>Back to skm.labs</a>
        </div>
      </main>
    );
  }

  return(
    <main style={{minHeight:"100svh",background:C.bg,padding:"5rem 2rem 4rem",display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{width:"100%",maxWidth:600,marginBottom:"2rem"}}>
        <a href="/" style={{...mono,fontSize:"0.7rem",letterSpacing:"0.1em",textTransform:"uppercase",color:C.dim,textDecoration:"none",transition:"color 0.2s"}}
          onMouseEnter={e=>(e.currentTarget.style.color=C.text)}
          onMouseLeave={e=>(e.currentTarget.style.color=C.dim)}
        >← skm.labs</a>
      </div>

      <div style={{width:"100%",maxWidth:600}}>
        <div style={{marginBottom:"2rem"}}>
          <p style={{...mono,fontSize:"0.68rem",letterSpacing:"0.18em",textTransform:"uppercase",color:C.accent,marginBottom:"0.75rem"}}>&gt; book a meeting</p>
          <h1 style={{...serif,fontSize:"clamp(1.6rem,4vw,2.4rem)",fontWeight:900,color:C.bright,letterSpacing:"-0.03em",lineHeight:1.05,marginBottom:"0.5rem"}}>Start a project</h1>
          <p style={{...mono,fontSize:"0.75rem",lineHeight:1.8,color:C.dim}}>
            <span style={{color:C.mid}}>// </span>Fill in your brief and pick a meeting slot. Marc will confirm within 24 hours.
          </p>
        </div>

        <Progress step={step}/>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{display:"flex",flexDirection:"column",gap:"1.4rem"}}>

            {/* ── STEP 1: Service ── */}
            {step===1&&(
              <>
                <StepHead n="01" title="What do you need?" sub="Pick the service that fits your project."/>
                {errors.service&&<p style={{...mono,fontSize:"0.7rem",color:C.err}}>{errors.service}</p>}
                <RadioCards
                  options={SERVICES.map(s=>({id:s.id,label:s.label,sub:s.sub}))}
                  value={form.service}
                  onChange={v=>set("service",v)}
                />
              </>
            )}

            {/* ── STEP 2: About you ── */}
            {step===2&&(
              <>
                <StepHead n="02" title="About you" sub="Who am I working with?"/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
                  <div>
                    <Label error={errors.client_name}>Full name</Label>
                    <TextInput value={form.client_name} onChange={v=>set("client_name",v)} placeholder="Your full name" error={errors.client_name}/>
                  </div>
                  <div>
                    <Label error={errors.client_email}>Email</Label>
                    <TextInput value={form.client_email} onChange={v=>set("client_email",v)} placeholder="you@email.com" error={errors.client_email}/>
                  </div>
                </div>
                <div>
                  <Label optional>Phone number</Label>
                  <TextInput value={form.client_phone} onChange={v=>set("client_phone",v)} placeholder="+63 9XX XXX XXXX"/>
                </div>
                <div>
                  <Label error={errors.client_intro}>Brief intro about yourself</Label>
                  <TextArea value={form.client_intro} onChange={v=>set("client_intro",v)}
                    placeholder="Tell me about yourself — your background, what you do, and what this project is for…"/>
                  {errors.client_intro&&<p style={{...mono,fontSize:"0.65rem",color:C.err,marginTop:4}}>{errors.client_intro}</p>}
                </div>
              </>
            )}

            {/* ── STEP 3: Project details — per service ── */}
            {step===3&&(
              <>
                {/* ── 3D PRINTING ── */}
                {form.service==="3d_printing"&&(
                  <>
                    <StepHead n="03" title="3D Printing details" sub="Tell me exactly what you need printed."/>
                    <div>
                      <Label error={errors.print_what}>What do you want printed?</Label>
                      <TextInput value={form.print_what} onChange={v=>set("print_what",v)} placeholder="e.g. Custom enclosure, phone stand, figurine, bracket" error={errors.print_what}/>
                    </div>
                    <div>
                      <Label error={errors.print_material}>Material</Label>
                      <SelectBox value={form.print_material} onChange={v=>set("print_material",v)}
                        placeholder="Select material…"
                        options={["PLA","PETG","ABS","TPU (Flexible)","Resin (Standard)","Resin (ABS-like)","Resin (Transparent)","ASA (UV resistant)","Not sure — recommend one"]}/>
                      {errors.print_material&&<p style={{...mono,fontSize:"0.65rem",color:C.err,marginTop:4}}>{errors.print_material}</p>}
                    </div>
                    <div>
                      <Label error={errors.print_color}>Color</Label>
                      <TextInput value={form.print_color} onChange={v=>set("print_color",v)} placeholder="e.g. Black, White, Transparent, Any" error={errors.print_color}/>
                    </div>
                    <div>
                      <Label error={errors.print_files}>STL / 3MF file <span style={{color:C.err,marginLeft:4}}>*</span></Label>
                      <FileDropZone files={printFiles} onFiles={setPrintFiles}
                        accept=".stl,.3mf"
                        hint="STL or 3MF only — strictly required for printing"/>
                      {errors.print_files&&<p style={{...mono,fontSize:"0.65rem",color:C.err,marginTop:4}}>{errors.print_files}</p>}
                    </div>
                  </>
                )}

                {/* ── 3D MODELING ── */}
                {form.service==="modeling"&&(
                  <>
                    <StepHead n="03" title="3D Modeling details" sub="Tell me about the model you need."/>
                    <div>
                      <Label error={errors.model_what}>What needs to be modeled?</Label>
                      <TextInput value={form.model_what} onChange={v=>set("model_what",v)} placeholder="e.g. Mechanical bracket, product shell, custom part" error={errors.model_what}/>
                    </div>
                    <div>
                      <Label optional>Material / process it will be used for</Label>
                      <TextInput value={form.model_material} onChange={v=>set("model_material",v)} placeholder="e.g. FDM printing, resin printing, CNC machining, rendering only"/>
                    </div>
                    <div>
                      <Label error={errors.model_dimensions}>Dimensions & measurements</Label>
                      <TextArea value={form.model_dimensions} onChange={v=>set("model_dimensions",v)} minHeight={90}
                        placeholder="List all known dimensions — e.g. 150mm long, 30mm shaft diameter, must fit inside a 200×100mm space"/>
                      {errors.model_dimensions&&<p style={{...mono,fontSize:"0.65rem",color:C.err,marginTop:4}}>{errors.model_dimensions}</p>}
                    </div>
                    <div>
                      <Label error={errors.model_has_cad}>Do you have an existing CAD file or reference?</Label>
                      <RadioCards
                        options={[
                          {id:"yes_cad",label:"Yes — I have a CAD file",sub:"STEP, IGES, F3D, or similar"},
                          {id:"yes_sketch",label:"Yes — I have a sketch or drawing",sub:"Photo, PDF, or hand sketch"},
                          {id:"no",label:"No — starting from scratch",sub:"Description only"},
                        ]}
                        value={form.model_has_cad}
                        onChange={v=>set("model_has_cad",v)}
                      />
                      {errors.model_has_cad&&<p style={{...mono,fontSize:"0.65rem",color:C.err,marginTop:4}}>{errors.model_has_cad}</p>}
                    </div>
                    {(form.model_has_cad==="yes_cad"||form.model_has_cad==="yes_sketch")&&(
                      <div>
                        <Label optional>Attach your CAD / sketch files</Label>
                        <FileDropZone files={cadFiles} onFiles={setCadFiles}
                          accept=".step,.stp,.iges,.igs,.f3d,.stl,.pdf,.png,.jpg,.jpeg"
                          hint="STEP · IGES · F3D · STL · PDF · PNG · JPG"/>
                      </div>
                    )}
                  </>
                )}

                {/* ── PROTOTYPING ── */}
                {form.service==="prototyping"&&(
                  <>
                    <StepHead n="03" title="Prototyping details" sub="What are we building and how does it work?"/>
                    <div>
                      <Label error={errors.proto_what}>What are you prototyping?</Label>
                      <TextInput value={form.proto_what} onChange={v=>set("proto_what",v)} placeholder="e.g. Smart helmet, automated plant watering system, NFC reader device" error={errors.proto_what}/>
                    </div>
                    <div>
                      <Label error={errors.proto_type}>What type of project is this?</Label>
                      <RadioCards
                        options={[
                          {id:"iot",        label:"IoT / Wireless",       sub:"WiFi, Bluetooth, MQTT, cloud-connected"},
                          {id:"mechatronics",label:"Mechatronics",        sub:"Motors, actuators, mechanical + electronics"},
                          {id:"electronics",label:"Pure Electronics",     sub:"PCB, circuits, sensors, power systems"},
                          {id:"embedded",   label:"Embedded System",      sub:"Microcontroller firmware, real-time systems"},
                          {id:"mixed",      label:"Mixed / Not sure",     sub:"Combination of the above"},
                        ]}
                        value={form.proto_type}
                        onChange={v=>set("proto_type",v)}
                      />
                      {errors.proto_type&&<p style={{...mono,fontSize:"0.65rem",color:C.err,marginTop:4}}>{errors.proto_type}</p>}
                    </div>
                    <div>
                      <Label error={errors.proto_description}>Describe what it should do</Label>
                      <TextArea value={form.proto_description} onChange={v=>set("proto_description",v)} minHeight={130}
                        placeholder="Describe the full functionality — inputs, outputs, how it behaves, what it connects to, how it will be tested or demonstrated"/>
                      {errors.proto_description&&<p style={{...mono,fontSize:"0.65rem",color:C.err,marginTop:4}}>{errors.proto_description}</p>}
                    </div>
                    <div>
                      <Label optional>Reference images or diagrams</Label>
                      <FileDropZone files={refFiles} onFiles={setRefFiles}
                        accept=".png,.jpg,.jpeg,.pdf,.stl,.step,.stp"
                        hint="PNG · JPG · PDF · STL · STEP — any references help"/>
                    </div>
                  </>
                )}

                {/* ── RESEARCH ── */}
                {form.service==="research"&&(
                  <>
                    <StepHead n="03" title="Research details" sub="What needs to be studied, analyzed, or documented?"/>
                    <div>
                      <Label error={errors.research_topic}>Research topic or project title</Label>
                      <TextInput value={form.research_topic} onChange={v=>set("research_topic",v)} placeholder="e.g. Structural feasibility of a folding shelter frame" error={errors.research_topic}/>
                    </div>
                    <div>
                      <Label error={errors.research_scope}>Scope & objectives</Label>
                      <TextArea value={form.research_scope} onChange={v=>set("research_scope",v)} minHeight={120}
                        placeholder="What questions need to be answered? What decisions will this research inform? What are the constraints?"/>
                      {errors.research_scope&&<p style={{...mono,fontSize:"0.65rem",color:C.err,marginTop:4}}>{errors.research_scope}</p>}
                    </div>
                    <div>
                      <Label error={errors.research_deliverable}>Expected deliverable</Label>
                      <SelectBox value={form.research_deliverable} onChange={v=>set("research_deliverable",v)}
                        placeholder="Select deliverable type…"
                        options={["Written technical report","Simulation / FEA results","Design recommendations document","Prototype + documentation","Literature review","Feasibility study","Other"]}/>
                      {errors.research_deliverable&&<p style={{...mono,fontSize:"0.65rem",color:C.err,marginTop:4}}>{errors.research_deliverable}</p>}
                    </div>
                    <div>
                      <Label optional>Institution or company context</Label>
                      <TextInput value={form.research_institution} onChange={v=>set("research_institution",v)} placeholder="e.g. TIP Manila — BSECE capstone, Startup R&D, Personal research"/>
                    </div>
                    <div>
                      <Label optional>Background / existing work</Label>
                      <TextArea value={form.research_background} onChange={v=>set("research_background",v)} minHeight={90}
                        placeholder="Any existing papers, datasets, prior work, or relevant context I should know about?"/>
                    </div>
                  </>
                )}

                {/* ── COMMISSIONS ── */}
                {form.service==="commissions"&&(
                  <>
                    <StepHead n="03" title="Commission details" sub="Describe what you want built end-to-end."/>
                    <div>
                      <Label error={errors.comm_what}>What do you want built?</Label>
                      <TextInput value={form.comm_what} onChange={v=>set("comm_what",v)} placeholder="e.g. Helmet cleaner vending machine, NFC event stamp device, custom RC chassis" error={errors.comm_what}/>
                    </div>
                    <div>
                      <Label error={errors.comm_description}>Full description</Label>
                      <TextArea value={form.comm_description} onChange={v=>set("comm_description",v)} minHeight={140}
                        placeholder="Describe it completely — what it does, how it works, what you want to hand off at the end (files, physical unit, both), any specific requirements or constraints"/>
                      {errors.comm_description&&<p style={{...mono,fontSize:"0.65rem",color:C.err,marginTop:4}}>{errors.comm_description}</p>}
                    </div>
                    <div>
                      <Label optional>Key hardware or tech involved</Label>
                      <TextInput value={form.comm_hardware} onChange={v=>set("comm_hardware",v)} placeholder="e.g. ESP32, Raspberry Pi, NFC, MQTT, 3D printed enclosure — or TBD"/>
                    </div>
                    <div>
                      <Label optional>Material or process preferences</Label>
                      <TextInput value={form.comm_materials} onChange={v=>set("comm_materials",v)} placeholder="e.g. PETG enclosure, custom PCB, off-the-shelf sensors"/>
                    </div>
                    <div>
                      <Label optional>Reference images or documents</Label>
                      <FileDropZone files={refFiles} onFiles={setRefFiles}
                        accept=".png,.jpg,.jpeg,.pdf,.stl,.step,.stp"
                        hint="PNG · JPG · PDF · STL · STEP"/>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ── STEP 4: Scope & budget ── */}
            {step===4&&(
              <>
                <StepHead n="04" title="Scope & budget" sub="Who is this project for, and what is your budget?"/>
                <div>
                  <Label error={errors.client_scope}>Client type</Label>
                  <RadioCards
                    options={SCOPES}
                    value={form.client_scope}
                    onChange={v=>{set("client_scope",v);set("budget","");}}
                  />
                  {errors.client_scope&&<p style={{...mono,fontSize:"0.65rem",color:C.err,marginTop:4}}>{errors.client_scope}</p>}
                </div>
                {form.client_scope&&(
                  <div>
                    <Label error={errors.budget}>Budget range</Label>
                    <RadioCards
                      options={budgets.map(b=>({id:b,label:b}))}
                      value={form.budget}
                      onChange={v=>set("budget",v)}
                    />
                    {errors.budget&&<p style={{...mono,fontSize:"0.65rem",color:C.err,marginTop:4}}>{errors.budget}</p>}
                  </div>
                )}
              </>
            )}

            {/* ── STEP 5: Schedule & terms ── */}
            {step===5&&(
              <>
                <StepHead n="05" title="Schedule & terms" sub="Timeline, rush fees, and confidentiality."/>

                <div>
                  <Label error={errors.deadline}>Target completion date</Label>
                  <input type="date" value={form.deadline} onChange={e=>{set("deadline",e.target.value);set("rush_fee_agreed",false);}}
                    style={{...inputStyle,colorScheme:"dark",borderColor:errors.deadline?C.err:C.bdr}}/>
                  {errors.deadline&&<p style={{...mono,fontSize:"0.65rem",color:C.err,marginTop:4}}>{errors.deadline}</p>}
                </div>

                {isRush&&(
                  <InfoBox color={C.warn}>
                    ⚡ Your deadline is under 5 weeks away. Projects with tight timelines require a <strong>rush fee</strong> — typically 20–30% on top of the base project cost — to prioritize your work in the schedule. Please acknowledge below to proceed.
                  </InfoBox>
                )}

                {isRush&&(
                  <Toggle
                    label="I understand and agree to the rush fee"
                    sub="A rush surcharge will be added to the final quote"
                    checked={form.rush_fee_agreed}
                    onChange={v=>set("rush_fee_agreed",v)}
                  />
                )}
                {errors.rush_fee_agreed&&<p style={{...mono,fontSize:"0.65rem",color:C.err}}>{errors.rush_fee_agreed}</p>}

                <div style={{borderTop:`1px solid ${C.bdr}`,paddingTop:"1.25rem",display:"flex",flexDirection:"column",gap:"0.75rem"}}>
                  <Toggle
                    label="This project requires an NDA or disclosure agreement"
                    sub="I will send you an NDA to sign before work begins"
                    checked={form.nda_required}
                    onChange={v=>set("nda_required",v)}
                  />
                  {form.nda_required&&(
                    <div>
                      <Label optional>NDA notes</Label>
                      <TextInput value={form.nda_notes} onChange={v=>set("nda_notes",v)} placeholder="Any specific confidentiality requirements or parties involved?"/>
                    </div>
                  )}
                </div>

                {!isRush&&form.deadline&&(
                  <InfoBox color={C.accent}>
                    ✓ Your timeline looks comfortable. No rush fee applies.
                  </InfoBox>
                )}
              </>
            )}

            {/* ── STEP 6: Meeting slot ── */}
            {step===6&&(
              <>
                <StepHead n="06" title="Book a meeting" sub="Available every day from 7 PM onwards, PH time."/>
                {errors.meeting_date&&<p style={{...mono,fontSize:"0.7rem",color:C.err}}>{errors.meeting_date}</p>}

                <Calendar selected={form.meeting_date} onSelect={d=>set("meeting_date",d)}/>

                {form.meeting_date&&(
                  <div>
                    <Label error={errors.meeting_time}>Time slot</Label>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem"}}>
                      {TIME_SLOTS.map(t=>(
                        <button key={t} type="button" onClick={()=>set("meeting_time",t)} style={{
                          ...mono,fontSize:"0.75rem",
                          color:form.meeting_time===t?C.bg:C.text,
                          background:form.meeting_time===t?C.accent:"transparent",
                          border:`1px solid ${form.meeting_time===t?C.accent:C.bdr}`,
                          borderRadius:3,padding:"8px 16px",cursor:"pointer",transition:"all 0.15s",
                        }}
                          onMouseEnter={e=>{if(form.meeting_time!==t)e.currentTarget.style.borderColor=C.bdrHi;}}
                          onMouseLeave={e=>{if(form.meeting_time!==t)e.currentTarget.style.borderColor=C.bdr;}}
                        >{TIME_LABELS[t]}</button>
                      ))}
                    </div>
                  </div>
                )}

                {form.meeting_date&&form.meeting_time&&(
                  <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:4,padding:"1.1rem 1.25rem",display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                    <p style={{...mono,fontSize:"0.62rem",letterSpacing:"0.12em",textTransform:"uppercase",color:C.muted}}>Booking summary</p>
                    <p style={{...mono,fontSize:"0.82rem",color:C.warn}}>
                      {new Date(form.meeting_date+"T00:00:00").toLocaleDateString("en-PH",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
                    </p>
                    <p style={{...mono,fontSize:"0.82rem",color:C.warn}}>{TIME_LABELS[form.meeting_time]} PH time</p>
                    <div style={{borderTop:`1px solid ${C.bdr}`,paddingTop:"0.75rem",display:"flex",gap:"1rem",flexWrap:"wrap"}}>
                      <span style={{...mono,fontSize:"0.68rem",color:C.mid}}>{SERVICES.find(s=>s.id===form.service)?.label}</span>
                      <span style={{...mono,fontSize:"0.68rem",color:C.mid}}>{form.budget}</span>
                      {form.nda_required&&<span style={{...mono,fontSize:"0.68rem",color:C.mid}}>⚑ NDA required</span>}
                      {form.rush_fee_agreed&&<span style={{...mono,fontSize:"0.68rem",color:C.warn}}>⚡ Rush fee agreed</span>}
                    </div>
                  </div>
                )}

                {status==="error"&&(
                  <InfoBox color={C.err}>Something went wrong — please try again or email work.mmasanjuan@gmail.com directly.</InfoBox>
                )}
              </>
            )}

            {/* ── Nav ── */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:"0.5rem"}}>
              {step>1?<GhostBtn onClick={back}>← Back</GhostBtn>:<span/>}
              {step<6
                ?<PrimaryBtn onClick={next}>Continue →</PrimaryBtn>
                :<PrimaryBtn type="submit" disabled={status==="loading"}>
                  {status==="loading"?"Submitting…":"Send booking request"}
                </PrimaryBtn>
              }
            </div>

          </div>
        </form>
      </div>
    </main>
  );
}