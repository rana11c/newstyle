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
    
    // Setup floating action button
    setupFloatingActionButton();
    
    // Add custom event listeners
    setupCustomEvents(clothesManager);
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
            // For now, just show the same content
            clothesManager.loadFeaturedClothes();
            break;
        case 'shopping':
            // Show shopping page (placeholder)
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

// Show shopping page (placeholder for now)
function showShoppingPage() {
    const featuredContainer = document.getElementById('featured-clothes');
    
    featuredContainer.innerHTML = `
        <div class="placeholder-content">
            <div class="placeholder-icon">
                <i class="fas fa-shopping-bag fa-3x"></i>
            </div>
            <h3>قريباً</h3>
            <p>سيتم إطلاق ميزة التسوق قريباً...</p>
        </div>
    `;
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
                </div>
                
                <button class="btn-primary logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    تسجيل الخروج
                </button>
            </div>
        `;
        
        // Setup logout button
        const logoutBtn = featuredContainer.querySelector('.logout-btn');
        logoutBtn.addEventListener('click', () => {
            dataManager.logoutUser();
            showProfilePage(); // Refresh the page
            
            // Update UI for other components
            document.dispatchEvent(new CustomEvent('user-logged-out'));
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
        // For now, show a notification that this feature is coming soon
        showNotification('سيتم توفير ميزة إضافة ملابس قريباً', 'info');
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
