"use strict";class Calendar{constructor(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};this.node=e,this.nodeDay=null,this.nodeBody=null,this.nodeTools=null,this.nodeToolsCreate=null,this.nodeNav=null,this.nodeNavPrev=null,this.nodeNavNext=null,this.nodeNavCurrent=null,this.nodeTable=null,this.nodeCells=[],this.offsets=n.offsets||this.getDefault("offsets"),this.labels=n.labels||this.getDefault("labels"),this.icons=n.icons||this.getDefault("icons"),this.events=this.formatEvents(t),this.onCreate=n.onCreate,this.onDayCreate=n.onDayCreate,this.year=null,this.month=null,this.date=null,this.start_date=null,this.today=null,this.activeCell=null,this.setDate(n.date||new Date),console.log(this.date),this.node&&(this.init(),this.initListeners(),this.render())}weekCount(e,t){const n=new Date(e,t,1),s=new Date(e,t+1,0),a=n.getDay()+6+s.getDate();return Math.ceil(a/7)}init(){this.nodeDay=document.createElement("div"),this.nodeDay.classList.add("calendar__day"),this.nodeBody=document.createElement("div"),this.nodeBody.classList.add("calendar__body"),this.nodeTools=document.createElement("div"),this.nodeTools.classList.add("calendar__tools"),this.nodeNav=document.createElement("nav"),this.nodeNav.classList.add("calendar__nav"),this.nodeNavPrev=document.createElement("button"),this.nodeNavPrev.setAttribute("type","button"),this.nodeNavPrev.classList.add("calendar__nav-item","calendar__prev"),this.nodeNavPrev.innerHTML=this.icons.chevron_left,this.nodeNavCurrent=document.createElement("button"),this.nodeNavCurrent.setAttribute("type","button"),this.nodeNavCurrent.classList.add("calendar__nav-item","calendar__nav-item_text","calendar__current"),this.nodeNavNext=document.createElement("button"),this.nodeNavNext.setAttribute("type","button"),this.nodeNavNext.classList.add("calendar__nav-item","calendar__next"),this.nodeNavNext.innerHTML=this.icons.chevron_right,this.nodeNav.appendChild(this.nodeNavPrev),this.nodeNav.appendChild(this.nodeNavCurrent),this.nodeNav.appendChild(this.nodeNavNext),this.nodeToolsCreate=document.createElement("button"),this.nodeToolsCreate.setAttribute("type","button"),this.nodeToolsCreate.classList.add("calendar__button"),this.nodeToolsCreate.innerHTML=this.icons.plus+"<span>"+this.labels.create+"</span>";const e=this.onCreate;e&&this.nodeToolsCreate.addEventListener("click",(t=>{t.preventDefault(),e(t)})),this.nodeTools.appendChild(this.nodeNav),this.nodeTools.appendChild(this.nodeToolsCreate),this.nodeBody.appendChild(this.nodeTools),this.nodeTable=document.createElement("div"),this.nodeTable.classList.add("calendar__table"),this.nodeBody.appendChild(this.nodeTable),this.node.appendChild(this.nodeDay),this.node.appendChild(this.nodeBody)}initListeners(){this.nodeNavPrev.addEventListener("click",(e=>{e.preventDefault(),this.renderPrev()})),this.nodeNavNext.addEventListener("click",(e=>{e.preventDefault(),this.renderNext()})),this.nodeNavCurrent.addEventListener("click",(e=>{e.preventDefault(),this.renderCustomDate()})),document.addEventListener("click",(e=>{document.querySelectorAll(".calendar__day-item-more").forEach((e=>{e.classList.remove("active")}));const t=e.target.closest(".calendar__day-item-more"),n=e.target.closest(".calendar__day-menu");if(!t)return!1;e.preventDefault(),n&&t.classList.add("active"),t.classList.toggle("active")}))}render(){this.nodeCells=[];const e=[],t=document.createElement("div");t.classList.add("calendar__row");for(let e=0;e<7;e++){const n=document.createElement("div");n.classList.add("calendar__cell","calendar__cell_head"),n.textContent=this.labels.weekday[e],t.appendChild(n)}e.push(t);for(let t=1;t<this.weekCount(this.year,this.month);t++){const t=document.createElement("div");t.classList.add("calendar__row"),this.getWeekday(this.date)>0&&this.date.setDate(this.date.getDate()-this.getWeekday(this.date));for(let e=0;e<7;e++)t.appendChild(this.getCell(this.date)),this.date.setDate(this.date.getDate()+1);e.push(t)}this.nodeTable.replaceChildren(...e),this.date=new Date(this.year,this.month),this.updateTools(),this.nodeDay.style.height=this.nodeBody.offsetHeight+"px"}getCell(e){e=new Date(e.valueOf());const t=document.createElement("div");t.classList.add("calendar__cell"),this.isToday(e)&&t.classList.add("current"),e.getMonth()!=this.start_date.getMonth()&&t.classList.add("muted"),t.date=e,t.events=this.events.filter((t=>this.isDatesEqual(e,t.date)))||[];const n=document.createElement("div");return n.classList.add("calendar__date"),n.textContent=e.getDate(),t.replaceChildren(n,this.getCellEvents(t.events)),t.addEventListener("click",(n=>{n.preventDefault(),this.nodeCells.forEach((e=>e.classList.remove("active"))),t.classList.add("active"),this.activeCell=e.getTime(),this.renderDay(t)})),this.activeCell&&e.getTime()==this.activeCell&&t.classList.add("active"),this.nodeCells.push(t),t}getCellEvents(e){let t=0,n=!1;const s=document.createElement("div");return s.classList.add("calendar__events"),e.forEach((a=>{const d=document.createElement("div");if(d.classList.add("calendar__event"),t>=2&&!n&&e.length>3&&(d.classList.add("calendar__event_more"),d.textContent="...",s.appendChild(d),n=!0),n)return!1;d.textContent=a.name,d.addEventListener("click",(e=>{a.onClick&&(e.preventDefault(),a.onClick(a))})),s.appendChild(d),t++})),s}renderPrev(){this.setDate(new Date(this.year,this.month-1)),this.render()}renderNext(){this.setDate(new Date(this.year,this.month+1)),this.render()}renderCustomDate(e){this.setDate(e),this.render()}updateTools(){this.nodeNavCurrent.innerText=this.labels.month[this.month]+" "+this.year}renderDay(e){const t=e.date,n=e.events,s=document.createElement("div");s.classList.add("calendar__day-header");const a=document.createElement("span");a.textContent=this.labels.weekday[this.getWeekday(t)]+" "+t.getDate()+", "+this.labels.month[t.getMonth()]+" "+t.getFullYear();const d=document.createElement("button");d.setAttribute("type","button"),d.classList.add("calendar__day-close"),d.addEventListener("click",(t=>{t.preventDefault(),this.activeCell=null,this.nodeCells.forEach((e=>e.classList.remove("active"))),e.classList.remove("active"),this.node.classList.remove("active")})),s.appendChild(a),s.appendChild(d);const i=document.createElement("div");i.classList.add("calendar__day-body"),i.replaceChildren(...this.getDayEvents(n));const l=document.createElement("div");l.classList.add("calendar__day-footer");const o=document.createElement("button");o.setAttribute("type","button"),o.classList.add("calendar__button"),o.innerHTML=this.icons.plus+"<span>"+this.labels.create+"</span>";const r=this.onDayCreate;r&&o.addEventListener("click",(t=>{t.preventDefault(),r(e.date,t)})),l.appendChild(o);const h=[s,i];e.date.getTime()>this.today.getTime()-this.offsets.create&&h.push(l),this.nodeDay.replaceChildren(...h),this.node.classList.add("active")}getDayEvents(e){const t=[];return e.forEach((e=>{const n=new Date(e.date),s=(n.getHours()<10?"0":"")+n.getHours()+":"+(n.getMinutes()<10?"0":"")+n.getMinutes(),a=document.createElement("div");a.classList.add("calendar__day-item");const d=document.createElement("time");d.textContent=s;const i=document.createElement("div");i.classList.add("calendar__day-item-data");const l=document.createElement("div");l.classList.add("calendar__day-item-title"),l.textContent=e.name;const o=document.createElement("div");o.classList.add("calendar__day-item-description"),o.textContent=e.description,i.appendChild(l),i.appendChild(o),a.appendChild(d),a.appendChild(i),a.appendChild(this.getDayEventMenu(e)),t.push(a)})),t}getDayEventMenu(e){const t=document.createElement("button");t.setAttribute("type","button"),t.classList.add("calendar__day-item-more"),t.innerHTML="<span></span>";const n=document.createElement("div");n.classList.add("calendar__day-menu");const s=document.createElement("div");s.classList.add("calendar__day-menu-item"),s.innerHTML=this.icons.view+"<span>"+this.labels.view+"</span>",s.addEventListener("click",(t=>{e.onView&&(t.preventDefault(),e.onView(e))}));const a=document.createElement("div");a.classList.add("calendar__day-menu-item"),a.innerHTML=this.icons.edit+"<span>"+this.labels.edit+"</span>",a.addEventListener("click",(t=>{e.onEdit&&(t.preventDefault(),e.onEdit(e))}));const d=document.createElement("div");d.classList.add("calendar__day-menu-item"),d.innerHTML=this.icons.delete+"<span>"+this.labels.delete+"</span>",d.addEventListener("click",(t=>{e.onDelete&&(t.preventDefault(),e.onDelete(e))})),n.appendChild(s);const i=new Date;return i.setMinutes(i.getMinutes()+this.offsets.edit),new Date(e.date)>i&&(n.appendChild(a),n.appendChild(d)),t.appendChild(n),t}setDate(e){e=new Date(e),this.year=e.getFullYear(),this.month=e.getMonth(),this.date=new Date(this.year,this.month),this.start_date=new Date(this.year,this.month),this.today=new Date,this.today.setHours(0,0,0,0)}formatEvents(e){if(!e||!e.length)return[];return(e=e.map((e=>({...e,date:new Date(e.date)})))).sort((function(e,t){return e.date<t.date?-1:e.date>t.date?1:0})),e}getWeekday(e){let t=e.getDay();return 0==t&&(t=7),t-1}isToday(e){return this.isDatesEqual(new Date,e)}isDatesEqual(e,t){return e.toDateString()==t.toDateString()}getDefault(e){switch(e.toLowerCase()){case"offsets":return{create:60,edit:60};case"labels":return{month:["January","February","March","April","May","June","July","August","September","October","November","December"],weekday:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],create:"Create",view:"View",edit:"Edit",delete:"Delete"};case"icons":return{chevron_left:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>',chevron_right:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>',plus:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>',view:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>',edit:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 20l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4h4z" /><path d="M13.5 6.5l4 4" /><path d="M16 18h4" /></svg>',delete:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>'}}}}