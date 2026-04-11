// ============ common.js - Shared Module for Multi-Page KY Management System ============

// ============ Debug Logging ============
const _dbgLog=[];
function dbg(msg){
  const ts=new Date().toLocaleTimeString('ja-JP');
  const line=`[${ts}] ${msg}`;
  _dbgLog.push(line);
  console.log('[KY-DBG]',msg);
  // Update debug panel if it exists
  const el=document.getElementById('_dbgPanel');
  if(el) el.textContent=_dbgLog.slice(-20).join('\n');
}
function showDebugPanel(){
  let el=document.getElementById('_dbgPanel');
  if(!el){
    el=document.createElement('pre');
    el.id='_dbgPanel';
    el.style.cssText='position:fixed;bottom:0;left:0;right:0;max-height:200px;overflow-y:auto;background:rgba(0,0,0,0.85);color:#0f0;font-size:11px;padding:8px;z-index:99999;font-family:monospace;white-space:pre-wrap;border-top:2px solid #0f0';
    document.body.appendChild(el);
  }
  el.textContent=_dbgLog.slice(-20).join('\n');
  el.style.display='block';
}
function hideDebugPanel(){
  const el=document.getElementById('_dbgPanel');
  if(el) el.style.display='none';
}

// ============ Master Data ============
const M={
  "単位":["式","m","m2","m3","基","個","箇所","枚","組","t","kg","km","g"],
  "重大性":["1","5","10","20"],
  "頻度":["1","5","10","20"],
  "危険要因":["路肩の崩壊","法面からの転落","足場からの転落","熱中症","歩行者と重機の接触","一般車両と重機の接触","重機に挟まれる","重機と作業者の接触","吊荷の落下","足場の倒壊","積荷の落下","一般車両との接触事故","機械に挟まれる","草刈り機での事故","河川内に転落","法面からの落石","クレーンの転倒","掘削中の法面崩壊","法面からの重機の転落","つまづき・転倒","交通事故","停止工事車両の暴走","上方からの工具の落下","高所作業者からの転落","吊荷との接触"],
  "安全対策":["合図者配置","整理整頓","安全帯着用","輪止の使用","水分補給・休息","合図確認","上下作業禁止","吊荷の下に立ち入らない","吊具の状態の確認","足元の確認","一般車両優先で作業する","荷締めを確実に行う","作業手順の確認","浮石の撤去","周囲の確認","アウトリガー養生","路肩の明示","作業半径内立入禁止","過積載禁止","工事車両徐行運転","急発進・急ブレーキ禁止","地山の点検","地盤・支点の確認","落下防止コードの使用","ガイドロープの使用","重機の足場の確認"],
  "作業者":["坂本","水野　博之","福島　利紀","福島　吏","塗木　一鑑","濱砂　幸治","日高　英司","西山　義光","横山　真実","塩畑　圭一郎","塩畑　紘文","交通誘導員B","交通誘導員A"]
};

// ============ 危険要因 → デフォルト値マッピング ============
let HAZARD_DEFAULTS = {
  "路肩の崩壊":           {sev:"10", freq:"5", measure:"地山の点検"},
  "法面からの転落":       {sev:"20", freq:"5", measure:"安全帯着用"},
  "足場からの転落":       {sev:"20", freq:"1", measure:"安全帯着用"},
  "熱中症":               {sev:"10", freq:"5", measure:"水分補給・休息"},
  "歩行者と重機の接触":   {sev:"20", freq:"5", measure:"合図者配置"},
  "一般車両と重機の接触": {sev:"20", freq:"5", measure:"合図者配置"},
  "重機に挟まれる":       {sev:"20", freq:"1", measure:"合図確認"},
  "重機と作業者の接触":   {sev:"20", freq:"5", measure:"作業半径内立入禁止"},
  "吊荷の落下":           {sev:"20", freq:"1", measure:"吊具の状態の確認"},
  "足場の倒壊":           {sev:"20", freq:"1", measure:"地盤・支点の確認"},
  "積荷の落下":           {sev:"10", freq:"5", measure:"荷締めを確実に行う"},
  "一般車両との接触事故": {sev:"20", freq:"1", measure:"一般車両優先で作業する"},
  "機械に挟まれる":       {sev:"20", freq:"1", measure:"合図確認"},
  "草刈り機での事故":     {sev:"10", freq:"5", measure:"周囲の確認"},
  "河川内に転落":         {sev:"20", freq:"5", measure:"路肩の明示"},
  "法面からの落石":       {sev:"20", freq:"5", measure:"浮石の撤去"},
  "クレーンの転倒":       {sev:"20", freq:"1", measure:"アウトリガー養生"},
  "掘削中の法面崩壊":     {sev:"20", freq:"5", measure:"地山の点検"},
  "法面からの重機の転落": {sev:"20", freq:"5", measure:"重機の足場の確認"},
  "つまづき・転倒":       {sev:"10", freq:"5", measure:"足元の確認"},
  "交通事故":             {sev:"20", freq:"5", measure:"工事車両徐行運転"},
  "停止工事車両の暴走":   {sev:"20", freq:"1", measure:"輪止の使用"},
  "上方からの工具の落下": {sev:"10", freq:"5", measure:"落下防止コードの使用"},
  "高所作業者からの転落": {sev:"20", freq:"5", measure:"安全帯着用"},
  "吊荷との接触":         {sev:"10", freq:"5", measure:"ガイドロープの使用"}
};

// ============ 安全目標の自動生成 ============
let GOAL_MAP={
  "合図者配置":"合図確認よし！",
  "整理整頓":"整理整頓よし！",
  "安全帯着用":"安全帯よし！",
  "輪止の使用":"輪止めよし！",
  "水分補給・休息":"水分補給よし！",
  "合図確認":"合図確認よし！",
  "上下作業禁止":"上下確認よし！",
  "吊荷の下に立ち入らない":"吊荷下確認よし！",
  "吊具の状態の確認":"吊具よし！",
  "足元の確認":"足元よし！",
  "一般車両優先で作業する":"交通確認よし！",
  "荷締めを確実に行う":"荷締め確認よし！",
  "作業手順の確認":"手順確認よし！",
  "浮石の撤去":"浮石確認よし！",
  "周囲の確認":"周囲確認よし！",
  "アウトリガー養生":"アウトリガーよし！",
  "路肩の明示":"路肩確認よし！",
  "作業半径内立入禁止":"立入禁止確認よし！",
  "過積載禁止":"積載確認よし！",
  "工事車両徐行運転":"徐行確認よし！",
  "急発進・急ブレーキ禁止":"安全運転よし！",
  "地山の点検":"地山確認よし！",
  "地盤・支点の確認":"地盤・支点よし！",
  "落下防止コードの使用":"落下防止コードよし！",
  "ガイドロープの使用":"ガイドロープよし！",
  "重機の足場の確認":"足場確認よし！"
};

// 初期値のディープコピー保持（「初期値に戻す」用）
const DEFAULT_HAZARDS=[...M["危険要因"]];
const DEFAULT_MEASURES=[...M["安全対策"]];
const DEFAULT_HAZARD_DEFAULTS=JSON.parse(JSON.stringify(HAZARD_DEFAULTS));
const DEFAULT_GOAL_MAP={...GOAL_MAP};

// ============ Utility Functions ============
function opts(list,sel){return '<option value="">--</option>'+list.map(v=>`<option value="${v}"${v===sel?' selected':''}>${v}</option>`).join('')}

function localDateStr(d){
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,'0');
  const day=String(d.getDate()).padStart(2,'0');
  return y+'-'+m+'-'+day;
}

function colLetter(c){let s='';while(c>0){c--;s=String.fromCharCode(65+(c%26))+s;c=Math.floor(c/26);}return s;}
function cRef(r,c){return colLetter(c)+r;}

function formatDateKey(k){
  if(!k||k.length!==8)return k;
  return k.slice(0,4)+'-'+k.slice(4,6)+'-'+k.slice(6,8);
}

