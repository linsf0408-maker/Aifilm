(function(){'use strict';const $=id=>document.getElementById(id);let slides=[],selected=null;
const missing='資料未提供；不作推論。';const short=s=>{s=String(s).replace(/\s+/g,' ');return [...s].length>82?[...s].slice(0,82).join('')+'…':s};
function rows(p){const d=p.data,g=id=>d[id]?.trim()||missing;const r=(title,items,sections=[])=>({title,body:items.map(short).join('\n'),notes:(p.demo?'【教學示例，非市場實績】\n':'')+'【完整原文與口頭稿編輯區】\n'+items.join('\n\n')+'\n\n【小組決策】\n'+sections.map(id=>id+'：\n'+Object.entries(p.decisions[id]||{}).map(([k,v])=>({text:'結論',kind:'證據狀態',owner:'負責角色',next:'下一步與時程'}[k])+ '：'+v).join('\n')).join('\n\n')+'\n\n【資料範圍】依小組填寫主檔整理；草稿不代表已查核。請加入來源、圖稿說明與精簡口頭講稿。'});
const f=Lab.finance(d);const financeItems=f.ready?[`售價NT$${f.p}−每杯變動成本NT$${f.variable}＝貢獻NT$${f.margin}。`,`每月營業${f.days}天×每日${f.s}杯＝${f.monthly}杯；月營收NT$${f.revenue}。`,`固定成本NT$${f.fixed}；月變動成本NT$${f.variableTotal}。`,f.margin>0?`兩平月杯數＝⌈${f.fixed}÷${f.margin}⌉＝${f.breakEven}杯；每日整杯目標${f.daily}杯。`:'每杯貢獻≤0，無法以增加銷量達到損益兩平。',`月營業損益＝${f.margin}×${f.s}×${f.days}−${f.fixed}＝NT$${f.operating}；不是淨利。`]:[f.message,'不套用示例或擅自補數字。','模型限制：'+g('finance_basis')];
const s=[
r([...g('brand')].slice(0,22).join(''),['組別：'+g('group'),'成員與角色：'+g('members'),'品牌承諾：'+g('promise'),p.demo?'教學示例：設定與數字均為假設，非市場實績。':'小組創業提案：請區分資料、假設與設計建議。'],['team']),
r('從問題出發，確認服務對象',['創業動機：'+g('motivation'),'品牌概念與模式：'+g('concept'),'目標客群與情境：'+g('audience'),'最優先驗證：'+g('priority')],['summary']),
r('市場與需求，先找支持依據',['商圈與市場觀察：'+g('market'),'顧客需求證據：'+g('customer_evidence'),'來源與附件：'+g('sources')],['market']),
r('顧客還會選擇誰？',['直接競爭者A：'+g('comp_a'),'直接競爭者B：'+g('comp_b'),'替代選擇C：'+g('comp_c'),'比較需同品項、杯量、冷熱與通路，保留價格條件及來源日期。'],['market']),
r('差異要被顧客感受到',['差異化主張：'+g('difference'),'品牌個性：'+g('tone'),'SWOT與行動：'+g('swot'),'驗證方向：'+g('priority')],['market']),
r('MI：理念指導品牌決策',['故事：'+g('mi_story'),'使命：'+g('mi_mission'),'願景：'+g('mi_vision'),'核心價值：'+g('mi_values'),'定位與標語：'+g('mi_position')],['cis']),
r('VI：建立可執行的視覺規範',['主標誌：'+g('vi_logo'),'字體家族：'+g('vi_type'),'圖形與插畫：'+g('vi_graphic'),'使用禁忌：'+g('vi_incorrect')],['cis']),
r('VI：跨接觸點保持一致',['色彩系統：'+g('vi_color'),'商務用品：'+g('vi_stationery'),'包裝系統：'+g('vi_pack'),'數位與社群：'+g('vi_digital')],['cis']),
r('BI：把承諾變成顧客體驗',['空間與動線：'+g('bi_space'),'五感體驗：'+g('bi_sensory'),'制服與專業形象：'+g('bi_uniform'),'服務與客訴：'+g('bi_service')],['cis']),
r('先確定主打產品與配方',['菜單規劃：'+g('menu'),'標準配方：'+g('recipe'),'定價策略：'+g('pricing')],['product']),
r('讓顧客旅程清楚可預期',['顧客流程：'+g('journey'),'特殊需求與異常：'+g('service'),'品牌體驗規範：'+g('bi_service')],['product']),
r('人力、產能與SOP要相符',['經營形式與通路：'+g('channel'),'人力排班與產能：'+g('capacity'),'營運SOP：'+g('sop'),'籌備時程：'+g('launch')],['operations']),
r('行銷目的、預算與指標一致',['試營運與開幕：'+g('opening'),'社群內容與頻率：'+g('social'),'合作與回購：'+g('partners'),'新增費用須回填財務，不將促銷銷量當常態需求。'],['marketing']),
r('算清單杯貢獻與月損益',financeItems,['finance']),
r('初期資金與現金流分開看',[f.initial!==null?'初期資金需求合計：NT$'+f.initial+'（依六項輸入合計）。':'初期六項資金欄位尚未填齊；不推算缺少數字。','資金包含建置、設備、首批原料、押金、開幕與週轉金，不全列當月費用。','估算依據與限制：'+g('finance_basis'),'回收期需要初期投入與淨現金流；不能用營收或未調整的營業損益替代。'],['finance']),
r('先設定門檻，再進行驗證',['驗證矩陣：'+g('validation'),'最重要的假設：'+g('priority'),'門檻須標明團隊設定；未執行的計畫不寫成試賣成果。'],['validation']),
r('風險與30天行動',['三項主要風險：'+g('risks'),'30天角色分工：'+g('actions'),'主檔與交接約定：'+g('handoff')],['validation']),
r('用跨域合作支持下一步決策',['品牌承諾：'+g('promise'),'小組分工：'+g('members'),'最優先行動：'+g('actions'),'來源與AI協助：'+g('ai'),'交件與剩餘工作：'+g('submission')],['appendix'])];
s[13].notes+='\n\n【完整公式】\n'+Lab.financeText(d);return s}
window.LabBuildSlides=rows;
function menu(){const m=$('maker-project');m.replaceChildren();for(const p of Lab.state.projects){const o=document.createElement('option');o.value=p.id;o.textContent=(p.demo?'[教學示例] ':'')+(p.data.group||'未命名小組')+'｜'+(p.data.brand||'咖啡品牌');m.appendChild(o)}m.value=Lab.state.active}
function render(){const h=$('slide-editors');h.replaceChildren();slides.forEach((s,i)=>{const d=document.createElement('details');d.className='slide-editor';if(i===0)d.open=true;const sum=document.createElement('summary');sum.textContent=String(i+1).padStart(2,'0')+'｜'+s.title;d.appendChild(sum);for(const[k,label,tag]of [['title','標題（54級，最多22字元）','input'],['body','正文（26級，每行一個重點）','textarea'],['notes','完整資料與講者備註','textarea']]){const l=document.createElement('label');l.htmlFor='slide-'+i+'-'+k;l.textContent=label;const e=document.createElement(tag);e.id=l.htmlFor;e.value=s[k];if(k==='title')e.maxLength=22;e.addEventListener('input',()=>{s[k]=e.value;if(k==='title')sum.textContent=String(i+1).padStart(2,'0')+'｜'+s.title});d.append(l,e)}h.appendChild(d)});$('slide-work').hidden=false}
function build(p){if(slides.length&&!confirm('重新整理會取代目前逐頁修改的草稿；請先下載保存。要繼續嗎？'))return;selected=p;slides=rows(p);render();$('maker-status').textContent=(p.demo?'【教學示例，非實績】 ':'')+'已整理18頁文字草稿，請檢查數字、來源與節錄語意，並在PowerPoint加入圖稿。'}
$('use-current').addEventListener('click',()=>{const p=Lab.state.projects.find(x=>x.id===$('maker-project').value);if(p)build(p)});
$('maker-file').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>4*1024*1024)throw Error('檔案超過4MB。');const ext=f.name.split('.').pop().toLowerCase();if(!['txt','json'].includes(ext))throw Error('請選擇JSON或TXT。');const p=Lab.importText(await f.text(),ext);menu();build(p)}catch(err){$('maker-status').textContent='匯入失敗：'+err.message}e.target.value=''});
function validate(){for(let i=0;i<slides.length;i++){const s=slides[i],l=s.body.split('\n').map(x=>x.trim()).filter(Boolean);if(!s.title.trim()||[...s.title].length>22)return'第'+(i+1)+'頁標題須有1–22字元。';if(!l.length||l.length>5)return'第'+(i+1)+'頁需有1–5行重點。';if(l.some(t=>[...t].length>85))return'第'+(i+1)+'頁有超過85字元的重點，請精簡並將完整內容移至備註。'}return''}
$('save-pptx').addEventListener('click',()=>{const issue=validate();if(issue){$('ppt-status').textContent=issue;return}try{const brand=[...(selected.data.brand||'咖啡品牌')].slice(0,32).join(''),data=CoffeeSlides.pptx(slides,brand);Lab.download(Lab.filename(selected)+'_創業簡報.pptx',data,'application/vnd.openxmlformats-officedocument.presentationml.presentation');$('ppt-status').textContent='已送出PPTX下載。請到瀏覽器下載項目確認，並用PowerPoint開啟檢查字型、圖稿與版面。'}catch(err){$('ppt-status').textContent='產生失敗，請先下載逐頁TXT備份，再重新整理重試。'}});
$('save-script').addEventListener('click',()=>Lab.download(Lab.filename(selected)+'_逐頁內容.txt',slides.map((s,i)=>(i+1)+'. '+s.title+'\n\n'+s.body+'\n\n【講者備註】\n'+s.notes).join('\n\n────────\n\n'),'text/plain;charset=utf-8'));
$('copy-prompt').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('prompt').value);$('copy-status').textContent='提示詞已複製。請先上傳小組TXT，再貼上送出。'}catch{$('prompt').focus();$('prompt').select();$('copy-status').textContent='瀏覽器未允許自動複製，已選取提示詞；請按Ctrl+C或Mac的⌘C。'}});
$('download-prompt').addEventListener('click',()=>Lab.download('屏科大不分系_咖啡創業提示詞.txt',$('prompt').value,'text/plain;charset=utf-8'));
menu();
})();
