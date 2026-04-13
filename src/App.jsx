import { useState } from "react";

const MODELS = [
  { id: "kling",   name: "Kling v3",           tag: "物理擬真", color: "#FF6B35", desc: "人物動態 / 生物交互 / 長鏡頭" },
  { id: "runway",  name: "Runway Gen-4.5",      tag: "電影氛圍", color: "#4ECDC4", desc: "體積光 / 大氣渲染 / 相機控制" },
  { id: "luma",    name: "Luma Dream Machine",  tag: "3D空間",   color: "#A855F7", desc: "場景變形 / 超現實環境 / 深度感知" },
  { id: "minimax", name: "MiniMax Hailuo 02",   tag: "產品穩定", color: "#F59E0B", desc: "360旋轉 / 物件一致性 / 品牌特效" },
];

const SCENE_TYPES = [
  { id: "person",     label: "人物動態", icon: "👤", model: "kling"   },
  { id: "landscape",  label: "景觀氛圍", icon: "🌄", model: "runway"  },
  { id: "morph",      label: "場景變形", icon: "🌀", model: "luma"    },
  { id: "product",    label: "產品展示", icon: "📦", model: "minimax" },
  { id: "realestate", label: "房產空間", icon: "🏠", model: "runway"  },
  { id: "custom",     label: "自訂場景", icon: "✨", model: "kling"   },
];

const CAMERA_MOVES = [
  "Slow Dolly In（慢速推入）",
  "Dolly Zoom / Vertigo Effect（希區考克變焦）",
  "Pan（水平搖攝）",
  "Tilt（俯仰）",
  "Crane / Jib Shot（搖臂鏡頭）",
  "Handheld / Shaky Cam（手持感）",
  "Orbit / Arc（環繞鏡頭）",
  "Drone Shot（無人機航拍）",
];

const LIGHTING = [
  "Golden Hour（黃金時刻）",
  "Volumetric Lighting（體積光）",
  "Chiaroscuro（強烈明暗對比）",
  "Soft Natural Light（柔和自然光）",
  "Neon Atmosphere（霓虹氛圍）",
  "Studio Lighting（棚拍燈光）",
];

const PHYSICS = [
  "Subsurface Scattering（次表面散射）",
  "Fluid Dynamics（流體動力學）",
  "Inertia（慣性）",
  "Kelvin-Helmholtz Instability（雲霧漩渦）",
  "Caustics（焦散水紋）",
  "Realistic Textile Physics（織物物理）",
];

const TEMPLATES = {
  person:     { subject: "一位30歲亞洲女性在東京夜市中自然交談", details: "真實皮膚紋理、可見毛孔、自然呼吸感", camera: CAMERA_MOVES[0], lighting: LIGHTING[4], physics: PHYSICS[0], quality: "1080p, 60fps, High temporal consistency" },
  landscape:  { subject: "壯麗山脈全景，陽光穿透晨霧", details: "層次豐富的大氣效果，色彩濃郁", camera: CAMERA_MOVES[7], lighting: LIGHTING[1], physics: PHYSICS[3], quality: "4K, Cinematic color grading" },
  morph:      { subject: "茂密森林無縫轉化為未來風格實驗室", details: "3D空間深度保持一致，樹木變形為光柱", camera: CAMERA_MOVES[6], lighting: LIGHTING[3], physics: PHYSICS[1], quality: "Physics-aware rendering, Depth perception maintained" },
  product:    { subject: "啞光黑色高端手機在純白空間中懸浮旋轉", details: "玻璃螢幕反光細節絲滑，形狀零失真", camera: CAMERA_MOVES[6], lighting: LIGHTING[5], physics: PHYSICS[2], quality: "Zero shape distortion, Structural consistency" },
  realestate: { subject: "北歐風格客廳，落地窗，天花板挑高", details: "白橡木地板、奶油色布藝沙發、自然光影層次", camera: CAMERA_MOVES[0], lighting: LIGHTING[0], physics: PHYSICS[4], quality: "4K, No overhead lighting, Natural atmosphere" },
  custom:     { subject: "", details: "", camera: CAMERA_MOVES[0], lighting: LIGHTING[0], physics: PHYSICS[0], quality: "1080p, Cinematic quality" },
};

