(function () {
    'use strict';

    // Все элементы для анимации
    const animatedElements = document.querySelectorAll(
        '.feature-tile, .premium-card, .perf-item, .tooling-block, .cta-block-premium, .table-wrapper, ' +
        '.gradient-banner, .version-card, .version-list-card, .prev-standard-card, .split-layout, .prev-standards-grid'
    );

    // Функция проверки видимости элемента
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        const threshold = 0.15; // 15% элемента должно быть видно
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
        const visiblePercent = (visibleHeight * visibleWidth) / (rect.height * rect.width);
        return visiblePercent >= threshold;
    }

    // Добавляем класс fade-in-up и запускаем проверку
    animatedElements.forEach(el => {
        el.classList.add('fade-in-up');
    });

    function checkAndShow() {
        animatedElements.forEach(el => {
            if (isElementInViewport(el)) {
                el.classList.add('visible');
            } else {
                // Можно раскомментировать, если нужно скрывать при уходе из зоны видимости
                // el.classList.remove('visible');
            }
        });
    }

    // Запускаем при загрузке, скролле и ресайзе
    window.addEventListener('load', checkAndShow);
    window.addEventListener('scroll', checkAndShow);
    window.addEventListener('resize', checkAndShow);
    // Дополнительный вызов через 0 мс, чтобы поймать динамические элементы
    setTimeout(checkAndShow, 100);

    // Плавный скролл по якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === "#" || href === "") return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                // После скролла обновим видимость через небольшую задержку
                setTimeout(checkAndShow, 500);
            }
        });
    });

    // Динамический год в футере
    const copy = document.getElementById('footer-copyright');
    if (copy) {
        const year = new Date().getFullYear();
        copy.innerText = copy.innerText.replace(/\d{4}/, year);
    }

    // Параллакс фона
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        const orb1 = document.querySelector('.orb-1');
        const orb2 = document.querySelector('.orb-2');
        if (orb1) orb1.style.transform = `translate(${x}px, ${y}px)`;
        if (orb2) orb2.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px)`;
    });

    console.log('✨ Ely — премиальная производительность. Анимация появления работает.');
})();