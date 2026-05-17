const fs = require('fs');
const path = require('path');

const root = process.cwd();
const brand = 'minefun io';
const siteUrl = 'https://minefunio.space';
const referrerUrl = 'https://www.onlinegames.io/cat-runner/';
const refQuery = `?gd_sdk_referrer_url=${referrerUrl}`;

const categoryConfigs = {
  action: {
    folder: 'Action',
    label: 'Action',
    relatedTitle: 'More Action Games',
    varName: 'actionGames',
  },
  'battle-royale': {
    folder: 'BattleRoyale',
    label: 'Battle Royale',
    relatedTitle: 'More Battle Royale Games',
    varName: 'battleRoyaleData',
  },
  fps: {
    folder: 'FPS',
    label: 'Shooter',
    relatedTitle: 'More Shooter Games',
    varName: 'fpsData',
  },
  multiplayer: {
    folder: 'Multiplayer',
    label: 'Multiplayer',
    relatedTitle: 'More Multiplayer Games',
    varName: 'multiplayerGames',
  },
  sniper: {
    folder: 'Sniper',
    label: 'Sniper',
    relatedTitle: 'More Sniper Games',
    varName: 'sniperData',
  },
};

const brandReplacements = [
  ['Open Front - FrontWars.io', brand],
  ['FrontWars.io', brand],
  ['FrontWarsIO', brand],
  ['FrontWars', brand],
  ['FRONTWARS.IO', 'MINEFUN IO'],
  ['FRONTWARS IO', 'MINEFUN IO'],
  ['frontwars io', brand],
  ['MineFun.io', brand],
  ['MineFun', brand],
  ['VECK IO', brand],
  ['Veck.io', brand],
  ['VECK.IO', brand],
  ['veck io', brand],
  ['minefun.io', brand],
  ['minefun io io', brand],
  ['Mine<span class="logo-io">Fun</span>', `minefun <span class="logo-io">io</span>`],
  ['Mine<span class="logo-io">Fun</span>', `minefun <span class="logo-io">io</span>`],
  ["../img/icon/veckIo.jpg", "../img/icon/minefun.svg"],
  ["img/icon/veckIo.jpg", "img/icon/minefun.svg"],
  ['漏 2024 minefun io - Free Online Strategy Games. All rights reserved.', '© 2024 minefun io - Free Online H5 Games. All rights reserved.'],
  ['漏 2024 minefun io - Free Online H5 Games. All rights reserved.', '© 2024 minefun io - Free Online H5 Games. All rights reserved.'],
];

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeText(filePath, content) {
  fs.writeFileSync(filePath, content.replace(/\n/g, '\r\n'));
}

