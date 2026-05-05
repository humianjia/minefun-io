// 加载游戏到主页 iframe
function loadMainGame() {
    if (gamesData && gamesData.length > 0) {
        const firstGame = gamesData[0];
        const iframe = document.getElementById('game-iframe');
        const title = document.getElementById('current-game-title');
        const icon = document.getElementById('game-icon');
        
        if (iframe && firstGame.iframeUrl) {
            iframe.src = firstGame.iframeUrl;
        }
        
        if (title) {
            title.textContent = firstGame.name || 'Game';
        }
        
        if (icon && firstGame.imageUrl) {
            icon.src = firstGame.imageUrl.replace('game_icon', 'icon');
            icon.onerror = function() {
                this.src = 'img/icon/veckIo.jpg';
            };
        }
    }
}

// 加载游戏（用于点击游戏卡片）
function loadGame(gameIndex) {
    if (gamesData && gamesData[gameIndex]) {
        const game = gamesData[gameIndex];
        const iframe = document.getElementById('game-iframe');
        const title = document.getElementById('current-game-title');
        const icon = document.getElementById('game-icon');
        
        if (iframe) {
            iframe.src = game.iframeUrl || '';
        }
        
        if (title) {
            title.textContent = game.name || 'Game';
        }
        
        if (icon && game.imageUrl) {
            icon.src = game.imageUrl.replace('game_icon', 'icon');
            icon.onerror = function() {
                this.src = 'img/icon/veckIo.jpg';
            };
        }
    }
}

// 全屏切换
function toggleFullscreen() {
    const iframe = document.getElementById('game-iframe');
    if (iframe) {
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.webkitRequestFullscreen) {
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) {
            iframe.msRequestFullscreen();
        }
    }
}

// 打乱数组顺序（用于随机排序）
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 动态生成游戏卡片
function loadRelatedGames() {
    const container = document.getElementById('related-games-container');
    const sidebarContainer = document.getElementById('sidebar-games-container');
    
    // 合并所有分类的游戏数据
    const allGames = [
        ...(window.gamesData || []),
        ...(window.actionGames || []),
        ...(window.battleRoyaleData || []),
        ...(window.fpsData || []),
        ...(window.multiplayerGames || []),
        ...(window.sniperData || [])
    ];
    
    if (allGames.length === 0) return;
    
    // 随机打乱游戏数据
    const shuffledGames = shuffleArray(allGames);
    
    // 主内容区域取前18个
    const mainGames = shuffledGames.slice(0, 18);
    
    // 侧边栏取9个
    const sidebarGames = shuffledGames.slice(0, 9);
    
    // 清空容器
    if (container) container.innerHTML = '';
    if (sidebarContainer) sidebarContainer.innerHTML = '';
    
    // 生成主内容区游戏卡片
    if (container) {
        mainGames.forEach((game) => {
            const card = document.createElement('div');
            card.className = 'game-card-wide';
            card.setAttribute('data-game', game.id);
            card.innerHTML = `
                <img src="${game.imageUrl}" alt="${game.name}" onerror="this.src='img/icon/veckIo.jpg'">
                <div class="game-card-wide-title">${game.name}</div>
            `;
            card.addEventListener('click', function() {
                loadGameById(game.id);
            });
            container.appendChild(card);
        });
    }
    
    // 生成侧边栏游戏卡片
    if (sidebarContainer) {
        sidebarGames.forEach((game) => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.setAttribute('data-game', game.id);
            card.innerHTML = `
                <img src="${game.imageUrl}" alt="${game.name}" onerror="this.src='img/icon/veckIo.jpg'">
                <div class="game-card-title">${game.name}</div>
            `;
            card.addEventListener('click', function() {
                loadGameById(game.id);
            });
            sidebarContainer.appendChild(card);
        });
    }
}

// 根据游戏ID跳转到游戏页面
function loadGameById(gameId) {
    // 合并所有分类的游戏数据
    const allGames = [
        ...(window.gamesData || []),
        ...(window.actionGames || []),
        ...(window.battleRoyaleData || []),
        ...(window.fpsData || []),
        ...(window.multiplayerGames || []),
        ...(window.sniperData || [])
    ];

    const game = allGames.find(g => g.id === gameId);
    if (!game) return;

    // 跳转到游戏页面
    if (game.link) {
        window.location.href = game.link;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 加载主页游戏
    loadMainGame();
    
    // 加载21个随机游戏
    loadRelatedGames();
    
    // 初始化粒子背景
    initParticles();
    
    // 初始化鼠标跟随效果
    initCursorGlow();
    
    // 为新游戏区域的卡片添加点击事件
    const newGameCards = document.querySelectorAll('.series-game');
    newGameCards.forEach(card => {
        card.addEventListener('click', function() {
            const gameIndex = this.getAttribute('data-game');
            if (gameIndex !== null) {
                loadGame(parseInt(gameIndex));
            }
        });
    });
});

// 粒子背景效果
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

// 鼠标跟随光效
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;
    
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
    
    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        glow.style.opacity = '1';
    });
}