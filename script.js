// 1. نظام الترجمة وتغيير اللغة
const langToggleBtn = document.getElementById('langToggle');
let currentLang = 'en'; 

langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    langToggleBtn.textContent = currentLang === 'en' ? 'عربي' : 'English';

    document.querySelectorAll('.tr').forEach(el => {
        el.innerHTML = el.getAttribute(`data-${currentLang}`);
    });
    document.querySelectorAll('.tr-placeholder').forEach(el => {
        el.setAttribute('placeholder', el.getAttribute(`data-${currentLang}`));
    });
});

// 2. الخريطة التفاعلية (Leaflet.js)
const targetLocationCoords = [30.0287577, 31.2090513]; 
const map = L.map('gis-map').setView([30.0266, 31.2064], 15);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
const marker = L.marker(targetLocationCoords).addTo(map);

document.getElementById('zoomBtn').addEventListener('click', () => {
    map.flyTo(targetLocationCoords, 19, { animate: true, duration: 2 });
});

// 3. نظام الـ Modal (الفصل الأول)
const modal = document.getElementById("chapterModal");
const chapterCard = document.getElementById("chapterOneCard");
const spanClose = document.querySelector(".close-modal");

if (chapterCard && modal && spanClose) {
    chapterCard.onclick = () => {
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // منع سكرول الصفحة
    }
    spanClose.onclick = () => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }
}

// 4. نظام الشات بوت (TwinBot)
const chatToggler = document.getElementById('chatToggler');
const chatWindow = document.getElementById('chatWindow');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

chatToggler.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
});

document.getElementById('closeChat').addEventListener('click', () => chatWindow.style.display = 'none');

document.getElementById('sendChatBtn').addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (!text) return;
    
    appendMsg('user', text);
    chatInput.value = '';
    setTimeout(() => appendMsg('bot', currentLang === 'ar' ? "شكراً لتواصلك! جاري معالجة طلبك بخصوص مشروع Twin Team." : "Thanks! Processing your request regarding Twin Team."), 600);
});

function appendMsg(sender, text) {
    const div = document.createElement('div');
    div.className = `message ${sender}-message`;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 5. القائمة المنسدلة للموبايل
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('navLinks');
mobileMenu.addEventListener('click', () => navLinks.classList.toggle('active'));