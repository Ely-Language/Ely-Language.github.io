// loca.js — локализация Ely (главная страница, версии, документация)
(function() {
    'use strict';

    const translations = {
        ru: {
            // Главная навигация (общая)
            'nav-features': 'Возможности',
            'nav-performance': 'Производительность',
            'nav-versions': 'Версии',
            'nav-docs': 'Документация',

            // Баннер версий (versions.html)
            'versions-banner-title': 'Ely – версии и стандарты',
            'versions-banner-desc': 'Стандарты (ГГ.М) и билды (build ДДМ) – выбирай стабильность и скачивай нужную версию.',
            'btn-download-ely': 'Скачать ElySpruce',
            'btn-vscode-extension': 'VS Code расширение',
            'btn-docs-banner': 'Документация',

            // Текущий стандарт (versions.html)
            'current-standard-title': 'Текущий стандарт – 26.5',
            'current-standard-month': 'Май 2026',
            'latest-badge': 'последний билд',
            'latest-desc': 'Стабильный релиз – компилятор пишет на C++, добавлены интерфейсы, async, пакетный менеджер ELP.',
            'changelog-current-title': 'Список изменений (build 215)',
            'download-latest-btn': 'Скачать build 215',
            'all-builds-title': 'Все билды стандарта 26.5',
            'builds-note': 'Билды нумеруются по схеме: build ДДМ (день + месяц без нуля).',

            // Предыдущие стандарты (versions.html)
            'prev-standards-title': 'Предыдущие стандарты',

            // Документация (docs.html)
            'docs-title': 'Ely – документация',
            'docs-sidebar-title': 'Содержание',
            'docs-loading': 'Загрузка документации...',
            'docs-error-index': 'Не удалось загрузить документацию. Убедитесь, что папки docsmdru/docsmden существуют и содержат docs-index.json.',
            'docs-nav-prev': '← Предыдущая',
            'docs-nav-next': 'Следующая →',
            'docs-burger-label': 'Меню',
            'docs-close-sidebar-label': 'Закрыть',

            // Футер (общий)
            'footer-copyright': '© %year% Ely-Language. Открытый исходный код.',
            'footer-github': 'GitHub',
            'footer-telegram': 'Telegram',
            'footer-extension': 'Расширение',

            // ... (остальные ключи для главной страницы)
            'hero-subtitle': 'Вы выбираете, как вам писать',
            'hero-description': 'Универсальный молодой язык с простотой, гибкостью и скоростью',
            'cta-get-started': 'Начните работу',
            'cta-github': 'Исходный код',
            'stat-version-label': 'стандарт',
            'stat-perf-label': 'оп/сек',
            'stat-license-label': 'лицензия',
            'feature-1-title': 'Безопасность памяти',
            'feature-1-desc': 'Поколенческий GC – настраиваемый, без утечек.',
            'feature-2-title': 'Делайте программы быстрыми',
            'feature-2-desc': 'Статическая типизация даёт более 20M операций/сек.',
            'feature-3-title': 'Динамический any',
            'feature-3-desc': 'Пользуйтесь удобствами динамической типизации для лёгких мест.',
            'perf-heading': 'Производительность',
            'perf-subheading': 'Статика – на уровне C, динамика – удобство без жертв.',
            'perf-static-label': '(операций/сек, статический int)',
            'perf-any-label': '(операций/сек, динамический any)',
            'th-lang': 'Язык',
            'th-typing': 'Типизация',
            'th-gc': 'GC',
            'th-cgen': 'Генерация C',
            'th-ffi': 'FFI C',
            'th-perf': 'Производительность, оп/сек',
            'mod-title': 'Модульность',
            'mod-desc': 'Компиляция в .dll/.so, экспорт публичных функций.',
            'reflect-title': 'Рефлексия',
            'reflect-desc': 'typeof, fields, methods – интроспекция времени выполнения.',
            'json-title': 'File',
            'json-desc': 'Удобная работа с файлами через std модуль file',
            'ffi-title': 'C FFI',
            'ffi-desc': 'Вызов любых C‑функций, динамическая загрузка библиотек.',
            'tooling-title': 'Инструментарий',
            'tool-compiler': 'компилятор Python → C++',
            'tool-ebt': 'ebt build - для компиляции',
            'tool-config': 'ebt project - для создания проекта',
            'tool-proj': 'elp - собственный пакетный менеджер',
            'cta-title': 'Начните сейчас',
            'cta-subtitle': 'Одна команда – и ваш проект готов к написанию. Открытый код, премиальная скорость',
            'cta-download': 'Скачать ElySpruce',
            'cta-docs': 'Документация'
        },
        en: {
            // Navigation
            'nav-features': 'Features',
            'nav-performance': 'Performance',
            'nav-versions': 'Versions',
            'nav-docs': 'Docs',

            // Banner (versions)
            'versions-banner-title': 'Ely – versions and standards',
            'versions-banner-desc': 'Standards (YY.M) and builds (build DDM) – pick stability and download the version you need.',
            'btn-download-ely': 'Download ElySpruce',
            'btn-vscode-extension': 'VS Code extension',
            'btn-docs-banner': 'Documentation',

            // Current standard (versions)
            'current-standard-title': 'Current standard – 26.5',
            'current-standard-month': 'May 2026',
            'latest-badge': 'latest build',
            'latest-desc': 'Stable release – compiler generates C++, added interfaces, async, ELP package manager.',
            'changelog-current-title': 'Changelog (build 215)',
            'download-latest-btn': 'Download build 215',
            'all-builds-title': 'All builds of standard 26.5',
            'builds-note': 'Builds are numbered as build DDM (day + month without leading zero).',

            // Previous standards (versions)
            'prev-standards-title': 'Previous standards',

            // Documentation (docs.html)
            'docs-title': 'Ely – documentation',
            'docs-sidebar-title': 'Contents',
            'docs-loading': 'Loading documentation...',
            'docs-error-index': 'Failed to load documentation. Make sure docsmdru/docsmden folders exist and contain docs-index.json.',
            'docs-nav-prev': '← Previous',
            'docs-nav-next': 'Next →',
            'docs-burger-label': 'Menu',
            'docs-close-sidebar-label': 'Close',

            // Footer
            'footer-copyright': '© %year% Ely-Language. Open source.',
            'footer-github': 'GitHub',
            'footer-telegram': 'Telegram',
            'footer-extension': 'Extension',

            // ... (main page keys)
            'hero-subtitle': 'You choose how to write',
            'hero-description': 'A universal young language with simplicity, flexibility, and speed',
            'cta-get-started': 'Get Started',
            'cta-github': 'Source Code',
            'stat-version-label': 'standard',
            'stat-perf-label': 'ops/sec',
            'stat-license-label': 'license',
            'feature-1-title': 'Memory Safety',
            'feature-1-desc': 'Generational GC – configurable, no leaks.',
            'feature-2-title': 'Make programs fast',
            'feature-2-desc': 'Static typing delivers over 20M ops/sec.',
            'feature-3-title': 'Dynamic any',
            'feature-3-desc': 'Enjoy dynamic typing convenience for lightweight parts.',
            'perf-heading': 'Performance',
            'perf-subheading': 'Static – on par with C, dynamic – convenience without sacrifice.',
            'perf-static-label': '(ops/sec, static int)',
            'perf-any-label': '(ops/sec, dynamic any)',
            'th-lang': 'Language',
            'th-typing': 'Typing',
            'th-gc': 'GC',
            'th-cgen': 'C Generation',
            'th-ffi': 'C FFI',
            'th-perf': 'Performance, ops/sec',
            'mod-title': 'Modularity',
            'mod-desc': 'Compile to .dll/.so, export public functions.',
            'reflect-title': 'Reflection',
            'reflect-desc': 'typeof, fields, methods – runtime introspection.',
            'json-title': 'File',
            'json-desc': 'Convenient file handling via std::file module',
            'ffi-title': 'C FFI',
            'ffi-desc': 'Call any C functions, dynamic library loading.',
            'tooling-title': 'Tooling',
            'tool-compiler': 'Python → C++ compiler',
            'tool-ebt': 'ebt build - for compilation',
            'tool-config': 'ebt project - to create a project',
            'tool-proj': 'elp - package manager',
            'cta-title': 'Start now',
            'cta-subtitle': 'One command and your project is ready. Open source, premium speed',
            'cta-download': 'Download ElySpruce',
            'cta-docs': 'Documentation'
        }
    };

    function getCurrentLanguage() {
        return localStorage.getItem('ely_language') || 'ru';
    }

    function setCurrentLanguage(lang) {
        localStorage.setItem('ely_language', lang);
    }

    // Применение переводов ко всем элементам с id
    function applyLanguage(lang) {
        const dict = translations[lang];
        if (!dict) return;

        for (const [id, text] of Object.entries(dict)) {
            const element = document.getElementById(id);
            if (element) {
                if (id === 'footer-copyright') {
                    const year = new Date().getFullYear();
                    element.innerText = text.replace('%year%', year);
                } else {
                    element.innerText = text;
                }
            }
        }
        // Специальная обработка для заголовка страницы
        if (dict['docs-title']) {
            document.title = dict['docs-title'];
        }

        // Активный класс для переключателя языка
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(opt => {
            const txt = opt.innerText.trim().toLowerCase();
            if (txt === lang) opt.classList.add('active');
            else opt.classList.remove('active');
        });
    }

    function switchLanguage() {
        const current = getCurrentLanguage();
        const newLang = current === 'ru' ? 'en' : 'ru';
        setCurrentLanguage(newLang);
        applyLanguage(newLang);
        // Уведомляем другие скрипты о смене языка
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: newLang } }));
    }

    function initLocalization() {
        const oldToggle = document.getElementById('lang-toggle');
        if (oldToggle) {
            const newToggle = oldToggle.cloneNode(true);
            oldToggle.parentNode.replaceChild(newToggle, oldToggle);
            newToggle.addEventListener('click', (e) => {
                e.preventDefault();
                switchLanguage();
            });
        }
        const savedLang = getCurrentLanguage();
        applyLanguage(savedLang);
    }

    // Глобальный API для получения перевода из других скриптов
    window.elyTranslations = {
        get: (key, lang = null) => {
            const currentLang = lang || getCurrentLanguage();
            return translations[currentLang]?.[key] || key;
        },
        getCurrentLanguage: getCurrentLanguage
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLocalization);
    } else {
        initLocalization();
    }
})();