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
  "危険要因":["路肩の崩壊","法面からの転落","足場からの転落","熱中症","歩行者と重機の接触","一般車両と重機の接触","重機に挟まれる","重機と作業者の接触","吊荷の落下","足場の倒壊","土砂等の積荷の落下","一般車両との接触事故","機械に挟まれる","草刈機の歯が他の作業員にあたる","法面からの落石","クレーンの転倒","掘削中の法面崩壊","法面からの重機の転落","つまづき・転倒","交通事故","停止工事車両の暴走","上方からの工具の落下","高所作業者からの転落","吊荷との接触","草刈機の歯により石等が飛散する","単管等の積荷の落下","チェーンソとの接触","倒木・跳ね返りによる被災","第三者の被災","仮設物の転倒","高所からの墜落","上方からの資材の落下","漏電・火災","架空線への接触","地下埋設物の損傷","開口部への転落","粉じん吸入","積荷の荷崩れ","手指の挟まれ","鉄筋端部による刺傷","腰痛","工具の落下","重機接触","火傷","飛来物による被災","騒音による被災","溶剤吸入"],
  "安全対策":["合図者配置","整理整頓","安全帯着用","輪止の使用","水分補給・休息","合図確認","上下作業禁止","吊荷の下に立ち入らない","吊具の状態の確認","足元の確認","一般車両優先で作業する","荷締めを確実に行う","作業手順の確認","浮石の撤去","周囲の確認","地盤の確認","路肩の明示","作業半径内立入禁止","過積載禁止","工事車両徐行運転","急発進・急ブレーキ禁止","地山の点検","地盤・支点の確認","落下防止コードの使用","ガイドロープの使用","重機の足場の確認","保護具の着用","退避路の確保","立入禁止措置","飛散防止措置","誘導員配置・保安施設設置","専用吊金具の使用","足場の適正使用","ケーブル養生","落下防止措置","掘削勾配確保・土留め設置","架空線離隔の確保","埋設物の事前確認","開口部養生","散水・防じんマスク着用","玉掛けの適正実施","治具の使用","作業区画の分離","適正車両の選定","定格荷重の確認","挟まれ防止措置","型枠支保工の点検","鉄筋端部の養生","補助具の使用","作業姿勢の管理","高所作業車の適正使用","足場の点検","換気・防毒マスク着用"],
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
  "土砂等の積荷の落下":   {sev:"10", freq:"5", measure:"過積載禁止"},
  "一般車両との接触事故": {sev:"20", freq:"1", measure:"一般車両優先で作業する"},
  "機械に挟まれる":       {sev:"20", freq:"1", measure:"合図確認"},
  "草刈機の歯が他の作業員にあたる": {sev:"20", freq:"5", measure:"周囲の確認"},
  "法面からの落石":       {sev:"20", freq:"5", measure:"浮石の撤去"},
  "クレーンの転倒":       {sev:"20", freq:"1", measure:"地盤の確認"},
  "掘削中の法面崩壊":     {sev:"20", freq:"5", measure:"地山の点検"},
  "法面からの重機の転落": {sev:"20", freq:"5", measure:"重機の足場の確認"},
  "つまづき・転倒":       {sev:"10", freq:"5", measure:"足元の確認"},
  "交通事故":             {sev:"20", freq:"5", measure:"工事車両徐行運転"},
  "停止工事車両の暴走":   {sev:"20", freq:"1", measure:"輪止の使用"},
  "上方からの工具の落下": {sev:"10", freq:"5", measure:"落下防止コードの使用"},
  "高所作業者からの転落": {sev:"20", freq:"5", measure:"安全帯着用"},
  "吊荷との接触":         {sev:"10", freq:"5", measure:"ガイドロープの使用"},
  "草刈機の歯により石等が飛散する": {sev:"5", freq:"20", measure:"保護具の着用"},
  "単管等の積荷の落下":   {sev:"20", freq:"10", measure:"荷締めを確実に行う"},
  "チェーンソとの接触":   {sev:"20", freq:"10", measure:"保護具の着用"},
  "倒木・跳ね返りによる被災": {sev:"20", freq:"5", measure:"退避路の確保"},
  "第三者の被災":         {sev:"10", freq:"1", measure:"立入禁止措置"},
  "仮設物の転倒":         {sev:"20", freq:"1", measure:"専用吊金具の使用"},
  "高所からの墜落":       {sev:"20", freq:"5", measure:"足場の適正使用"},
  "上方からの資材の落下": {sev:"20", freq:"5", measure:"立入禁止措置"},
  "漏電・火災":           {sev:"20", freq:"1", measure:"ケーブル養生"},
  "架空線への接触":       {sev:"20", freq:"5", measure:"架空線離隔の確保"},
  "地下埋設物の損傷":     {sev:"10", freq:"5", measure:"埋設物の事前確認"},
  "開口部への転落":       {sev:"20", freq:"5", measure:"開口部養生"},
  "粉じん吸入":           {sev:"10", freq:"10", measure:"散水・防じんマスク着用"},
  "積荷の荷崩れ":         {sev:"10", freq:"5", measure:"荷締めを確実に行う"},
  "手指の挟まれ":         {sev:"20", freq:"5", measure:"治具の使用"},
  "鉄筋端部による刺傷":   {sev:"20", freq:"5", measure:"鉄筋端部の養生"},
  "腰痛":                 {sev:"5", freq:"10", measure:"補助具の使用"},
  "工具の落下":           {sev:"20", freq:"5", measure:"上下作業禁止"},
  "重機接触":             {sev:"20", freq:"5", measure:"合図者配置"},
  "火傷":                 {sev:"10", freq:"5", measure:"保護具の着用"},
  "飛来物による被災":     {sev:"10", freq:"5", measure:"保護具の着用"},
  "騒音による被災":       {sev:"10", freq:"10", measure:"保護具の着用"},
  "溶剤吸入":             {sev:"10", freq:"10", measure:"換気・防毒マスク着用"}
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
  "地盤の確認":"地盤よし！",
  "路肩の明示":"路肩確認よし！",
  "作業半径内立入禁止":"立入禁止確認よし！",
  "過積載禁止":"積載確認よし！",
  "工事車両徐行運転":"徐行確認よし！",
  "急発進・急ブレーキ禁止":"安全運転よし！",
  "地山の点検":"地山確認よし！",
  "地盤・支点の確認":"地盤・支点よし！",
  "落下防止コードの使用":"落下防止コードよし！",
  "ガイドロープの使用":"ガイドロープよし！",
  "重機の足場の確認":"足場確認よし！",
  "保護具の着用":"保護具よし！",
  "退避路の確保":"退避路よし！",
  "立入禁止措置":"立入禁止よし！",
  "飛散防止措置":"飛散防止よし！",
  "誘導員配置・保安施設設置":"誘導員配置・保安施設設置よし！",
  "専用吊金具の使用":"専用吊金具よし！",
  "足場の適正使用":"足場適正使用よし！",
  "ケーブル養生":"ケーブル養生よし！",
  "落下防止措置":"落下防止措置よし！",
  "掘削勾配確保・土留め設置":"掘削勾配確保・土留め設置よし！",
  "架空線離隔の確保":"架空線離隔確保よし！",
  "埋設物の事前確認":"埋設物事前確認よし！",
  "開口部養生":"開口部養生よし！",
  "散水・防じんマスク着用":"散水・防じんマスクよし！",
  "玉掛けの適正実施":"玉掛け適正実施よし！",
  "治具の使用":"治具よし！",
  "作業区画の分離":"作業区画分離よし！",
  "適正車両の選定":"適正車両選定よし！",
  "定格荷重の確認":"定格荷重確認よし！",
  "挟まれ防止措置":"挟まれ防止措置よし！",
  "型枠支保工の点検":"型枠支保工確認よし！",
  "鉄筋端部の養生":"鉄筋端部の養生よし！",
  "補助具の使用":"補助具よし！",
  "作業姿勢の管理":"作業姿勢管理よし！",
  "高所作業車の適正使用":"高所作業車適正使用よし！",
  "足場の点検":"足場確認よし！",
  "換気・防毒マスク着用":"換気・防毒マスクよし！"
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
let currentMonthHAFileId=null;  // YYYYMM_Hazard_Assessment.json
let currentMonthDRFileId=null;  // YYYYMM_Daily_Report.json
let dataFileSaveTm=null;

