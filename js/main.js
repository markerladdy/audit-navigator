/* 医教财通 — main.js (仪表盘版) */
const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initSearch();
  initPage();
});

/* ===== 导航 ===== */
function initNav() {
  const header = document.querySelector('header');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  const cp = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (cp === href || cp === '/' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ===== 搜索 ===== */
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const searchPanel = document.getElementById('search-panel');
  const searchOverlay = document.getElementById('search-overlay');

  if (!searchInput) return;

  function doSearch(q) {
    if (!q || q.length < 2) return;
    fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(data => {
        const resultsEl = document.getElementById('search-results');
        if (!resultsEl) return;
        if (!data.items || data.items.length === 0) {
          resultsEl.innerHTML = '<div class="search-empty">未找到"' + q + '"相关内容</div>';
          return;
        }
        let html = '<div class="search-hits">找到 ' + data.total + ' 条结果</div>';
        data.items.forEach(item => {
          const link = item.type === 'article'
            ? '/article.html?slug=' + item.slug + '&type=article'
            : item.type === 'case'
              ? '/article.html?slug=' + item.slug + '&type=case'
              : '/article.html?id=' + item.id + '&type=news';
          html += '<a href="' + link + '" class="search-item" onclick="closeSearch()">' +
            '<span class="search-tag tag-' + item.type + '">' + typeLabel(item.type) + '</span>' +
            '<span class="search-title">' + item.title + '</span>' +
            '</a>';
        });
        resultsEl.innerHTML = html;
      })
      .catch(() => {
        document.getElementById('search-results').innerHTML = '<div class="search-empty">搜索服务暂不可用</div>';
      });
  }

  function openSearch() {
    searchPanel.classList.add('open');
    searchOverlay.classList.add('open');
    searchInput.value = '';
    searchInput.focus();
    document.getElementById('search-results').innerHTML = '';
  }

  function closeSearch() {
    searchPanel.classList.remove('open');
    searchOverlay.classList.remove('open');
  }

  searchBtn.addEventListener('click', () => openSearch());
  searchOverlay.addEventListener('click', () => closeSearch());
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  });

  let searchTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    const val = searchInput.value.trim();
    if (val.length < 2) {
      document.getElementById('search-results').innerHTML = '';
      return;
    }
    searchTimer = setTimeout(() => doSearch(val), 300);
  });

  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch(searchInput.value.trim());
  });

  window.closeSearch = closeSearch;
}

function typeLabel(type) {
  return { article: '文章', news: '资讯', case: '案例' }[type] || type;
}

/* ===== 页面分发 ===== */
function initPage() {
  const pageType = document.body.dataset.page;
  if (pageType === 'home') initHome();
  else if (pageType === 'news') initNews();
  else if (pageType === 'hospital' || pageType === 'education') initArticles(pageType);
  else if (pageType === 'cases') initCases();
  else if (pageType === 'article') initArticleDetail();
}

/* ===== 首页仪表盘 ===== */
function initHome() {
  // 加载最新资讯（右上）
  const newsContainer = document.getElementById('home-news');
  if (newsContainer) {
    fetch(API_BASE + '/news?limit=4')
      .then(r => r.json())
      .then(data => {
        if (!data.items || !data.items.length) {
          newsContainer.innerHTML = '<div class="search-empty">暂无资讯</div>';
          return;
        }
        newsContainer.innerHTML = data.items.map(item =>
          '<a href="/article.html?id=' + item.id + '&type=news" class="news-mini-card">' +
            '<span class="news-meta">' + (item.category || '动态') + '</span>' +
            '<span class="news-title-text">' + item.title + '</span>' +
            '<span class="news-date">' + formatDate(item.published_at) + '</span>' +
          '</a>'
        ).join('');
      })
      .catch(() => {
        newsContainer.innerHTML = '<div class="search-empty">加载失败</div>';
      });
  }

  // 加载案例预览（中下）
  const casesContainer = document.getElementById('cases-preview');
  if (casesContainer) {
    fetch(API_BASE + '/cases?limit=3')
      .then(r => r.json())
      .then(data => {
        if (!data.items || !data.items.length) {
          casesContainer.innerHTML = '<div class="search-empty">暂无案例</div>';
          return;
        }
        casesContainer.innerHTML = data.items.map(item =>
          '<a href="/article.html?slug=' + item.slug + '&type=case" class="case-mini">' +
            '<span class="case-mini-title">' + item.title + '</span>' +
            '<span class="case-mini-meta">' + (item.category || '') + ' · ' + formatDate(item.published_at) + '</span>' +
          '</a>'
        ).join('');
      })
      .catch(() => {
        casesContainer.innerHTML = '<div class="search-empty">加载失败</div>';
      });
  }
}

