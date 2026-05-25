// docs.js – загрузка документации и применение Shiki
import { initShiki, highlightCodeBlocks } from './docs-highlight.js';

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

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }

    function setupMarked() {
        if (typeof marked === 'undefined') return;
        marked.setOptions({
            gfm: true,
            breaks: false,
            headerIds: true,
            mangle: false
        });
    }

    function getLanguage() {
        if (window.elyTranslations) return window.elyTranslations.getCurrentLanguage();
        const saved = localStorage.getItem('ely_language');
        return (saved === 'en' || saved === 'ru') ? saved : 'ru';
    }

    async function loadDocsIndex(lang) {
        const path = docsPaths[lang];
        if (!path) return [];
        try {
            const response = await fetch(`${path}/docs-index.json`);
            if (!response.ok) throw new Error('Index not found');
            return await response.json();
        } catch (error) {
            console.error('Error loading index:', error);
            return [];
        }
    }

    function buildFlatPages(structure) {
        const flat = [];
        for (let catIdx = 0; catIdx < structure.length; catIdx++) {
            const category = structure[catIdx];
            for (let pageIdx = 0; pageIdx < category.files.length; pageIdx++) {
                const page = category.files[pageIdx];
                flat.push({
                    category: category.category,
                    pageName: page.name,
                    file: page.file,
                    categoryIndex: catIdx,
                    pageIndex: pageIdx,
                    categoryObj: category
                });
            }
        }
        return flat;
    }

    async function loadMarkdown(page) {
        if (!page) return;
        const lang = currentLanguage;
        const path = docsPaths[lang];
        const fileUrl = `${path}/${page.category}/${page.file}`;
        try {
            isLoading = true;
            markdownContent.innerHTML = '<div class="loading">Загрузка...</div>';
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error('File not found');
            const mdText = await response.text();

            let html = await marked.parse(mdText);
            markdownContent.innerHTML = html;

            await highlightCodeBlocks(markdownContent);

            updateActiveNavItem(page);
            updateNavButtons();
        } catch (error) {
            console.error('Load error:', error);
            markdownContent.innerHTML = `<div class="loading">${escapeHtml(error.message)}</div>`;
        } finally {
            isLoading = false;
        }
    }

    function updateActiveNavItem(activePage) {
        const allLinks = document.querySelectorAll('.category-pages a');
        for (const link of allLinks) {
            link.classList.remove('active');
            if (link.getAttribute('data-file') === activePage.file && link.getAttribute('data-category') === activePage.category) {
                link.classList.add('active');
            }
        }
    }

    function updateNavButtons() {
        if (navPrevBtn && navNextBtn) {
            navPrevBtn.disabled = (currentPageIndex === 0);
            navNextBtn.disabled = (currentPageIndex === flatPages.length - 1);
        }
    }

    function goToPage(index) {
        if (index < 0 || index >= flatPages.length) return;
        currentPageIndex = index;
        loadMarkdown(flatPages[currentPageIndex]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.innerWidth <= 900) closeSidebar();
    }

    function renderNavMenu(structure, activePage) {
        if (!docsNav) return;
        let html = '';
        for (const category of structure) {
            const categoryName = category.category;
            const files = category.files;
            let hasActive = false;
            if (activePage) {
                hasActive = files.some(f => f.name === activePage.pageName && f.file === activePage.file);
            }
            const collapsedClass = hasActive ? '' : 'collapsed';
            html += `<div class="nav-category">`;
            html += `<div class="category-header"><span>${escapeHtml(categoryName)}</span><span class="category-toggle ${collapsedClass}">▼</span></div>`;
            html += `<ul class="category-pages ${collapsedClass}" style="max-height: ${hasActive ? '500px' : '0'};">`;
            for (const page of files) {
                const isActive = activePage && activePage.file === page.file && activePage.category === categoryName;
                const activeClass = isActive ? 'active' : '';
                html += `<li><a href="#" data-category="${escapeHtml(categoryName)}" data-file="${escapeHtml(page.file)}" data-name="${escapeHtml(page.name)}" class="${activeClass}">${escapeHtml(page.name)}</a></li>`;
            }
            html += `</ul></div>`;
        }
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
                if (targetPage) goToPage(flatPages.indexOf(targetPage));
            });
        });
    }

    async function initDocs() {
        currentLanguage = getLanguage();
        setupMarked();
        const structure = await loadDocsIndex(currentLanguage);
        if (!structure.length) {
            markdownContent.innerHTML = '<div class="loading">Не удалось загрузить документацию. Проверьте папки docsmdru/docsmden и наличие docs-index.json.</div>';
            return;
        }
        docsStructure = structure;
        flatPages = buildFlatPages(docsStructure);
        currentPageIndex = 0;
        renderNavMenu(docsStructure, flatPages[0]);
        await loadMarkdown(flatPages[0]);
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebarOpen = false;
    }

    function setupBurgerMenu() {
        if (burgerBtn) burgerBtn.addEventListener('click', () => { sidebar.classList.add('open'); sidebarOpen = true; });
        if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 900 && sidebarOpen && !sidebar.contains(e.target) && e.target !== burgerBtn) closeSidebar();
        });
    }

    function setupNavButtons() {
        if (navPrevBtn) navPrevBtn.addEventListener('click', () => { if (currentPageIndex > 0) goToPage(currentPageIndex - 1); });
        if (navNextBtn) navNextBtn.addEventListener('click', () => { if (currentPageIndex < flatPages.length - 1) goToPage(currentPageIndex + 1); });
    }

    window.addEventListener('languageChanged', () => window.location.reload());
    window.addEventListener('DOMContentLoaded', async () => {
        setupBurgerMenu();
        await initShiki();
        await initDocs();
        setupNavButtons();
    });
})();