'use client'; import {useRef,useState,FormEvent} from 'react'; import data from '../../content/es.json'; import {normalize,validate,LIMITS,FieldErrors} from '../lib/contact';
export default function Contact(){
const [status,setStatus]=useState<'idle'|'sending'|'sent'|'error'>('idle');
const [errors,setErrors]=useState<FieldErrors>({});
const [msg,setMsg]=useState('');
const busy=useRef(false);
const started=useRef(Date.now());
const alertRef=useRef<HTMLDivElement>(null);
const focusFirst=(f:HTMLFormElement,e:FieldErrors)=>{const k=Object.keys(e)[0];if(k)(f.elements.namedItem(k) as HTMLElement|null)?.focus();else alertRef.current?.focus()};
async function submit(ev:FormEvent<HTMLFormElement>){
ev.preventDefault();if(busy.current)return;
const form=ev.currentTarget;const fd=new FormData(form);
const raw:Record<string,unknown>=Object.fromEntries(fd.entries());
const errs=validate(normalize(raw));setErrors(errs);
if(Object.keys(errs).length){setStatus('error');setMsg('Revisa los campos marcados.');setTimeout(()=>focusFirst(form,errs),0);return}
busy.current=true;setStatus('sending');setMsg('');
try{
const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...raw,startedAt:started.current})});
const j=await r.json().catch(()=>({}));
if(r.ok&&j.ok){setStatus('sent');return}
const fe:FieldErrors=j.fields||{};setErrors(fe);setStatus('error');setMsg(j.error||'No se pudo enviar tu consulta. Inténtalo de nuevo más tarde.');setTimeout(()=>focusFirst(form,fe),0);
}catch{setStatus('error');setMsg('No se pudo enviar tu consulta. Comprueba tu conexión e inténtalo de nuevo.');setTimeout(()=>alertRef.current?.focus(),0)}
finally{busy.current=false}
}
const err=(k:keyof FieldErrors)=>errors[k]?<span id={`${k}-err`} className="field-error">{errors[k]}</span>:null;
const a=(k:keyof FieldErrors)=>({'aria-invalid':errors[k]?true:undefined,'aria-describedby':errors[k]?`${k}-err`:undefined});
return <main className="page"><div className="wrap"><div className="kicker">{data.contact.label}</div><h1>{data.contact.title}</h1><p className="intro">{data.contact.body}</p>
{status==='sent'?<div className="success" role="status" tabIndex={-1} ref={el=>el?.focus()}>Gracias por tu mensaje. Tu consulta ha sido enviada al Secretario de la Logia, que te responderá en cuanto sea posible.</div>:
<form className="form" onSubmit={submit} noValidate aria-busy={status==='sending'}>
{status==='error'&&msg&&<div className="form-error" role="alert" tabIndex={-1} ref={alertRef}>{msg}</div>}
<label>Motivo de contacto<select required name="reason" defaultValue="" {...a('reason')}><option value="">Selecciona una opción</option><option>Quiero conocer la Masonería</option><option>Soy masón y quiero visitar</option><option>Consulta general</option></select>{err('reason')}</label>
<label>Nombre<input required name="name" autoComplete="name" maxLength={LIMITS.name} {...a('name')}/>{err('name')}</label>
<label>Correo electrónico<input required type="email" name="email" autoComplete="email" maxLength={LIMITS.email} {...a('email')}/>{err('email')}</label>
<label>Teléfono<input required type="tel" name="phone" autoComplete="tel" maxLength={LIMITS.phone} {...a('phone')}/>{err('phone')}</label>
<label>Ciudad de residencia<input required name="city" autoComplete="address-level2" maxLength={LIMITS.city} {...a('city')}/>{err('city')}</label>
<label>Mensaje<textarea name="message" maxLength={LIMITS.message} {...a('message')}/>{err('message')}</label>
<div aria-hidden="true" style={{position:'absolute',left:'-9999px',width:1,height:1,overflow:'hidden'}}><label>No rellenar este campo<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
<button className="button" type="submit" disabled={status==='sending'}>{status==='sending'?'Enviando…':'Enviar consulta'}</button>
<small>Solo solicitamos los datos necesarios para responder a tu consulta. No adjuntes documentación.</small>
<small>Al enviar, aceptas que usemos estos datos únicamente para atender tu consulta, que se remitirá por correo electrónico al Secretario de la Logia. No se guardan en ninguna base de datos ni se ceden a terceros, salvo el proveedor de correo necesario para el envío.</small>
</form>}</div></main>}