/* ===== 资讯页 ===== */
function initNews() {
  const container = document.getElementById('news-list');
  if (!container) return;

  let url = API_BASE + '/news?limit=30';
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  if (category) url += '&category=' + encodeURIComponent(category);

  fetch(url)
    .then(r => r.json())
    .then(data => {
      if (!data.items || !data.items.length) {
        container.innerHTML = '<div class="empty-state">暂无资讯</div>';
        return;
      }
      container.innerHTML = data.items.map(item =>
        '<a href="/article.html?id=' + item.id + '&type=news" class="news-card" style="display:block;text-decoration:none;color:inherit;">' +
          '<div class="news-card-header">' +
            '<span class="news-badge">' + (item.category || '资讯') + '</span>' +
            '<span class="news-source">' + (item.source || '') + '</span>' +
            '<span class="news-date">' + formatDate(item.published_at) + '</span>' +
          '</div>' +
          '<h3>' + item.title + '</h3>' +
          '<p>' + (item.summary || '') + '</p>' +
        '</a>'
      ).join('');
    })
    .catch(() => {
      container.innerHTML = '<div class="empty-state">加载失败，请稍后重试</div>';
    });
}

/* ===== 文章列表页（医院/院校） ===== */
function initArticles(section) {
  const container = document.querySelector('.article-grid');
  if (!container) return;

  fetch(API_BASE + '/articles?section=' + section + '&limit=20')
    .then(r => r.json())
    .then(data => {
      if (!data.items || !data.items.length) {
        container.innerHTML = '<div class="empty-state">暂无文章</div>';
        return;
      }
      container.innerHTML = data.items.map(item =>
        '<a href="/article.html?slug=' + item.slug + '&type=article" class="article-card">' +
          '<span class="article-cat">' + (item.category || '实务') + '</span>' +
          '<h3>' + item.title + '</h3>' +
          '<p>' + (item.summary ? item.summary.slice(0, 80) + '...' : '') + '</p>' +
          '<span class="article-date">' + formatDate(item.published_at) + '</span>' +
        '</a>'
      ).join('');
    })
    .catch(() => {
      container.innerHTML = '<div class="empty-state">加载失败</div>';
    });
}

/* ===== 案例页 ===== */
function initCases() {
  const container = document.querySelector('.cases-list');
  if (!container) return;

  fetch(API_BASE + '/cases?limit=20')
    .then(r => r.json())
    .then(data => {
      if (!data.items || !data.items.length) {
        container.innerHTML = '<div class="empty-state">暂无案例</div>';
        return;
      }
      container.innerHTML = data.items.map(item =>
        '<a href="/article.html?slug=' + item.slug + '&type=case" class="case-card" style="display:block;text-decoration:none;color:inherit;">' +
          '<h3>' + item.title + '</h3>' +
          '<p>' + (item.summary || '') + '</p>' +
          '<div class="case-meta">' +
            '<span>' + (item.category || '案例') + '</span>' +
            '<span>' + formatDate(item.published_at) + '</span>' +
          '</div>' +
        '</a>'
      ).join('');
    })
    .catch(() => {
      container.innerHTML = '<div class="empty-state">加载失败</div>';
    });
}

/* ===== 文章/案例详情页 ===== */
function initArticleDetail() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const id = params.get('id');
  const type = params.get('type') || 'article';

  if (!slug && !id) {
    document.getElementById('article-title').textContent = '页面不存在';
    document.getElementById('article-content').innerHTML = '<p>请从列表选择内容</p>';
    return;
  }

  let apiUrl, backUrl;
  if (type === 'case') {
    apiUrl = API_BASE + '/cases/' + slug;
    backUrl = '/cases';
  } else if (type === 'news') {
    apiUrl = API_BASE + '/news/' + id;
    backUrl = '/news';
  } else {
    apiUrl = API_BASE + '/articles/' + slug;
    backUrl = '/education';
  }

  fetch(apiUrl)
    .then(r => {
      if (!r.ok) throw new Error('Not found');
      return r.json();
    })
    .then(item => {
      if (type === 'article') {
        backUrl = item.section === 'hospital' ? '/hospital' : '/education';
      }
      document.title = item.title + ' — 医教财通';
      document.getElementById('article-title').textContent = item.title;

      const meta = document.getElementById('article-meta');
      let metaHtml = '';
      if (type === 'case') {
        metaHtml = '<span class="article-meta-tag">&#x1F4CB; 实例讲解</span>';
      } else if (type === 'news') {
        metaHtml = '<span class="article-meta-tag tag-news-badge">&#x1F4F0; 行业资讯</span>';
        if (item.source) metaHtml += '<span class="article-meta-tag">' + item.source + '</span>';
      } else if (item.section === 'hospital') {
        metaHtml = '<span class="article-meta-tag tag-hospital">&#x1F3E5; 医院专区</span>';
      } else {
        metaHtml = '<span class="article-meta-tag tag-edu">&#x1F3EB; 院校专区</span>';
      }
      if (item.category) metaHtml += '<span class="article-meta-tag">' + item.category + '</span>';
      if (item.author) metaHtml += '<span class="article-meta-author">' + item.author + '</span>';
      metaHtml += '<span class="article-meta-date">' + formatDate(item.published_at) + '</span>';
      meta.innerHTML = metaHtml;

      const contentDiv = document.getElementById('article-content');
      contentDiv.innerHTML = '<article class="article-body">' + (item.content || item.summary || '') + '</article>';
      contentDiv.innerHTML += '<div class="article-back"><a href="' + backUrl + '" class="btn btn-outline">&larr; 返回列表</a></div>';
    })
    .catch(() => {
      document.getElementById('article-title').textContent = '内容未找到';
      document.getElementById('article-content').innerHTML = '<p>该内容不存在或已被移除</p>';
    });
}

/* ===== 工具 ===== */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + day;
}
