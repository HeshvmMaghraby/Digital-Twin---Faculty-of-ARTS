// ==========================================
// 1. نظام الترجمة وتغيير اللغة
// ==========================================
const langToggleBtn = document.getElementById('langToggle');
let currentLang = 'en'; 

langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
    langToggleBtn.textContent = currentLang === 'en' ? 'عربي' : 'English';

    // ترجمة النصوص العادية
    document.querySelectorAll('.tr').forEach(el => {
        el.innerHTML = el.getAttribute(`data-${currentLang}`);
    });

    // ترجمة الـ Placeholders
    document.querySelectorAll('.tr-placeholder').forEach(el => {
        el.setAttribute('placeholder', el.getAttribute(`data-${currentLang}`));
    });
    
    // ترجمة حقل إدخال الشات
    document.getElementById('chatInput').setAttribute('placeholder', currentLang === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message here...');
});

// ==========================================
// 2. برمجة الخريطة التفاعلية (Leaflet.js)
// ==========================================
const cairoUniCoords = [30.0266, 31.2064];
const targetLocationCoords = [30.0287577, 31.2090513]; 

const map = L.map('gis-map', {
    scrollWheelZoom: true,
    fullscreenControl: true, 
    fullscreenControlOptions: { position: 'topleft' }
}).setView(cairoUniCoords, 15);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 20
}).addTo(map);

const marker = L.marker(targetLocationCoords).addTo(map);
marker.bindPopup("<div style='text-align:center; font-family:Cairo;'><b>المكتبة التراثية</b><br>كلية الآداب - جامعة القاهرة</div>");

const zoomBtn = document.getElementById('zoomBtn');
zoomBtn.addEventListener('click', () => {
    map.flyTo(targetLocationCoords, 19, { animate: true, duration: 2 });
    setTimeout(() => { marker.openPopup(); }, 2000);
});

// ==========================================
// 3. نظام تتبع الأقسام (Scroll Spy)
// ==========================================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links li a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 150) { 
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==========================================
// 4. عقل الشات بوت الذكي (TwinBot)
// ==========================================
const chatToggler = document.getElementById('chatToggler');
const chatWindow = document.getElementById('chatWindow');
const closeChatBtn = document.getElementById('closeChat');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
const chatMessages = document.getElementById('chatMessages');

// فتح وإغلاق نافذة الشات
chatToggler.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
});

closeChatBtn.addEventListener('click', () => { 
    chatWindow.style.display = 'none'; 
});

// دالة إرسال الرسالة
function sendMessage() {
    let text = chatInput.value.trim();
    if (!text) return;
    
    appendMessage('user', text);
    chatInput.value = '';
    
    // تأخير نصف ثانية ليبدو طبيعياً
    setTimeout(() => {
        processBotResponse(text.toLowerCase());
    }, 600);
}

// تشغيل الإرسال عند الضغط على الزر أو زر Enter
sendChatBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// دالة إضافة الرسالة لواجهة الشات
function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    msgDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// دالة فحص الكلمات المفتاحية
const containsKeyword = (text, keywords) => keywords.some(kw => text.includes(kw));