const MODEL_SUFFIX = {
  kling:   "Physical accuracy mode enabled. High temporal consistency. No warping in jewelry or accessories. Natural spontaneous blinking every 4 seconds.",
  runway:  "Generated with Runway Gen-4.5. Precise camera path control. Multi-Motion Brush applied. Maximum cinematic realism.",
  luma:    "3D-consistent environment. Physics-aware rendering. Depth perception maintained throughout. Surreal yet grounded.",
  minimax: "MiniMax Hailuo 02 model. Maximum structural consistency. Zero distortion during rotation.",
};

const DIRECTOR_MAP = {
  "Slow Dolly In":                 "builds intimacy and foregrounds character revelation",
  "Dolly Zoom / Vertigo Effect":   "creates psychological dread and spatial distortion",
  "Pan":                           "sweeps across landscape to reveal environmental scale",
  "Tilt":                          "reveals vertical scale from feet to face",
  "Crane / Jib Shot":              "lifts camera to establish epic spatial narrative",
  "Handheld / Shaky Cam":          "injects kinetic documentary realism and tension",
  "Orbit / Arc":                   "encircles subject for heroic 360-degree presence",
  "Drone Shot":                    "aerial surveillance establishes god-like perspective",
};

const PHYSICS_MAP = {
  "Subsurface Scattering":             "light penetrates skin surface and scatters internally, eliminating wax-figure plasticity",
  "Fluid Dynamics":                    "particle system simulates laminar-to-turbulent flow transitions with spray dispersion",
  "Inertia":                           "mass resistance delays motion onset, creating weighted realism in acceleration",
  "Kelvin-Helmholtz Instability":      "shear forces between atmospheric layers produce natural vortex patterns in clouds",
  "Caustics":                          "light refracts through curved surfaces projecting dynamic bright patterns onto geometry",
  "Realistic Textile Physics":         "fiber simulation with drag coefficients produces natural fabric resistance against motion",
};

const LIGHTING_MAP = {
  "Golden Hour":        "warm 3200K directional sunlight, long shadows, saturation boost",
  "Volumetric Lighting":"God rays piercing through particulate atmosphere, light scattering enabled",
  "Chiaroscuro":        "extreme contrast ratio 1:20, deep shadow pooling, single motivated key light",
  "Soft Natural Light": "overcast diffusion, low contrast, even fill, no hard shadows",
  "Neon Atmosphere":    "polychromatic LED spill, color temperature mix 3200K-6500K, bokeh bloom",
  "Studio Lighting":    "three-point setup, soft box key, rim separation, no ambient contamination",
};

function buildBasePrompt(form, modelId) {
  const cam   = form.camera.split("（")[0].trim();
  const light = form.lighting.split("（")[0].trim();
  const phys  = form.physics.split("（")[0].trim();
  return `${form.subject}. ${form.details ? form.details + ". " : ""}${light}. Camera: ${cam}. Physics: ${phys}. ${form.quality}. ${MODEL_SUFFIX[modelId] || ""}`.trim();
}

function generatePromptLocally(form, sceneType) {
  const scene   = SCENE_TYPES.find(s => s.id === sceneType);
  const modelId = scene?.model || "kling";
  const model   = MODELS.find(m => m.id === modelId);
  const cam     = form.camera.split("（")[0].trim();
  const light   = form.lighting.split("（")[0].trim();
  const phys    = form.physics.split("（")[0].trim();

  const dirNote   = DIRECTOR_MAP[cam]   || "precise motivated camera trajectory";
  const physNote  = PHYSICS_MAP[phys]   || "physics simulation enforces real-world material behavior";
  const lightNote = LIGHTING_MAP[light] || "layered atmospheric lighting with realistic light scattering";

  const engPrompt =
    `${form.subject}. ` +
    (form.details ? form.details + ". " : "") +
    `Camera: ${cam} — ${dirNote}. ` +
    `Lighting: ${light} — ${lightNote}. ` +
    `Physics simulation: ${phys} — ${physNote}. ` +
    `${form.quality}. ` +
    `${MODEL_SUFFIX[modelId]}`;

  const analysis = [
    `📷 ${cam}：${dirNote.charAt(0).toUpperCase() + dirNote.slice(1)}，引導觀眾情緒節奏`,
    `💡 ${light}：${lightNote.split(",")[0]}，觸發模型進階光影處理模組`,
    `⚙️ ${phys}：${physNote.split(",")[0]}，避免 AI 生成的「飄浮感」與材質失真`,
    `🎯 模型鎖定 ${model?.name}：${model?.desc}，發揮其核心能力優勢`,
  ].join("\n");

  const upgrades = [
    `✦ 加入「導演動機說明」—— 不只告訴 AI 鏡頭動，更說明為什麼這樣動`,
    `✦ 加入物理學術語「${phys}」—— 觸發世界模擬器底層物理渲染引擎`,
    `✦ 加入「${light} — ${lightNote.split(",")[0]}」—— 多層大氣效果取代單一打光描述`,
    `✦ 加入模型專屬後綴指令 —— 針對 ${model?.name} 解鎖對應核心能力`,
  ].join("\n");

  return `【英文提示詞】\n${engPrompt}\n\n【中文技術解析】\n${analysis}\n\n【導演指令升級點】\n${upgrades}`;
}

