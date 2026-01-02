const IMAGE_COUNT = 604;
let currentPage = 1; 

const pageImage = document.getElementById('quran-page-image');
const sideMenu = document.getElementById('side-menu');
const subMenuContainer = document.getElementById('sub-menu-container');
const menuContent = document.getElementById('menu-content');

let isMenuVisible = false;
let currentSubMenu = null;

// -------------------
// دالة بناء اسم الصورة
// -------------------
function getPageFileName(pageNumber) {
    return 'pages/page' + pageNumber + '.jpeg';
}

// -------------------
// عرض الصفحة
// -------------------
function showPage(pageNumber) {
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > IMAGE_COUNT) pageNumber = IMAGE_COUNT;
    currentPage = pageNumber;
    pageImage.src = getPageFileName(currentPage);
    document.title = 'المصحف - صفحة ' + currentPage;
    window.scrollTo(0,0);
}

// -------------------
// التنقل بين الصفحات
// -------------------
function nextPage() { showPage(currentPage + 1); }
function previousPage() { showPage(currentPage - 1); }

// -------------------
// إظهار / إخفاء القائمة
// -------------------
function toggleMenu() {
    if (isMenuVisible) {
        sideMenu.classList.add('hidden');
        closeSubMenu();
    } else {
        sideMenu.classList.remove('hidden');
        const firstMenuItem = menuContent.querySelector('.menu-item');
        if (firstMenuItem) firstMenuItem.focus();
    }
    isMenuVisible = !isMenuVisible;
}

function closeSubMenu() {
    subMenuContainer.innerHTML = '';
    currentSubMenu = null;
    menuContent.style.display = 'block';
}

// -------------------
// معالجة اختيار القائمة
// -------------------
function handleMenuSelection(action) {
    menuContent.style.display = 'none';
    subMenuContainer.innerHTML = '';
    switch(action) {
        case 'surah': showSurahList(); break;
        case 'juz': showJuzList(); break;
        case 'page': showGoToPageDialog(); break;
    }
}

// -------------------
// عرض قائمة السور
// -------------------
function showSurahList() {
    currentSubMenu = 'surah';
    subMenuContainer.innerHTML = `
        <h3>قائمة السور</h3>
        <button class="menu-item" id="back-button">العودة للقائمة الرئيسية</button>
        <input type="text" id="surah-search" class="menu-item" placeholder="بحث باسم السورة">
        <div id="surah-list"></div>
    `;
    const surahList = document.getElementById('surah-list');

    allSurahs.forEach(surah => {
        const btn = document.createElement('button');
        btn.className = 'list-item';
        btn.textContent = surah.id + '. ' + surah.name;
        btn.onclick = () => { toggleMenu(); showPage(surah.startPage); };
        surahList.appendChild(btn);
    });

    document.getElementById('back-button').onclick = closeSubMenu;

    // البحث
    const searchInput = document.getElementById('surah-search');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        Array.from(surahList.children).forEach(btn => {
            btn.style.display = btn.textContent.includes(query) ? 'block' : 'none';
        });
    });
}

// -------------------
// عرض قائمة الأجزاء
// -------------------
function showJuzList() {
    currentSubMenu = 'juz';
    subMenuContainer.innerHTML = `
        <h3>قائمة الأجزاء</h3>
        <button class="menu-item" id="back-button">العودة للقائمة الرئيسية</button>
        <input type="text" id="juz-search" class="menu-item" placeholder="بحث بالجزء">
        <div id="juz-list"></div>
    `;
    const juzListDiv = document.getElementById('juz-list');
    allJuz.forEach(juz => {
        const btn = document.createElement('button');
        btn.className = 'list-item';
        btn.textContent = juz.name;
        btn.onclick = () => { toggleMenu(); showPage(juz.startPage); };
        juzListDiv.appendChild(btn);
    });
    document.getElementById('back-button').onclick = closeSubMenu;

    const searchInput = document.getElementById('juz-search');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        Array.from(juzListDiv.children).forEach(btn => {
            btn.style.display = btn.textContent.includes(query) ? 'block' : 'none';
        });
    });
}

// -------------------
// البحث برقم الصفحة
// -------------------
function showGoToPageDialog() {
    currentSubMenu = 'page';
    subMenuContainer.innerHTML = `
        <h3>انتقل إلى صفحة</h3>
        <button class="menu-item" id="back-button">العودة للقائمة الرئيسية</button>
        <input type="number" id="page-input" class="menu-item" placeholder="رقم الصفحة (1-${IMAGE_COUNT})">
        <button id="go-button" class="menu-item">اذهب</button>
    `;
    const input = document.getElementById('page-input');
    const goBtn = document.getElementById('go-button');

    goBtn.onclick = () => {
        const p = parseInt(input.value);
        if (!isNaN(p) && p >= 1 && p <= IMAGE_COUNT) {
            toggleMenu();
            showPage(p);
        } else { alert('رقم الصفحة غير صالح'); }
    };

    document.getElementById('back-button').onclick = closeSubMenu;
}

// -------------------
// تهيئة التطبيق
// -------------------
window.onload = () => {
    showPage(currentPage);
    setupMouseHandling();
};

// -------------------
// تعامل مع المؤشر (المناطق اليمنى/الوسط/اليسرى)
// -------------------
function setupMouseHandling() {
    document.body.addEventListener('click', (e) => {
        const x = e.clientX / window.innerWidth;
        if (x < 0.2) previousPage();
        else if (x > 0.8) nextPage();
        else toggleMenu();
    });

    // التمرير عمودياً بالفأرة أو الأسهم
    document.addEventListener('keydown', (event) => {
        const scrollAmount = window.innerHeight * 0.4;
        switch(event.keyCode) {
            case 38: window.scrollBy(0,-scrollAmount); break; // سهم أعلى
            case 40: window.scrollBy(0,scrollAmount); break; // سهم أسفل
        }
    });
}