// ============ Google Drive API 連携 ============
const DRIVE_CLIENT_ID='284823490637-5i3bmm35ncug6k486gidq3obgnb8ca3s.apps.googleusercontent.com';
const DRIVE_SCOPES='https://www.googleapis.com/auth/drive.file';
let driveAccessToken=null;
let driveReady=false;
let gapiInited=false;
let gisInited=false;
let tokenClient=null;

// ============ Master / Project 状態 ============
const MASTER_FILE_NAME='KY_master.json';
let masterFileId=null;
const DEFAULT_WORK_CATEGORIES=[{"category":"準備工","items":[{"name":"仮設物撤去","hazards":[{"hazard":"クレーンの転倒","severity":"20","frequency":"1","measure":"地盤の確認"},{"hazard":"吊荷との接触","severity":"10","frequency":"5","measure":"ガイドロープの使用"}]},{"name":"仮設物設置","hazards":[{"hazard":"クレーンの転倒","severity":"20","frequency":"1","measure":"地盤の確認"},{"hazard":"吊荷との接触","severity":"10","frequency":"5","measure":"ガイドロープの使用"}]},{"name":"測量作業","hazards":[{"hazard":"つまづき・転倒","severity":"5","frequency":"20","measure":"整理整頓"}]},{"name":"現地踏査・事前調査・測量","hazards":[{"hazard":"つまづき・転倒","severity":"5","frequency":"10","measure":"足元の確認"},{"hazard":"一般車両との接触事故","severity":"20","frequency":"5","measure":"誘導員配置・保安施設設置"},{"hazard":"法面からの転落","severity":"20","frequency":"5","measure":"路肩の明示"},{"hazard":"熱中症","severity":"10","frequency":"10","measure":"水分補給・休息"}]},{"name":"除草作業","hazards":[{"hazard":"草刈機の歯が他の作業員にあたる","severity":"20","frequency":"10","measure":"周囲の確認"},{"hazard":"草刈機の歯により石等が飛散する","severity":"10","frequency":"10","measure":"保護具の着用"},{"hazard":"草刈機の歯により石等が飛散する","severity":"10","frequency":"10","measure":"飛散防止措置"}]}]},{"category":"仮設工","items":[{"name":"仮設防護柵設置・撤去","hazards":[{"hazard":"上方からの資材の落下","severity":"20","frequency":"5","measure":"立入禁止措置"},{"hazard":"仮設物の転倒","severity":"20","frequency":"1","measure":"専用吊金具の使用"},{"hazard":"漏電・火災","severity":"20","frequency":"1","measure":"ケーブル養生"},{"hazard":"重機と作業者の接触","severity":"20","frequency":"5","measure":"作業半径内立入禁止"},{"hazard":"高所からの墜落","severity":"20","frequency":"5","measure":"足場の適正使用"}]},{"name":"足場設置・撤去","hazards":[{"hazard":"上方からの資材の落下","severity":"20","frequency":"5","measure":"落下防止措置"},{"hazard":"高所からの墜落","severity":"20","frequency":"5","measure":"安全帯着用"}]}]},{"category":"土工","items":[{"name":"切土","hazards":[{"hazard":"掘削中の法面崩壊","severity":"20","frequency":"1","measure":"地山の点検"}]},{"name":"埋戻し","hazards":[{"hazard":"地下埋設物の損傷","severity":"10","frequency":"5","measure":"埋設物の事前確認"}]},{"name":"掘削","hazards":[{"hazard":"地下埋設物の損傷","severity":"10","frequency":"5","measure":"埋設物の事前確認"},{"hazard":"掘削中の法面崩壊","severity":"20","frequency":"1","measure":"掘削勾配確保・土留め設置"},{"hazard":"架空線への接触","severity":"20","frequency":"5","measure":"架空線離隔の確保"},{"hazard":"重機と作業者の接触","severity":"20","frequency":"5","measure":"作業半径内立入禁止"},{"hazard":"開口部への転落","severity":"20","frequency":"5","measure":"開口部養生"}]},{"name":"掘削・切土・運搬","hazards":[{"hazard":"粉じん吸入","severity":"10","frequency":"10","measure":"散水・防じんマスク着用"}]},{"name":"盛土","hazards":[{"hazard":"法面からの重機の転落","severity":"20","frequency":"5","measure":"地盤の確認"}]},{"name":"積込・運搬","hazards":[{"hazard":"重機と作業者の接触","severity":"20","frequency":"5","measure":"合図者配置"}]}]},{"category":"排水構造物工","items":[{"name":"各種側溝の搬入","hazards":[{"hazard":"一般車両との接触事故","severity":"20","frequency":"5","measure":"合図者配置"},{"hazard":"積荷の荷崩れ","severity":"10","frequency":"5","measure":"荷締めを確実に行う"}]},{"name":"各種側溝設置","hazards":[{"hazard":"吊荷との接触","severity":"20","frequency":"5","measure":"合図確認"},{"hazard":"吊荷の落下","severity":"20","frequency":"5","measure":"吊具の状態の確認"},{"hazard":"手指の挟まれ","severity":"20","frequency":"5","measure":"治具の使用"}]},{"name":"埋戻し","hazards":[{"hazard":"重機と作業者の接触","severity":"20","frequency":"5","measure":"作業区画の分離"}]},{"name":"掘削","hazards":[{"hazard":"地下埋設物の損傷","severity":"10","frequency":"5","measure":"埋設物の事前確認"},{"hazard":"掘削中の法面崩壊","severity":"20","frequency":"1","measure":"掘削勾配確保・土留め設置"},{"hazard":"架空線への接触","severity":"20","frequency":"5","measure":"架空線離隔の確保"},{"hazard":"開口部への転落","severity":"20","frequency":"5","measure":"開口部養生"}]}]},{"category":"擁壁工","items":[{"name":"プレキャスト擁壁の搬入","hazards":[{"hazard":"一般車両との接触事故","severity":"20","frequency":"5","measure":"合図者配置"},{"hazard":"積荷の荷崩れ","severity":"10","frequency":"5","measure":"適正車両の選定"}]},{"name":"プレキャスト擁壁設置","hazards":[{"hazard":"クレーンの転倒","severity":"20","frequency":"1","measure":"定格荷重の確認"},{"hazard":"吊荷との接触","severity":"20","frequency":"5","measure":"合図者配置"},{"hazard":"吊荷の落下","severity":"20","frequency":"5","measure":"玉掛けの適正実施"},{"hazard":"手指の挟まれ","severity":"20","frequency":"5","measure":"挟まれ防止措置"}]},{"name":"型枠組立・撤去","hazards":[{"hazard":"足場からの転落","severity":"20","frequency":"5","measure":"安全帯着用"},{"hazard":"足場の倒壊","severity":"20","frequency":"1","measure":"型枠支保工の点検"}]},{"name":"埋戻し","hazards":[{"hazard":"重機と作業者の接触","severity":"20","frequency":"5","measure":"作業区画の分離"}]},{"name":"掘削","hazards":[{"hazard":"掘削中の法面崩壊","severity":"20","frequency":"1","measure":"掘削勾配確保・土留め設置"},{"hazard":"開口部への転落","severity":"20","frequency":"5","measure":"開口部養生"}]},{"name":"鉄器加工組立","hazards":[{"hazard":"鉄筋端部による刺傷","severity":"20","frequency":"5","measure":"鉄筋端部の養生"}]}]},{"category":"縁石工","items":[{"name":"埋戻し","hazards":[{"hazard":"重機と作業者の接触","severity":"20","frequency":"5","measure":"作業区画の分離"}]},{"name":"掘削","hazards":[{"hazard":"路肩の崩壊","severity":"20","frequency":"1","measure":"路肩の明示"},{"hazard":"重機と作業者の接触","severity":"20","frequency":"5","measure":"作業区画の分離"}]},{"name":"縁石の搬入","hazards":[{"hazard":"手指の挟まれ","severity":"20","frequency":"5","measure":"治具の使用"},{"hazard":"腰痛","severity":"5","frequency":"10","measure":"補助具の使用"}]},{"name":"縁石設置","hazards":[{"hazard":"吊荷の落下","severity":"20","frequency":"5","measure":"吊具の状態の確認"},{"hazard":"手指の挟まれ","severity":"20","frequency":"5","measure":"治具の使用"},{"hazard":"第三者の被災","severity":"10","frequency":"5","measure":"立入禁止措置"},{"hazard":"腰痛","severity":"5","frequency":"10","measure":"作業姿勢の管理"}]}]},{"category":"法面工","items":[{"name":"モルタル吹付","hazards":[{"hazard":"工具の落下","severity":"20","frequency":"5","measure":"上下作業禁止"},{"hazard":"法面からの転落","severity":"20","frequency":"5","measure":"安全帯着用"}]},{"name":"ラス張","hazards":[{"hazard":"上方からの資材の落下","severity":"20","frequency":"5","measure":"上下作業禁止"},{"hazard":"法面からの転落","severity":"20","frequency":"5","measure":"安全帯着用"}]},{"name":"植生基材吹付","hazards":[{"hazard":"工具の落下","severity":"20","frequency":"5","measure":"上下作業禁止"},{"hazard":"法面からの転落","severity":"20","frequency":"5","measure":"安全帯着用"}]},{"name":"法枠組立","hazards":[{"hazard":"上方からの資材の落下","severity":"20","frequency":"5","measure":"上下作業禁止"},{"hazard":"法面からの転落","severity":"20","frequency":"5","measure":"安全帯着用"}]},{"name":"法面整形","hazards":[{"hazard":"掘削中の法面崩壊","severity":"20","frequency":"1","measure":"地山の点検"},{"hazard":"法面からの落石","severity":"10","frequency":"5","measure":"浮石の撤去"},{"hazard":"法面からの転落","severity":"20","frequency":"5","measure":"安全帯着用"}]}]},{"category":"舗装工","items":[{"name":"アスファルト舗設","hazards":[{"hazard":"火傷","severity":"10","frequency":"5","measure":"保護具の着用"},{"hazard":"熱中症","severity":"10","frequency":"10","measure":"水分補給・休息"},{"hazard":"重機と作業者の接触","severity":"20","frequency":"5","measure":"作業半径内立入禁止"}]},{"name":"合材受入","hazards":[{"hazard":"重機と作業者の接触","severity":"20","frequency":"5","measure":"合図者配置"}]},{"name":"路床・路盤","hazards":[{"hazard":"粉じん吸入","severity":"10","frequency":"10","measure":"散水・防じんマスク着用"},{"hazard":"重機と作業者の接触","severity":"20","frequency":"5","measure":"作業半径内立入禁止"},{"hazard":"重機接触","severity":"20","frequency":"5","measure":"合図者配置"}]}]},{"category":"安全施設工","items":[{"name":"ガードレール設置","hazards":[{"hazard":"一般車両との接触事故","severity":"20","frequency":"5","measure":"誘導員配置・保安施設設置"},{"hazard":"法面からの転落","severity":"20","frequency":"5","measure":"安全帯着用"}]},{"name":"区画線設置","hazards":[{"hazard":"一般車両との接触事故","severity":"20","frequency":"5","measure":"誘導員配置・保安施設設置"}]},{"name":"撤去・復旧","hazards":[{"hazard":"仮設物の転倒","severity":"20","frequency":"1","measure":"作業手順の確認"}]},{"name":"案内標識設置","hazards":[{"hazard":"一般車両との接触事故","severity":"20","frequency":"5","measure":"誘導員配置・保安施設設置"},{"hazard":"高所からの墜落","severity":"20","frequency":"5","measure":"高所作業車の適正使用"}]},{"name":"転落防止柵設置","hazards":[{"hazard":"一般車両との接触事故","severity":"20","frequency":"5","measure":"誘導員配置・保安施設設置"},{"hazard":"法面からの転落","severity":"20","frequency":"5","measure":"安全帯着用"}]}]},{"category":"橋梁補修工","items":[{"name":"ひび割れ補修","hazards":[{"hazard":"溶剤吸入","severity":"10","frequency":"10","measure":"換気・防毒マスク着用"},{"hazard":"高所からの墜落","severity":"20","frequency":"5","measure":"開口部養生"}]},{"name":"吊足場設置・撤去","hazards":[{"hazard":"上方からの工具の落下","severity":"20","frequency":"5","measure":"落下防止措置"},{"hazard":"足場の倒壊","severity":"20","frequency":"1","measure":"足場の点検"},{"hazard":"高所からの墜落","severity":"20","frequency":"5","measure":"安全帯着用"}]},{"name":"支承補修","hazards":[{"hazard":"機械に挟まれる","severity":"20","frequency":"5","measure":"作業手順の確認"},{"hazard":"高所からの墜落","severity":"20","frequency":"5","measure":"開口部養生"}]},{"name":"断面修復","hazards":[{"hazard":"溶剤吸入","severity":"10","frequency":"10","measure":"換気・防毒マスク着用"},{"hazard":"飛来物による被災","severity":"10","frequency":"5","measure":"保護具の着用"},{"hazard":"騒音による被災","severity":"10","frequency":"10","measure":"保護具の着用"},{"hazard":"高所からの墜落","severity":"20","frequency":"5","measure":"開口部養生"}]},{"name":"現場塗装","hazards":[{"hazard":"溶剤吸入","severity":"10","frequency":"10","measure":"換気・防毒マスク着用"}]}]}];
let masterData={workers:[],workCategories:JSON.parse(JSON.stringify(DEFAULT_WORK_CATEGORIES)),hazards:[],measures:[],hazardDefaults:{},goalMap:{},units:['式','m','m2','m3','基','個','箇所','枚','組','t','kg','km','g'],materials:[],materialSpecs:[]};
let projectList=[];
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
      if(currentFolderId&&projectList.some(p=>p.id===currentFolderId)){
        sel.value=currentFolderId;
        dbg('onDriveConnected: restored project '+currentFolderId);
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
    if(currentFolderId){
      dbg('onDriveConnected: sub-page - loading folder '+currentFolderId);
      await switchToFolder(currentFolderId);
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
    // workCategoriesが空またはhazardsが未設定の場合、DEFAULT_WORK_CATEGORIESで補完
    if(!masterData.workCategories||masterData.workCategories.length===0){
      masterData.workCategories=JSON.parse(JSON.stringify(DEFAULT_WORK_CATEGORIES));
    }else{
      // 既存カテゴリの各作業項目にhazardsが空なら、デフォルトからマージ
      const defMap={};
      DEFAULT_WORK_CATEGORIES.forEach(dc=>{
        dc.items.forEach(di=>{ defMap[dc.category+'///'+di.name]=di.hazards; });
      });
      masterData.workCategories.forEach(cat=>{
        if(!cat.items)cat.items=[];
        cat.items.forEach(item=>{
          if(typeof item==='string')return;
          if(!item.hazards||item.hazards.length===0){
            const key=cat.category+'///'+item.name;
            if(defMap[key])item.hazards=JSON.parse(JSON.stringify(defMap[key]));
          }
        });
      });
      // デフォルトにあってDriveデータにないカテゴリを追加
      const existCats=new Set(masterData.workCategories.map(c=>c.category));
      DEFAULT_WORK_CATEGORIES.forEach(dc=>{
        if(!existCats.has(dc.category)){
          masterData.workCategories.push(JSON.parse(JSON.stringify(dc)));
        }
      });
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
  return !!(driveAccessToken && currentFolderId);
}

// ============ プロジェクト管理（フォルダ方式） ============
async function listProjectFiles(){
  try{
    const configResp=await gapi.client.drive.files.list({
      q:"name='"+CONFIG_FILE_NAME+"' and mimeType='application/json' and trashed=false",
      fields:'files(id,name,parents)',spaces:'drive',pageSize:100
    });
    const configFiles=configResp.result.files||[];
    const folderIds=new Set();
    configFiles.forEach(cf=>{
      if(cf.parents&&cf.parents.length>0){
        folderIds.add(cf.parents[0]);
      }
    });
    const result=[];
    for(const fid of folderIds){
      try{
        const fResp=await gapi.client.drive.files.get({fileId:fid,fields:'id,name,trashed'});
        if(!fResp.result.trashed){
          result.push({name:fResp.result.name, id:fid, type:'folder'});
        }
      }catch(e){}
    }
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
    if(currentFolderId){sel.value=currentFolderId;}
  }
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
  await switchToFolder(proj.id);
}

async function switchToFolder(folderId){
  dbg(`switchToFolder(${folderId})`);
  if(driveReady&&currentFolderId){
    if(typeof autoSave==='function') autoSave();
    await saveCurrentMonth(true);
  }
  currentFolderId=folderId;
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

async function loadMonthData(month){
  dbg(`loadMonthData(${month}) start, folderId=${currentFolderId}`);
  allData.entries={};
  currentMonthHAFileId=null;
  currentMonthDRFileId=null;
  if(!currentFolderId||!month){dbg('loadMonthData: skip (no folderId or month)');return;}

  // Try new format first: YYYYMM_Hazard_Assessment.json + YYYYMM_Daily_Report.json
  const haFileName=month+'_Hazard_Assessment.json';
  const drFileName=month+'_Daily_Report.json';
  const haFileId=await findFileInFolder(currentFolderId, haFileName);
  const drFileId=await findFileInFolder(currentFolderId, drFileName);
  dbg(`loadMonthData: HA=${haFileId}, DR=${drFileId}`);

  if(haFileId||drFileId){
    // New split format
    currentMonthHAFileId=haFileId;
    currentMonthDRFileId=drFileId;
    if(haFileId){
      const txt=await readFromDriveById(haFileId);
      if(txt){try{const parsed=JSON.parse(txt);const entries=parsed.entries||parsed||{};
        Object.keys(entries).forEach(dk=>{allData.entries[dk]={...allData.entries[dk],...entries[dk]};});
        dbg(`loadMonthData: HA parsed ${Object.keys(entries).length} entries`);
      }catch(e){dbg('loadMonthData: HA parse error: '+e.message);}}
    }
    if(drFileId){
      const txt=await readFromDriveById(drFileId);
      if(txt){try{const parsed=JSON.parse(txt);const entries=parsed.entries||parsed||{};
        Object.keys(entries).forEach(dk=>{
          if(!allData.entries[dk])allData.entries[dk]={};
          allData.entries[dk].nippo=entries[dk].nippo||entries[dk];
        });
        dbg(`loadMonthData: DR parsed ${Object.keys(entries).length} entries`);
      }catch(e){dbg('loadMonthData: DR parse error: '+e.message);}}
    }
  }
  dbg(`loadMonthData: total entries=${Object.keys(allData.entries).length}`);
}

async function switchMonth(newMonth){
  if(!currentFolderId)return;
  await saveCurrentMonth(true);
  currentMonth=newMonth;
  await loadMonthData(newMonth);
}

async function saveCurrentMonth(silent){
  try{
    if(!currentFolderId||!currentMonth)return false;
    // Split entries into HA (KY activity) and DR (daily report)
    const haEntries={};
    const drEntries={};
    Object.keys(allData.entries).forEach(dk=>{
      const e=allData.entries[dk];
      const haCopy={...e};
      delete haCopy.nippo;
      haEntries[dk]=haCopy;
      if(e.nippo){
        drEntries[dk]={nippo:e.nippo};
      }
    });
    const haJson=JSON.stringify({entries:haEntries},null,2);
    const drJson=JSON.stringify({entries:drEntries},null,2);

    // Save Hazard Assessment file
    if(currentMonthHAFileId){
      await writeToDriveById(currentMonthHAFileId, haJson);
    }else{
      const haFileName=currentMonth+'_Hazard_Assessment.json';
      currentMonthHAFileId=await createFileInFolder(currentFolderId, haFileName, haJson);
    }
    // Save Daily Report file
    if(Object.keys(drEntries).length>0){
      if(currentMonthDRFileId){
        await writeToDriveById(currentMonthDRFileId, drJson);
      }else{
        const drFileName=currentMonth+'_Daily_Report.json';
        currentMonthDRFileId=await createFileInFolder(currentFolderId, drFileName, drJson);
      }
    }
    if(!silent){const cnt=Object.keys(allData.entries).length;showConfigStatus('✅ Google ドライブに保存 ('+currentMonth+' / '+cnt+'日分)');}
    return true;
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
  if(driveReady&&currentFolderId){
    if(typeof autoSave==='function') autoSave();
    await saveCurrentMonth(true);
  }
  const createResp=await gapi.client.drive.files.create({
    resource:{name:trimmed, mimeType:'application/vnd.google-apps.folder'},fields:'id'
  });
  const folderId=createResp.result.id;
  const config={projectName:trimmed,creator:''};
  await createFileInFolder(folderId, CONFIG_FILE_NAME, JSON.stringify(config,null,2));
  currentFolderId=folderId;
  allData={config:config,entries:{}};
  currentMonth=getMonthKey()||localDateStr(new Date()).replace(/-/g,'').substring(0,6);
  currentMonthHAFileId=null;
  currentMonthDRFileId=null;
  await refreshProjectList();
  const sel=document.getElementById('projectSelect');
  if(sel) sel.value=folderId;
  const pnEl=document.getElementById('projectName');
  if(pnEl) pnEl.textContent=trimmed;
  driveReady=true;
  showConfigStatus('🆕 新規工事「'+trimmed+'」を作成しました');
}

async function deleteCurrentProject(){
  if(!currentFolderId){alert('削除する工事が選択されていません');return;}
  const name=allData.config?.projectName||'';
  if(!confirm('工事「'+name+'」を削除しますか？\nこの操作は取り消せません。'))return;
  if(!confirm('本当に削除してよろしいですか？（最終確認）'))return;
  await gapi.client.drive.files.update({fileId:currentFolderId,resource:{trashed:true}});
  currentFolderId=null;
  currentMonth='';currentMonthHAFileId=null;currentMonthDRFileId=null;
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

// エイリアス
async function saveAllToDataFile(silent){return await saveCurrentMonth(silent);}
async function loadAllFromDataFile(){
  if(!currentFolderId)return false;
  await loadMonthData(currentMonth);
  return Object.keys(allData.entries).length>0;
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
        showConfigStatus('❌ 対応していないファイル形式です');
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
    currentMonth=sessionStorage.getItem('currentMonth')||'';
    masterFileId=sessionStorage.getItem('masterFileId')||null;
    currentMonthHAFileId=sessionStorage.getItem('currentMonthHAFileId')||null;
    currentMonthDRFileId=sessionStorage.getItem('currentMonthDRFileId')||null;
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
      if(!masterData.workCategories||masterData.workCategories.length===0){
        masterData.workCategories=JSON.parse(JSON.stringify(DEFAULT_WORK_CATEGORIES));
      }else{
        // hazardsが空の作業項目にデフォルトを補完
        const defMap={};
        DEFAULT_WORK_CATEGORIES.forEach(dc=>{ dc.items.forEach(di=>{ defMap[dc.category+'///'+di.name]=di.hazards; }); });
        masterData.workCategories.forEach(cat=>{
          if(!cat.items)cat.items=[];
          cat.items.forEach(item=>{
            if(typeof item!=='string'&&(!item.hazards||item.hazards.length===0)){
              const key=cat.category+'///'+item.name;
              if(defMap[key])item.hazards=JSON.parse(JSON.stringify(defMap[key]));
            }
          });
        });
        const existCats=new Set(masterData.workCategories.map(c=>c.category));
        DEFAULT_WORK_CATEGORIES.forEach(dc=>{ if(!existCats.has(dc.category)) masterData.workCategories.push(JSON.parse(JSON.stringify(dc))); });
      }
    }}catch(e){}
    dbg(`initCommon: session restored - folderId=${currentFolderId}, month=${currentMonth}, entries=${Object.keys(allData.entries).length}, entryKeys=[${Object.keys(allData.entries).join(',')}]`);
  }

  // 2) SUB-PAGE FAST PATH: show UI instantly from cache, then connect in background
  if(!isHomePage && savedToken && currentFolderId){
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
      if(currentFolderId && !currentMonthHAFileId){
        const mk=getMonthKey();
        const month=mk||currentMonth||localDateStr(new Date()).replace(/-/g,'').substring(0,6);
        dbg(`connectDriveBackground: looking for ${month} files`);
        const haId=await findFileInFolder(currentFolderId, month+'_Hazard_Assessment.json');
        const drId=await findFileInFolder(currentFolderId, month+'_Daily_Report.json');
        if(haId){currentMonthHAFileId=haId;dbg('connectDriveBackground: HA fileId='+haId);}
        if(drId){currentMonthDRFileId=drId;dbg('connectDriveBackground: DR fileId='+drId);}
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
  if(currentMonth) sessionStorage.setItem('currentMonth', currentMonth);
  else sessionStorage.removeItem('currentMonth');
  if(masterFileId) sessionStorage.setItem('masterFileId', masterFileId);
  else sessionStorage.removeItem('masterFileId');
  if(currentMonthHAFileId) sessionStorage.setItem('currentMonthHAFileId', currentMonthHAFileId);
  else sessionStorage.removeItem('currentMonthHAFileId');
  if(currentMonthDRFileId) sessionStorage.setItem('currentMonthDRFileId', currentMonthDRFileId);
  else sessionStorage.removeItem('currentMonthDRFileId');
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

// ============ Test Data Generator ============
async function generateTestProject(){
  if(!driveReady||!driveAccessToken){alert('先にGoogleドライブにログインしてください');return;}
  const projectName='動作確認テスト工事';
  dbg('generateTestProject: creating folder '+projectName);
  showConfigStatus('⏳ テストプロジェクト作成中...');

  // 1) Create project folder (folder name = project name only)
  const folderMeta={name:projectName, mimeType:'application/vnd.google-apps.folder'};
  const folderResp=await fetch('https://www.googleapis.com/drive/v3/files',{
    method:'POST',
    headers:{Authorization:'Bearer '+driveAccessToken,'Content-Type':'application/json'},
    body:JSON.stringify(folderMeta)
  });
  const folder=await folderResp.json();
  const folderId=folder.id;
  dbg('generateTestProject: folderId='+folderId);

  // 2) Create config.json
  const config={projectName:projectName,creator:'塩畑　圭一郎'};
  await createFileInFolder(folderId,'config.json',JSON.stringify(config));

  // 2.5) Ensure masterData.workCategories has test categories
  const workItems=['路体盛土工','法面整形工','排水構造物工','仮設工','舗装工','土工','コンクリート工','鉄筋工','型枠工','基礎工'];
  if(!masterData.workCategories||masterData.workCategories.length===0){
    masterData.workCategories=[
      {category:'土木工事',items:workItems.map(n=>({name:n,hazards:[]}))},
      {category:'仮設工事',items:[{name:'仮設工',hazards:[]},{name:'足場工',hazards:[]}]}
    ];
    dbg('generateTestProject: created workCategories in masterData');
    await saveMasterData();
  }else if(!masterData.workCategories.some(c=>c.category==='土木工事')){
    masterData.workCategories.push({category:'土木工事',items:workItems.map(n=>({name:n,hazards:[]}))});
    dbg('generateTestProject: added 土木工事 category to masterData');
    await saveMasterData();
  }

  // 3) Generate 45 days of data (today - 44 days ~ today)
  const today=new Date();
  const hazards=M["危険要因"];
  const measures=M["安全対策"];
  const workers=['坂本','水野　博之','福島　利紀','塗木　一鑑','濱砂　幸治','日高　英司'];
  const materials=['生コンクリート','鉄筋 D13','鉄筋 D16','型枠用合板','砕石 RC-40','アスファルト合材','セメント','コルゲートパイプ'];
  const weatherOpts=['晴れ','曇り','雨','晴れ時々曇り','曇り一時雨'];

  // Group entries by month
  const monthData={};
  for(let i=44;i>=0;i--){
    const d=new Date(today);
    d.setDate(d.getDate()-i);
    // Skip Sundays
    if(d.getDay()===0) continue;
    const dk=localDateStr(d).replace(/-/g,'');
    const month=dk.substring(0,6);
    if(!monthData[month]) monthData[month]={};

    const numBlocks=1+Math.floor(Math.random()*3);
    const workBlocks=[];
    for(let b=0;b<numBlocks;b++){
      const item=workItems[Math.floor(Math.random()*workItems.length)];
      const haz1=hazards[Math.floor(Math.random()*hazards.length)];
      const haz2=hazards[Math.floor(Math.random()*hazards.length)];
      const meas1=HAZARD_DEFAULTS[haz1]?HAZARD_DEFAULTS[haz1].measure:measures[0];
      const meas2=HAZARD_DEFAULTS[haz2]?HAZARD_DEFAULTS[haz2].measure:measures[1];
      workBlocks.push({
        category:'土木工事',
        item:item,
        hazards:[
          {hazard:haz1,severity:HAZARD_DEFAULTS[haz1]?.sev||'10',frequency:HAZARD_DEFAULTS[haz1]?.freq||'5',measure:meas1},
          {hazard:haz2,severity:HAZARD_DEFAULTS[haz2]?.sev||'10',frequency:HAZARD_DEFAULTS[haz2]?.freq||'5',measure:meas2}
        ]
      });
    }

    // KY Activity data
    const entry={
      workDate:localDateStr(d),
      creator:'塩畑　圭一郎',
      notice:'安全第一で作業する。体調管理に注意。',
      safetyGoal:GOAL_MAP[workBlocks[0].hazards[0].measure]||'安全確認よし！',
      workBlocks:workBlocks,
      inspection:{'0-0':true,'0-1':true,'1-0':true,'1-1':true,'2-0':true},
      signatures:{}
    };

    // Nippo (daily report) data
    const numWorkers=2+Math.floor(Math.random()*4);
    const dayWorkers=[];
    const shuffled=[...workers].sort(()=>Math.random()-0.5);
    for(let w=0;w<Math.min(numWorkers,shuffled.length);w++){
      dayWorkers.push({name:shuffled[w],start:'08:00',end:'17:00',type:'作業員'});
    }
    const numNippoWork=1+Math.floor(Math.random()*2);
    const nippoWork=[];
    for(let n=0;n<numNippoWork;n++){
      const wi=workItems[Math.floor(Math.random()*workItems.length)];
      nippoWork.push({item:wi,spec:'一式',qty:String(10+Math.floor(Math.random()*90)),unit:'m'});
    }
    const numMat=Math.floor(Math.random()*3);
    const nippoMaterials=[];
    for(let m=0;m<numMat;m++){
      const mi=materials[Math.floor(Math.random()*materials.length)];
      nippoMaterials.push({name:mi,spec:'',qty:String(1+Math.floor(Math.random()*20)),unit:'t'});
    }

    entry.nippo={
      weather:weatherOpts[Math.floor(Math.random()*weatherOpts.length)],
      tempHigh:String(15+Math.floor(Math.random()*18)),
      tempLow:String(5+Math.floor(Math.random()*15)),
      work:nippoWork,
      workers:dayWorkers,
      materials:nippoMaterials,
      complaints:'特になし',
      envMeasures:'散水による粉塵対策実施',
      safetyItems:'KY活動実施。安全帯着用確認。'
    };

    monthData[month][dk]=entry;
  }

  // 4) Save monthly files to Drive (split into HA + DR)
  const months=Object.keys(monthData).sort();
  dbg('generateTestProject: saving '+months.length+' months x 2 files');
  for(const month of months){
    // Split into Hazard Assessment and Daily Report
    const haEntries={};
    const drEntries={};
    Object.keys(monthData[month]).forEach(dk=>{
      const e=monthData[month][dk];
      const haCopy={...e};
      delete haCopy.nippo;
      haEntries[dk]=haCopy;
      if(e.nippo) drEntries[dk]={nippo:e.nippo};
    });
    await createFileInFolder(folderId,month+'_Hazard_Assessment.json',JSON.stringify({entries:haEntries},null,2));
    await createFileInFolder(folderId,month+'_Daily_Report.json',JSON.stringify({entries:drEntries},null,2));
    dbg('generateTestProject: saved '+month+' HA+DR ('+Object.keys(haEntries).length+' days)');
  }

  // 5) Refresh project list and select the new project
  await refreshProjectList();
  const sel=document.getElementById('projectSelect');
  if(sel){
    sel.value=folderId;
    await onProjectSelect();
  }
  saveSession();
  showConfigStatus('✅ テストプロジェクト作成完了！ ('+Object.values(monthData).reduce((s,m)=>s+Object.keys(m).length,0)+'日分)');
  if(typeof onPageReady==='function') onPageReady();
  dbg('generateTestProject: done');
}