export default function App() {
  const [sceneType, setSceneType] = useState("person");
  const [form, setForm]           = useState(TEMPLATES["person"]);
  const [result, setResult]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [copied, setCopied]       = useState(false);
  const [activeTab, setActiveTab] = useState("builder");
  const [useAI, setUseAI]         = useState(false);

  const selectedModel = MODELS.find(m => m.id === SCENE_TYPES.find(s => s.id === sceneType)?.model);

  function handleSceneChange(id) {
    setSceneType(id);
    setForm({ ...TEMPLATES[id] });
    setResult("");
  }

  function handleFormChange(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    setResult("");
  }

  async function handleGenerate() {
    if (!form.subject.trim()) return;
    setLoading(true);
    setResult("");

    const modelId    = SCENE_TYPES.find(s => s.id === sceneType)?.model;
    const basePrompt = buildBasePrompt(form, modelId);

    if (!useAI) {
      await new Promise(r => setTimeout(r, 500));
      setResult(generatePromptLocally(form, sceneType));
      setLoading(false);
      return;
    }

    try {
      const prompt =
        `你是AI影片提示詞工程師。請用繁體中文回覆，提示詞用英文。\n\n` +
        `將以下基礎提示詞升級為專業AI影片生成指令，目標模型：${selectedModel?.name}\n\n` +
        `基礎提示詞：${basePrompt}\n\n` +
        `輸出三段：\n` +
        `【英文提示詞】完整英文prompt，含攝影機物理路徑、光影層次、物理動態關鍵字\n` +
        `【中文技術解析】4個要點說明每個技術詞的作用\n` +
        `【導演指令升級點】4個要點說明相比原始prompt新增了哪些電影級指令`;

      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model:      "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages:   [{ role: "user", content: prompt }],
        }),
      });

      const json = await res.json();
      let text = "";
      if (Array.isArray(json?.content)) {
        text = json.content.filter(b => b.type === "text").map(b => b.text).join("").trim();
      }
      setResult(text || generatePromptLocally(form, sceneType));
    } catch (_) {
      setResult(generatePromptLocally(form, sceneType));
    }

    setLoading(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const previewPrompt = buildBasePrompt(form, SCENE_TYPES.find(s => s.id === sceneType)?.model);

  return (
    <div style={S.root}>
      <div style={S.grain} />

      <header style={S.header}>
        <div style={S.hInner}>
          <div>
            <div style={S.badge}>AI PROMPT ENGINEER</div>
            <h1 style={S.title}>影片提示詞<span style={S.accent}>生成器</span></h1>
            <p style={S.sub}>導演思維 × 物理動態 × 電影語言</p>
          </div>
          <div style={S.pills}>
            {MODELS.map(m => (
              <div key={m.id} style={{ ...S.pill, borderColor: m.color + "55" }}>
                <span style={{ ...S.dot, background: m.color }} />
                <span style={S.pTxt}>{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div style={S.tabs}>
        {["builder","reference"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{ ...S.tab, ...(activeTab === t ? S.tabOn : {}) }}>
            {t === "builder" ? "🎬 提示詞生成器" : "📖 技術參考庫"}
          </button>
        ))}
        <div style={S.toggle}>
          <span style={S.tLbl}>本地</span>
          <div onClick={() => setUseAI(v => !v)}
            style={{ ...S.track, background: useAI ? "#FF6B35" : "#2A2A3E" }}>
            <div style={{ ...S.thumb, left: useAI ? 18 : 2 }} />
          </div>
          <span style={S.tLbl}>AI增強</span>
        </div>
      </div>

      {activeTab === "builder" ? (
        <main style={S.main}>
          <section style={S.left}>
            <div style={S.g}>
              <label style={S.lbl}>場景類型</label>
              <div style={S.sGrid}>
                {SCENE_TYPES.map(s => {
                  const m  = MODELS.find(m => m.id === s.model);
                  const on = sceneType === s.id;
                  return (
                    <button key={s.id} onClick={() => handleSceneChange(s.id)}
                      style={{ ...S.sBtn, ...(on ? { borderColor: m?.color, boxShadow: `0 0 14px ${m?.color}35`, background: "#16161F" } : {}) }}>
                      <span style={{ fontSize: 20 }}>{s.icon}</span>
                      <span style={{ fontSize: 11, color: "#CCC" }}>{s.label}</span>
                      <span style={{ fontSize: 9, color: m?.color, fontWeight: 700 }}>{m?.tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedModel && (
              <div style={{ ...S.mCard, borderColor: selectedModel.color + "44" }}>
                <span style={{ ...S.dot, background: selectedModel.color, width: 10, height: 10 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: selectedModel.color }}>{selectedModel.name}</div>
                  <div style={{ fontSize: 11, color: "#666680" }}>{selectedModel.desc}</div>
                </div>
              </div>
            )}

            <div style={S.g}>
              <label style={S.lbl}>主體描述 <span style={{ color: "#FF6B35" }}>*</span></label>
              <textarea value={form.subject}
                onChange={e => handleFormChange("subject", e.target.value)}
                placeholder="描述畫面的主角或核心場景..." style={S.ta} rows={2} />
            </div>

            <div style={S.g}>
              <label style={S.lbl}>細節補充</label>
              <textarea value={form.details}
                onChange={e => handleFormChange("details", e.target.value)}
                placeholder="材質、紋理、特徵等細節..." style={S.ta} rows={2} />
            </div>

            <div style={S.tri}>
              {[
                { label: "📷 攝影機運動", key: "camera",   opts: CAMERA_MOVES },
                { label: "💡 光影效果",   key: "lighting", opts: LIGHTING     },
                { label: "⚙️ 物理動態",   key: "physics",  opts: PHYSICS      },
              ].map(({ label, key, opts }) => (
                <div key={key} style={S.g}>
                  <label style={S.lbl}>{label}</label>
                  <select value={form[key]}
                    onChange={e => handleFormChange(key, e.target.value)} style={S.sel}>
                    {opts.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div style={S.g}>
              <label style={S.lbl}>🎥 品質參數</label>
              <input value={form.quality}
                onChange={e => handleFormChange("quality", e.target.value)} style={S.inp} />
            </div>

            <div style={S.prev}>
              <div style={S.pLbl}>基礎提示詞預覽</div>
              <div style={S.pTxt2}>{previewPrompt}</div>
            </div>

            <button onClick={handleGenerate}
              disabled={loading || !form.subject.trim()}
              style={{ ...S.btn, ...(loading || !form.subject.trim() ? S.btnOff : {}) }}>
              {loading ? "⟳ 生成中..." : `✦ ${useAI ? "AI" : "本地"}升級提示詞`}
            </button>
          </section>

          <section style={S.right}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={S.lbl}>🎬 專業級提示詞</span>
              {result && (
                <button onClick={handleCopy} style={S.cpBtn}>
                  {copied ? "✓ 已複製" : "複製"}
                </button>
              )}
            </div>

            {loading && (
              <div style={S.ctr}>
                <div style={S.spin} />
                <p style={{ color: "#555570", fontSize: 13, letterSpacing: 1 }}>
                  {useAI ? "導演正在思考最佳指令..." : "本地生成中..."}
                </p>
              </div>
            )}

            {!loading && !result && (
              <div style={S.ctr}>
                <div style={{ fontSize: 48, opacity: 0.2 }}>🎥</div>
                <p style={{ color: "#444460", fontSize: 13, textAlign: "center", lineHeight: 1.8 }}>
                  填寫左側表單後<br />點擊「升級提示詞」
                </p>
              </div>
            )}

            {!loading && result && (
              <div style={S.rBox}>
                {result.split("\n").map((line, i) => {
                  if (line.startsWith("【") && line.includes("】"))
                    return <div key={i} style={S.sec}>{line}</div>;
                  if (!line.trim()) return <div key={i} style={{ height: 6 }} />;
                  return <div key={i} style={{ color: "#CCCCDD", marginBottom: 3, lineHeight: 1.7 }}>{line}</div>;
                })}
              </div>
            )}
          </section>
        </main>
      ) : (
        <main style={{ padding: "28px 32px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20, marginBottom: 24 }}>
            {[
              { title: "🤖 四大核心模型", rows: MODELS.map(m => ({ code: m.name, desc: `${m.tag} — ${m.desc}`, color: m.color })) },
              { title: "📷 攝影機心理效應", rows: [
                  { code: "Slow Dolly In",  desc: "建立親密感、強化發現時的震撼" },
                  { code: "Dolly Zoom",     desc: "恐懼感、命運轉折點" },
                  { code: "Pan",            desc: "展示壯麗景觀，引導視線" },
                  { code: "Tilt",           desc: "展現高度、規模感" },
                  { code: "Crane Shot",     desc: "宏大空間感與敘事距離" },
                  { code: "Handheld",       desc: "紀實感、緊張度、沉浸能量" },
                  { code: "Orbit / Arc",    desc: "英雄主義感、動態深度" },
              ]},
              { title: "⚙️ 物理關鍵詞", rows: [
                  { code: "Subsurface Scattering", desc: "解決蠟像感，皮膚呼吸感" },
                  { code: "Fluid Dynamics",        desc: "水面交互、流體真實感" },
                  { code: "Inertia",               desc: "物體轉向時的自然阻力感" },
                  { code: "Kelvin-Helmholtz",      desc: "雲霧、煙霧的漩渦模式" },
                  { code: "Caustics",              desc: "水下光紋、玻璃折射光斑" },
                  { code: "Textile Physics",       desc: "旗幟裙襬的阻力運動" },
              ]},
              { title: "🎨 導演構圖風格", rows: [
                  { code: "Spielberg Face",   desc: "慢推入臉部，直接傳遞情緒衝擊" },
                  { code: "Fincher Style",    desc: "對稱幾何構圖，冰冷壓抑美學" },
                  { code: "Villeneuve Scale", desc: "巨大建築 vs 渺小人物" },
                  { code: "Dutch Angle",      desc: "傾斜地平線，製造不安心理張力" },
                  { code: "Worm's Eye",       desc: "Ultra-low angle，英雄主義感" },
                  { code: "Frame in Frame",   desc: "門框窗戶構圖，囚禁孤立象徵" },
              ]},
            ].map(card => (
              <div key={card.title} style={S.rCard}>
                <div style={S.rTitle}>{card.title}</div>
                {card.rows.map(r => (
                  <div key={r.code} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <code style={{ ...S.code, color: r.color || "#4ECDC4" }}>{r.code}</code>
                    <span style={{ fontSize: 11, color: "#888899", lineHeight: 1.5 }}>{r.desc}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={S.fml}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#FF6B35", marginBottom: 12, fontWeight: 700 }}>✦ 2026年標準提示詞公式</div>
            <div style={{ fontSize: 13, color: "#AAAACC", lineHeight: 2 }}>
              [場景語境] + [物理約束] + [攝影機指令] + [光影物理] + [情緒/風格] + [品質參數] + [模型專屬指令]
            </div>
          </div>
        </main>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        select option { background: #111118; color: #E8E8F0; }
      `}</style>
    </div>
  );
}

const S = {
  root:  { minHeight: "100vh", background: "#0A0A0F", color: "#E8E8F0", fontFamily: "'DM Mono','Fira Code',monospace", position: "relative" },
  grain: { position: "fixed", inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`, pointerEvents: "none", zIndex: 0 },
  header:{ borderBottom: "1px solid #1E1E2E", padding: "24px 32px", position: "relative", zIndex: 1, background: "linear-gradient(180deg,#0D0D18,transparent)" },
  hInner:{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 },
  badge: { fontSize: 10, letterSpacing: 4, color: "#FF6B35", marginBottom: 8, fontWeight: 700 },
  title: { fontSize: 32, fontWeight: 800, letterSpacing: -1, margin: 0, lineHeight: 1.1 },
  accent:{ color: "#FF6B35", marginLeft: 8 },
  sub:   { fontSize: 13, color: "#666680", marginTop: 6, letterSpacing: 2 },
  pills: { display: "flex", flexWrap: "wrap", gap: 8 },
  pill:  { display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", border: "1px solid", borderRadius: 4, background: "#111118", fontSize: 11 },
  dot:   { width: 6, height: 6, borderRadius: "50%", display: "inline-block", flexShrink: 0 },
  pTxt:  { color: "#AAAACC", letterSpacing: 0.5 },
  tabs:  { display: "flex", alignItems: "center", borderBottom: "1px solid #1E1E2E", padding: "0 32px", position: "relative", zIndex: 1 },
  tab:   { background: "none", border: "none", borderBottom: "2px solid transparent", color: "#555570", padding: "14px 20px", fontSize: 13, cursor: "pointer", letterSpacing: 0.5, fontFamily: "inherit" },
  tabOn: { color: "#FF6B35", borderBottomColor: "#FF6B35" },
  toggle:{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" },
  tLbl:  { fontSize: 10, color: "#555570", letterSpacing: 1 },
  track: { width: 36, height: 20, borderRadius: 10, position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 },
  thumb: { position: "absolute", top: 3, width: 14, height: 14, borderRadius: "50%", background: "#FFF", transition: "left 0.2s" },
  main:  { display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 160px)", position: "relative", zIndex: 1 },
  left:  { padding: "28px 32px", borderRight: "1px solid #1E1E2E", display: "flex", flexDirection: "column", gap: 18 },
  right: { padding: "28px 32px", display: "flex", flexDirection: "column", gap: 16 },
  g:     { display: "flex", flexDirection: "column", gap: 8 },
  lbl:   { fontSize: 11, letterSpacing: 2, color: "#888899", fontWeight: 600, textTransform: "uppercase" },
  sGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 },
  sBtn:  { background: "#111118", border: "1px solid #1E1E2E", borderRadius: 8, padding: "12px 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all 0.2s" },
  mCard: { display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#111118", border: "1px solid", borderRadius: 6 },
  ta:    { background: "#111118", border: "1px solid #1E1E2E", borderRadius: 6, color: "#E8E8F0", padding: "10px 12px", fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", lineHeight: 1.6 },
  tri:   { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 },
  sel:   { background: "#111118", border: "1px solid #1E1E2E", borderRadius: 6, color: "#E8E8F0", padding: "8px 10px", fontSize: 11, fontFamily: "inherit", outline: "none", cursor: "pointer", width: "100%" },
  inp:   { background: "#111118", border: "1px solid #1E1E2E", borderRadius: 6, color: "#E8E8F0", padding: "10px 12px", fontSize: 13, fontFamily: "inherit", outline: "none", width: "100%" },
  prev:  { background: "#0D0D18", border: "1px dashed #2A2A3E", borderRadius: 6, padding: "12px 14px" },
  pLbl:  { fontSize: 9, letterSpacing: 3, color: "#444460", marginBottom: 8, textTransform: "uppercase" },
  pTxt2: { fontSize: 11, color: "#888899", lineHeight: 1.7, fontStyle: "italic" },
  btn:   { background: "linear-gradient(135deg,#FF6B35,#FF8C55)", border: "none", borderRadius: 8, color: "#FFF", padding: "14px 24px", fontSize: 14, fontFamily: "inherit", fontWeight: 700, cursor: "pointer", letterSpacing: 2, boxShadow: "0 4px 24px #FF6B3540" },
  btnOff:{ background: "#1E1E2E", color: "#444460", boxShadow: "none", cursor: "not-allowed" },
  ctr:   { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 16 },
  spin:  { width: 32, height: 32, border: "2px solid #1E1E2E", borderTop: "2px solid #FF6B35", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  rBox:  { background: "#0D0D18", border: "1px solid #1E1E2E", borderRadius: 8, padding: "20px", fontSize: 13, overflowY: "auto", maxHeight: "calc(100vh - 320px)", flex: 1 },
  sec:   { color: "#FF6B35", fontWeight: 700, fontSize: 12, letterSpacing: 2, marginTop: 16, marginBottom: 8, borderBottom: "1px solid #1E1E2E", paddingBottom: 8 },
  cpBtn: { background: "#1E1E2E", border: "1px solid #2A2A3E", borderRadius: 4, color: "#AAAACC", padding: "6px 14px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" },
  rCard: { background: "#0D0D18", border: "1px solid #1E1E2E", borderRadius: 10, padding: 20 },
  rTitle:{ fontSize: 12, letterSpacing: 2, color: "#FF6B35", fontWeight: 700, marginBottom: 16, textTransform: "uppercase" },
  code:  { background: "#1A1A28", border: "1px solid #2A2A3E", borderRadius: 4, padding: "2px 8px", fontSize: 10, flexShrink: 0, whiteSpace: "nowrap" },
  fml:   { background: "linear-gradient(135deg,#0D0D18,#111120)", border: "1px solid #FF6B3530", borderRadius: 10, padding: "20px 24px", textAlign: "center" },
};
