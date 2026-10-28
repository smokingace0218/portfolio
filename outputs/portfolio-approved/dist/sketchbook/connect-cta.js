let portfolioHandoffTimer=0;
window.addEventListener('pageshow',()=>{clearTimeout(portfolioHandoffTimer);portfolioHandoffTimer=0;document.documentElement.classList.remove('portfolio-handoff')});
function goToPortfolio(destination){
 try{sessionStorage.setItem('storybook-preview-seen','1');sessionStorage.setItem('portfolio-audio-unlocked','1')}catch(_){}
 // Leave on the click itself. A delayed jump drops the gesture, so Connect and the wizard page ask for another tap before any sound.
 window.location.assign(destination);
}
function openPortfolioLanding(){goToPortfolio('/?from=magic')}
function openPortfolioContact(){goToPortfolio('/contact?from=magic')}
/* Compact navigation instance; original source and font notices retained under vendor/venom. */
let connectCTA=null;
function mountWorldConnect(){
 if(connectCTA)return;
 const host=document.querySelector('#connect-venom');
 if(!host)return;
 // Send an owl sits on the painting. A white studio floor reads as a slab behind the pill on every screen size.
 connectCTA=VenomCTA.mount(host,{
  label:'SEND AN OWL',labelFont:'Harry P',
  floor:[0.004,0.006,0.004],
  labelSize:29,buttonHeight:64,paddingX:36,
  onActivate:openPortfolioContact,
  params:{reach:600,awareness:700,maxStrands:6,maxLen:650,sheen:.4}
 });
 connectCTA.element.setAttribute('aria-label','Send an owl');
 connectCTA.element.style.fontSize='24px';
}
if(matchMedia('(prefers-reduced-motion: reduce)').matches)mountWorldConnect();
else requestAnimationFrame(mountWorldConnect);
new MutationObserver(()=>connectCTA?.recalibrate?.()).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

const connectCard=document.querySelector('#connect-card');function dismissConnect(){if(typeof settleChapter==='function')settleChapter(connectCard);else connectCard.close()}document.querySelector('#close-connect').addEventListener('click',dismissConnect);connectCard.addEventListener('click',e=>{if(e.target===connectCard)dismissConnect()});connectCard.addEventListener('cancel',e=>{e.preventDefault();dismissConnect()});

function magicButton(label,action){const b=document.createElement('button');b.type='button';b.className='wizard-cta';b.textContent=label;b.addEventListener('click',action);return b}
const designerHost=document.querySelector('#designer-spider');designerHost.classList.add('wizard-designer');designerHost.append(magicButton('Catch the wizard',openPortfolioLanding));

// The same two original interactive components, mounted only for the active chapter.
function mountChapterCTAs(dialog,container){
 if(dialog.id==='paper'&&['sant','janitri'].includes(dialog.dataset.place))return;
 if(dialog.querySelector('.chapter-cta-dock'))return;
 if(dialog.id==='nift-map'){
  const dock=document.createElement('div');dock.className='chapter-cta-dock nift-single-action';dock.setAttribute('aria-label','Know the wizard');
  const button=magicButton('Know the wizard',openPortfolioLanding);dock.append(button);container.append(dock);
  const cleanup=()=>{dock.remove();dialog.removeEventListener('close',cleanup)};dialog.addEventListener('close',cleanup,{once:true});return cleanup;
 }

 const dock=document.createElement('div');dock.className='chapter-cta-dock';dock.setAttribute('aria-label','Send an owl or catch the wizard');dock.innerHTML='<div class="chapter-connect"><div class="chapter-venom"></div></div>'+(dialog.id==='paper'&&dialog.dataset.place==='me'?'':'<div class="chapter-contact"><div class="chapter-spider"></div></div>');if(dialog.id==='paper'&&dialog.dataset.place==='me')dock.classList.add('wanted-connect');container.append(dock);
 const designerButton=magicButton('Catch the wizard',openPortfolioLanding);dock.querySelector('.chapter-spider')?.append(designerButton);
 const isWanted=dialog.id==='paper'&&dialog.dataset.place==='me';
 let venom=null;
 const mountVenom=()=>{
  if(!dock.isConnected||venom)return;
  venom=VenomCTA.mount(dock.querySelector('.chapter-venom'),{label:'SEND AN OWL',labelFont:'Harry P',labelSize:dialog.id==='nift-map'?34:26,buttonHeight:dialog.id==='nift-map'?76:72,paddingX:dialog.id==='nift-map'?36:22,clearFloor:isWanted,params:{reach:550,awareness:600,maxStrands:5,maxLen:580},onActivate:openPortfolioContact});
  venom.element.setAttribute('aria-label','Send an owl');
 };
 const mountFrame=matchMedia('(prefers-reduced-motion: reduce)').matches?0:requestAnimationFrame(mountVenom);
 if(!mountFrame)mountVenom();
 const cleanup=()=>{if(mountFrame)cancelAnimationFrame(mountFrame);venom?.destroy();dock.remove();dialog.removeEventListener('close',cleanup)};dialog.addEventListener('close',cleanup,{once:true});return cleanup;
}

const CHAPTER_MESSAGES={nift:['I solemnly swear','I am up to no good.'],me:['Hey, I’m Shruti.','UI/UX & Product Designer'],janitri:['Designing for care.','Nurse-facing experiences at Janitri'],sant:['Craft, brand & discovery.','Sant Ram’s · JAZAA'],ministry:['A new chapter awaits.','Your team could be next.']};
function setChapterBanner(dialog,id){dialog.querySelector('.chapter-message-ribbon')?.remove();}
