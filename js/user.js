/**
 * User management functionality for the Styler application
 * Handles user authentication, profiles, and settings
 */

class UserManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.isLoggedIn = false;
    }

    // Initialize user functionality
    initUser() {
        this.checkLoginStatus();
        this.setupAuthModal();
        this.setupForms();
        this.setupProfileButton();
    }

    // Check if user is logged in
    checkLoginStatus() {
        this.isLoggedIn = this.dataManager.isUserLoggedIn();
        this.updateUIForLoginStatus();
    }

    // Update UI elements based on login status
    updateUIForLoginStatus() {
        const profileBtn = document.querySelector('.profile-btn i');
        
        if (this.isLoggedIn) {
            // User is logged in
            profileBtn.className = 'fas fa-user';
            
            // Get user data
            const user = this.dataManager.getCurrentUser();
            
            // Update profile button with first letter of username if available
            if (user && user.username) {
                // Use initials for profile avatar if logged in
                profileBtn.className = 'fas fa-user';
            }
        } else {
            // User is not logged in
            profileBtn.className = 'fas fa-circle-info';
        }
    }

    // Setup authentication modal
    setupAuthModal() {
        const authModal = document.getElementById('auth-modal');
        const tabButtons = authModal.querySelectorAll('.tab-btn');
        const tabContents = authModal.querySelectorAll('.tab-content');
        
        // Handle tab switching
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab
                button.classList.add('active');
                
                // Show corresponding tab content
                const tabId = button.dataset.tab;
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
        
        // Close modal when clicking close button
        const closeModal = authModal.querySelector('.close-modal');
        closeModal.addEventListener('click', () => {
            authModal.style.display = 'none';
        });
    }

    // Setup login and registration forms
    setupForms() {
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        
        // Login form submission
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            const result = this.dataManager.loginUser(username, password);
            
            if (result.success) {
                // Hide modal
                document.getElementById('auth-modal').style.display = 'none';
                
                // Update UI
                this.isLoggedIn = true;
                this.updateUIForLoginStatus();
                
                // Show success message
                this.showNotification('تم تسجيل الدخول بنجاح', 'success');
                
                // Reset form
                loginForm.reset();
            } else {
                // Show error message
                this.showFormError(loginForm, result.message);
            }
        });
        
        // Signup form submission
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-password-confirm').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                this.showFormError(signupForm, 'كلمات المرور غير متطابقة');
                return;
            }
            
            const result = this.dataManager.registerUser(username, email, password);
            
            if (result.success) {
                // Hide modal
                document.getElementById('auth-modal').style.display = 'none';
                
                // Update UI
                this.isLoggedIn = true;
                this.updateUIForLoginStatus();
                
                // Show success message
                this.showNotification('تم إنشاء الحساب بنجاح', 'success');
                
                // Reset form
                signupForm.reset();
            } else {
                // Show error message
                this.showFormError(signupForm, result.message);
            }
        });
    }

    // Show error message in form
    showFormError(form, message) {
        // Remove any existing error message
        const existingError = form.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Create and show error message
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        
        // Insert after form heading
        form.insertBefore(errorElement, form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorElement.parentNode === form) {
                errorElement.remove();
            }
        }, 5000);
    }

    // Setup profile button functionality
    setupProfileButton() {
        const profileBtn = document.querySelector('.profile-btn');
        
        profileBtn.addEventListener('click', () => {
            if (this.isLoggedIn) {
                // Show profile options
                this.showProfileOptions();
            } else {
                // Show login/signup modal
                document.getElementById('auth-modal').style.display = 'block';
            }
        });
    }

    // Show profile options
    showProfileOptions() {
        const user = this.dataManager.getCurrentUser();
        
        // Create modal content
        const modalContent = `
            <div class="modal-content profile-options">
                <span class="close-modal">&times;</span>
                <div class="profile-header">
                    <div class="profile-avatar">
                        <i class="fas fa-user fa-2x"></i>
                    </div>
                    <h3>${user.username}</h3>
                    <p>${user.email}</p>
                </div>
                <div class="profile-actions">
                    <button class="profile-action-btn" id="favorites-btn">
                        <i class="fas fa-heart"></i>
                        <span>المفضلة</span>
                    </button>
                    <button class="profile-action-btn" id="settings-btn">
                        <i class="fas fa-cog"></i>
                        <span>الإعدادات</span>
                    </button>
                    <button class="profile-action-btn" id="logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>تسجيل الخروج</span>
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
        
        // Setup profile actions
        
        // Favorites button
        const favoritesBtn = modal.querySelector('#favorites-btn');
        favoritesBtn.addEventListener('click', () => {
            // Close modal
            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);
            
            // Show favorites
            document.dispatchEvent(new CustomEvent('show-favorites'));
        });
        
        // Settings button
        const settingsBtn = modal.querySelector('#settings-btn');
        settingsBtn.addEventListener('click', () => {
            // Close modal
            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);
            
            // Show settings (not implemented for this demo)
            this.showNotification('سيتم توفير إعدادات الحساب قريباً', 'info');
        });
        
        // Logout button
        const logoutBtn = modal.querySelector('#logout-btn');
        logoutBtn.addEventListener('click', () => {
            // Close modal
            modal.style.display = 'none';
            setTimeout(() => modal.remove(), 300);
            
            // Perform logout
            this.dataManager.logoutUser();
            this.isLoggedIn = false;
            this.updateUIForLoginStatus();
            
            // Show notification
            this.showNotification('تم تسجيل الخروج بنجاح', 'success');
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
            </div>
            <div class="notification-message">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Hide and remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Get notification icon based on type
    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'info':
            default: return 'fa-info-circle';
        }
    }
}
