import json

# Read slides data
with open(r"C:\Users\MuMa Studio\auditnavigator\downloads\slides_data.json", encoding="utf-8") as f:
    data = json.load(f)

json_str = json.dumps(data, ensure_ascii=False)

html = r'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>用友设计制造一体化解决方案 — 在线演示</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
      background: #1e293b; color: #f1f5f9;
      min-height: 100vh;
    }
    .top-bar {
      background: #0f172a; padding: 12px 24px;
      display: flex; align-items: center; justify-content: space-between;
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    }
    .top-bar h1 { font-size: 16px; font-weight: 600; }
    .top-bar .nav-btns { display: flex; gap: 8px; align-items: center; }
    .top-bar .nav-btns button {
      padding: 6px 16px; border-radius: 6px; border: none;
      font-size: 14px; cursor: pointer; font-weight: 600;
      background: #334155; color: #e2e8f0; transition: all .2s;
    }
    .top-bar .nav-btns button:hover { background: #475569; }
    .top-bar .nav-btns button:disabled { opacity: .4; cursor: default; }
    .top-bar .nav-btns .page-indicator { font-size: 14px; color: #94a3b8; min-width: 80px; text-align: center; }
    .top-bar .nav-btns .download-btn { background: #2563eb; color: white; }
    .top-bar .nav-btns .download-btn:hover { background: #1d4ed8; }
    .slide-area {
      padding: 80px 24px 40px; max-width: 1000px; margin: 0 auto;
      min-height: 100vh;
    }
    .slide-content {
      background: white; color: #1e293b;
      border-radius: 12px; padding: 48px; min-height: 60vh;
      box-shadow: 0 20px 60px rgba(0,0,0,.3);
    }
    .slide-content .title-lg { font-size: 32px; font-weight: 700; margin-bottom: 16px; }
    .slide-content .title-md { font-size: 24px; font-weight: 700; margin-bottom: 12px; }
    .slide-content .title-sm { font-size: 18px; font-weight: 600; margin-bottom: 8px; margin-top: 16px; }
    .slide-content .para { font-size: 15px; line-height: 1.8; margin-bottom: 8px; color: #334155; }
    .slide-content .para.indent-1 { padding-left: 24px; }
    .slide-content .para.indent-2 { padding-left: 48px; }
    .slide-content .para.bullet::before { content: "• "; color: #2563eb; font-weight: 700; }
    .slide-content .para.num { font-weight: 600; color: #0f172a; }
    .slide-content table {
      width: 100%; border-collapse: collapse; margin: 16px 0;
      font-size: 14px;
    }
    .slide-content th, .slide-content td {
      border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left;
    }
    .slide-content th { background: #f1f5f9; font-weight: 600; }
    .slide-index { text-align: center; color: #64748b; font-size: 13px; margin-top: 16px; }
    .return-link { text-align: center; margin-top: 16px; }
    .return-link a { color: #94a3b8; font-size: 14px; text-decoration: none; }
    .return-link a:hover { color: #60a5fa; }
    @media (max-width: 768px) {
      .top-bar h1 { font-size: 13px; }
      .slide-content { padding: 24px; }
      .slide-content .title-lg { font-size: 24px; }
      .slide-content .title-md { font-size: 20px; }
    }
  </style>
</head>
<body>

<div class="top-bar">
  <h1>📊 用友设计制造一体化解决方案</h1>
  <div class="nav-btns">
    <button id="prevBtn" onclick="prevSlide()">◀ 上一页</button>
    <span class="page-indicator" id="pageNum">1 / ''' + str(data["total"]) + r'''</span>
    <button id="nextBtn" onclick="nextSlide()">下一页 ▶</button>
    <a href="../downloads/用友高校实训-智能制造.pptx" class="download-btn" style="padding:6px 16px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">⬇ 下载PPT</a>
  </div>
</div>

<div class="slide-area" id="slideArea"></div>

<script>
const SLIDES = ''' + json_str + r'''.slides;
let current = 0;

function renderSlide(idx) {
  const area = document.getElementById('slideArea');
  const slide = SLIDES[idx];
  document.getElementById('pageNum').textContent = (idx+1) + ' / ' + SLIDES.length;
  document.getElementById('prevBtn').disabled = idx === 0;
  document.getElementById('nextBtn').disabled = idx === SLIDES.length - 1;

  let html = '<div class="slide-content">';
  for (const item of slide) {
    if (item.p) {
      for (const p of item.p) {
        let cls = 'para';
        if (p.l > 0) cls += ' indent-' + p.l;
        const isNum = /^[\d一二三四五六七八九十、]+[.、]/.test(p.t);
        if (p.l === 0 && p.t.length > 20 && !p.t.startsWith('•')) {
          if (p.t.length > 35) cls += ' title-sm';
          else cls += ' title-md';
        }
        if (p.l === 0 && p.t.length < 15 && /^[^\d]/.test(p.t)) cls += ' title-sm';
        const bullet = p.t.startsWith('•') || p.t.startsWith('-');
        if (bullet) cls += ' bullet';
        if (isNum) cls += ' num';
        html += '<div class="' + cls + '">' + p.t.replace(/•/g,'') + '</div>';
      }
    }
    if (item.t) {
      html += '<table>';
      for (let ri = 0; ri < item.t.length; ri++) {
        html += '<tr>';
        for (const cell of item.t[ri]) {
          html += (ri === 0 ? '<th>' : '<td>') + cell + (ri === 0 ? '</th>' : '</td>');
        }
        html += '</tr>';
      }
      html += '</table>';
    }
  }
  html += '</div>';
  html += '<div class="slide-index">第 ' + (idx+1) + ' / ' + SLIDES.length + ' 页</div>';
  html += '<div class="return-link"><a href="../education.html#yonyou">← 返回院校专区 · 用友软件应用</a></div>';
  area.innerHTML = html;
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function nextSlide() { if (current < SLIDES.length - 1) { current++; renderSlide(current); } }
function prevSlide() { if (current > 0) { current--; renderSlide(current); } }
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

renderSlide(0);
</script>
</body>
</html>'''

with open(r"C:\Users\MuMa Studio\auditnavigator\edu\yonyou-training.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Viewer page created!")
