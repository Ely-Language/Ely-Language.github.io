// docs.js – с поддержкой локализации (использует window.elyTranslations)
(function() {
    'use strict';

    let docsStructure = [];
    let flatPages = [];
    let currentPageIndex = 0;
    let currentLanguage = 'ru';
    let isLoading = false;
    let sidebarOpen = false;

    const docsNav = document.getElementById('docsNav');
    const markdownContent = document.getElementById('markdownContent');
    const navPrevBtn = document.getElementById('navPrevBtn');
    const navNextBtn = document.getElementById('navNextBtn');
    const sidebar = document.getElementById('docsSidebar');
    const burgerBtn = document.getElementById('burgerBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');

    const docsPaths = {
        ru: 'docsmdru',
        en: 'docsmden'
    };

    // Настройка marked (если загружен)
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            highlight: function(code, lang) {
                if (typeof hljs !== 'undefined') {
                    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                    return hljs.highlight(code, { language }).value;
                }
                return code;
            },
            langPrefix: 'hljs language-',
            gfm: true,
            breaks: false
        });
    }

    function getLanguage() {
        return window.elyTranslations ? window.elyTranslations.getCurrentLanguage() : (localStorage.getItem('ely_language') || 'ru');
    }

    async function loadDocsIndex(lang) {
        const path = docsPaths[lang];
        if (!path) return [];
        try {
            const response = await fetch(`${path}/docs-index.json`);
            if (!response.ok) throw new Error('Index not found');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error loading index:', error);
            return [];
        }
    }

    function buildFlatPages(structure) {
        const flat = [];
        structure.forEach((category, catIdx) => {
            category.files.forEach((page, pageIdx) => {
                flat.push({
                    category: category.category,
                    pageName: page.name,
                    file: page.file,
                    categoryIndex: catIdx,
                    pageIndex: pageIdx,
                    categoryObj: category
                });
            });
        });
        return flat;
    }

    async function loadMarkdown(page) {
        if (!page) return;
        const lang = currentLanguage;
        const path = docsPaths[lang];
        const fileUrl = `${path}/${page.category}/${page.file}`;
        try {
            isLoading = true;
            const loadingText = window.elyTranslations ? window.elyTranslations.get('docs-loading') : 'Загрузка...';
            markdownContent.innerHTML = `<div class="loading">${loadingText}</div>`;
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error('File not found');
            const mdText = await response.text();
            let html = await marked.parse(mdText);
            let cleanHtml = DOMPurify.sanitize(html, {
                ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code', 'ul', 'ol', 'li', 'blockquote', 'img', 'span'],
                ALLOWED_ATTR: ['href', 'name', 'target', 'src', 'alt', 'class', 'id', 'width', 'height']
            });
            markdownContent.innerHTML = html;
            if (typeof hljs !== 'undefined') {
                document.querySelectorAll('.markdown-body pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
            updateActiveNavItem(page);
            updateNavButtons();
        } catch (error) {
            markdownContent.innerHTML = `<div class="loading">${error.message}</div>`;
        } finally {
            isLoading = false;
        }
    }

    function updateActiveNavItem(activePage) {
        const allLinks = document.querySelectorAll('.category-pages a');
        allLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('data-file');
            if (href === activePage.file && link.getAttribute('data-category') === activePage.category) {
                link.classList.add('active');
            }
        });
    }

    function updateNavButtons() {
        if (navPrevBtn && navNextBtn) {
            navPrevBtn.disabled = currentPageIndex === 0;
            navNextBtn.disabled = currentPageIndex === flatPages.length - 1;
        }
    }

    function goToPage(index) {
        if (index < 0 || index >= flatPages.length) return;
        currentPageIndex = index;
        const page = flatPages[currentPageIndex];
        loadMarkdown(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.innerWidth <= 900) {
            closeSidebar();
        }
    }

    function renderNavMenu(structure, activePage) {
        if (!docsNav) return;
        let html = '';
        structure.forEach((category, catIdx) => {
            const categoryName = category.category;
            const files = category.files;
            let hasActive = false;
            if (activePage) {
                hasActive = files.some(f => f.name === activePage.pageName && f.file === activePage.file);
            }
            const collapsedClass = hasActive ? '' : 'collapsed';
            html += `<div class="nav-category" data-category-index="${catIdx}">`;
            html += `<div class="category-header">`;
            html += `<span>${escapeHtml(categoryName)}</span>`;
            html += `<span class="category-toggle ${collapsedClass}">▼</span>`;
            html += `</div>`;
            html += `<ul class="category-pages ${collapsedClass}" style="max-height: ${hasActive ? '500px' : '0'};">`;
            files.forEach((page, pageIdx) => {
                const isActive = activePage && activePage.file === page.file && activePage.category === categoryName;
                const activeClass = isActive ? 'active' : '';
                html += `<li><a href="#" data-category="${escapeHtml(categoryName)}" data-file="${escapeHtml(page.file)}" data-name="${escapeHtml(page.name)}" class="${activeClass}">${escapeHtml(page.name)}</a></li>`;
            });
            html += `</ul></div>`;
        });
        docsNav.innerHTML = html;

        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                const parent = header.closest('.nav-category');
                const toggle = header.querySelector('.category-toggle');
                const pagesList = parent.querySelector('.category-pages');
                if (pagesList.classList.contains('collapsed')) {
                    pagesList.classList.remove('collapsed');
                    toggle.classList.remove('collapsed');
                    pagesList.style.maxHeight = pagesList.scrollHeight + 'px';
                } else {
                    pagesList.classList.add('collapsed');
                    toggle.classList.add('collapsed');
                    pagesList.style.maxHeight = '0';
                }
            });
        });

        document.querySelectorAll('.category-pages a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.getAttribute('data-category');
                const file = link.getAttribute('data-file');
                const targetPage = flatPages.find(p => p.category === category && p.file === file);
                if (targetPage) {
                    goToPage(flatPages.indexOf(targetPage));
                }
            });
        });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    async function initDocs() {
        currentLanguage = getLanguage();
        const structure = await loadDocsIndex(currentLanguage);
        if (!structure.length) {
            const errorMsg = window.elyTranslations ? window.elyTranslations.get('docs-error-index') : 'Failed to load documentation.';
            markdownContent.innerHTML = `<div class="loading">${errorMsg}</div>`;
            return;
        }
        docsStructure = structure;
        flatPages = buildFlatPages(docsStructure);
        currentPageIndex = 0;
        const firstPage = flatPages[0];
        renderNavMenu(docsStructure, firstPage);
        await loadMarkdown(firstPage);
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebarOpen = false;
    }

    function setupBurgerMenu() {
        if (burgerBtn) {
            burgerBtn.addEventListener('click', () => {
                sidebar.classList.add('open');
                sidebarOpen = true;
            });
        }
        if (closeSidebarBtn) {
            closeSidebarBtn.addEventListener('click', closeSidebar);
        }
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 900 && sidebarOpen && 
                !sidebar.contains(e.target) && 
                e.target !== burgerBtn) {
                closeSidebar();
            }
        });
    }

    function setupNavButtons() {
        if (navPrevBtn) {
            navPrevBtn.addEventListener('click', () => {
                if (currentPageIndex > 0) goToPage(currentPageIndex - 1);
            });
        }
        if (navNextBtn) {
            navNextBtn.addEventListener('click', () => {
                if (currentPageIndex < flatPages.length - 1) goToPage(currentPageIndex + 1);
            });
        }
    }

    // При смене языка перезагружаем страницу (проще, чем перечитывать всё)
    window.addEventListener('languageChanged', () => {
        window.location.reload();
    });

    window.addEventListener('DOMContentLoaded', async () => {
        setupBurgerMenu();
        await initDocs();
        setupNavButtons();
    });
})();