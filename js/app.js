/**
 * Main application script for the Styler app
 * Initializes and connects all the different modules
 */

// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    initApp();
});

// Initialize the application
function initApp() {
    // Create instances of all managers using the shared data manager
    const weatherManager = new WeatherManager(dataManager);
    const clothesManager = new ClothesManager(dataManager, weatherManager);
    const userManager = new UserManager(dataManager);

    // Initialize components
    weatherManager.initWeather();
    clothesManager.initClothes();
    userManager.initUser();

    // Setup navigation
    setupNavigation(clothesManager);
    
    // Setup header icons actions
    setupHeaderActions();
    
    // Setup floating action button
    setupFloatingActionButton();
    
    // Add custom event listeners
    setupCustomEvents(clothesManager);
}

// Setup header icons actions
function setupHeaderActions() {
    // Menu button (right side)
    const menuBtn = document.getElementById('menu-btn');
    menuBtn.addEventListener('click', () => {
        showMenu();
    });
    
    // Share button (right side)
    const shareBtn = document.getElementById('share-btn');
    shareBtn.addEventListener('click', () => {
        shareApp();
    });
    
    // Close button (left side)
    const closeBtn = document.getElementById('close-btn');
    closeBtn.addEventListener('click', () => {
        showNotification('تم إغلاق الشاشة الحالية', 'info');
    });
    
    // Expand button (left side)
    const expandBtn = document.getElementById('expand-btn');
    expandBtn.addEventListener('click', () => {
        toggleExpandView();
    });
    
    // Notifications button (left side)
    const notificationsBtn = document.getElementById('notifications-btn');
    notificationsBtn.addEventListener('click', () => {
        showNotifications();
    });
}

// Show app menu
function showMenu() {
    // Create modal content
    const modalContent = `
        <div class="modal-content menu-modal">
            <span class="close-modal">&times;</span>
            <h3>القائمة</h3>
            <ul class="menu-list">
                <li class="menu-item" data-action="preferences">
                    <i class="fas fa-sliders-h"></i>
                    <span>تفضيلات الملابس</span>
                </li>
                <li class="menu-item" data-action="occasions">
                    <i class="fas fa-calendar-day"></i>
                    <span>اقتراحات للمناسبات</span>
                </li>
                <li class="menu-item" data-action="language">
                    <i class="fas fa-language"></i>
                    <span>اللغة</span>
                </li>
                <li class="menu-item" data-action="settings">
                    <i class="fas fa-cog"></i>
                    <span>الإعدادات</span>
                </li>
                <li class="menu-item" data-action="help">
                    <i class="fas fa-question-circle"></i>
                    <span>المساعدة</span>
                </li>
                <li class="menu-item" data-action="about">
                    <i class="fas fa-info-circle"></i>
                    <span>حول التطبيق</span>
                </li>
            </ul>
        </div>
    `;
    
    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = modalContent;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.style.display = 'block', 10);
    
    // Setup close functionality
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    });
    
    // Setup menu item actions
    const menuItems = modal.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            
            // Close modal
            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);
            
            // Handle menu item action
            handleMenuAction(action);
        });
    });
}

// Handle menu actions
function handleMenuAction(action) {
    switch (action) {
        case 'preferences':
            showClothingPreferences();
            break;
        case 'occasions':
            showOccasionSuggestions();
            break;
        case 'language':
            showLanguageOptions();
            break;
        case 'settings':
            showSettings();
            break;
        case 'help':
            showHelp();
            break;
        case 'about':
            showAbout();
            break;
    }
}

// Show clothing preferences
function showClothingPreferences() {
    // Check if user is logged in
    if (!dataManager.isUserLoggedIn()) {
        showNotification('يجب تسجيل الدخول لتعديل التفضيلات', 'warning');
        document.getElementById('auth-modal').style.display = 'block';
        return;
    }
    
    const userPreferences = dataManager.getUserPreferences() || {
        style: 'كاجوال',
        gender: 'male',
        favoriteColors: ['أزرق', 'أسود']
    };
    
    // Create modal content
    const modalContent = `
        <div class="modal-content preferences-modal">
            <span class="close-modal">&times;</span>
            <h3>تفضيلات الملابس</h3>
            <form id="preferences-form">
                <div class="form-group">
                    <label for="pref-style">النمط المفضل</label>
                    <select id="pref-style">
                        <option value="كاجوال" ${userPreferences.style === 'كاجوال' ? 'selected' : ''}>كاجوال</option>
                        <option value="رسمي" ${userPreferences.style === 'رسمي' ? 'selected' : ''}>رسمي</option>
                        <option value="رياضي" ${userPreferences.style === 'رياضي' ? 'selected' : ''}>رياضي</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="pref-gender">النوع</label>
                    <select id="pref-gender">
                        <option value="male" ${userPreferences.gender === 'male' ? 'selected' : ''}>ذكر</option>
                        <option value="female" ${userPreferences.gender === 'female' ? 'selected' : ''}>أنثى</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>الألوان المفضلة</label>
                    <div class="color-options">
                        <label class="color-option">
                            <input type="checkbox" value="أسود" ${userPreferences.favoriteColors.includes('أسود') ? 'checked' : ''}>
                            <span class="color-swatch black"></span>
                            <span>أسود</span>
                        </label>
                        <label class="color-option">
                            <input type="checkbox" value="أبيض" ${userPreferences.favoriteColors.includes('أبيض') ? 'checked' : ''}>
                            <span class="color-swatch white"></span>
                            <span>أبيض</span>
                        </label>
                        <label class="color-option">
                            <input type="checkbox" value="أزرق" ${userPreferences.favoriteColors.includes('أزرق') ? 'checked' : ''}>
                            <span class="color-swatch blue"></span>
                            <span>أزرق</span>
                        </label>
                        <label class="color-option">
                            <input type="checkbox" value="أحمر" ${userPreferences.favoriteColors.includes('أحمر') ? 'checked' : ''}>
                            <span class="color-swatch red"></span>
                            <span>أحمر</span>
                        </label>
                        <label class="color-option">
                            <input type="checkbox" value="بني" ${userPreferences.favoriteColors.includes('بني') ? 'checked' : ''}>
                            <span class="color-swatch brown"></span>
                            <span>بني</span>
                        </label>
                        <label class="color-option">
                            <input type="checkbox" value="بيج" ${userPreferences.favoriteColors.includes('بيج') ? 'checked' : ''}>
                            <span class="color-swatch beige"></span>
                            <span>بيج</span>
                        </label>
                    </div>
                </div>
                <button type="submit" class="btn-primary">حفظ التفضيلات</button>
            </form>
        </div>
    `;
    
    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = modalContent;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.style.display = 'block', 10);
    
    // Setup close functionality
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    });
    
    // Setup form submission
    const preferencesForm = document.getElementById('preferences-form');
    preferencesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const style = document.getElementById('pref-style').value;
        const gender = document.getElementById('pref-gender').value;
        
        // Get selected colors
        const colorInputs = document.querySelectorAll('.color-option input:checked');
        const favoriteColors = Array.from(colorInputs).map(input => input.value);
        
        // Update preferences
        const result = dataManager.updateUserPreferences({
            style,
            gender,
            favoriteColors
        });
        
        if (result.success) {
            showNotification('تم حفظ التفضيلات بنجاح', 'success');
            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);
            
            // Refresh displayed content based on new preferences
            if (document.querySelector('.nav-item[data-page="clothes"].active')) {
                document.querySelector('.nav-item[data-page="suggestions"]').click();
                setTimeout(() => document.querySelector('.nav-item[data-page="clothes"]').click(), 100);
            }
        } else {
            showNotification(result.message || 'حدث خطأ أثناء حفظ التفضيلات', 'error');
        }
    });
}