function formatDateJP(dateStr){
  const d=new Date(dateStr+'T00:00:00');
  const dow=['日','月','火','水','木','金','土'][d.getDay()];
  return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}（${dow}）`;
}

function getDateKey(){
  const el=document.getElementById('workDate');
  if(!el)return '';
  const d=el.value;
  return d?d.replace(/-/g,''):'';
}
function getMonthKey(){
  const dk=getDateKey();
  return dk?dk.substring(0,6):'';
}

async function shiftDate(delta){
  // 現画面のデータを保存
  if(typeof autoSave==='function' && document.getElementById('workBlocks')) autoSave();
  if(typeof autoSaveNippo==='function' && document.getElementById('nippoWorkBlocks')) autoSaveNippo();
  const inp=document.getElementById('workDate');
  if(!inp) return;
  const d=inp.value?new Date(inp.value+'T00:00:00'):new Date();
  d.setDate(d.getDate()+delta);
  inp.value=localDateStr(d);
  if(typeof onDateChange==='function') await onDateChange();
}

// ============ データ保存・読込（フォルダ + 月次ファイル方式） ============
const STORAGE_PREFIX='KY_';
const CONFIG_FILE_NAME='config.json';
// 当月分データのインメモリキャッシュ
let allData={config:{},entries:{}};
let currentMonth=''; // 'YYYYMM'
let currentMonthFileId=null;
let dataFileSaveTm=null;

// ============ Google Drive API 連携 ============
const DRIVE_CLIENT_ID='284823490637-5i3bmm35ncug6k486gidq3obgnb8ca3s.apps.googleusercontent.com';
const DRIVE_SCOPES='https://www.googleapis.com/auth/drive.file';
let driveAccessToken=null;
let driveFileId=null;
let driveReady=false;
let gapiInited=false;
let gisInited=false;
let tokenClient=null;

// ============ Master / Project 状態 ============
const MASTER_FILE_NAME='KY_master.json';
let masterFileId=null;
let masterData={workers:[],workCategories:[],hazards:[],measures:[],hazardDefaults:{},goalMap:{},units:['式','m','m2','m3','基','個','箇所','枚','組','t','kg','km','g'],materials:[],materialSpecs:[]};
let projectList=[];
let currentProjectFileId=null;
let currentFolderId=null;

// GAPI (Google API client) 初期化
function initGapi(){
  return new Promise((resolve)=>{
    gapi.load('client',async()=>{
      await gapi.client.init({});
      await gapi.client.load('drive','v3');
      gapiInited=true;
      resolve();
    });
  });
}

// GIS (Google Identity Services) 初期化
function initGis(){
  tokenClient=google.accounts.oauth2.initTokenClient({
    client_id:DRIVE_CLIENT_ID,
    scope:DRIVE_SCOPES,
    callback:(resp)=>{
      if(resp.error)return;
      driveAccessToken=resp.access_token;
      if(gapiInited) gapi.client.setToken({access_token:driveAccessToken});
      driveReady=true;
      dbg('GIS callback: token received, calling onDriveConnected');
      onDriveConnected();
    }
  });
  gisInited=true;
}

// ログインボタン押下
function handleDriveLogin(){
  if(!gapiInited||!gisInited){
    showConfigStatus('⏳ Google API 読込中…少々お待ちください');
    setTimeout(handleDriveLogin,500);
    return;
  }
  tokenClient.requestAccessToken();
}

// Drive接続成功後の処理（ホームページ専用。サブページはconnectDriveBackground経由）
async function onDriveConnected(){
  dbg('onDriveConnected() start');
  const statusEl=document.getElementById('driveStatus');
  if(statusEl){
    statusEl.style.background='#ecfdf5';
    statusEl.style.borderColor='#059669';
    statusEl.style.color='#047857';
    statusEl.innerHTML='✅ Google ドライブに接続済み';
  }
  const btn=document.getElementById('btnDriveLogin');
  if(btn){btn.textContent='✅ 接続済み';btn.disabled=true;btn.style.opacity='0.6';}

  // Load master data from Drive
  await findOrCreateMasterFile();
  dbg('onDriveConnected: masterFileId='+masterFileId);
  await loadMasterData();
  dbg('onDriveConnected: masterData workers='+masterData.workers.length);
  refreshAllHazardSelects();
  refreshCreatorSelect();

  // List projects and populate selector
  const sel=document.getElementById('projectSelect');
  dbg('onDriveConnected: projectSelect element='+(sel?'found':'NOT FOUND'));
  if(sel){
    await refreshProjectList();
    dbg('onDriveConnected: projectList='+projectList.length+' items: '+projectList.map(p=>p.name).join(', '));
    if(projectList.length>0){
      const savedId=currentFolderId||currentProjectFileId;
      if(savedId&&projectList.some(p=>p.id===savedId)){
        sel.value=savedId;
        dbg('onDriveConnected: restored project '+savedId);
      }else{
        sel.value=projectList[0].id;
        dbg('onDriveConnected: selected first project '+projectList[0].id);
      }
      await onProjectSelect();
      dbg('onDriveConnected: after onProjectSelect, entries='+Object.keys(allData.entries).length);
    }else{
      dbg('onDriveConnected: no projects found');
      showConfigStatus('ℹ️ Google ドライブに接続しました。「＋ 新規工事」で工事を作成してください');
    }
  }else{
    dbg('onDriveConnected: NO projectSelect - sub-page login detected');
    // Sub-page login: load project using saved session state
    if(currentFolderId){
      dbg('onDriveConnected: sub-page - loading folder '+currentFolderId);
      await switchToFolder(currentFolderId);
    }else if(currentProjectFileId){
      dbg('onDriveConnected: sub-page - loading legacy '+currentProjectFileId);
      await switchToLegacy(currentProjectFileId);
    }
  }

  // Save session state for sub-pages
  saveSession();
  dbg('onDriveConnected: saveSession done. entries='+Object.keys(allData.entries).length);

  // Re-call onPageReady to refresh UI with loaded data
  // (on first login, onPageReady was already called with driveReady=false)
  if(typeof onPageReady==='function'){
    dbg('onDriveConnected: re-calling onPageReady() to refresh UI');
    onPageReady();
  }
  showDebugPanel();
}

// ============ Drive 低レベルヘルパー ============
async function readFromDriveById(fileId){
  if(!fileId||!driveAccessToken)return null;
  try{
    const resp=await fetch('https://www.googleapis.com/drive/v3/files/'+fileId+'?alt=media',{
      headers:{Authorization:'Bearer '+driveAccessToken}
    });
    if(!resp.ok)return null;
    return await resp.text();
  }catch(e){return null;}
}

async function writeToDriveById(fileId, content){
  if(!fileId||!driveAccessToken)return false;
  try{
    const resp=await fetch('https://www.googleapis.com/upload/drive/v3/files/'+fileId+'?uploadType=media',{
      method:'PATCH',
      headers:{Authorization:'Bearer '+driveAccessToken,'Content-Type':'application/json'},
      body:content
    });
    return resp.ok;
  }catch(e){return false;}
}

// フォルダ内のファイルを名前で検索
async function findFileInFolder(folderId, fileName){
  try{
    const resp=await gapi.client.drive.files.list({
      q:"'"+folderId+"' in parents and name='"+fileName+"' and trashed=false",
      fields:'files(id,name)',spaces:'drive'
    });
    const files=resp.result.files||[];
    return files.length>0?files[0].id:null;
  }catch(e){return null;}
}

// フォルダ内にファイルを作成
async function createFileInFolder(folderId, fileName, content){
  const metadata={name:fileName, parents:[folderId], mimeType:'application/json'};
  const form=new FormData();
  form.append('metadata',new Blob([JSON.stringify(metadata)],{type:'application/json'}));
  form.append('file',new Blob([content],{type:'application/json'}));
  const resp=await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',{
    method:'POST',headers:{Authorization:'Bearer '+driveAccessToken},body:form
  });
  const created=await resp.json();
  return created.id;
}

// レガシー互換ヘルパー
async function readFromDrive(){
  if(!driveFileId||!driveAccessToken)return null;
  return await readFromDriveById(driveFileId);
}
async function writeToDrive(content){
  if(!driveFileId||!driveAccessToken)return false;
  return await writeToDriveById(driveFileId,content);
}

// Master file operations
async function findOrCreateMasterFile(){
  // Skip search if masterFileId already restored from session
  if(masterFileId) return;
  try{
    const resp=await gapi.client.drive.files.list({
      q:"name='"+MASTER_FILE_NAME+"' and trashed=false",
      fields:'files(id,name)',
      spaces:'drive'
    });
    const files=resp.result.files||[];
    if(files.length>0){
      masterFileId=files[0].id;
      return;
    }
    // Create initial master with current M and HAZARD_DEFAULTS
    const initMaster={
      workers: M["作業者"].map(name=>({name,company:''})),
      workCategories:[],
      hazards: M["危険要因"],
      measures: M["安全対策"],
      hazardDefaults: HAZARD_DEFAULTS,
      goalMap: {...GOAL_MAP}
    };
    const metadata={name:MASTER_FILE_NAME,mimeType:'application/json'};
    const form=new FormData();
    form.append('metadata',new Blob([JSON.stringify(metadata)],{type:'application/json'}));
    form.append('file',new Blob([JSON.stringify(initMaster)],{type:'application/json'}));
    const createResp=await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',{
      method:'POST',
      headers:{Authorization:'Bearer '+driveAccessToken},
      body:form
    });
    const created=await createResp.json();
    masterFileId=created.id;
  }catch(e){
    showConfigStatus('❌ マスタファイル作成エラー: '+e.message);
  }
}

async function readMasterFromDrive(){
  return await readFromDriveById(masterFileId);
}

async function writeMasterToDrive(){
  return await writeToDriveById(masterFileId, JSON.stringify(masterData, null, 2));
}

async function loadMasterData(){
  const txt=await readMasterFromDrive();
  if(!txt)return;
  try{
    masterData=JSON.parse(txt);
    if(masterData.hazards&&masterData.hazards.length>0)M["危険要因"]=[...masterData.hazards];
    if(masterData.measures&&masterData.measures.length>0)M["安全対策"]=[...masterData.measures];
    if(masterData.hazardDefaults)HAZARD_DEFAULTS={...masterData.hazardDefaults};
    if(masterData.goalMap)GOAL_MAP={...masterData.goalMap};
    if(!masterData.workers)masterData.workers=[];
    if(!masterData.workCategories)masterData.workCategories=[];
    // 旧形式 workItems がある場合は workCategories に移行
    if(masterData.workItems&&masterData.workItems.length>0&&(!masterData.workCategories||masterData.workCategories.length===0)){
      masterData.workCategories=[{category:'その他',items:masterData.workItems}];
      delete masterData.workItems;
    }
  }catch(e){
    showConfigStatus('❌ マスタデータ解析エラー: '+e.message);
  }
}

async function saveMasterData(){
  await writeMasterToDrive();
}

// Drive接続済みかどうか
function isDriveConnected(){
  return !!(driveAccessToken && (currentFolderId || driveFileId));
}

// ============ プロジェクト管理（フォルダ方式 + レガシー互換） ============
async function listProjectFiles(){
  try{
    const folderResp=await gapi.client.drive.files.list({
      q:"name contains 'KY_' and mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields:'files(id,name)',spaces:'drive',pageSize:100
    });
    const folders=folderResp.result.files||[];
    const legacyResp=await gapi.client.drive.files.list({
      q:"(name contains 'KY_' or name='KY_data.json') and mimeType='application/json' and trashed=false",
      fields:'files(id,name)',spaces:'drive',pageSize:100
    });
    const legacyFiles=legacyResp.result.files||[];
    const result=[];
    folders.forEach(f=>{
      let projName=f.name;
      if(projName.startsWith('KY_'))projName=projName.substring(3);
      result.push({name:projName, id:f.id, type:'folder'});
    });
    legacyFiles.forEach(f=>{
      if(f.name===MASTER_FILE_NAME)return;
      let projName=f.name;
      if(projName==='KY_data.json'){projName='（旧データ）';}
      else{
        if(projName.startsWith('KY_'))projName=projName.substring(3);
        if(projName.endsWith('.json'))projName=projName.substring(0,projName.length-5);
      }
      if(/^\d{6}$/.test(projName))return;
      if(result.some(r=>r.name===projName))return;
      result.push({name:projName+'（旧形式）', id:f.id, type:'legacy'});
    });
    return result;
  }catch(e){return[];}
}

async function refreshProjectList(){
  projectList=await listProjectFiles();
  const sel=document.getElementById('projectSelect');
  if(sel){
    sel.innerHTML='<option value="">-- 工事を選択 --</option>';
    projectList.forEach(p=>{
      sel.innerHTML+=`<option value="${p.id}">${p.name}</option>`;
    });
    const curId=currentFolderId||currentProjectFileId;
    if(curId){sel.value=curId;}
  }
  // Save projectList to sessionStorage for other pages
  try{
    sessionStorage.setItem('projectList', JSON.stringify(projectList));
  }catch(e){}
}

async function onProjectSelect(){
  const sel=document.getElementById('projectSelect');
  const id=sel.value;
  if(!id)return;
  const proj=projectList.find(p=>p.id===id);
  if(!proj)return;
  if(proj.type==='folder'){
    await switchToFolder(proj.id);
  }else{
    await switchToLegacy(proj.id);
  }
}

async function switchToFolder(folderId){
  dbg(`switchToFolder(${folderId})`);
  if(driveReady&&(currentFolderId||currentProjectFileId)){
    if(typeof autoSave==='function') autoSave();
    await saveCurrentMonth(true);
  }
  currentFolderId=folderId;
  currentProjectFileId=null;
  driveFileId=null;
  const configId=await findFileInFolder(folderId, CONFIG_FILE_NAME);
  dbg(`switchToFolder: config.json => ${configId}`);
  if(configId){
    const txt=await readFromDriveById(configId);
    if(txt){try{allData.config=JSON.parse(txt);dbg('switchToFolder: config loaded, projectName='+allData.config.projectName);}catch(e){allData.config={};}}
  }
  const pnEl=document.getElementById('projectName');
  if(pnEl) pnEl.textContent=allData.config.projectName||'';
  const creatorEl=document.getElementById('creator');
  if(creatorEl&&allData.config.creator){creatorEl.value=allData.config.creator;}
  const mk=getMonthKey();
  currentMonth=mk||currentMonth||localDateStr(new Date()).replace(/-/g,'').substring(0,6);
  dbg(`switchToFolder: monthKey=${mk}, currentMonth=${currentMonth}`);
  await loadMonthData(currentMonth);
  dbg(`switchToFolder: after loadMonthData, entries=${Object.keys(allData.entries).length}`);
  if(typeof applyCurrentDateData==='function') applyCurrentDateData();
  driveReady=true;
  showConfigStatus('📂 工事「'+(allData.config.projectName||'')+'」を読込みました');
}

async function switchToLegacy(fileId){
  if(driveReady&&(currentFolderId||currentProjectFileId)){
    if(typeof autoSave==='function') autoSave();
    await saveCurrentMonth(true);
  }
  currentFolderId=null;
  currentProjectFileId=fileId;
  driveFileId=fileId;
  currentMonth='';
  currentMonthFileId=null;
  const txt=await readFromDriveById(fileId);
  if(txt){
    try{
      let cleaned=txt.replace(/[\u0000\s]+$/,'');
      const lastBrace=cleaned.lastIndexOf('}');
      if(lastBrace>=0)cleaned=cleaned.substring(0,lastBrace+1);
      const parsed=JSON.parse(cleaned);
      allData={config:parsed.config||{},entries:parsed.entries||{}};
    }catch(e){allData={config:{},entries:{}};}
  }
  const pnEl=document.getElementById('projectName');
  if(pnEl) pnEl.textContent=allData.config.projectName||'';
  const creatorEl=document.getElementById('creator');
  if(creatorEl&&allData.config.creator){creatorEl.value=allData.config.creator;}
  if(typeof applyCurrentDateData==='function') applyCurrentDateData();
  driveReady=true;
  showConfigStatus('📂 工事「'+(allData.config.projectName||'')+'」を読込みました（旧形式）');
}

async function loadMonthData(month){
  dbg(`loadMonthData(${month}) start, folderId=${currentFolderId}`);
  allData.entries={};
  currentMonthFileId=null;
  if(!currentFolderId||!month){dbg('loadMonthData: skip (no folderId or month)');return;}
  const fileName=month+'.json';
  const fileId=await findFileInFolder(currentFolderId, fileName);
  dbg(`loadMonthData: findFileInFolder('${fileName}') => ${fileId}`);
  if(fileId){
    currentMonthFileId=fileId;
    const txt=await readFromDriveById(fileId);
    dbg(`loadMonthData: readFromDrive => ${txt?txt.length+' chars':'null'}`);
    if(txt){try{const parsed=JSON.parse(txt);allData.entries=parsed.entries||parsed||{};dbg(`loadMonthData: parsed ${Object.keys(allData.entries).length} entries`);}catch(e){allData.entries={};dbg('loadMonthData: JSON parse error: '+e.message);}}
  }else{dbg('loadMonthData: file not found');}
}

async function switchMonth(newMonth){
  if(!currentFolderId)return;
  await saveCurrentMonth(true);
  currentMonth=newMonth;
  await loadMonthData(newMonth);
}

async function saveCurrentMonth(silent){
  try{
    if(currentFolderId){
      if(!currentMonth)return false;
      const jsonStr=JSON.stringify({entries:allData.entries},null,2);
      if(currentMonthFileId){
        const ok=await writeToDriveById(currentMonthFileId, jsonStr);
        if(!silent&&ok){const cnt=Object.keys(allData.entries).length;showConfigStatus('✅ Google ドライブに保存 ('+currentMonth+' / '+cnt+'日分)');}
        if(!silent&&!ok)showConfigStatus('❌ 保存失敗');
        return ok;
      }else{
        const fileName=currentMonth+'.json';
        currentMonthFileId=await createFileInFolder(currentFolderId, fileName, jsonStr);
        if(!silent){const cnt=Object.keys(allData.entries).length;showConfigStatus('✅ Google ドライブに保存 ('+currentMonth+' / '+cnt+'日分)');}
        return true;
      }
    }
    if(currentProjectFileId){
      const jsonStr=JSON.stringify(allData,null,2);
      driveFileId=currentProjectFileId;
      const ok=await writeToDrive(jsonStr);
      if(!silent&&ok){const cnt=Object.keys(allData.entries).length;showConfigStatus('✅ Google ドライブに保存 ('+cnt+'日分)');}
      return ok;
    }
    return false;
  }catch(e){if(!silent)showConfigStatus('❌ 保存失敗: '+e.message);return false;}
}

async function saveProjectConfig(){
  if(!currentFolderId||!driveAccessToken)return;
  const configId=await findFileInFolder(currentFolderId, CONFIG_FILE_NAME);
  const configStr=JSON.stringify(allData.config,null,2);
  if(configId){await writeToDriveById(configId, configStr);}
  else{await createFileInFolder(currentFolderId, CONFIG_FILE_NAME, configStr);}
}

async function createNewProject(){
  if(!driveAccessToken){alert('先にGoogleドライブにログインしてください');return;}
  const name=prompt('新規工事名を入力してください');
  if(!name||!name.trim())return;
  const trimmed=name.trim();
  if(driveReady&&(currentFolderId||currentProjectFileId)){
    if(typeof autoSave==='function') autoSave();
    await saveCurrentMonth(true);
  }
  const folderName='KY_'+trimmed;
  const createResp=await gapi.client.drive.files.create({
    resource:{name:folderName, mimeType:'application/vnd.google-apps.folder'},fields:'id'
  });
  const folderId=createResp.result.id;
  const config={projectName:trimmed,creator:''};
  await createFileInFolder(folderId, CONFIG_FILE_NAME, JSON.stringify(config,null,2));
  currentFolderId=folderId;
  currentProjectFileId=null;
  driveFileId=null;
  allData={config:config,entries:{}};
  currentMonth=getMonthKey()||localDateStr(new Date()).replace(/-/g,'').substring(0,6);
  currentMonthFileId=null;
  await refreshProjectList();
  const sel=document.getElementById('projectSelect');
  if(sel) sel.value=folderId;
  const pnEl=document.getElementById('projectName');
  if(pnEl) pnEl.textContent=trimmed;
  driveReady=true;
  showConfigStatus('🆕 新規工事「'+trimmed+'」を作成しました');
}

async function deleteCurrentProject(){
  const id=currentFolderId||currentProjectFileId;
  if(!id){alert('削除する工事が選択されていません');return;}
  const name=allData.config?.projectName||'';
  if(!confirm('工事「'+name+'」を削除しますか？\nこの操作は取り消せません。'))return;
  if(!confirm('本当に削除してよろしいですか？（最終確認）'))return;
  await gapi.client.drive.files.update({fileId:id,resource:{trashed:true}});
  currentFolderId=null;currentProjectFileId=null;driveFileId=null;
  currentMonth='';currentMonthFileId=null;
  allData={config:{},entries:{}};
  await refreshProjectList();
  const pnEl=document.getElementById('projectName');
  if(pnEl) pnEl.textContent='';
  driveReady=false;
  showConfigStatus('🗑 工事「'+name+'」を削除しました');
}

// 自動保存
function autoSave(){
  if(!driveReady)return;
  const key=getDateKey();
  if(!key)return;
  try{
    const data=typeof collectFormData==='function'?collectFormData():{};
    // 既存の日報データを保持
    const existingNippo=(allData.entries[key]&&allData.entries[key].nippo)||null;
    const pnEl=document.getElementById('projectName');
    const creatorEl=document.getElementById('creator');
    allData.config={
      ...(allData.config||{}),
      projectName:pnEl?pnEl.textContent:'',
      creator:creatorEl?creatorEl.value:''
    };
    allData.entries[key]=data;
    if(existingNippo) allData.entries[key].nippo=existingNippo;
    scheduleDataFileSave();
  }catch(e){}
}

function scheduleDataFileSave(){
  if(!isDriveConnected())return;
  clearTimeout(dataFileSaveTm);
  dataFileSaveTm=setTimeout(()=>{saveCurrentMonth(true);if(currentFolderId)saveProjectConfig();},2000);
}

// 互換用エイリアス
async function saveAllToDataFile(silent){return await saveCurrentMonth(silent);}
async function loadAllFromDataFile(){
  if(currentFolderId){
    await loadMonthData(currentMonth);
    return Object.keys(allData.entries).length>0;
  }
  if(!driveFileId)return false;
  const txt=await readFromDrive();
  if(!txt)return false;
  try{
    let cleaned=txt.replace(/[\u0000\s]+$/,'');
    const lb=cleaned.lastIndexOf('}');
    if(lb>=0)cleaned=cleaned.substring(0,lb+1);
    const parsed=JSON.parse(cleaned);
    if(parsed&&typeof parsed==='object'&&parsed.entries){
      allData={config:parsed.config||{},entries:parsed.entries||{}};
      return true;
    }
  }catch(e){}
  return false;
}

// バックアップダウンロード
async function downloadAll(){
  if(typeof autoSave==='function') autoSave();
  const pn=allData.config?.projectName||'KY活動';
  if(currentFolderId){
    const all={config:allData.config,month:currentMonth,entries:allData.entries};
    const jsonStr=JSON.stringify(all,null,2);
    const cnt=Object.keys(allData.entries).length;
    const blob=new Blob([jsonStr],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);
    a.download=pn+'_'+currentMonth+'.json';
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    showConfigStatus('✅ '+pn+'_'+currentMonth+'.json を書き出しました ('+cnt+'日分)');
  }else{
    const all={config:{...(allData.config||{})},entries:{...(allData.entries||{})}};
    const jsonStr=JSON.stringify(all,null,2);
    const cnt=Object.keys(all.entries).length;
    const blob=new Blob([jsonStr],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);
    a.download=pn+'.json';
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    showConfigStatus('✅ '+pn+'.json を書き出しました ('+cnt+'日分)');
  }
}

// 1つのJSONファイルから全データを読込
function loadDataFile(ev){
  const file=ev.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=function(e){
    try{
      const all=JSON.parse(e.target.result);
      // 統合ファイル形式（config+entries）か判定
      if(all.entries&&typeof all.entries==='object'){
        allData={
          config:all.config||{},
          entries:all.entries||{}
        };
        const pnEl=document.getElementById('projectName');
        if(pnEl&&allData.config.projectName)pnEl.textContent=allData.config.projectName;
        const sel=document.getElementById('creator');
        if(sel&&allData.config.creator){
          for(let o of sel.options){if(o.value===allData.config.creator){sel.value=allData.config.creator;break;}}
        }
        // Drive連携済みならデータにも反映
        if(isDriveConnected())scheduleDataFileSave();
        // 今日のデータがあれば表示、なければ最新日付を表示
        const todayKey=getDateKey();
        const keys=Object.keys(allData.entries).sort().reverse();
        if(allData.entries[todayKey]){
          if(typeof restoreFormData==='function') restoreFormData(allData.entries[todayKey]);
        }else if(keys.length>0){
          const latest=keys[0];
          const ds=latest.slice(0,4)+'-'+latest.slice(4,6)+'-'+latest.slice(6,8);
          const workDateEl=document.getElementById('workDate');
          if(workDateEl) workDateEl.value=ds;
          if(typeof restoreFormData==='function') restoreFormData(allData.entries[latest]);
        }
        const cnt=Object.keys(allData.entries).length;
        showConfigStatus('✅ ファイルから読み込みました ('+cnt+'日分)');
      }else{
        // 旧形式（単日データ）の互換対応
        if(typeof restoreFormData==='function') restoreFormData(all);
        showConfigStatus('✅ ファイルから読み込みました');
      }
    }catch(err){showConfigStatus('❌ 読み込み失敗: '+err.message);}
  };
  reader.readAsText(file);
  ev.target.value='';
}

// ============ Master Editor Functions ============
let masterEditorListenersAttached=false;
function openMasterEditor(){
  if(typeof populateWorkerTable==='function') populateWorkerTable();
  if(typeof populateWorkItemList==='function') populateWorkItemList();
  if(typeof populateHazardTable==='function') populateHazardTable();
  if(typeof populateMeasureTable==='function') populateMeasureTable();
  if(typeof showMasterTab==='function') showMasterTab('worker');
  const mel=document.getElementById('masterModal');
  if(mel) mel.classList.add('active');
  // 初回のみ委譲イベントを付与（input/change を受けて自動保存）
  if(!masterEditorListenersAttached){
    const hTb=document.getElementById('hazardTbody');
    const mTb=document.getElementById('measureTbody');
    const wTb=document.getElementById('workerTbody');
    const wiList=document.getElementById('workItemList');
    if(hTb||mTb||wTb||wiList){
      ['input','change'].forEach(ev=>{
        if(hTb) hTb.addEventListener(ev,scheduleMasterAutoSave);
        if(mTb) mTb.addEventListener(ev,scheduleMasterAutoSave);
        if(wTb) wTb.addEventListener(ev,scheduleMasterAutoSave);
        if(wiList) wiList.addEventListener(ev,scheduleMasterAutoSave);
      });
      masterEditorListenersAttached=true;
    }
  }
  const ind=document.getElementById('masterAutoIndicator');
  if(ind){ind.textContent='編集内容は自動保存されます';ind.style.color='#6b7280';}
}
function closeMasterEditor(){
  const mel=document.getElementById('masterModal');
  if(mel) mel.classList.remove('active');
}
function showMasterTab(tab){
  ['worker','workitem','hazard','measure'].forEach(t=>{
    const pane=document.getElementById('mpane_'+t);
    const tabEl=document.getElementById('mtab_'+t);
    if(pane) pane.style.display=(t===tab)?'block':'none';
    if(tabEl) tabEl.style.background=(t===tab)?'#1a56db':'#6b7280';
  });
}

function buildMeasureOptionsHtml(selVal){
  let html='<option value="">--</option>';
  M["安全対策"].forEach(m=>{
    html+=`<option value="${m}"${m===selVal?' selected':''}>${m}</option>`;
  });
  return html;
}

function populateHazardTable(){
  const tb=document.getElementById('hazardTbody');
  if(!tb)return;
  tb.innerHTML='';
  M["危険要因"].forEach(name=>{
    const def=HAZARD_DEFAULTS[name]||{sev:'',freq:'',measure:''};
    addHazardMasterRow(name,def.sev,def.freq,def.measure);
  });
}

function addHazardMasterRow(name='',sev='',freq='',measure=''){
  const tb=document.getElementById('hazardTbody');
  if(!tb)return;
  const tr=document.createElement('tr');
  const sevOpts=['','1','5','10','20'].map(v=>`<option value="${v}"${v===sev?' selected':''}>${v||'--'}</option>`).join('');
  const freqOpts=['','1','5','10','20'].map(v=>`<option value="${v}"${v===freq?' selected':''}>${v||'--'}</option>`).join('');
  tr.innerHTML=`
    <td style="padding:4px;border:1px solid #d1d5db"><input type="text" class="hmaster-name" value="${(name||'').replace(/"/g,'&quot;')}" style="width:100%;border:1px solid #d1d5db;padding:4px;border-radius:4px;font-size:12px"></td>
    <td style="padding:4px;border:1px solid #d1d5db"><select class="hmaster-sev" style="width:100%;padding:4px;font-size:12px">${sevOpts}</select></td>
    <td style="padding:4px;border:1px solid #d1d5db"><select class="hmaster-freq" style="width:100%;padding:4px;font-size:12px">${freqOpts}</select></td>
    <td style="padding:4px;border:1px solid #d1d5db"><select class="hmaster-measure" style="width:100%;padding:4px;font-size:12px">${buildMeasureOptionsHtml(measure)}</select></td>
    <td style="padding:4px;border:1px solid #d1d5db;text-align:center"><button class="btn btn-del" onclick="this.closest('tr').remove();scheduleMasterAutoSave();">×</button></td>`;
  tb.appendChild(tr);
  if(arguments.length===0)scheduleMasterAutoSave();
}

function populateMeasureTable(){
  const tb=document.getElementById('measureTbody');
  if(!tb)return;
  tb.innerHTML='';
  M["安全対策"].forEach(name=>{
    addMeasureMasterRow(name,GOAL_MAP[name]||'');
  });
}

function addMeasureMasterRow(name='',goal=''){
  const tb=document.getElementById('measureTbody');
  if(!tb)return;
  const tr=document.createElement('tr');
  tr.innerHTML=`
    <td style="padding:4px;border:1px solid #d1d5db"><input type="text" class="mmaster-name" value="${(name||'').replace(/"/g,'&quot;')}" style="width:100%;border:1px solid #d1d5db;padding:4px;border-radius:4px;font-size:12px"></td>
    <td style="padding:4px;border:1px solid #d1d5db"><input type="text" class="mmaster-goal" value="${(goal||'').replace(/"/g,'&quot;')}" style="width:100%;border:1px solid #d1d5db;padding:4px;border-radius:4px;font-size:12px"></td>
    <td style="padding:4px;border:1px solid #d1d5db;text-align:center"><button class="btn btn-del" onclick="this.closest('tr').remove();scheduleMasterAutoSave();">×</button></td>`;
  tb.appendChild(tr);
  if(arguments.length===0)scheduleMasterAutoSave();
}

function populateWorkerTable(){
  const tb=document.getElementById('workerTbody');
  if(!tb)return;
  tb.innerHTML='';
  masterData.workers.forEach(w=>addWorkerMasterRow(w.name,w.company));
}

function addWorkerMasterRow(name='',company=''){
  const tb=document.getElementById('workerTbody');
  if(!tb)return;
  const tr=document.createElement('tr');
  tr.innerHTML=`
    <td style="padding:4px;border:1px solid #d1d5db"><input type="text" class="wmaster-name" value="${(name||'').replace(/"/g,'&quot;')}" style="width:100%;border:1px solid #d1d5db;padding:4px;border-radius:4px;font-size:12px" placeholder="名前"></td>
    <td style="padding:4px;border:1px solid #d1d5db"><input type="text" class="wmaster-company" value="${(company||'').replace(/"/g,'&quot;')}" style="width:100%;border:1px solid #d1d5db;padding:4px;border-radius:4px;font-size:12px" placeholder="所属会社"></td>
    <td style="padding:4px;border:1px solid #d1d5db;text-align:center"><button class="btn btn-del" onclick="this.closest('tr').remove();scheduleMasterAutoSave();">×</button></td>`;
  tb.appendChild(tr);
  if(arguments.length===0)scheduleMasterAutoSave();
}

function populateWorkItemList(){
  const container=document.getElementById('workItemList');
  if(!container)return;
  container.innerHTML='';
  (masterData.workCategories||[]).forEach(cat=>addCategoryMasterBlock(cat.category,cat.items||[]));
}

function addCategoryMasterBlock(category='',items=[]){
  const container=document.getElementById('workItemList');
  if(!container)return;
  const catDiv=document.createElement('div');
  catDiv.className='wcat-block';
  catDiv.style.cssText='border:2px solid #1a56db;border-radius:10px;padding:10px;margin-bottom:12px;background:#f8fafc';
  catDiv.innerHTML=`
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
      <span style="font-weight:700;color:#1a56db;font-size:13px">工種:</span>
      <input type="text" class="wcat-name" value="${(category||'').replace(/"/g,'&quot;')}" style="flex:1;border:2px solid #1a56db;padding:5px 8px;border-radius:5px;font-size:13px;font-weight:600" placeholder="例: 土工">
      <button class="btn btn-del" onclick="this.closest('.wcat-block').remove();scheduleMasterAutoSave();">工種を削除</button>
    </div>
    <div class="wcat-items"></div>
    <button class="btn btn-add-sm" style="margin-top:6px;background:#1a56db" onclick="addWorkItemInCategory(this.previousElementSibling)">＋ 作業を追加</button>`;
  container.appendChild(catDiv);
  const itemsDiv=catDiv.querySelector('.wcat-items');
  items.forEach(wi=>addWorkItemInCategory(itemsDiv,wi.name,wi.hazards||[]));
  if(items.length===0)addWorkItemInCategory(itemsDiv);
}

function addWorkItemInCategory(container,name='',hazards=[]){
  if(container.tagName==='BUTTON')container=container.previousElementSibling;
  const block=document.createElement('div');
  block.className='work-block';
  block.style.cssText='margin-bottom:8px;padding:8px;background:#fff';
  if(hazards.length===0)hazards=[{}];
  block.innerHTML=`
    <div class="work-header" style="margin-bottom:4px">
      <div class="fg f2"><label>作業名</label><input type="text" class="witem-name" value="${(name||'').replace(/"/g,'&quot;')}" style="width:100%;border:1px solid #d1d5db;padding:4px;border-radius:4px;font-size:12px" placeholder="例: 掘削工"></div>
      <button class="btn btn-del" onclick="this.closest('.work-block').remove();scheduleMasterAutoSave();">作業を削除</button>
    </div>
    <div class="witem-hz-list"></div>
    <button class="btn btn-add-sm" style="margin-top:4px" onclick="addWorkItemHazardRow(this.previousElementSibling)">＋ 危険要因を追加</button>`;
  container.appendChild(block);
  const hzList=block.querySelector('.witem-hz-list');
  hazards.forEach(h=>addWorkItemHazardRow(hzList,h.hazard,h.severity,h.frequency,h.measure));
}

function addWorkItemHazardRow(list,hazard='',sev='',freq='',measure=''){
  if(list.tagName==='BUTTON')list=list.previousElementSibling;
  const row=document.createElement('div');
  row.className='hazard-row';
  row.style.marginTop='4px';
  const sevOpts=['','1','5','10','20'].map(v=>`<option value="${v}"${v===sev?' selected':''}>${v||'--'}</option>`).join('');
  const freqOpts=['','1','5','10','20'].map(v=>`<option value="${v}"${v===freq?' selected':''}>${v||'--'}</option>`).join('');
  row.innerHTML=`
    <div class="form-row" style="gap:4px;margin:0">
      <div class="fg f2"><select class="witem-hz-hazard" style="width:100%;padding:3px;font-size:11px">${opts(M["危険要因"],hazard)}</select></div>
      <div class="fg w70"><select class="witem-hz-sev" style="width:100%;padding:3px;font-size:11px">${sevOpts}</select></div>
      <div class="fg w70"><select class="witem-hz-freq" style="width:100%;padding:3px;font-size:11px">${freqOpts}</select></div>
      <div class="fg f2"><select class="witem-hz-measure" style="width:100%;padding:3px;font-size:11px">${opts(M["安全対策"],measure)}</select></div>
      <button class="btn btn-del" onclick="this.closest('.hazard-row').remove();scheduleMasterAutoSave();">×</button>
    </div>`;
  list.appendChild(row);
  if(arguments.length<=1)scheduleMasterAutoSave();
}

function resetMasterDefaults(){
  if(!confirm('マスタデータを初期値に戻しますか？（保存するまで反映されません）'))return;
  M["危険要因"]=[...DEFAULT_HAZARDS];
  M["安全対策"]=[...DEFAULT_MEASURES];
  HAZARD_DEFAULTS=JSON.parse(JSON.stringify(DEFAULT_HAZARD_DEFAULTS));
  GOAL_MAP={...DEFAULT_GOAL_MAP};
  if(typeof populateHazardTable==='function') populateHazardTable();
  if(typeof populateMeasureTable==='function') populateMeasureTable();
}

// テーブルを読み取って適用する内部関数（silent=true: alert抑制して成否のみ返す）
function applyMasterEditorChanges(silent){
  // 1) 安全対策テーブル
  const newMeasures=[];
  const newGoalMap={};
  const mTrs=document.querySelectorAll('#measureTbody tr');
  for(const tr of mTrs){
    const name=tr.querySelector('.mmaster-name').value.trim();
    const goal=tr.querySelector('.mmaster-goal').value.trim();
    if(!name)continue;
    if(newMeasures.includes(name)){
      if(!silent)alert('安全対策名が重複しています: '+name);
      return false;
    }
    newMeasures.push(name);
    if(goal)newGoalMap[name]=goal;
  }
  if(newMeasures.length===0){
    if(!silent)alert('安全対策を1つ以上登録してください');
    return false;
  }

  // 2) 危険要因テーブル
  const newHazards=[];
  const newHazardDefaults={};
  const hTrs=document.querySelectorAll('#hazardTbody tr');
  for(const tr of hTrs){
    const name=tr.querySelector('.hmaster-name').value.trim();
    const sev=tr.querySelector('.hmaster-sev').value;
    const freq=tr.querySelector('.hmaster-freq').value;
    const measure=tr.querySelector('.hmaster-measure').value;
    if(!name)continue;
    if(newHazards.includes(name)){
      if(!silent)alert('危険要因名が重複しています: '+name);
      return false;
    }
    if(measure&&!newMeasures.includes(measure)){
      // silent時は黙ってmeasureをクリア、明示時はエラー
      if(silent){
        newHazards.push(name);
        if(sev||freq)newHazardDefaults[name]={sev,freq,measure:''};
        continue;
      }
      alert('危険要因「'+name+'」のデフォルト安全対策「'+measure+'」が安全対策リストに存在しません');
      return false;
    }
    newHazards.push(name);
    if(sev||freq||measure){
      newHazardDefaults[name]={sev,freq,measure};
    }
  }
  if(newHazards.length===0){
    if(!silent)alert('危険要因を1つ以上登録してください');
    return false;
  }

  // 3) Collect workers
  const newWorkers=[];
  document.querySelectorAll('#workerTbody tr').forEach(tr=>{
    const name=tr.querySelector('.wmaster-name').value.trim();
    const company=tr.querySelector('.wmaster-company').value.trim();
    if(name)newWorkers.push({name,company});
  });
  masterData.workers=newWorkers;

  // 4) Collect work categories (工種→作業の2階層)
  const newCategories=[];
  document.querySelectorAll('#workItemList .wcat-block').forEach(catBlock=>{
    const catName=catBlock.querySelector('.wcat-name').value.trim();
    if(!catName)return;
    const items=[];
    catBlock.querySelectorAll('.work-block').forEach(block=>{
      const name=block.querySelector('.witem-name').value.trim();
      if(!name)return;
      const hazards=[];
      block.querySelectorAll('.hazard-row').forEach(row=>{
        const h=row.querySelector('.witem-hz-hazard').value;
        const s=row.querySelector('.witem-hz-sev').value;
        const f=row.querySelector('.witem-hz-freq').value;
        const m=row.querySelector('.witem-hz-measure').value;
        if(h)hazards.push({hazard:h,severity:s,frequency:f,measure:m});
      });
      items.push({name,hazards});
    });
    newCategories.push({category:catName,items});
  });
  masterData.workCategories=newCategories;

  // 5) グローバル置換
  M["危険要因"]=newHazards;
  M["安全対策"]=newMeasures;
  HAZARD_DEFAULTS=newHazardDefaults;
  GOAL_MAP=newGoalMap;

  // 6) masterDataに追加
  masterData.hazards=newHazards;
  masterData.measures=newMeasures;
  masterData.hazardDefaults=newHazardDefaults;
  masterData.goalMap=newGoalMap;

  // 7) Save master to Drive
  if(isDriveConnected()&&masterFileId){
    writeMasterToDrive();
  }

  // 8) 画面上の既存selectをリビルド
  refreshAllHazardSelects();
  refreshCreatorSelect();

  // 9) 編集モーダル内の安全対策プルダウン（危険要因行側）も再構築
  document.querySelectorAll('#hazardTbody tr').forEach(tr=>{
    const sel=tr.querySelector('.hmaster-measure');
    if(sel){
      const cur=sel.value;
      sel.innerHTML=buildMeasureOptionsHtml(cur);
    }
  });

  // 10) 自動保存
  if(typeof autoSave==='function') autoSave();
  return true;
}

// 明示保存ボタン: 結果を表示して閉じる
function saveMasterEditor(){
  if(applyMasterEditorChanges(false)){
    closeMasterEditor();
    showConfigStatus('✅ マスタデータを保存・反映しました');
  }
}

// 編集操作のたびに自動保存（debounce）
let masterAutoSaveTm=null;
function scheduleMasterAutoSave(){
  clearTimeout(masterAutoSaveTm);
  masterAutoSaveTm=setTimeout(()=>{
    if(applyMasterEditorChanges(true)){
      const ind=document.getElementById('masterAutoIndicator');
      if(ind){
        ind.textContent='✅ 自動保存済み '+new Date().toLocaleTimeString();
        ind.style.color='#059669';
      }
    }
  },800);
}

function refreshAllHazardSelects(){
  // 危険要因select
  document.querySelectorAll('.hz-hazard').forEach(sel=>{
    const cur=sel.value;
    sel.innerHTML=opts(M["危険要因"],cur);
  });
  // 安全対策select
  document.querySelectorAll('.hz-measure').forEach(sel=>{
    const cur=sel.value;
    sel.innerHTML=opts(M["安全対策"],cur);
  });
}

// allData.configに保存されたマスタ上書きを起動時に適用
function applyMasterOverrides(){
  if(!allData.config)return;
  if(Array.isArray(allData.config.hazards)&&allData.config.hazards.length>0){
    M["危険要因"]=[...allData.config.hazards];
  }
  if(Array.isArray(allData.config.measures)&&allData.config.measures.length>0){
    M["安全対策"]=[...allData.config.measures];
  }
  if(allData.config.hazardDefaults&&typeof allData.config.hazardDefaults==='object'){
    HAZARD_DEFAULTS={...allData.config.hazardDefaults};
  }
  if(allData.config.goalMap&&typeof allData.config.goalMap==='object'){
    GOAL_MAP={...allData.config.goalMap};
  }
}

// 作成者管理
function refreshCreatorSelect(){
  const sel=document.getElementById('creator');
  if(!sel)return;
  const cur=sel.value;
  let html='<option value="">--</option>';
  masterData.workers.forEach(w=>{
    html+=`<option value="${w.name}"${w.name===cur?' selected':''}>${w.name}</option>`;
  });
  sel.innerHTML=html;
}

function mergeCustomCreators(){
  const list=allData.config&&allData.config.customCreators;
  if(!list||!Array.isArray(list))return;
  list.forEach(name=>{
    if(name&&!M["作業者"].includes(name))M["作業者"].unshift(name);
  });
}

// 同期バナー更新
function updateSyncBanner(){
  // Drive版ではsyncBannerは使わない（driveStatusで代替）
}

// マスタ Excel ダウンロード / アップロード
function downloadMasterExcel(){
  try{
    const wb=XLSX.utils.book_new();

    // シート1: 従事者
    const wData=[['名前','所属会社']];
    (masterData.workers||[]).forEach(w=>wData.push([w.name,w.company||'']));
    const ws1=XLSX.utils.aoa_to_sheet(wData);
    ws1['!cols']=[{wch:20},{wch:25}];
    XLSX.utils.book_append_sheet(wb,ws1,'従事者');

    // シート2: 作業マスタ（工種→作業→危険要因を展開）
    const wiData=[['工種','作業名','危険要因','重大性','頻度','安全対策']];
    (masterData.workCategories||[]).forEach(cat=>{
      (cat.items||[]).forEach(wi=>{
        if(wi.hazards&&wi.hazards.length>0){
          wi.hazards.forEach(h=>{
            wiData.push([cat.category,wi.name,h.hazard||'',h.severity||'',h.frequency||'',h.measure||'']);
          });
        }else{
          wiData.push([cat.category,wi.name,'','','','']);
        }
      });
      // 作業がない工種も1行出力
      if(!cat.items||cat.items.length===0){
        wiData.push([cat.category,'','','','','']);
      }
    });
    const ws2=XLSX.utils.aoa_to_sheet(wiData);
    ws2['!cols']=[{wch:15},{wch:20},{wch:25},{wch:8},{wch:8},{wch:25}];
    XLSX.utils.book_append_sheet(wb,ws2,'作業マスタ');

    // シート3: 危険要因
    const hzData=[['危険要因名','重大性','頻度','デフォルト安全対策']];
    (M["危険要因"]||[]).forEach(name=>{
      const def=HAZARD_DEFAULTS[name]||{};
      hzData.push([name,def.sev||'',def.freq||'',def.measure||'']);
    });
    const ws3=XLSX.utils.aoa_to_sheet(hzData);
    ws3['!cols']=[{wch:25},{wch:8},{wch:8},{wch:25}];
    XLSX.utils.book_append_sheet(wb,ws3,'危険要因');

    // シート4: 安全対策
    const msData=[['安全対策名','安全目標標語']];
    (M["安全対策"]||[]).forEach(name=>{
      msData.push([name,GOAL_MAP[name]||'']);
    });
    const ws4=XLSX.utils.aoa_to_sheet(msData);
    ws4['!cols']=[{wch:25},{wch:25}];
    XLSX.utils.book_append_sheet(wb,ws4,'安全対策');

    XLSX.writeFile(wb,'KY_マスタデータ.xlsx');
    showConfigStatus('📥 KY_マスタデータ.xlsx をダウンロードしました');
  }catch(e){
    showConfigStatus('❌ Excelダウンロードエラー: '+e.message);
  }
}

function uploadMasterExcel(input){
  const file=input.files[0];
  if(!file)return;
  input.value=''; // リセット

  const reader=new FileReader();
  reader.onload=function(e){
    try{
      const data=new Uint8Array(e.target.result);
      const wb=XLSX.read(data,{type:'array'});

      let imported=0;

      // シート: 従事者
      const ws1=wb.Sheets['従事者'];
      if(ws1){
        const workerData=XLSX.utils.sheet_to_json(ws1);
        masterData.workers=[];
        workerData.forEach(row=>{
          if(row['名前']) masterData.workers.push({name:row['名前']||'',company:row['所属会社']||''});
        });
        imported++;
      }

      // シート: 作業マスタ
      const ws2=wb.Sheets['作業マスタ'];
      if(ws2){
        const wiData=XLSX.utils.sheet_to_json(ws2);
        const cats={};
        wiData.forEach(row=>{
          const cat=row['工種'];
          const name=row['作業名'];
          if(!cat||!name)return;
          if(!cats[cat])cats[cat]={category:cat,items:[]};
          const wi=cats[cat].items.find(x=>x.name===name);
          if(!wi){
            const newWi={name,hazards:[]};
            const hz=row['危険要因'];
            if(hz){
              newWi.hazards.push({
                hazard:hz,
                severity:row['重大性']||'',
                frequency:row['頻度']||'',
                measure:row['安全対策']||''
              });
            }
            cats[cat].items.push(newWi);
          }else if(row['危険要因']){
            wi.hazards.push({
              hazard:row['危険要因'],
              severity:row['重大性']||'',
              frequency:row['頻度']||'',
              measure:row['安全対策']||''
            });
          }
        });
        masterData.workCategories=Object.values(cats);
        imported++;
      }

      // シート: 危険要因
      const ws3=wb.Sheets['危険要因'];
      if(ws3){
        const hzData=XLSX.utils.sheet_to_json(ws3);
        const newHazards=[];
        const newHazardDefs={};
        hzData.forEach(row=>{
          const name=row['危険要因名'];
          if(!name)return;
          newHazards.push(name);
          if(row['重大性']||row['頻度']||row['デフォルト安全対策']){
            newHazardDefs[name]={sev:row['重大性']||'',freq:row['頻度']||'',measure:row['デフォルト安全対策']||''};
          }
        });
        if(newHazards.length>0){
          M["危険要因"]=newHazards;
          HAZARD_DEFAULTS=newHazardDefs;
          masterData.hazards=newHazards;
          masterData.hazardDefaults=newHazardDefs;
          imported++;
        }
      }

      // シート: 安全対策
      const ws4=wb.Sheets['安全対策'];
      if(ws4){
        const msData=XLSX.utils.sheet_to_json(ws4);
        const newMeasures=[];
        const newGoalMap={};
        msData.forEach(row=>{
          const name=row['安全対策名'];
          if(!name)return;
          newMeasures.push(name);
          if(row['安全目標標語']){
            newGoalMap[name]=row['安全目標標語'];
          }
        });
        if(newMeasures.length>0){
          M["安全対策"]=newMeasures;
          GOAL_MAP=newGoalMap;
          masterData.measures=newMeasures;
          masterData.goalMap=newGoalMap;
          imported++;
        }
      }

      if(imported>0){
        if(typeof writeMasterToDrive==='function'&&isDriveConnected()&&masterFileId){
          writeMasterToDrive();
        }
        refreshAllHazardSelects();
        refreshCreatorSelect();
        showConfigStatus('✅ Excelからマスタデータをインポートしました ('+imported+'シート)');
      }else{
        showConfigStatus('⚠️ インポート対象のシートが見つかりませんでした');
      }
    }catch(e){
      showConfigStatus('❌ インポートエラー: '+e.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

// ============ Status Display ============
function showConfigStatus(msg){
  const el=document.getElementById('configStatus');
  if(el){
    el.textContent=msg;
    el.style.color=msg.startsWith('❌')?'#ef4444':'#059669';
    setTimeout(()=>{el.textContent='';},5000);
  }
}

// ============ Helper: getMonthKey ============
function getMonthKey(){
  const d=document.getElementById('workDate');
  if(!d)return '';
  const dateStr=d.value;
  return dateStr?dateStr.replace(/-/g,'').substring(0,6):'';
}

// ============ Common Initialization for Pages ============
// Google APIスクリプトの読み込みを待つヘルパー
function waitForGapi(maxWait){
  return new Promise((resolve)=>{
    const start=Date.now();
    (function check(){
      if(typeof gapi!=='undefined'){resolve(true);return;}
      if(Date.now()-start>maxWait){resolve(false);return;}
      setTimeout(check,200);
    })();
  });
}
function waitForGis(maxWait){
  return new Promise((resolve)=>{
    const start=Date.now();
    (function check(){
      if(typeof google!=='undefined'&&google.accounts&&google.accounts.oauth2){resolve(true);return;}
      if(Date.now()-start>maxWait){resolve(false);return;}
      setTimeout(check,200);
    })();
  });
}

async function initCommon(){
  const isHomePage=!!document.getElementById('projectSelect');
  dbg(`initCommon() start, isHomePage=${isHomePage}, url=${location.pathname}`);

  // 1) Restore session from sessionStorage
  const savedToken=sessionStorage.getItem('driveAccessToken');
  dbg(`initCommon: savedToken=${savedToken?'yes ('+savedToken.substring(0,10)+'...)':'no'}`);
  if(savedToken){
    driveAccessToken=savedToken;
    currentFolderId=sessionStorage.getItem('currentFolderId')||null;
    currentProjectFileId=sessionStorage.getItem('currentProjectFileId')||null;
    currentMonth=sessionStorage.getItem('currentMonth')||'';
    masterFileId=sessionStorage.getItem('masterFileId')||null;
    currentMonthFileId=sessionStorage.getItem('currentMonthFileId')||null;
    try{ const s=sessionStorage.getItem('projectList'); if(s) projectList=JSON.parse(s); }catch(e){}
    try{ const s=sessionStorage.getItem('allDataConfig'); if(s) allData.config=JSON.parse(s); }catch(e){}
    try{ const s=sessionStorage.getItem('allDataEntries'); if(s) allData.entries=JSON.parse(s); }catch(e){}
    try{ const s=sessionStorage.getItem('masterDataCache'); if(s){
      masterData=JSON.parse(s);
      if(masterData.hazards&&masterData.hazards.length>0)M["危険要因"]=[...masterData.hazards];
      if(masterData.measures&&masterData.measures.length>0)M["安全対策"]=[...masterData.measures];
      if(masterData.hazardDefaults)HAZARD_DEFAULTS={...masterData.hazardDefaults};
      if(masterData.goalMap)GOAL_MAP={...masterData.goalMap};
      if(!masterData.workers)masterData.workers=[];
      if(!masterData.workCategories)masterData.workCategories=[];
    }}catch(e){}
    dbg(`initCommon: session restored - folderId=${currentFolderId}, month=${currentMonth}, entries=${Object.keys(allData.entries).length}, entryKeys=[${Object.keys(allData.entries).join(',')}]`);
  }

  // 2) SUB-PAGE FAST PATH: show UI instantly from cache, then connect in background
  if(!isHomePage && savedToken && (currentFolderId||currentProjectFileId)){
    dbg('initCommon: SUB-PAGE FAST PATH');
    // Apply cached master data to UI selects
    refreshAllHazardSelects();
    refreshCreatorSelect();
    // Mark as ready so onPageReady can display data
    driveReady=true;
    // Show UI immediately
    if(typeof onPageReady==='function'){
      dbg('initCommon: calling onPageReady()');
      onPageReady();
    }
    // Connect to Drive API in background (for auto-save)
    connectDriveBackground();
    showDebugPanel();
    return;
  }

  // 3) HOME PAGE or FIRST VISIT: full initialization
  dbg('initCommon: full init path (home page or first visit)');
  const [gapiOk, gisOk] = await Promise.all([
    waitForGapi(10000),
    waitForGis(10000)
  ]);
  dbg(`initCommon: gapi=${gapiOk}, gis=${gisOk}`);
  if(gapiOk){
    try{ await initGapi(); dbg('initCommon: gapi inited'); }catch(e){console.warn('GAPI init failed',e);dbg('initCommon: gapi FAILED: '+e.message);}
  }else{ console.warn('gapi did not load within 10s'); dbg('initCommon: gapi timeout!'); }
  if(gisOk){
    try{ initGis(); dbg('initCommon: gis inited'); }catch(e){console.warn('GIS init failed',e);dbg('initCommon: gis FAILED: '+e.message);}
  }else{ console.warn('GIS did not load within 10s'); dbg('initCommon: gis timeout!'); }

  // 4) If token exists, reconnect to Drive
  dbg(`initCommon: step4 - token=${!!driveAccessToken}, gapiInited=${gapiInited}`);
  if(driveAccessToken&&gapiInited){
    try{
      gapi.client.setToken({access_token:driveAccessToken});
      driveReady=true;
      dbg('initCommon: calling onDriveConnected()');
      await onDriveConnected();
      dbg('initCommon: onDriveConnected() done, entries='+Object.keys(allData.entries).length);
    }catch(e){
      console.warn('Session restore failed',e);
      dbg('initCommon: onDriveConnected FAILED: '+e.message);
      driveAccessToken=null;
      sessionStorage.removeItem('driveAccessToken');
    }
  }

  // 5) Page-specific init
  dbg('initCommon: step5 - calling onPageReady, entries='+Object.keys(allData.entries).length);
  if(typeof onPageReady==='function') onPageReady();
  showDebugPanel();
}

// Background Drive connection for sub-pages (non-blocking)
// Only establishes API connection for auto-save. Data is already loaded from cache.
async function connectDriveBackground(){
  dbg('connectDriveBackground() start');
  try{
    const [gapiOk, gisOk] = await Promise.all([
      waitForGapi(10000),
      waitForGis(10000)
    ]);
    dbg(`connectDriveBackground: gapi=${gapiOk}, gis=${gisOk}`);
    if(gapiOk){ await initGapi(); }
    if(gisOk){ initGis(); }
    if(driveAccessToken&&gapiInited){
      gapi.client.setToken({access_token:driveAccessToken});
      dbg('connectDriveBackground: token set, verifying with test API call...');
      // Verify token is still valid
      try{
        const testResp=await gapi.client.drive.files.list({q:"trashed=false",pageSize:1,fields:'files(id)'});
        dbg('connectDriveBackground: token valid, API accessible');
      }catch(apiErr){
        dbg('connectDriveBackground: TOKEN EXPIRED/INVALID - '+apiErr.message);
        // Token is expired, will need re-login
      }
      // Ensure masterFileId and currentMonthFileId are valid for auto-save
      if(!masterFileId) await findOrCreateMasterFile();
      if(currentFolderId && !currentMonthFileId){
        const mk=getMonthKey();
        const month=mk||currentMonth||localDateStr(new Date()).replace(/-/g,'').substring(0,6);
        dbg(`connectDriveBackground: looking for ${month}.json`);
        const fileId=await findFileInFolder(currentFolderId, month+'.json');
        if(fileId){currentMonthFileId=fileId;dbg('connectDriveBackground: monthFileId='+fileId);}
        else{dbg('connectDriveBackground: month file not found');}
      }
    }else{dbg('connectDriveBackground: skip - no token or gapi not inited');}
    dbg('connectDriveBackground: done');
  }catch(e){ console.warn('Background Drive connect failed:',e); dbg('connectDriveBackground: ERROR '+e.message); }
}

// ============ Session save helper ============
function saveSession(){
  dbg(`saveSession: entries=${Object.keys(allData.entries).length}, folderId=${currentFolderId}, month=${currentMonth}`);
  if(driveAccessToken) sessionStorage.setItem('driveAccessToken', driveAccessToken);
  else sessionStorage.removeItem('driveAccessToken');
  if(currentFolderId) sessionStorage.setItem('currentFolderId', currentFolderId);
  else sessionStorage.removeItem('currentFolderId');
  if(currentProjectFileId) sessionStorage.setItem('currentProjectFileId', currentProjectFileId);
  else sessionStorage.removeItem('currentProjectFileId');
  if(currentMonth) sessionStorage.setItem('currentMonth', currentMonth);
  else sessionStorage.removeItem('currentMonth');
  if(masterFileId) sessionStorage.setItem('masterFileId', masterFileId);
  else sessionStorage.removeItem('masterFileId');
  if(currentMonthFileId) sessionStorage.setItem('currentMonthFileId', currentMonthFileId);
  else sessionStorage.removeItem('currentMonthFileId');
  try{
    sessionStorage.setItem('projectList', JSON.stringify(projectList));
    if(allData.config&&Object.keys(allData.config).length>0){
      sessionStorage.setItem('allDataConfig', JSON.stringify(allData.config));
    }
    // Cache master data for sub-pages
    if(masterData&&masterData.workers){
      sessionStorage.setItem('masterDataCache', JSON.stringify(masterData));
    }
    // Cache entries data for instant sub-page display (always save, even if empty)
    sessionStorage.setItem('allDataEntries', JSON.stringify(allData.entries||{}));
  }catch(e){}
}

// ============ Page Navigation ============
function navigateTo(page){
  // Save any pending form data first
  if(typeof autoSave==='function') autoSave();
  if(typeof autoSaveNippo==='function') autoSaveNippo();
  // Persist session state to sessionStorage before leaving
  saveSession();
  window.location.href=page;
}
