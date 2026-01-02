const IMAGE_COUNT = 604;
let currentPage = 1;

const img = document.getElementById("quran-page-image");
const menuOverlay = document.getElementById("menu-overlay");
const menuBox = document.getElementById("menu-box");

// تحميل آخر صفحة
const savedPage = localStorage.getItem("lastPage");
if (savedPage) currentPage = parseInt(savedPage);

// عرض الصفحة
function showPage(page) {
    if (page < 1 || page > IMAGE_COUNT) return;
    currentPage = page;
    localStorage.setItem("lastPage", page);
    img.src = `pages/page_${String(page).padStart(3, "0")}.jpg`;
}

// مناطق النقر للتنقل
document.getElementById("zone-prev").onclick = () => showPage(currentPage - 1);
document.getElementById("zone-next").onclick = () => showPage(currentPage + 1);
document.getElementById("zone-menu").onclick = () => openMainMenu();

// إغلاق القائمة عند الضغط خارجها
menuOverlay.onclick = (e) => {
    if (e.target === menuOverlay) closeMenu();
};

function openMainMenu() {
    menuOverlay.classList.remove("hidden");
    renderMainMenu();
}

function closeMenu() {
    menuOverlay.classList.add("hidden");
}

// القائمة الرئيسية
function renderMainMenu() {
    menuBox.innerHTML = `
        <div class="menu-item" onclick="openSurahMenu()">السور</div>
        <div class="menu-item" onclick="openJuzMenu()">الأجزاء</div>
        <div class="menu-item" onclick="openPageSearch()">الصفحات</div>
    `;
}

// ============================================
// عرض قائمة السور مع شريط التمرير والبحث
// ============================================
function openSurahMenu() {
    menuBox.innerHTML = `
        <div class="menu-item" onclick="renderMainMenu()">⬅ رجوع</div>
        <input type="text" placeholder="بحث باسم السورة" class="search-box" id="surah-search">
        <div class="scroll-container" id="surah-list"></div>
    `;
    const listContainer = document.getElementById("surah-list");
    const searchInput = document.getElementById("surah-search");

    function renderList(filter="") {
        listContainer.innerHTML = "";
        allSurahs.filter(s => s.name.includes(filter)).forEach(surah => {
            const btn = document.createElement("div");
            btn.className = "menu-item";
            btn.textContent = `${surah.id}. ${surah.name}`;
            btn.onclick = () => {
                closeMenu();
                showPage(surah.startPage);
            };
            listContainer.appendChild(btn);
        });
    }

    renderList();
    searchInput.oninput = () => renderList(searchInput.value);
}

// ============================================
// عرض قائمة الأجزاء مع شريط التمرير والبحث
// ============================================
function openJuzMenu() {
    menuBox.innerHTML = `
        <div class="menu-item" onclick="renderMainMenu()">⬅ رجوع</div>
        <input type="text" placeholder="بحث برقم الجزء" class="search-box" id="juz-search">
        <div class="scroll-container" id="juz-list"></div>
    `;
    const listContainer = document.getElementById("juz-list");
    const searchInput = document.getElementById("juz-search");

    function renderList(filter="") {
        listContainer.innerHTML = "";
        allJuz.filter(j => j.name.includes(filter)).forEach(juz => {
            const btn = document.createElement("div");
            btn.className = "menu-item";
            btn.textContent = `${juz.name}`;
            btn.onclick = () => {
                closeMenu();
                showPage(juz.startPage);
            };
            listContainer.appendChild(btn);
        });
    }

    renderList();
    searchInput.oninput = () => renderList(searchInput.value);
}

// ============================================
// البحث برقم الصفحة
// ============================================
function openPageSearch() {
    menuBox.innerHTML = `
        <div class="menu-item" onclick="renderMainMenu()">⬅ رجوع</div>
        <input type="number" id="page-input" placeholder="رقم الصفحة (1-${IMAGE_COUNT})" class="search-box">
        <div class="menu-item" id="go-page">اذهب</div>
    `;
    document.getElementById("go-page").onclick = () => {
        const val = parseInt(document.getElementById("page-input").value);
        if (val >= 1 && val <= IMAGE_COUNT) {
            closeMenu();
            showPage(val);
        } else {
            alert("رقم الصفحة غير صالح");
        }
    };
}

// ============================================
// عرض الصفحة عند البداية
// ============================================
showPage(currentPage);