function slugify(title) {
  return title.replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function uniqueStrings(values) {
  const seen = new Set();
  const out = [];
  for (const value of values) {
    if (!value) continue;
    const normalized = String(value).trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(normalized);
  }
  return out;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildDescription(item, label) {
  const base = (item.desc || '').trim();
  if (base) {
    return `${base} Play it on ${brand} with no download required.`;
  }
  return `${item.title} is a free online ${label.toLowerCase()} game on ${brand}. Play instantly in your browser with no download required.`;
}

function buildKeywords(item, label) {
  const extras = [
    item.title,
    brand,
    'free online games',
    'browser games',
    `${label.toLowerCase()} games`,
    label.toLowerCase(),
    ...(item.genres || []),
    ...(item.kw ? item.kw.split(',') : []),
  ];
  return uniqueStrings(extras.map((value) => String(value).trim().toLowerCase())).join(', ');
}

function buildTags(item, label) {
  const tags = [
    brand,
    label.toLowerCase(),
    'browser game',
    'free online game',
  ];
  for (const genre of item.genres || []) {
    const cleaned = String(genre).trim();
    if (!cleaned || /^no blood|^no cruelty$/i.test(cleaned)) continue;
    tags.push(cleaned.toLowerCase());
    if (tags.length >= 6) break;
  }
  return uniqueStrings(tags);
}

function ratingFor(index) {
  return (4 + ((index % 6) * 0.1)).toFixed(1);
}

function buildRelatedTitle(categoryKey) {
  return categoryConfigs[categoryKey].relatedTitle;
}

function buildPageHtml(item, categoryKey, index) {
  const config = categoryConfigs[categoryKey];
  const description = buildDescription(item, config.label);
  const keywords = buildKeywords(item, config.label);
  const tags = buildTags(item, config.label);
  const safeTitle = escapeHtml(item.title);
  const safeDescription = escapeHtml(description);
  const safeKeywords = escapeHtml(keywords);
  const safeImage = escapeHtml(item.imageUrl);
  const iframeUrl = `${item.url}${refQuery}`;
  const titleSlug = item.title.toUpperCase();
  const tagHtml = tags
    .map((tag) => `<span class="tag"><i class="fas fa-tag"></i> ${escapeHtml(tag)}</span>`)
    .join('\n                        ');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle} - Play Free Online | ${brand}</title>
    <meta name="description" content="${safeDescription}">
    <meta name="keywords" content="${safeKeywords}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="${brand}">
    <link rel="canonical" href="${siteUrl}/${config.folder}/${slugify(item.title)}.html">
    <meta property="og:title" content="${safeTitle} - Play Free Online | ${brand}">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${siteUrl}/${config.folder}/${slugify(item.title)}.html">
    <meta property="og:image" content="${safeImage}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTitle} - Play Free Online | ${brand}">
    <meta name="twitter:description" content="${safeDescription}">
    <meta name="twitter:image" content="${safeImage}">
    <link rel="icon" type="image/svg+xml" href="../favicon.svg">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/index.css">
</head>
<body>
    <div class="particles" id="particles"></div>
    <div class="cursor-glow" id="cursorGlow"></div>
    <header class="header">
        <a href="../index.html" class="logo">
            <svg class="logo-icon" viewBox="0 0 50 50" width="45" height="45">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#34d399;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect x="8" y="12" width="34" height="26" rx="4" fill="none" stroke="url(#grad1)" stroke-width="2.5"/>
                <circle cx="18" cy="22" r="3" fill="#10b981"/>
                <circle cx="32" cy="22" r="3" fill="#34d399"/>
                <circle cx="25" cy="30" r="3" fill="#6ee7b7"/>
                <line x1="14" y1="12" x2="14" y2="8" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
                <line x1="25" y1="12" x2="25" y2="6" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>
                <line x1="36" y1="12" x2="36" y2="8" stroke="#6ee7b7" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span class="logo-text">minefun <span class="logo-io">io</span></span>
        </a>
        <nav class="nav-categories">
            <a href="../categories.html?category=action" class="nav-item">Action</a>
            <a href="../categories.html?category=battle-royale" class="nav-item">Battle</a>
            <a href="../categories.html?category=fps" class="nav-item">Shooter</a>
            <a href="../categories.html?category=multiplayer" class="nav-item">Multiplayer</a>
            <a href="../categories.html?category=sniper" class="nav-item">Sniper</a>
        </nav>
        <div class="search-bar">
            <input type="text" placeholder="Search games...">
            <i class="fas fa-search"></i>
        </div>
    </header>

    <div class="main-container">
        <main class="main-content">
            <div class="game-showcase">
                <div class="game-frame">
                    <iframe id="game-iframe" src="${iframeUrl}" allowfullscreen loading="lazy"></iframe>
                </div>
                <div class="game-controls">
                    <div class="game-title-section">
                        <img src="${safeImage}" id="game-icon" class="game-icon" alt="${safeTitle}" onerror="this.src='../img/icon/minefun.svg'">
                        <span class="game-title" id="current-game-title">${safeTitle}</span>
                    </div>
                    <div class="game-actions">
                        <i class="fas fa-expand" onclick="toggleFullscreen()"></i>
                    </div>
                </div>
            </div>

            <div class="related-games">
                <h3 class="section-title">${buildRelatedTitle(categoryKey)}</h3>
                <div class="games-grid" id="related-games-container"></div>
            </div>

            <div class="content-section">
                <div class="game-info">
                    <div class="info-header">Welcome to ${brand} - free online H5 games you can play instantly in your browser.</div>
                    <div class="info-content">
                        <h2>WHAT IS ${escapeHtml(titleSlug)}?</h2>
                        <p>${safeDescription}</p>
                        <p>Play instantly on ${brand} with no download required.</p>
                    </div>
                    <div class="tags">
                        <span class="tag"><i class="fas fa-bullseye"></i> ${brand}</span>
                        <span class="tag"><i class="fas fa-gamepad"></i> ${escapeHtml(config.label)}</span>
                        <span class="tag"><i class="fas fa-globe"></i> Browser Game</span>
                        ${tagHtml}
                    </div>
                </div>
            </div>
        </main>
    </div>

    <footer class="footer">
        <div class="footer-links">
            <a href="../index.html">About ${brand}</a>
            <a href="../contact.html">Contact Us</a>
            <a href="../contact.html">DMCA</a>
            <a href="../privacy-policy.html">Privacy Policy</a>
            <a href="../terms-of-service.html">Terms of Service</a>
            <a href="../cookie-policy.html">Cookie Policy</a>
        </div>
        <div class="footer-copyright">© 2024 ${brand} - Free Online H5 Games. All rights reserved.</div>
    </footer>

    <script src="../js/game_data/games.js"></script>
    <script src="../js/game_data/action.js"></script>
    <script src="../js/game_data/battleRoyale.js"></script>
    <script src="../js/game_data/fps.js"></script>
    <script src="../js/game_data/multiplayer.js"></script>
    <script src="../js/game_data/sniper.js"></script>
    <script>
        const CURRENT_TITLE = ${JSON.stringify(item.title)};
        const CURRENT_CATEGORY = ${JSON.stringify(categoryKey)};
        const CURRENT_FOLDER = ${JSON.stringify(config.folder)};

        function shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }

        function getAllGames() {
            return [
                ...(window.gamesData || []),
                ...(window.actionGames || []),
                ...(window.battleRoyaleData || []),
                ...(window.fpsData || []),
                ...(window.multiplayerGames || []),
                ...(window.sniperData || [])
            ];
        }

        function getCategoryGames() {
            const categoryMap = {
                action: window.actionGames || [],
                'battle-royale': window.battleRoyaleData || [],
                fps: window.fpsData || [],
                multiplayer: window.multiplayerGames || [],
                sniper: window.sniperData || []
            };
            return categoryMap[CURRENT_CATEGORY] || [];
        }

        function loadRelatedGames() {
            const container = document.getElementById('related-games-container');
            if (!container) return;

            const categoryGames = getCategoryGames().filter((game) => game.name !== CURRENT_TITLE);
            const fallbackGames = getAllGames().filter((game) => game.name !== CURRENT_TITLE);
            const sourceGames = categoryGames.length >= 12 ? categoryGames : fallbackGames;
            const shuffled = shuffleArray(sourceGames).slice(0, 12);

            container.innerHTML = '';
            shuffled.forEach((game) => {
                const card = document.createElement('div');
                card.className = 'game-card-wide';

                const img = document.createElement('img');
                img.src = game.imageUrl || '../img/icon/minefun.svg';
                img.alt = game.name;
                img.loading = 'lazy';
                img.onerror = function() {
                    this.src = '../img/icon/minefun.svg';
                };

                const title = document.createElement('div');
                title.className = 'game-card-wide-title';
                title.textContent = game.name;

                card.appendChild(img);
                card.appendChild(title);
                card.addEventListener('click', function() {
                    if (game.link) {
                        window.location.href = '../' + game.link;
                    }
                });
                container.appendChild(card);
            });
        }

        function toggleFullscreen() {
            const iframe = document.getElementById('game-iframe');
            if (!iframe) return;
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else if (iframe.requestFullscreen) {
                iframe.requestFullscreen();
            }
        }

        function initParticles() {
            const container = document.getElementById('particles');
            if (!container) return;
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 20 + 's';
                particle.style.animationDuration = (15 + Math.random() * 10) + 's';
                particle.style.width = (3 + Math.random() * 4) + 'px';
                particle.style.height = particle.style.width;
                container.appendChild(particle);
            }
        }

        function initCursorGlow() {
            const glow = document.getElementById('cursorGlow');
            if (!glow) return;
            document.addEventListener('mousemove', (e) => {
                glow.style.left = e.clientX - 100 + 'px';
                glow.style.top = e.clientY - 100 + 'px';
            });
        }

        loadRelatedGames();
        initParticles();
        initCursorGlow();
    </script>