// Show occasion-based outfit suggestions
function showOccasionSuggestions() {
    // Get all occasions
    const occasions = dataManager.getOccasions();
    
    // Create modal content
    let occasionsHTML = '';
    
    occasions.forEach(occasion => {
        occasionsHTML += `
            <div class="occasion-card" data-id="${occasion.id}">
                <div class="occasion-icon">
                    <i class="fas fa-${occasion.image}"></i>
                </div>
                <div class="occasion-name">${occasion.name}</div>
            </div>
        `;
    });
    
    const modalContent = `
        <div class="modal-content occasions-modal">
            <span class="close-modal">&times;</span>
            <h3>اقتراحات للمناسبات</h3>
            <div class="occasions-grid">
                ${occasionsHTML}
            </div>
        </div>
    `;
    
    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = modalContent;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.style.display = 'block', 10);
    
    // Setup close functionality
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    });
    
    // Setup occasion card click
    const occasionCards = modal.querySelectorAll('.occasion-card');
    occasionCards.forEach(card => {
        card.addEventListener('click', () => {
            const occasionId = parseInt(card.dataset.id);
            
            // Close modal
            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);
            
            // Show outfit for this occasion
            showOccasionOutfit(occasionId);
        });
    });
}

// Show outfit for a specific occasion
function showOccasionOutfit(occasionId) {
    const outfit = dataManager.getOutfitForOccasion(occasionId);
    const occasion = dataManager.getOccasion(occasionId);
    
    if (!outfit || !occasion) {
        showNotification('حدث خطأ في تحميل الإطلالة', 'error');
        return;
    }
    
    // Create outfit display content
    let outfitItemsHTML = '';
    
    outfit.items.forEach(item => {
        outfitItemsHTML += `
            <div class="outfit-item" data-id="${item.id}">
                <div class="outfit-item-icon">
                    <i class="fas fa-${item.image || 'tshirt'}"></i>
                </div>
                <div class="outfit-item-name">${item.name}</div>
            </div>
        `;
    });
    
    const modalContent = `
        <div class="modal-content outfit-modal">
            <span class="close-modal">&times;</span>
            <h3>إطلالة ${occasion.name}</h3>
            <div class="outfit-display">
                <div class="outfit-items">
                    ${outfitItemsHTML}
                </div>
                <div class="outfit-actions">
                    <button class="btn-secondary outfit-action-btn" data-action="save">
                        <i class="fas fa-heart"></i>
                        <span>حفظ</span>
                    </button>
                    <button class="btn-primary outfit-action-btn" data-action="shop">
                        <i class="fas fa-shopping-bag"></i>
                        <span>تسوق</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = modalContent;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.style.display = 'block', 10);
    
    // Setup close functionality
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    });
    
    // Setup outfit action buttons
    const actionButtons = modal.querySelectorAll('.outfit-action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            
            // Handle action
            if (action === 'save') {
                // Save outfit functionality
                showNotification('تم حفظ الإطلالة في المفضلة', 'success');
                
                // Add outfit items to favorites if logged in
                if (dataManager.isUserLoggedIn()) {
                    outfit.items.forEach(item => {
                        dataManager.toggleFavorite(item.id);
                    });
                }
            } else if (action === 'shop') {
                // Close outfit modal
                modal.style.display = 'none';
                setTimeout(() => modal.remove(), 300);
                
                // Navigate to shopping page
                document.querySelector('.nav-item[data-page="shopping"]').click();
            }
        });
    });
    
    // Setup item click events to show details
    const outfitItems = modal.querySelectorAll('.outfit-item');
    outfitItems.forEach(item => {
        item.addEventListener('click', () => {
            const itemId = parseInt(item.dataset.id);
            
            // Close outfit modal
            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);
            
            // Show clothing details
            const clothesManager = new ClothesManager(dataManager, new WeatherManager(dataManager));
            clothesManager.showClothingDetails(itemId);
        });
    });
}

// Show language options
function showLanguageOptions() {
    // Create modal content
    const modalContent = `
        <div class="modal-content language-modal">
            <span class="close-modal">&times;</span>
            <h3>اختر اللغة</h3>
            <div class="language-options">
                <button class="language-option selected">
                    <span class="language-flag">🇸🇦</span>
                    <span>العربية</span>
                </button>
                <button class="language-option">
                    <span class="language-flag">🇺🇸</span>
                    <span>English</span>
                </button>
                <button class="language-option">
                    <span class="language-flag">🇫🇷</span>
                    <span>Français</span>
                </button>
            </div>
        </div>
    `;
    
    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = modalContent;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.style.display = 'block', 10);
    
    // Setup close functionality
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    });
    
    // Setup language selection
    const languageOptions = modal.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Unselect all options
            languageOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Select clicked option
            option.classList.add('selected');
            
            // Show notification
            if (!option.classList.contains('selected')) {
                showNotification('تم تغيير اللغة بنجاح', 'success');
            } else {
                showNotification('هذه هي اللغة الحالية', 'info');
            }
            
            // Close modal
            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);
        });
    });
}

// Share app functionality
function shareApp() {
    // Create modal content
    const modalContent = `
        <div class="modal-content share-modal">
            <span class="close-modal">&times;</span>
            <h3>مشاركة التطبيق</h3>
            <p>شارك تطبيق ستايلر مع أصدقائك</p>
            <div class="share-options">
                <button class="share-option" data-platform="whatsapp">
                    <i class="fab fa-whatsapp"></i>
                    <span>واتساب</span>
                </button>
                <button class="share-option" data-platform="facebook">
                    <i class="fab fa-facebook-f"></i>
                    <span>فيسبوك</span>
                </button>
                <button class="share-option" data-platform="twitter">
                    <i class="fab fa-twitter"></i>
                    <span>تويتر</span>
                </button>
                <button class="share-option" data-platform="email">
                    <i class="fas fa-envelope"></i>
                    <span>البريد الإلكتروني</span>
                </button>
                <button class="share-option" data-platform="copy">
                    <i class="fas fa-link"></i>
                    <span>نسخ الرابط</span>
                </button>
            </div>
        </div>
    `;
    
    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = modalContent;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.style.display = 'block', 10);
    
    // Setup close functionality
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    });
    
    // Setup share options
    const shareOptions = modal.querySelectorAll('.share-option');
    shareOptions.forEach(option => {
        option.addEventListener('click', () => {
            const platform = option.dataset.platform;
            
            // Show success message
            showNotification(`تمت المشاركة عبر ${option.querySelector('span').textContent}`, 'success');
            
            // Close modal
            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);
        });
    });
}

// Show notifications
function showNotifications() {
    // Create modal content
    const modalContent = `
        <div class="modal-content notifications-modal">
            <span class="close-modal">&times;</span>
            <h3>الإشعارات</h3>
            <div class="notifications-list">
                <div class="notification-item unread">
                    <div class="notification-icon">
                        <i class="fas fa-tshirt"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">تخفيضات الصيف</div>
                        <div class="notification-message">استفد من تخفيضات الصيف على الملابس الخفيفة</div>
                        <div class="notification-time">منذ 2 ساعة</div>
                    </div>
                </div>
                <div class="notification-item">
                    <div class="notification-icon">
                        <i class="fas fa-cloud-sun"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">تغير الطقس</div>
                        <div class="notification-message">توقعات بانخفاض درجات الحرارة غداً</div>
                        <div class="notification-time">منذ يوم</div>
                    </div>
                </div>
                <div class="notification-item">
                    <div class="notification-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">تحديث المفضلة</div>
                        <div class="notification-message">تم تعديل أسعار بعض المنتجات في المفضلة</div>
                        <div class="notification-time">منذ 3 أيام</div>
                    </div>
                </div>
            </div>
            <button class="btn-secondary mark-all-read-btn">تحديد الكل كمقروء</button>
        </div>
    `;
    
    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = modalContent;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.style.display = 'block', 10);
    
    // Setup close functionality
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    });
    
    // Setup mark all as read button
    const markAllReadBtn = modal.querySelector('.mark-all-read-btn');
    markAllReadBtn.addEventListener('click', () => {
        const unreadItems = modal.querySelectorAll('.notification-item.unread');
        unreadItems.forEach(item => item.classList.remove('unread'));
        
        showNotification('تم تحديد جميع الإشعارات كمقروءة', 'success');
    });
    
    // Setup notification item click
    const notificationItems = modal.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', () => {
            // Mark as read
            item.classList.remove('unread');
            
            // Show clicked notification details
            const title = item.querySelector('.notification-title').textContent;
            showNotification(`تم فتح الإشعار: ${title}`, 'info');
            
            // Could navigate to specific page based on notification type
        });
    });
}

// Toggle expanded view
function toggleExpandView() {
    // Toggle expanded class on body
    document.body.classList.toggle('expanded-view');
    
    // Toggle expand button icon
    const expandBtn = document.getElementById('expand-btn');
    if (document.body.classList.contains('expanded-view')) {
        expandBtn.querySelector('i').className = 'fas fa-chevron-up';
        showNotification('تم توسيع العرض', 'info');
    } else {
        expandBtn.querySelector('i').className = 'fas fa-chevron-down';
        showNotification('تم تصغير العرض', 'info');
    }
}

// Show settings
function showSettings() {
    // Create modal content
    const modalContent = `
        <div class="modal-content settings-modal">
            <span class="close-modal">&times;</span>
            <h3>الإعدادات</h3>
            <div class="settings-list">
                <div class="setting-item">
                    <div class="setting-label">الإشعارات</div>
                    <div class="setting-control">
                        <label class="switch">
                            <input type="checkbox" checked>
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
                <div class="setting-item">
                    <div class="setting-label">تحديث الطقس تلقائياً</div>
                    <div class="setting-control">
                        <label class="switch">
                            <input type="checkbox" checked>
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
                <div class="setting-item">
                    <div class="setting-label">الوضع الداكن</div>
                    <div class="setting-control">
                        <label class="switch">
                            <input type="checkbox">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
                <div class="setting-item">
                    <div class="setting-label">وحدة درجة الحرارة</div>
                    <div class="setting-control">
                        <select>
                            <option value="celsius" selected>مئوية (°C)</option>
                            <option value="fahrenheit">فهرنهايت (°F)</option>
                        </select>
                    </div>
                </div>
                <div class="setting-item">
                    <div class="setting-label">مسح ذاكرة التخزين المؤقت</div>
                    <div class="setting-control">
                        <button class="btn-secondary clear-cache-btn">مسح</button>
                    </div>
                </div>
            </div>
            <button class="btn-primary save-settings-btn">حفظ الإعدادات</button>
        </div>
    `;
    
    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = modalContent;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.style.display = 'block', 10);
    
    // Setup close functionality
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    });
    
    // Setup clear cache button
    const clearCacheBtn = modal.querySelector('.clear-cache-btn');
    clearCacheBtn.addEventListener('click', () => {
        showNotification('تم مسح ذاكرة التخزين المؤقت', 'success');
    });
    
    // Setup save settings button
    const saveSettingsBtn = modal.querySelector('.save-settings-btn');
    saveSettingsBtn.addEventListener('click', () => {
        showNotification('تم حفظ الإعدادات بنجاح', 'success');
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    });
}

// Show help
function showHelp() {
    // Create modal content
    const modalContent = `
        <div class="modal-content help-modal">
            <span class="close-modal">&times;</span>
            <h3>المساعدة</h3>
            <div class="help-content">
                <div class="help-section">
                    <h4>الاقتراحات اليومية</h4>
                    <p>يوفر التطبيق اقتراحات يومية للملابس بناءً على الطقس الحالي، ويمكنك مشاهدة هذه الاقتراحات في الصفحة الرئيسية.</p>
                </div>
                <div class="help-section">
                    <h4>البحث عن الملابس</h4>
                    <p>يمكنك البحث عن الملابس باستخدام شريط البحث في أعلى الشاشة، ويمكنك تصفية النتائج حسب النوع أو اللون أو السعر.</p>
                </div>
                <div class="help-section">
                    <h4>المفضلة</h4>
                    <p>يمكنك إضافة الملابس إلى المفضلة بالضغط على زر القلب، ويمكنك مشاهدة المفضلة من خلال الضغط على زر الحساب ثم المفضلة.</p>
                </div>
                <div class="help-section">
                    <h4>التسوق</h4>
                    <p>يمكنك تصفح المتاجر وشراء الملابس من خلال قسم التسوق، ويمكنك أيضاً الحصول على اقتراحات للمتاجر القريبة منك.</p>
                </div>
                <div class="help-section">
                    <h4>تخصيص الإعدادات</h4>
                    <p>يمكنك تخصيص إعدادات التطبيق من خلال قائمة الإعدادات، مثل تفضيلات الملابس واللغة ووحدة درجة الحرارة.</p>
                </div>
            </div>
            <div class="help-footer">
                <p>هل تحتاج إلى مزيد من المساعدة؟ <a href="#" class="contact-support-link">تواصل مع الدعم</a></p>
            </div>
        </div>
    `;
    
    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = modalContent;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.style.display = 'block', 10);
    
    // Setup close functionality
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    });
    
    // Setup contact support link
    const contactSupportLink = modal.querySelector('.contact-support-link');
    contactSupportLink.addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('سيتم التواصل مع فريق الدعم قريباً', 'info');
    });
}

// Show about app
function showAbout() {
    // Create modal content
    const modalContent = `
        <div class="modal-content about-modal">
            <span class="close-modal">&times;</span>
            <div class="about-header">
                <div class="app-logo">
                    <i class="fas fa-tshirt fa-3x"></i>
                </div>
                <h3>ستايلر</h3>
                <p class="app-version">الإصدار 1.0.0</p>
            </div>
            <div class="about-content">
                <p>ستايلر هو تطبيق يساعدك على اختيار ملابسك بناءً على الطقس وتفضيلاتك الشخصية. يوفر التطبيق اقتراحات يومية للملابس، ويتيح لك تصفح المتاجر وشراء الملابس مباشرة.</p>
                <p>تم تطوير التطبيق بواسطة فريق ستايلر، وهو متاح للاستخدام على جميع الأجهزة.</p>
                <div class="about-links">
                    <a href="#" class="about-link">الشروط والأحكام</a>
                    <a href="#" class="about-link">سياسة الخصوصية</a>
                    <a href="#" class="about-link">الرخص</a>
                </div>
            </div>
            <div class="about-footer">
                <p class="copyright">© 2025 ستايلر. جميع الحقوق محفوظة.</p>
            </div>
        </div>
    `;
    
    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = modalContent;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.style.display = 'block', 10);
    
    // Setup close functionality
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    });
    
    // Setup about links
    const aboutLinks = modal.querySelectorAll('.about-link');
    aboutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification(`تم النقر على ${link.textContent}`, 'info');
        });
    });
}

// Setup bottom navigation functionality
function setupNavigation(clothesManager) {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Handle page switching
            const page = item.dataset.page;
            handlePageSwitch(page, clothesManager);
        });
    });
}

// Handle switching between pages
function handlePageSwitch(page, clothesManager) {
    // Update page title
    updatePageTitle(page);
    
    // Handle page-specific content
    switch (page) {
        case 'clothes':
            // Show clothing recommendations
            clothesManager.loadFeaturedClothes();
            break;
        case 'suggestions':
            // Show smart suggestions
            showSmartSuggestions();
            break;
        case 'shopping':
            // Show shopping page
            showShoppingPage();
            break;
        case 'profile':
            // Show profile page if logged in, or login prompt
            showProfilePage();
            break;
    }
}

// Update the page title based on selected section
function updatePageTitle(page) {
    const titleElement = document.querySelector('.site-title');
    
    switch (page) {
        case 'clothes':
            titleElement.textContent = 'ستايلر';
            break;
        case 'suggestions':
            titleElement.textContent = 'اقتراحات';
            break;
        case 'shopping':
            titleElement.textContent = 'تسوق';
            break;
        case 'profile':
            titleElement.textContent = 'حسابي';
            break;
        default:
            titleElement.textContent = 'ستايلر';
    }
}

// Show smart suggestions page
function showSmartSuggestions() {
    const featuredContainer = document.getElementById('featured-clothes');
    
    // Get smart suggestions
    const smartSuggestions = dataManager.getSmartSuggestions();
    
    if (!smartSuggestions || smartSuggestions.length === 0) {
        featuredContainer.innerHTML = '<p class="no-items-message">لا توجد اقتراحات متاحة حالياً</p>';
        return;
    }
    
    // Create HTML for smart suggestions
    let suggestionsHTML = '';
    
    // Add occasions section
    suggestionsHTML += `
        <section class="suggestions-section">
            <h2>اقتراحات حسب المناسبة</h2>
            <div class="occasions-row">
                ${dataManager.getOccasions().slice(0, 4).map(occasion => `
                    <div class="occasion-item" data-id="${occasion.id}">
                        <div class="occasion-icon">
                            <i class="fas fa-${occasion.image}"></i>
                        </div>
                        <div class="occasion-name">${occasion.name}</div>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
    
    // Add smart clothing suggestions
    suggestionsHTML += `
        <section class="suggestions-section">
            <h2>اقتراحات ذكية</h2>
            <div class="smart-suggestions-grid">
                ${smartSuggestions.map(item => `
                    <div class="clothing-item" data-id="${item.id}">
                        <div class="clothing-item-img">
                            <i class="fas fa-${item.image || 'tshirt'}"></i>
                        </div>
                        <div class="clothing-item-details">
                            <div class="clothing-item-name">${item.name}</div>
                            <div class="clothing-item-type">${item.type}</div>
                            <div class="clothing-item-temp">${item.minTemp}° - ${item.maxTemp}°</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
    
    // Add style suggestions section
    suggestionsHTML += `
        <section class="suggestions-section">
            <h2>أنماط مقترحة</h2>
            <div class="style-categories">
                <div class="style-category" data-style="كاجوال">
                    <div class="style-icon">
                        <i class="fas fa-tshirt"></i>
                    </div>
                    <div class="style-name">كاجوال</div>
                </div>
                <div class="style-category" data-style="رسمي">
                    <div class="style-icon">
                        <i class="fas fa-user-tie"></i>
                    </div>
                    <div class="style-name">رسمي</div>
                </div>
                <div class="style-category" data-style="رياضي">
                    <div class="style-icon">
                        <i class="fas fa-running"></i>
                    </div>
                    <div class="style-name">رياضي</div>
                </div>
            </div>
        </section>
    `;
    
    // Display suggestions
    featuredContainer.innerHTML = suggestionsHTML;
    
    // Setup occasion item click events
    const occasionItems = document.querySelectorAll('.occasion-item');
    occasionItems.forEach(item => {
        item.addEventListener('click', () => {
            const occasionId = parseInt(item.dataset.id);
            showOccasionOutfit(occasionId);
        });
    });
    
    // Setup clothing item click events
    const clothingItems = document.querySelectorAll('.clothing-item');
    clothingItems.forEach(item => {
        item.addEventListener('click', () => {
            const itemId = parseInt(item.dataset.id);
            const clothesManager = new ClothesManager(dataManager, new WeatherManager(dataManager));
            clothesManager.showClothingDetails(itemId);
        });
    });
    
    // Setup style category click events
    const styleCategories = document.querySelectorAll('.style-category');
    styleCategories.forEach(category => {
        category.addEventListener('click', () => {
            const style = category.dataset.style;
            
            // Show notification
            showNotification(`تم اختيار نمط ${style}`, 'info');
            
            // Update user preferences if logged in
            if (dataManager.isUserLoggedIn()) {
                dataManager.updateUserPreferences({ style });
                
                // Refresh suggestions
                setTimeout(() => showSmartSuggestions(), 500);
            } else {
                // Show login prompt
                showNotification('يجب تسجيل الدخول لحفظ التفضيلات', 'warning');
                document.getElementById('auth-modal').style.display = 'block';
            }
        });
    });
}

// Show shopping page
function showShoppingPage() {
    const featuredContainer = document.getElementById('featured-clothes');
    
    // Get stores
    const stores = dataManager.getStores();
    
    // Create shopping page content
    let shoppingHTML = `
        <div class="shopping-container">
            <div class="search-bar">
                <div class="search-icon">
                    <i class="fas fa-search"></i>
                </div>
                <input type="text" class="search-input" placeholder="ابحث عن متاجر أو منتجات...">
                <div class="filter-icon">
                    <i class="fas fa-sliders-h"></i>
                </div>
            </div>
            
            <div class="categories-row">
                <button class="category-btn active" data-category="all">الكل</button>
                <button class="category-btn" data-category="ملابس">ملابس</button>
                <button class="category-btn" data-category="أحذية">أحذية</button>
                <button class="category-btn" data-category="إكسسوارات">إكسسوارات</button>
                <button class="category-btn" data-category="رياضة">رياضة</button>
            </div>
            
            <h3>متاجر مقترحة</h3>
            <div class="stores-grid">
                ${stores.map(store => `
                    <div class="store-card" data-id="${store.id}">
                        <div class="store-logo">
                            <i class="fas fa-store"></i>
                        </div>
                        <div class="store-details">
                            <div class="store-name">${store.name}</div>
                            <div class="store-categories">${store.categories.join(' • ')}</div>
                            <div class="store-info">
                                <span class="store-rating">
                                    <i class="fas fa-star"></i>
                                    ${store.rating}
                                </span>
                                ${store.distance ? `
                                    <span class="store-distance">
                                        <i class="fas fa-map-marker-alt"></i>
                                        ${store.distance} كم
                                    </span>
                                ` : '<span class="store-online">متجر إلكتروني</span>'}
                                <span class="store-price">
                                    ${store.priceRange}
                                </span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <h3>العروض الحالية</h3>
            <div class="offers-slider">
                <div class="offer-card">
                    <div class="offer-image">
                        <i class="fas fa-percentage"></i>
                    </div>
                    <div class="offer-details">
                        <div class="offer-title">تخفيضات الصيف</div>
                        <div class="offer-desc">خصم حتى 50% على الملابس الصيفية</div>
                        <button class="offer-btn">تسوق الآن</button>
                    </div>
                </div>
                <div class="offer-card">
                    <div class="offer-image">
                        <i class="fas fa-shipping-fast"></i>
                    </div>
                    <div class="offer-details">
                        <div class="offer-title">شحن مجاني</div>
                        <div class="offer-desc">شحن مجاني على جميع الطلبات فوق 200 ريال</div>
                        <button class="offer-btn">تسوق الآن</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Display shopping page
    featuredContainer.innerHTML = shoppingHTML;
    
    // Setup category buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Filter stores by category
            filterStoresByCategory(btn.dataset.category);
        });
    });
    
    // Setup store card click events
    setupStoreCardEvents();
    
    // Setup offer buttons
    const offerBtns = document.querySelectorAll('.offer-btn');
    offerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('تم الانتقال إلى صفحة العرض', 'success');
        });
    });
    
    // Setup search functionality
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query.length > 0) {
            // Filter stores by name
            const filteredStores = stores.filter(store => 
                store.name.toLowerCase().includes(query) || 
                store.categories.some(cat => cat.toLowerCase().includes(query))
            );
            
            // Update stores grid
            updateStoresGrid(filteredStores);
        } else {
            // Show all stores
            updateStoresGrid(stores);
        }
    });
    
    // Setup filter icon click
    const filterIcon = document.querySelector('.filter-icon');
    filterIcon.addEventListener('click', () => {
        showShoppingFilters();
    });
}

// Filter stores by category
function filterStoresByCategory(category) {
    const stores = category === 'all' ? 
        dataManager.getStores() : 
        dataManager.getStoresByCategory(category);
    
    updateStoresGrid(stores);
}

// Update stores grid
function updateStoresGrid(stores) {
    const storesGrid = document.querySelector('.stores-grid');
    
    if (!stores || stores.length === 0) {
        storesGrid.innerHTML = '<p class="no-items-message">لا توجد متاجر متطابقة مع البحث</p>';
        return;
    }
    
    storesGrid.innerHTML = stores.map(store => `
        <div class="store-card" data-id="${store.id}">
            <div class="store-logo">
                <i class="fas fa-store"></i>
            </div>
            <div class="store-details">
                <div class="store-name">${store.name}</div>
                <div class="store-categories">${store.categories.join(' • ')}</div>
                <div class="store-info">
                    <span class="store-rating">
                        <i class="fas fa-star"></i>
                        ${store.rating}
                    </span>
                    ${store.distance ? `
                        <span class="store-distance">
                            <i class="fas fa-map-marker-alt"></i>
                            ${store.distance} كم
                        </span>
                    ` : '<span class="store-online">متجر إلكتروني</span>'}
                    <span class="store-price">
                        ${store.priceRange}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Setup store card click events
    setupStoreCardEvents();
}

// Setup store card click events
function setupStoreCardEvents() {
    const storeCards = document.querySelectorAll('.store-card');
    storeCards.forEach(card => {
        card.addEventListener('click', () => {
            const storeId = parseInt(card.dataset.id);
            showStoreDetails(storeId);
        });
    });
}

// Show store details
function showStoreDetails(storeId) {
    const store = dataManager.getStore(storeId);
    
    if (!store) {
        showNotification('حدث خطأ في تحميل بيانات المتجر', 'error');
        return;
    }
    
    // Get suitable clothes for current weather
    const suitableClothes = dataManager.getSuitableClothes().slice(0, 4);
    
    // Create store details content
    const storeDetailsHTML = `
        <div class="store-details-container">
            <div class="store-header">
                <div class="store-logo-large">
                    <i class="fas fa-store fa-3x"></i>
                </div>
                <div class="store-header-details">
                    <h2>${store.name}</h2>
                    <div class="store-categories">${store.categories.join(' • ')}</div>
                    <div class="store-info">
                        <span class="store-rating">
                            <i class="fas fa-star"></i>
                            ${store.rating}
                        </span>
                        ${store.distance ? `
                            <span class="store-distance">
                                <i class="fas fa-map-marker-alt"></i>
                                ${store.distance} كم
                            </span>
                        ` : '<span class="store-online">متجر إلكتروني</span>'}
                        <span class="store-price">
                            ${store.priceRange}
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="store-actions">
                <button class="store-action-btn" data-action="call">
                    <i class="fas fa-phone"></i>
                    <span>اتصال</span>
                </button>
                <button class="store-action-btn" data-action="directions">
                    <i class="fas fa-directions"></i>
                    <span>اتجاهات</span>
                </button>
                <button class="store-action-btn" data-action="website">
                    <i class="fas fa-globe"></i>
                    <span>موقع الويب</span>
                </button>
                <button class="store-action-btn" data-action="share">
                    <i class="fas fa-share-alt"></i>
                    <span>مشاركة</span>
                </button>
            </div>
            
            <div class="section-title">
                <h3>مقترحات للطقس الحالي</h3>
                <span class="see-all">عرض الكل</span>
            </div>
            
            <div class="store-products-grid">
                ${suitableClothes.map(item => `
                    <div class="product-card" data-id="${item.id}">
                        <div class="product-image">
                            <i class="fas fa-${item.image || 'tshirt'}"></i>
                        </div>
                        <div class="product-details">
                            <div class="product-name">${item.name}</div>
                            <div class="product-price">${item.price} ر.س</div>
                            <div class="product-rating">
                                <i class="fas fa-star"></i>
                                ${item.rating}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="section-title">
                <h3>عروض خاصة</h3>
                <span class="see-all">عرض الكل</span>
            </div>
            
            <div class="store-offers">
                <div class="store-offer">
                    <div class="offer-badge">خصم 30%</div>
                    <div class="offer-image">
                        <i class="fas fa-tshirt"></i>
                    </div>
                    <div class="offer-text">على الملابس الصيفية</div>
                </div>
                <div class="store-offer">
                    <div class="offer-badge">1 + 1 مجاناً</div>
                    <div class="offer-image">
                        <i class="fas fa-socks"></i>
                    </div>
                    <div class="offer-text">على الجوارب والإكسسوارات</div>
                </div>
            </div>
        </div>
    `;
    
    // Display store details
    const featuredContainer = document.getElementById('featured-clothes');
    featuredContainer.innerHTML = storeDetailsHTML;
    
    // Add back button
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.innerHTML = '<i class="fas fa-arrow-right"></i>';
    featuredContainer.prepend(backButton);
    
    // Setup back button click
    backButton.addEventListener('click', () => {
        showShoppingPage();
    });
    
    // Setup store action buttons
    const actionButtons = document.querySelectorAll('.store-action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            
            switch (action) {
                case 'call':
                    showNotification('جاري الاتصال بالمتجر...', 'info');
                    break;
                case 'directions':
                    showNotification('جاري فتح خرائط Google...', 'info');
                    break;
                case 'website':
                    showNotification('جاري فتح موقع المتجر...', 'info');
                    break;
                case 'share':
                    showNotification('جاري مشاركة المتجر...', 'info');
                    break;
            }
        });
    });
    
    // Setup product cards click
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const itemId = parseInt(card.dataset.id);
            showProductDetails(itemId, store);
        });
    });
    
    // Setup see all links
    const seeAllLinks = document.querySelectorAll('.see-all');
    seeAllLinks.forEach(link => {
        link.addEventListener('click', () => {
            showNotification('عرض جميع المنتجات', 'info');
        });
    });
    
    // Setup store offers click
    const storeOffers = document.querySelectorAll('.store-offer');
    storeOffers.forEach(offer => {
        offer.addEventListener('click', () => {
            showNotification('تم النقر على العرض', 'info');
        });
    });
}

// Show product details
function showProductDetails(itemId, store) {
    const allClothes = dataManager.getClothes();
    const item = allClothes.find(item => item.id === itemId);
    
    if (!item) {
        showNotification('حدث خطأ في تحميل بيانات المنتج', 'error');
        return;
    }
    
    // Get similar items
    const similarItems = dataManager.getSimilarItems(itemId);
    
    // Create product details content
    const productDetailsHTML = `
        <div class="product-details-container">
            <div class="product-image-large">
                <i class="fas fa-${item.image || 'tshirt'} fa-5x"></i>
            </div>
            
            <div class="product-info">
                <h2 class="product-title">${item.name}</h2>
                <div class="product-meta">
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        ${item.rating}
                    </div>
                    <div class="product-reviews">120 تقييم</div>
                </div>
                <div class="product-price-large">${item.price} ر.س</div>
                <div class="product-store">
                    <span>المتجر:</span>
                    <span class="store-name">${store.name}</span>
                </div>
                <div class="product-description">
                    ${item.description}
                </div>
                <div class="product-details-table">
                    <div class="detail-row">
                        <div class="detail-label">النوع</div>
                        <div class="detail-value">${item.type}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">اللون</div>
                        <div class="detail-value">${item.color}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">مناسب للطقس</div>
                        <div class="detail-value">${item.weather.join('، ')}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">نطاق درجة الحرارة</div>
                        <div class="detail-value">${item.minTemp}° - ${item.maxTemp}°</div>
                    </div>
                </div>
                
                <div class="product-actions">
                    <button class="btn-primary add-to-cart-btn">
                        <i class="fas fa-shopping-cart"></i>
                        <span>إضافة للسلة</span>
                    </button>
                    <button class="btn-secondary favorite-btn ${item.favorite ? 'active' : ''}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="btn-secondary share-btn">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
            
            <div class="section-title">
                <h3>منتجات مشابهة</h3>
            </div>
            
            <div class="similar-products">
                ${similarItems.map(similar => `
                    <div class="similar-product" data-id="${similar.id}">
                        <div class="similar-product-image">
                            <i class="fas fa-${similar.image || 'tshirt'}"></i>
                        </div>
                        <div class="similar-product-name">${similar.name}</div>
                        <div class="similar-product-price">${similar.price} ر.س</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Display product details
    const featuredContainer = document.getElementById('featured-clothes');
    featuredContainer.innerHTML = productDetailsHTML;
    
    // Add back button
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.innerHTML = '<i class="fas fa-arrow-right"></i>';
    featuredContainer.prepend(backButton);
    
    // Setup back button click
    backButton.addEventListener('click', () => {
        showStoreDetails(store.id);
    });
    
    // Setup add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => {
        showNotification('تمت إضافة المنتج إلى السلة', 'success');
    });
    
    // Setup favorite button
    const favoriteBtn = document.querySelector('.favorite-btn');
    favoriteBtn.addEventListener('click', () => {
        favoriteBtn.classList.toggle('active');
        
        if (favoriteBtn.classList.contains('active')) {
            showNotification('تمت إضافة المنتج إلى المفضلة', 'success');
            
            // Add to favorites if logged in
            if (dataManager.isUserLoggedIn()) {
                dataManager.toggleFavorite(item.id);
            }
        } else {
            showNotification('تمت إزالة المنتج من المفضلة', 'info');
            
            // Remove from favorites if logged in
            if (dataManager.isUserLoggedIn()) {
                dataManager.toggleFavorite(item.id);
            }
        }
    });
    
    // Setup share button
    const shareBtn = document.querySelector('.share-btn');
    shareBtn.addEventListener('click', () => {
        showNotification('جاري مشاركة المنتج...', 'info');
    });
    
    // Setup similar products click
    const similarProducts = document.querySelectorAll('.similar-product');
    similarProducts.forEach(product => {
        product.addEventListener('click', () => {
            const similarItemId = parseInt(product.dataset.id);
            showProductDetails(similarItemId, store);
        });
    });
}

// Show shopping filters
function showShoppingFilters() {
    // Create modal content
    const modalContent = `
        <div class="modal-content filters-modal">
            <span class="close-modal">&times;</span>
            <h3>تصفية النتائج</h3>
            <form id="filters-form">
                <div class="filter-group">
                    <label class="filter-label">النوع</label>
                    <div class="filter-options">
                        <label class="filter-option">
                            <input type="checkbox" name="category" value="ملابس" checked>
                            <span>ملابس</span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" name="category" value="أحذية" checked>
                            <span>أحذية</span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" name="category" value="إكسسوارات" checked>
                            <span>إكسسوارات</span>
                        </label>
                        <label class="filter-option">
                            <input type="checkbox" name="category" value="رياضة" checked>
                            <span>رياضة</span>
                        </label>
                    </div>
                </div>
                
                <div class="filter-group">
                    <label class="filter-label">نطاق السعر</label>
                    <div class="price-range">
                        <div class="price-slider">
                            <input type="range" min="0" max="1000" value="500" class="slider" id="price-slider">
                        </div>
                        <div class="price-range-values">
                            <span>0 ر.س</span>
                            <span id="price-value">500 ر.س</span>
                            <span>1000 ر.س</span>
                        </div>
                    </div>
                </div>
                
                <div class="filter-group">
                    <label class="filter-label">التقييم</label>
                    <div class="filter-options">
                        <label class="filter-option">
                            <input type="radio" name="rating" value="all" checked>
                            <span>الكل</span>
                        </label>
                        <label class="filter-option">
                            <input type="radio" name="rating" value="4">
                            <span>4+ نجوم</span>
                        </label>
                        <label class="filter-option">
                            <input type="radio" name="rating" value="3">
                            <span>3+ نجوم</span>
                        </label>
                    </div>
                </div>
                
                <div class="filter-group">
                    <label class="filter-label">المسافة</label>
                    <div class="filter-options">
                        <label class="filter-option">
                            <input type="radio" name="distance" value="all" checked>
                            <span>الكل</span>
                        </label>
                        <label class="filter-option">
                            <input type="radio" name="distance" value="5">
                            <span>أقل من 5 كم</span>
                        </label>
                        <label class="filter-option">
                            <input type="radio" name="distance" value="10">
                            <span>أقل من 10 كم</span>
                        </label>
                    </div>
                </div>
                
                <div class="filter-actions">
                    <button type="button" class="btn-secondary reset-filters-btn">إعادة ضبط</button>
                    <button type="submit" class="btn-primary apply-filters-btn">تطبيق</button>
                </div>
            </form>
        </div>
    `;
    
    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = modalContent;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.style.display = 'block', 10);
    
    // Setup close functionality
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    });
    
    // Setup price slider
    const priceSlider = document.getElementById('price-slider');
    const priceValue = document.getElementById('price-value');
    
    priceSlider.addEventListener('input', () => {
        priceValue.textContent = `${priceSlider.value} ر.س`;
    });
    
    // Setup reset filters button
    const resetFiltersBtn = modal.querySelector('.reset-filters-btn');
    resetFiltersBtn.addEventListener('click', () => {
        const categoryCheckboxes = modal.querySelectorAll('input[name="category"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        
        modal.querySelector('input[name="rating"][value="all"]').checked = true;
        modal.querySelector('input[name="distance"][value="all"]').checked = true;
        
        priceSlider.value = 500;
        priceValue.textContent = '500 ر.س';
    });
    
    // Setup apply filters button
    const filtersForm = document.getElementById('filters-form');
    filtersForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get selected categories
        const selectedCategories = Array.from(modal.querySelectorAll('input[name="category"]:checked'))
            .map(checkbox => checkbox.value);
        
        // Get selected rating
        const selectedRating = modal.querySelector('input[name="rating"]:checked').value;
        
        // Get selected distance
        const selectedDistance = modal.querySelector('input[name="distance"]:checked').value;
        
        // Get price range
        const priceRange = parseInt(priceSlider.value);
        
        // Show notification
        showNotification('تم تطبيق التصفية', 'success');
        
        // Close modal
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
        
        // Apply filters (in a real app, this would filter the stores)
        // For this demo, we'll just show all stores
        showShoppingPage();
    });
}

// Show profile page or login prompt
function showProfilePage() {
    const featuredContainer = document.getElementById('featured-clothes');
    
    if (dataManager.isUserLoggedIn()) {
        const user = dataManager.getCurrentUser();
        
        featuredContainer.innerHTML = `
            <div class="profile-content">
                <div class="profile-header-card">
                    <div class="profile-avatar-large">
                        <i class="fas fa-user fa-3x"></i>
                    </div>
                    <h2>${user.username}</h2>
                    <p>${user.email}</p>
                </div>
                
                <div class="profile-stats">
                    <div class="stat-card">
                        <div class="stat-value">${dataManager.getFavorites().length}</div>
                        <div class="stat-label">المفضلة</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${user.preferences?.style || 'كاجوال'}</div>
                        <div class="stat-label">النمط المفضل</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">
                            <i class="fas fa-cog"></i>
                        </div>
                        <div class="stat-label">الإعدادات</div>
                    </div>
                </div>
                
                <div class="profile-actions">
                    <button class="profile-action-btn" id="favorites-btn">
                        <i class="fas fa-heart"></i>
                        <span>المفضلة</span>
                    </button>
                    <button class="profile-action-btn" id="preferences-btn">
                        <i class="fas fa-sliders-h"></i>
                        <span>التفضيلات</span>
                    </button>
                    <button class="profile-action-btn" id="logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>تسجيل الخروج</span>
                    </button>
                </div>

                <div class="recently-viewed">
                    <h3>تمت مشاهدته مؤخراً</h3>
                    <div class="recently-viewed-items">
                        <div class="recently-viewed-item">
                            <i class="fas fa-tshirt"></i>
                            <span>قميص قطني خفيف</span>
                        </div>
                        <div class="recently-viewed-item">
                            <i class="fas fa-shoe-prints"></i>
                            <span>حذاء رياضي</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Setup profile action buttons
        const favoritesBtn = featuredContainer.querySelector('#favorites-btn');
        favoritesBtn.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('show-favorites'));
        });
        
        const preferencesBtn = featuredContainer.querySelector('#preferences-btn');
        preferencesBtn.addEventListener('click', () => {
            showClothingPreferences();
        });
        
        const logoutBtn = featuredContainer.querySelector('#logout-btn');
        logoutBtn.addEventListener('click', () => {
            dataManager.logoutUser();
            showProfilePage(); // Refresh the page
            
            // Update UI for other components
            document.dispatchEvent(new CustomEvent('user-logged-out'));
        });
        
        // Setup stat cards click
        const statCards = featuredContainer.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.addEventListener('click', () => {
                const label = card.querySelector('.stat-label').textContent;
                
                if (label === 'المفضلة') {
                    document.dispatchEvent(new CustomEvent('show-favorites'));
                } else if (label === 'النمط المفضل') {
                    showClothingPreferences();
                } else if (label === 'الإعدادات') {
                    showSettings();
                }
            });
        });
        
        // Setup recently viewed items
        const recentlyViewedItems = featuredContainer.querySelectorAll('.recently-viewed-item');
        recentlyViewedItems.forEach(item => {
            item.addEventListener('click', () => {
                showNotification(`تم النقر على ${item.querySelector('span').textContent}`, 'info');
            });
        });
        
    } else {
        // Show login prompt
        featuredContainer.innerHTML = `
            <div class="login-prompt">
                <div class="placeholder-icon">
                    <i class="fas fa-user-circle fa-3x"></i>
                </div>
                <h3>تسجيل الدخول</h3>
                <p>قم بتسجيل الدخول أو إنشاء حساب للوصول إلى المزيد من الميزات</p>
                <button class="btn-primary login-btn">تسجيل الدخول / إنشاء حساب</button>
            </div>
        `;
        
        // Setup login button
        const loginBtn = featuredContainer.querySelector('.login-btn');
        loginBtn.addEventListener('click', () => {
            document.getElementById('auth-modal').style.display = 'block';
        });
    }
}

// Setup floating action button functionality
function setupFloatingActionButton() {
    const fabButton = document.querySelector('.fab-button');
    
    fabButton.addEventListener('click', () => {
        showFloatingMenu();
    });
}

// Show floating action menu
function showFloatingMenu() {
    // Check if menu already exists
    const existingMenu = document.querySelector('.fab-menu');
    if (existingMenu) {
        // Toggle menu visibility
        existingMenu.classList.toggle('active');
        return;
    }
    
    // Create menu
    const fabMenu = document.createElement('div');
    fabMenu.className = 'fab-menu active';
    
    // Add menu items
    fabMenu.innerHTML = `
        <div class="fab-menu-item" data-action="add-outfit">
            <div class="fab-menu-icon">
                <i class="fas fa-user-tie"></i>
            </div>
            <div class="fab-menu-label">إضافة إطلالة</div>
        </div>
        <div class="fab-menu-item" data-action="add-clothes">
            <div class="fab-menu-icon">
                <i class="fas fa-tshirt"></i>
            </div>
            <div class="fab-menu-label">إضافة ملابس</div>
        </div>
        <div class="fab-menu-item" data-action="scan">
            <div class="fab-menu-icon">
                <i class="fas fa-camera"></i>
            </div>
            <div class="fab-menu-label">مسح ملابس</div>
        </div>
    `;
    
    // Add menu to DOM
    document.body.appendChild(fabMenu);
    
    // Position menu
    const fabButton = document.querySelector('.fab-button');
    const fabRect = fabButton.getBoundingClientRect();
    
    fabMenu.style.bottom = `${window.innerHeight - fabRect.top + 10}px`;
    fabMenu.style.right = '50%';
    fabMenu.style.transform = 'translateX(50%)';
    
    // Setup menu item click
    const menuItems = fabMenu.querySelectorAll('.fab-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            
            // Hide menu
            fabMenu.classList.remove('active');
            setTimeout(() => fabMenu.remove(), 300);
            
            // Handle action
            switch (action) {
                case 'add-outfit':
                    showNotification('إضافة إطلالة جديدة قريباً', 'info');
                    break;
                case 'add-clothes':
                    showAddClothesForm();
                    break;
                case 'scan':
                    showNotification('مسح الملابس بالكاميرا قريباً', 'info');
                    break;
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function closeMenu(e) {
        if (!fabMenu.contains(e.target) && e.target !== fabButton) {
            fabMenu.classList.remove('active');
            setTimeout(() => {
                if (fabMenu.parentNode) {
                    fabMenu.remove();
                }
            }, 300);
            document.removeEventListener('click', closeMenu);
        }
    });
}

// Show add clothes form
function showAddClothesForm() {
    // Check if user is logged in
    if (!dataManager.isUserLoggedIn()) {
        showNotification('يجب تسجيل الدخول لإضافة ملابس', 'warning');
        document.getElementById('auth-modal').style.display = 'block';
        return;
    }
    
    // Create modal content
    const modalContent = `
        <div class="modal-content add-clothes-modal">
            <span class="close-modal">&times;</span>
            <h3>إضافة ملابس جديدة</h3>
            <form id="add-clothes-form">
                <div class="form-group">
                    <label for="clothes-name">اسم القطعة</label>
                    <input type="text" id="clothes-name" placeholder="مثال: قميص قطني أزرق" required>
                </div>
                <div class="form-group">
                    <label for="clothes-type">النوع</label>
                    <select id="clothes-type" required>
                        <option value="">اختر النوع</option>
                        <option value="قميص">قميص</option>
                        <option value="تيشيرت">تيشيرت</option>
                        <option value="سترة">سترة</option>
                        <option value="بنطلون">بنطلون</option>
                        <option value="جينز">جينز</option>
                        <option value="شورت">شورت</option>
                        <option value="فستان">فستان</option>
                        <option value="حذاء">حذاء</option>
                        <option value="إكسسوار">إكسسوار</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="clothes-category">الفئة</label>
                    <select id="clothes-category" required>
                        <option value="">اختر الفئة</option>
                        <option value="علوي">علوي</option>
                        <option value="سفلي">سفلي</option>
                        <option value="كامل">كامل</option>
                        <option value="أحذية">أحذية</option>
                        <option value="إكسسوارات">إكسسوارات</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="clothes-color">اللون</label>
                    <select id="clothes-color" required>
                        <option value="">اختر اللون</option>
                        <option value="أبيض">أبيض</option>
                        <option value="أسود">أسود</option>
                        <option value="أزرق">أزرق</option>
                        <option value="أحمر">أحمر</option>
                        <option value="أصفر">أصفر</option>
                        <option value="أخضر">أخضر</option>
                        <option value="بني">بني</option>
                        <option value="رمادي">رمادي</option>
                        <option value="بيج">بيج</option>
                    </select>
                </div>
                <div class="form-row">
                    <div class="form-group half">
                        <label for="min-temp">أدنى درجة حرارة (°C)</label>
                        <input type="number" id="min-temp" min="-10" max="40" required>
                    </div>
                    <div class="form-group half">
                        <label for="max-temp">أقصى درجة حرارة (°C)</label>
                        <input type="number" id="max-temp" min="-10" max="40" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>مناسب للطقس</label>
                    <div class="weather-checkboxes">
                        <label class="weather-checkbox">
                            <input type="checkbox" value="مشمس">
                            <span><i class="fas fa-sun"></i> مشمس</span>
                        </label>
                        <label class="weather-checkbox">
                            <input type="checkbox" value="غائم جزئياً">
                            <span><i class="fas fa-cloud-sun"></i> غائم جزئياً</span>
                        </label>
                        <label class="weather-checkbox">
                            <input type="checkbox" value="غائم">
                            <span><i class="fas fa-cloud"></i> غائم</span>
                        </label>
                        <label class="weather-checkbox">
                            <input type="checkbox" value="ممطر">
                            <span><i class="fas fa-cloud-rain"></i> ممطر</span>
                        </label>
                        <label class="weather-checkbox">
                            <input type="checkbox" value="ثلجي">
                            <span><i class="fas fa-snowflake"></i> ثلجي</span>
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="clothes-description">وصف</label>
                    <textarea id="clothes-description" rows="3" placeholder="وصف قطعة الملابس..."></textarea>
                </div>
                <div class="form-group">
                    <label for="clothes-image">صورة</label>
                    <div class="image-upload">
                        <div class="image-preview">
                            <i class="fas fa-tshirt fa-3x"></i>
                        </div>
                        <button type="button" class="btn-secondary upload-btn">اختر صورة</button>
                    </div>
                </div>
                <button type="submit" class="btn-primary">إضافة</button>
            </form>
        </div>
    `;
    
    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = modalContent;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.style.display = 'block', 10);
    
    // Setup close functionality
    const closeModal = modal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    });
    
    // Setup upload button
    const uploadBtn = modal.querySelector('.upload-btn');
    uploadBtn.addEventListener('click', () => {
        showNotification('سيتم توفير ميزة رفع الصور قريباً', 'info');
    });
    
    // Setup form submission
    const addClothesForm = document.getElementById('add-clothes-form');
    addClothesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success message
        showNotification('تمت إضافة قطعة الملابس بنجاح', 'success');
        
        // Close modal
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    });
}

// Show notification helper function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="notification-message">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Setup custom events
function setupCustomEvents(clothesManager) {
    // Show favorites event
    document.addEventListener('show-favorites', () => {
        // Change to clothes tab
        const clothesTab = document.querySelector('.nav-item[data-page="clothes"]');
        clothesTab.click();
        
        // Update title
        document.querySelector('.site-title').textContent = 'المفضلة';
        
        // Show favorites
        clothesManager.showFavorites();
    });
    
    // User logged out event
    document.addEventListener('user-logged-out', () => {
        // Update UI elements that depend on login status
        const profileBtn = document.querySelector('.profile-btn i');
        profileBtn.className = 'fas fa-circle-info';
        
        // Show notification
        showNotification('تم تسجيل الخروج بنجاح', 'success');
    });
}