// منطق الردود
function processBotResponse(text) {
    let reply = "";

    // كلمات الخريطة
    if (containsKeyword(text, ['خريطة', 'خريطه', 'خرائط', 'ماب', 'مكان', 'موقع', 'المكتبة', 'التراثية', 'كلية', 'اداب', 'map', 'maps', 'location', 'library', 'arts', 'faculty', 'where', 'zoom'])) {
        reply = currentLang === 'ar' ? "حسناً، سآخذك إلى الخريطة التفاعلية فوراً!" : "Sure! Taking you to the interactive map now.";
        document.getElementById('maps').scrollIntoView({behavior: 'smooth'});
        setTimeout(() => { zoomBtn.click(); }, 1500); 
    } 
    // كلمات الداش بورد
    else if (containsKeyword(text, ['داش بورد', 'تقارير', 'بيانات', 'احصائيات', 'ارقام', 'تحليل', 'dashboard', 'data', 'reports', 'statistics', 'stats', 'arcgis', 'analysis'])) {
        reply = currentLang === 'ar' ? "جاري تحويلك إلى لوحة بيانات ArcGIS..." : "Navigating to ArcGIS Dashboard...";
        document.getElementById('reports').scrollIntoView({behavior: 'smooth'});
    } 
    // كلمات المشروع والفريق
    else if (containsKeyword(text, ['مشروع', 'فريق', 'توأم', 'توأمة', 'رقمي', 'توين', 'جيوماتكس', 'مساحة', 'تفاصيل', 'معلومات', 'project', 'team', 'twin', 'digital', 'geomatics', 'surveying', 'about', 'info', 'bim', 'gis'])) {
        reply = currentLang === 'ar' ? "نحن فريق Twin Team! نقوم ببناء توأم رقمي لمباني كلية الآداب باستخدام أحدث التقنيات. سآخذك لقسم المشروع." : "We are Twin Team! Building a digital twin for the Faculty of Arts. Taking you to the project section.";
        document.getElementById('project').scrollIntoView({behavior: 'smooth'});
    }
    // كلمات التواصل
    else if (containsKeyword(text, ['تواصل', 'اتصل', 'ايميل', 'رقم', 'رسالة', 'مساعدة', 'دعم', 'contact', 'email', 'phone', 'support', 'message', 'reach', 'help'])) {
        reply = currentLang === 'ar' ? "يسعدنا تواصلك معنا! سأقوم بتوجيهك إلى نموذج المراسلة." : "We'd love to hear from you! Directing you to the contact form.";
        document.getElementById('contact').scrollIntoView({behavior: 'smooth'});
    }
    // كلمات الترحيب
    else if (containsKeyword(text, ['مرحبا', 'اهلا', 'سلام', 'السلام', 'صباح', 'مساء', 'بوت', 'hello', 'hi', 'hey', 'greetings', 'welcome', 'bot'])) {
        reply = currentLang === 'ar' ? "أهلاً بك! أنا TwinBot جاهز لمساعدتك. يمكنك سؤالي عن: الخريطة، الداش بورد، المشروع، أو التواصل معنا." : "Hello! I am TwinBot. You can ask me about: the map, dashboard, project, or contacting us.";
    } 
    // إذا لم يتعرف على الكلمة
    else {
        reply = currentLang === 'ar' ? "عذراً، لم أفهم طلبك بدقة. جرب كتابة كلمات مثل: 'خريطة', 'بيانات', 'مشروع', أو 'تواصل'." : "Sorry, I didn't catch that. Try keywords like: 'map', 'data', 'project', or 'contact'.";
    }

    appendMessage('bot', reply);
}
// ==========================================
// 5. تشغيل قائمة الموبايل (Hamburger Menu)
// ==========================================
const mobileMenu = document.getElementById('mobile-menu');
const navLinksContainer = document.getElementById('navLinks');

// فتح وإغلاق القائمة عند الضغط على الزر
mobileMenu.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
});

// إغلاق القائمة تلقائياً عند الضغط على أي قسم بداخلها
const mobileNavItems = document.querySelectorAll('.nav-links li a');
mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
    });
});
// ==========================================
// 5. زر تثبيت التطبيق (PWA Install)
// ==========================================
let deferredPrompt;
const installAppBtn = document.getElementById('installAppBtn');

// المتصفح بيبعت الحدث ده لما يتأكد إن الموقع جاهز ينزل كأبلكيشن
window.addEventListener('beforeinstallprompt', (e) => {
    // منع المتصفح من إظهار رسالته التلقائية المزعجة
    e.preventDefault();
    // حفظ الحدث عشان نستخدمه لما المستخدم يدوس على الزرار
    deferredPrompt = e;
    // إظهار الزرار بتاعنا
    installAppBtn.style.display = 'block';
});

// لما المستخدم يدوس على زرار "تثبيت التطبيق"
installAppBtn.addEventListener('click', async () => {
    if (deferredPrompt !== null) {
        // إظهار رسالة التثبيت الأصلية بتاعة الموبايل
        deferredPrompt.prompt();
        
        // انتظار رد المستخدم (وافق ولا رفض)
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        
        // تصفير المتغير وإخفاء الزرار بعد الاستخدام
        deferredPrompt = null;
        installAppBtn.style.display = 'none';
    }
});

// إخفاء الزرار لو التطبيق نزل بالفعل
window.addEventListener('appinstalled', () => {
    installAppBtn.style.display = 'none';
    console.log('PWA was installed');
});