</body>
</html>
`;
}

function updateGameDataFile(fileName, selectedItems, categoryKey) {
  const filePath = path.join(root, 'js', 'game_data', fileName);
  const current = readText(filePath);
  const config = categoryConfigs[categoryKey];
  const existingNames = new Set(
    [...current.matchAll(/"name"\s*:\s*"([^"]+)"/g)].map((match) => match[1].trim().toLowerCase())
  );

  const newEntries = selectedItems
    .filter((item) => !existingNames.has(item.title.toLowerCase()))
    .map((item, index) => {
      const linkFile = `${slugify(item.title)}.html`;
      const description = buildDescription(item, config.label);
      const keywords = buildKeywords(item, config.label);
      const tags = buildTags(item, config.label);
      const imageUrl = item.imageUrl;
      return {
        id: item.title,
        name: item.title,
        imageUrl,
        gameType: config.label,
        rating: ratingFor(index),
        description,
        keywords,
        link: `${config.folder}/${linkFile}`,
        tags,
        iframeUrl: `${item.url}${refQuery}`,
      };
    });

  if (!newEntries.length) return;

  const serialized = newEntries
    .map((entry) => `    ${JSON.stringify(entry, null, 4).replace(/\n/g, '\n    ')}`)
    .join(',\n');

  const next = current.replace(/\]\s*;?\s*$/, `${current.includes('[\r\n') ? ',\r\n' : ',\n'}${serialized}\n];\n`);
  writeText(filePath, next);
}

function normalizeRootPages() {
  const indexPath = path.join(root, 'index.html');
  let indexContent = readText(indexPath);
  indexContent = indexContent
    .replace(/<title>[\s\S]*?<\/title>/, '<title>minefun io - Free Online H5 Games | Browser Game Platform</title>')
    .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="minefun io - Play free online H5 games! Discover action, battle royale, shooter, multiplayer, and sniper browser games with instant play and no download required.">')
    .replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="minefun io - Free Online H5 Games on minefunio.space">')
    .replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="minefun io - Play free H5 games on minefunio.space! Action, shooter, multiplayer, sniper, and battle royale games with no download required.">')
    .replace(/<div class="info-header">[\s\S]*?<\/div>/, '<div class="info-header">Welcome to minefun io - a fast, browser-based game hub packed with free action, shooter, multiplayer, sniper, and battle royale games.</div>')
    .replace(/<div class="info-content">[\s\S]*?<\/div>\s*<div class="tags">/, `<div class="info-content">
                        <h2>WHAT IS MINEFUN IO?</h2>
                        <p><strong>minefun io</strong> is a free online H5 game platform where you can jump into browser games instantly. The site focuses on quick-loading iframe games sourced from GameDistribution and organized into action, battle royale, shooter, multiplayer, and sniper categories.</p>
                        <p>Instead of downloads or installs, you can browse the catalog, open a game page, and start playing right away. Whether you want arcade runners, tank battles, sniper missions, or competitive multiplayer matches, minefun io keeps everything in one place.</p>

                        <h3>INSTANT PLAY</h3>
                        <p>Every featured game opens directly inside the page with an embedded iframe, so players can launch titles in seconds. There is no signup wall, no extra launcher, and no delay between discovering a game and trying it.</p>
                        <p>The homepage also rotates recommended titles from across the full catalog, making it easy to discover something new every visit.</p>

                        <h3>GAME CATEGORIES</h3>
                        <ul>
                            <li><strong>Action:</strong> Endless runners, survival challenges, and fast arcade gameplay</li>
                            <li><strong>Battle Royale:</strong> Last-player-standing battles, pixel battlegrounds, and royale-style arenas</li>
                            <li><strong>Shooter:</strong> Gun games, tactical firefights, zombie defense, and combat-focused action</li>
                            <li><strong>Multiplayer:</strong> Tank duels, sports matchups, and online PvP experiences</li>
                            <li><strong>Sniper:</strong> Precision shooting missions, assassin challenges, and hunting games</li>
                        </ul>

                        <h3>WHY PLAY HERE</h3>
                        <ul>
                            <li><strong>No download required:</strong> Play directly in your browser on desktop or mobile</li>
                            <li><strong>Curated categories:</strong> Browse games by play style instead of digging through giant lists</li>
                            <li><strong>Fast discovery:</strong> Related game sections help players move between similar titles</li>
                            <li><strong>Simple access:</strong> Open a detail page, hit play, and jump into the game immediately</li>
                        </ul>
                    </div>
                    <div class="tags">`)
    .replace(/<span class="tag"><i class="fas fa-globe"><\/i>[\s\S]*?<\/div>\s*<\/div>\s*<\/main>/, `<span class="tag"><i class="fas fa-globe"></i> MINEFUN IO</span>
                        <span class="tag"><i class="fas fa-fist-raised"></i> ACTION</span>
                        <span class="tag"><i class="fas fa-crosshairs"></i> SHOOTER</span>
                        <span class="tag"><i class="fas fa-users"></i> MULTIPLAYER</span>
                        <span class="tag"><i class="fas fa-bullseye"></i> SNIPER</span>
                        <span class="tag"><i class="fas fa-skull"></i> BATTLE ROYALE</span>
                    </div>
                </div>
            </div>
        </main>`)
    .replace(/<a href="\.\.\/index\.html">About minefun io<\/a>/, '<a href="index.html">About minefun io</a>')
    .replace(/<a href="\.\.\/contact\.html">Contact Us<\/a>/, '<a href="contact.html">Contact Us</a>')
    .replace(/<a href="\.\.\/contact\.html">DMCA<\/a>/, '<a href="contact.html">DMCA</a>')
    .replace(/<a href="\.\.\/privacy-policy\.html">Privacy Policy<\/a>/, '<a href="privacy-policy.html">Privacy Policy</a>')
    .replace(/<a href="\.\.\/terms-of-service\.html">Terms of Service<\/a>/, '<a href="terms-of-service.html">Terms of Service</a>')
    .replace(/<a href="\.\.\/cookie-policy\.html">Cookie Policy<\/a>/, '<a href="cookie-policy.html">Cookie Policy</a>')
    .replace(/© 2024 minefun io - Free Online Strategy Games\. All rights reserved\./, '© 2024 minefun io - Free Online H5 Games. All rights reserved.')
    .replace(/漏 2024 minefun io - Free Online Strategy Games\. All rights reserved\./, '© 2024 minefun io - Free Online H5 Games. All rights reserved.');
  writeText(indexPath, indexContent);

  const categoriesPath = path.join(root, 'categories.html');
  let categoriesContent = readText(categoriesPath);
  categoriesContent = categoriesContent
    .replace(/<title>[\s\S]*?<\/title>/, '<title>Game Categories - minefun io | Free Online H5 Games</title>')
    .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Browse all game categories at minefun io - action, battle royale, shooter, multiplayer, sniper, and more free browser games.">')
    .replace(/<meta name="keywords" content="[^"]*">/, '<meta name="keywords" content="minefun io, game categories, browser games, action games, battle royale games, shooter games, multiplayer games, sniper games">')
    .replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="Browse all game categories - action, battle royale, shooter, multiplayer, sniper, and more!">')
    .replace(/<p class="page-subtitle">[\s\S]*?<\/p>/, '<p class="page-subtitle">Explore our collection of free online H5 games</p>')
    .replace(/<a href="\.\.\/index\.html">About minefun io<\/a>/, '<a href="index.html">About minefun io</a>')
    .replace(/<a href="\.\.\/contact\.html">Contact Us<\/a>/, '<a href="contact.html">Contact Us</a>')
    .replace(/<a href="\.\.\/contact\.html">DMCA<\/a>/, '<a href="contact.html">DMCA</a>')
    .replace(/<a href="\.\.\/privacy-policy\.html">Privacy Policy<\/a>/, '<a href="privacy-policy.html">Privacy Policy</a>')
    .replace(/<a href="\.\.\/terms-of-service\.html">Terms of Service<\/a>/, '<a href="terms-of-service.html">Terms of Service</a>')
    .replace(/<a href="\.\.\/cookie-policy\.html">Cookie Policy<\/a>/, '<a href="cookie-policy.html">Cookie Policy</a>')
    .replace(/© 2024 minefun io - Free Online Strategy Games\. All rights reserved\./, '© 2024 minefun io - Free Online H5 Games. All rights reserved.');
  writeText(categoriesPath, categoriesContent);

  const gamesPath = path.join(root, 'js', 'game_data', 'games.js');
  let gamesContent = readText(gamesPath);
  gamesContent = gamesContent
    .replace('"name": "MineFun.io"', '"name": "minefun io"')
    .replace('"description": "MineFun.io offers free online H5 games! Play strategy, action, shooter and multiplayer games directly in your browser. No download required, just click and play!"', '"description": "minefun io offers free online H5 games! Play action, battle royale, shooter, multiplayer, and sniper games directly in your browser with no download required."')
    .replace('"keywords": "minefun, minefun io, minefun.io, h5 games, online games, free games, browser games, io games, multiplayer games, strategy games, action games, shooter games"', '"keywords": "minefun io, h5 games, online games, free games, browser games, io games, multiplayer games, action games, shooter games, battle royale games, sniper games"')
    .replace('"gameplay": "FrontWars.io gameplay revolves around strategic territory expansion. Start with a small base, conquer adjacent territories, balance troops and workers, and build cities, ports, and defense posts. Form alliances, trade resources, and deploy naval forces and missiles to dominate the map."', '"gameplay": "minefun io is a browser-based H5 game portal focused on instant-play action, battle royale, shooter, multiplayer, and sniper games. Browse by category, open a detail page, and start playing right away."')
    .replace(/"gameModes": \[[\s\S]*?\]/, `"gameModes": [
            "Instant Play",
            "Action Games",
            "Shooter Games",
            "Multiplayer Games"
        ]`)
    .replace(/"features": \[[\s\S]*?\]/, `"features": [
            "Instant browser play",
            "Action and shooter categories",
            "Battle royale selection",
            "Multiplayer and sniper games",
            "No download required",
            "Category browsing",
            "Cross-platform play"
        ]`);
  writeText(gamesPath, gamesContent);

  const termsPath = path.join(root, 'terms-of-service.html');
  let termsContent = readText(termsPath);
  termsContent = termsContent.replace('Open Front, minefun io, and all related logos and trademarks are the property of minefun io. You may not use our trademarks without prior written consent.', 'minefun io and all related logos and trademarks are the property of minefun io. You may not use our trademarks without prior written consent.');
  writeText(termsPath, termsContent);
}

function updateBrandingAcrossFiles() {
  const targets = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === '.git' || entry.name === 'node_modules') continue;
        walk(fullPath);
      } else if (entry.isFile()) {
        if (fullPath.endsWith('.html') || fullPath.endsWith('.md') || fullPath.endsWith('js/game_data/games.js')) {
          targets.push(fullPath);
        }
      }
    }
  }

  walk(root);

  for (const filePath of targets) {
    let content = readText(filePath);
    let changed = false;
    for (const [from, to] of brandReplacements) {
      if (content.includes(from)) {
        content = content.split(from).join(to);
        changed = true;
      }
    }
    if (changed) {
      writeText(filePath, content);
    }
  }
}

function main() {
  const selectionPath = path.join(root, 'gd-final-selection.json');
  const selections = JSON.parse(readText(selectionPath));

  for (const [categoryKey, items] of Object.entries(selections)) {
    const config = categoryConfigs[categoryKey];
    for (const item of items) {
      const fileName = `${slugify(item.title)}.html`;
      const folder = path.join(root, config.folder);
      fs.mkdirSync(folder, { recursive: true });
      const filePath = path.join(folder, fileName);
      writeText(filePath, buildPageHtml(item, categoryKey, 0));
    }
  }

  updateGameDataFile('action.js', selections.action, 'action');
  updateGameDataFile('battleRoyale.js', selections['battle-royale'], 'battle-royale');
  updateGameDataFile('fps.js', selections.fps, 'fps');
  updateGameDataFile('multiplayer.js', selections.multiplayer, 'multiplayer');
  updateGameDataFile('sniper.js', selections.sniper, 'sniper');

  updateBrandingAcrossFiles();
  normalizeRootPages();
}

main();
