/**
 * Data storage and management for the Styler application
 * This file contains all mock data and localStorage operations
 */

const STORAGE_KEYS = {
    USERS: 'styler_users',
    CURRENT_USER: 'styler_current_user',
    CLOTHES: 'styler_clothes',
    FAVORITES: 'styler_favorites',
    WEATHER: 'styler_weather'
};

// Mock weather data
const WEATHER_DATA = {
    current: {
        date: '11 شوال',
        day: 'الاثنين',
        temperature: 27,
        condition: 'مشمس',
        icon: 'sun',
        humidity: 30,
        wind: 10
    },
    forecast: [
        {
            day: 'اليوم',
            temperature: 27,
            condition: 'مشمس',
            icon: 'sun'
        },
        {
            day: 'غداً',
            temperature: 23,
            condition: 'غائم جزئياً',
            icon: 'cloud-sun'
        },
        {
            day: 'بعد غد',
            temperature: 22,
            condition: 'غائم',
            icon: 'cloud'
        },
        {
            day: 'بعد ثلاثة أيام',
            temperature: 29,
            condition: 'مشمس',
            icon: 'sun'
        }
    ]
};

// Default clothing items
const DEFAULT_CLOTHES = [
    {
        id: 1,
        name: 'قميص قطني خفيف',
        type: 'قميص',
        category: 'علوي',
        minTemp: 20,
        maxTemp: 30,
        weather: ['مشمس', 'غائم جزئياً'],
        color: 'أبيض',
        image: 'tshirt',
        price: 89,
        rating: 4.5,
        description: 'قميص قطني خفيف مثالي للطقس الدافئ، مصنوع من القطن 100% للراحة طوال اليوم',
        favorite: true
    },
    {
        id: 2,
        name: 'سروال جينز',
        type: 'سروال',
        category: 'سفلي',
        minTemp: 15,
        maxTemp: 30,
        weather: ['مشمس', 'غائم جزئياً', 'غائم'],
        color: 'أزرق',
        image: 'jeans',
        price: 129,
        rating: 4.7,
        description: 'جينز مريح للاستخدام اليومي، نسيج مرن يوفر الراحة والمتانة',
        favorite: false
    },
    {
        id: 3,
        name: 'سترة خفيفة',
        type: 'سترة',
        category: 'علوي',
        minTemp: 15,
        maxTemp: 22,
        weather: ['غائم', 'غائم جزئياً'],
        color: 'رمادي',
        image: 'jacket',
        price: 159,
        rating: 4.3,
        description: 'سترة خفيفة للطقس المعتدل، مناسبة للارتداء في الربيع والخريف',
        favorite: true
    },
    {
        id: 4,
        name: 'فستان صيفي',
        type: 'فستان',
        category: 'كامل',
        minTemp: 25,
        maxTemp: 35,
        weather: ['مشمس'],
        color: 'أصفر',
        image: 'dress',
        price: 149,
        rating: 4.6,
        description: 'فستان صيفي خفيف بتصميم عصري، مثالي للمناسبات الصيفية والنزهات',
        favorite: false
    },
    {
        id: 5,
        name: 'بلوفر صوف',
        type: 'بلوفر',
        category: 'علوي',
        minTemp: 5,
        maxTemp: 15,
        weather: ['غائم', 'ممطر'],
        color: 'بني',
        image: 'sweater',
        price: 119,
        rating: 4.4,
        description: 'بلوفر صوفي دافئ للطقس البارد، مصنوع من صوف ناعم ومريح',
        favorite: false
    },
    {
        id: 6,
        name: 'حذاء رياضي',
        type: 'حذاء',
        category: 'أحذية',
        minTemp: 10,
        maxTemp: 30,
        weather: ['مشمس', 'غائم جزئياً', 'غائم'],
        color: 'أسود',
        image: 'shoes',
        price: 219,
        rating: 4.8,
        description: 'حذاء رياضي خفيف ومريح، مناسب للمشي والرياضة اليومية',
        favorite: true
    },
    {
        id: 7,
        name: 'تيشيرت قطني',
        type: 'تيشيرت',
        category: 'علوي',
        minTemp: 20,
        maxTemp: 35,
        weather: ['مشمس', 'غائم جزئياً'],
        color: 'أزرق فاتح',
        image: 'tshirt',
        price: 59,
        rating: 4.2,
        description: 'تيشيرت قطني بتصميم بسيط وأنيق، مريح للاستخدام اليومي',
        favorite: false
    },
    {
        id: 8,
        name: 'قميص رسمي',
        type: 'قميص',
        category: 'علوي',
        minTemp: 15,
        maxTemp: 25,
        weather: ['مشمس', 'غائم جزئياً', 'غائم'],
        color: 'أزرق سماوي',
        image: 'shirt',
        price: 129,
        rating: 4.5,
        description: 'قميص رسمي أنيق مناسب للمناسبات الرسمية والعمل، قطن مصري عالي الجودة',
        favorite: false
    },
    {
        id: 9,
        name: 'معطف شتوي',
        type: 'معطف',
        category: 'علوي',
        minTemp: -5,
        maxTemp: 10,
        weather: ['غائم', 'ممطر', 'ثلجي'],
        color: 'أزرق',
        image: 'wintercoat',
        price: 299,
        rating: 4.9,
        description: 'معطف شتوي سميك يوفر الدفء في أبرد الأيام، مقاوم للماء ومبطن',
        favorite: false
    },
    {
        id: 10,
        name: 'بنطلون قماش',
        type: 'بنطلون',
        category: 'سفلي',
        minTemp: 10,
        maxTemp: 25,
        weather: ['مشمس', 'غائم جزئياً', 'غائم'],
        color: 'بيج',
        image: 'pants',
        price: 139,
        rating: 4.3,
        description: 'بنطلون قماش عملي بتصميم أنيق، مناسب للمناسبات الرسمية والعمل',
        favorite: false
    },
    {
        id: 11,
        name: 'شورت رياضي',
        type: 'شورت',
        category: 'سفلي',
        minTemp: 25,
        maxTemp: 40,
        weather: ['مشمس'],
        color: 'أسود',
        image: 'shorts',
        price: 79,
        rating: 4.4,
        description: 'شورت رياضي خفيف ومريح، مثالي للطقس الحار والأنشطة الرياضية',
        favorite: false
    },
    {
        id: 12,
        name: 'حذاء رسمي',
        type: 'حذاء',
        category: 'أحذية',
        minTemp: 5,
        maxTemp: 30,
        weather: ['مشمس', 'غائم جزئياً', 'غائم'],
        color: 'بني',
        image: 'formal-shoes',
        price: 249,
        rating: 4.7,
        description: 'حذاء رسمي أنيق مناسب للمناسبات الرسمية والعمل، جلد طبيعي عالي الجودة',
        favorite: false
    },
    {
        id: 13,
        name: 'قبعة صيفية',
        type: 'إكسسوار',
        category: 'إكسسوارات',
        minTemp: 25,
        maxTemp: 40,
        weather: ['مشمس'],
        color: 'بيج',
        image: 'hat',
        price: 59,
        rating: 4.2,
        description: 'قبعة صيفية تحمي من أشعة الشمس، خفيفة ومريحة',
        favorite: false
    },
    {
        id: 14,
        name: 'وشاح شتوي',
        type: 'إكسسوار',
        category: 'إكسسوارات',
        minTemp: -10,
        maxTemp: 10,
        weather: ['غائم', 'ممطر', 'ثلجي'],
        color: 'أحمر',
        image: 'scarf',
        price: 69,
        rating: 4.6,
        description: 'وشاح شتوي دافئ، مصنوع من الصوف الناعم المريح',
        favorite: false
    },
    {
        id: 15,
        name: 'نظارة شمسية',
        type: 'إكسسوار',
        category: 'إكسسوارات',
        minTemp: 20,
        maxTemp: 40,
        weather: ['مشمس'],
        color: 'أسود',
        image: 'sunglasses',
        price: 99,
        rating: 4.5,
        description: 'نظارة شمسية أنيقة توفر حماية كاملة من أشعة الشمس',
        favorite: false
    }
];

// Default outfits based on weather
const DEFAULT_OUTFITS = {
    hot: {
        name: 'إطلالة يوم حار',
        items: [1, 2, 6],
        minTemp: 25,
        maxTemp: 40,
        weather: ['مشمس'],
        image: 'hot-outfit'
    },
    warm: {
        name: 'إطلالة يوم دافئ',
        items: [1, 2, 6],
        minTemp: 20,
        maxTemp: 25,
        weather: ['مشمس', 'غائم جزئياً'],
        image: 'warm-outfit'
    },
    mild: {
        name: 'إطلالة يوم معتدل',
        items: [3, 2, 6],
        minTemp: 15,
        maxTemp: 20,
        weather: ['غائم جزئياً', 'غائم'],
        image: 'mild-outfit'
    },
    cool: {
        name: 'إطلالة يوم بارد',
        items: [5, 2, 6],
        minTemp: 5,
        maxTemp: 15,
        weather: ['غائم', 'ممطر'],
        image: 'cool-outfit'
    },
    cold: {
        name: 'إطلالة يوم شديد البرودة',
        items: [5, 3, 2, 6],
        minTemp: -10,
        maxTemp: 5,
        weather: ['غائم', 'ثلجي'],
        image: 'cold-outfit'
    }
};

// Clothing suggestions based on temperature ranges
const CLOTHING_SUGGESTIONS = [
    {
        minTemp: 30,
        maxTemp: 50,
        suggestion: 'ملابس صيفية خفيفة'
    },
    {
        minTemp: 25,
        maxTemp: 30,
        suggestion: 'ملابس متوسطة'
    },
    {
        minTemp: 20,
        maxTemp: 25,
        suggestion: 'طبقات خفيفة'
    },
    {
        minTemp: 15,
        maxTemp: 20,
        suggestion: 'سترة خفيفة'
    },
    {
        minTemp: 10,
        maxTemp: 15,
        suggestion: 'سترة متوسطة'
    },
    {
        minTemp: 5,
        maxTemp: 10,
        suggestion: 'معطف خفيف'
    },
    {
        minTemp: -10,
        maxTemp: 5,
        suggestion: 'معطف ثقيل مع طبقات'
    }
];

// المتاجر
const STORES = [
    {
        id: 1,
        name: 'ديور',
        image: 'dior',
        categories: ['ملابس', 'عطور', 'إكسسوارات'],
        rating: 4.8,
        delivery: true,
        distance: 2.3,
        priceRange: '$$$$'
    },
    {
        id: 2,
        name: 'بنشي',
        image: 'givenchy',
        categories: ['ملابس', 'حقائب', 'أحذية'],
        rating: 4.7,
        delivery: true,
        distance: 3.1,
        priceRange: '$$$'
    },
    {
        id: 3,
        name: 'زارا',
        image: 'zara',
        categories: ['ملابس', 'أحذية', 'إكسسوارات'],
        rating: 4.5,
        delivery: true,
        distance: 1.5,
        priceRange: '$$'
    },
    {
        id: 4,
        name: 'ماركس & سبنسر',
        image: 'marks-spencer',
        categories: ['ملابس', 'منزل', 'مستلزمات'],
        rating: 4.3,
        delivery: true,
        distance: 2.8,
        priceRange: '$$'
    },
    {
        id: 5,
        name: 'إتش & إم',
        image: 'h&m',
        categories: ['ملابس', 'أطفال', 'منزل'],
        rating: 4.2,
        delivery: true,
        distance: 0.9,
        priceRange: '$$'
    },
    {
        id: 6,
        name: 'أديداس',
        image: 'adidas',
        categories: ['رياضة', 'أحذية', 'ملابس'],
        rating: 4.6,
        delivery: true,
        distance: 3.2,
        priceRange: '$$$'
    },
    {
        id: 7,
        name: 'نايك',
        image: 'nike',
        categories: ['رياضة', 'أحذية', 'ملابس'],
        rating: 4.7,
        delivery: true,
        distance: 4.0,
        priceRange: '$$$'
    },
    {
        id: 8,
        name: 'نمشي',
        image: 'namshi',
        categories: ['ملابس', 'أحذية', 'إكسسوارات'],
        rating: 4.4,
        delivery: true,
        distance: 0,
        priceRange: '$$',
        online: true
    }
];

// المناسبات
const OCCASIONS = [
    {
        id: 1,
        name: 'يومي',
        image: 'casual',
        outfits: [
            { male: [7, 2, 6], female: [7, 11, 6] }
        ]
    },
    {
        id: 2,
        name: 'عمل',
        image: 'work',
        outfits: [
            { male: [8, 10, 12], female: [3, 10, 12] }
        ]
    },
    {
        id: 3,
        name: 'رياضة',
        image: 'sport',
        outfits: [
            { male: [7, 11, 6], female: [7, 11, 6] }
        ]
    },
    {
        id: 4,
        name: 'مناسبة رسمية',
        image: 'formal',
        outfits: [
            { male: [8, 10, 12], female: [4, 12, 15] }
        ]
    },
    {
        id: 5,
        name: 'نزهة خارجية',
        image: 'outdoor',
        outfits: [
            { male: [1, 2, 6, 15], female: [1, 2, 6, 13, 15] }
        ]
    }
];

// Data management class
class DataManager {
    constructor() {
        this.initializeData();
    }

    // Initialize the application data
    initializeData() {
        // Check if weather data exists in localStorage
        if (!localStorage.getItem(STORAGE_KEYS.WEATHER)) {
            localStorage.setItem(STORAGE_KEYS.WEATHER, JSON.stringify(WEATHER_DATA));
        }

        // Check if clothes data exists in localStorage
        if (!localStorage.getItem(STORAGE_KEYS.CLOTHES)) {
            localStorage.setItem(STORAGE_KEYS.CLOTHES, JSON.stringify(DEFAULT_CLOTHES));
        }

        // Initialize users array if it doesn't exist
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
        }
    }

    // Get current weather and forecast
    getWeather() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.WEATHER));
    }

    // Get clothing suggestion based on temperature
    getClothingSuggestion(temperature) {
        const suggestion = CLOTHING_SUGGESTIONS.find(
            item => temperature >= item.minTemp && temperature <= item.maxTemp
        );
        
        return suggestion ? suggestion.suggestion : 'ملابس مناسبة للطقس';
    }

    // Get today's outfit suggestion based on temperature and condition
    getTodaysOutfit() {
        const weather = this.getWeather();
        const temperature = weather.current.temperature;
        const condition = weather.current.condition;
        
        let outfit;
        
        if (temperature >= 25) {
            outfit = DEFAULT_OUTFITS.hot;
        } else if (temperature >= 20) {
            outfit = DEFAULT_OUTFITS.warm;
        } else if (temperature >= 15) {
            outfit = DEFAULT_OUTFITS.mild;
        } else if (temperature >= 5) {
            outfit = DEFAULT_OUTFITS.cool;
        } else {
            outfit = DEFAULT_OUTFITS.cold;
        }
        
        // Get user's preferences to enhance the outfit suggestion
        const userPreferences = this.getUserPreferences();
        if (userPreferences && userPreferences.style) {
            // Adjust outfit based on user preference (simple implementation)
            outfit.name += ` - ${userPreferences.style}`;
        }
        
        return {
            ...outfit,
            items: this.getOutfitItems(outfit.items)
        };
    }

    // Get outfit suggestions for a specific occasion
    getOutfitForOccasion(occasionId) {
        const occasion = OCCASIONS.find(o => o.id === occasionId);
        if (!occasion) return null;
        
        // Choose gender based on user preference or default to first
        const userPreferences = this.getUserPreferences();
        const gender = userPreferences?.gender || 'male';
        
        // Get outfit items for gender
        const outfitConfig = occasion.outfits[0][gender];
        if (!outfitConfig) return null;
        
        return {
            name: occasion.name,
            items: this.getOutfitItems(outfitConfig),
            image: occasion.image
        };
    }

    // Get smart suggestions based on weather and user preferences
    getSmartSuggestions() {
        const weather = this.getWeather();
        const currentTemp = weather.current.temperature;
        const currentCondition = weather.current.condition;
        const userPreferences = this.getUserPreferences();
        const clothes = this.getClothes();
        
        // Filter clothes suitable for current weather
        let suggestions = clothes.filter(item => {
            const tempMatch = currentTemp >= item.minTemp && currentTemp <= item.maxTemp;
            const conditionMatch = item.weather.includes(currentCondition);
            return tempMatch && conditionMatch;
        });
        
        // Personalize based on user preferences if available
        if (userPreferences) {
            // Apply color preferences if any
            if (userPreferences.favoriteColors && userPreferences.favoriteColors.length > 0) {
                suggestions = this.sortByPreferredColors(suggestions, userPreferences.favoriteColors);
            }
            
            // Apply style preferences if any
            if (userPreferences.style) {
                suggestions = this.filterByStyle(suggestions, userPreferences.style);
            }
        }
        
        // Get most frequently used items by user if logged in
        const user = this.getCurrentUser();
        if (user && user.history) {
            suggestions = this.prioritizeFrequentlyUsed(suggestions, user.history);
        }
        
        return suggestions.slice(0, 6);
    }

    // Sort clothes by user's preferred colors
    sortByPreferredColors(clothes, preferredColors) {
        return [...clothes].sort((a, b) => {
            const aHasPreferredColor = preferredColors.includes(a.color);
            const bHasPreferredColor = preferredColors.includes(b.color);
            
            if (aHasPreferredColor && !bHasPreferredColor) return -1;
            if (!aHasPreferredColor && bHasPreferredColor) return 1;
            return 0;
        });
    }

    // Filter clothes by style preference
    filterByStyle(clothes, style) {
        // This is a simplified implementation
        // In a real app, clothes would have style tags or attributes
        const styleKeywords = {
            'كاجوال': ['قميص', 'تيشيرت', 'جينز', 'شورت'],
            'رسمي': ['قميص رسمي', 'بنطلون قماش', 'حذاء رسمي'],
            'رياضي': ['تيشيرت', 'شورت رياضي', 'حذاء رياضي']
        };
        
        const keywords = styleKeywords[style] || [];
        
        if (keywords.length === 0) return clothes;
        
        return clothes.filter(item => 
            keywords.some(keyword => 
                item.name.includes(keyword) || item.type.includes(keyword)
            )
        );
    }

    // Prioritize frequently used items
    prioritizeFrequentlyUsed(clothes, history) {
        return [...clothes].sort((a, b) => {
            const aCount = history[a.id] || 0;
            const bCount = history[b.id] || 0;
            return bCount - aCount;
        });
    }

    // Get user preferences (from localStorage or create default)
    getUserPreferences() {
        const user = this.getCurrentUser();
        if (!user) return null;
        
        if (!user.preferences) {
            return {
                style: 'كاجوال',
                gender: 'male',
                favoriteColors: ['أزرق', 'أسود']
            };
        }
        
        return user.preferences;
    }

    // Update user preferences
    updateUserPreferences(preferences) {
        const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (!userId) return { success: false, message: 'يجب تسجيل الدخول أولاً' };
        
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex === -1) return { success: false, message: 'المستخدم غير موجود' };
        
        users[userIndex].preferences = { 
            ...users[userIndex].preferences, 
            ...preferences 
        };
        
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        
        return { success: true };
    }

    // Get full outfit items from IDs
    getOutfitItems(itemIds) {
        const allClothes = this.getClothes();
        return itemIds.map(id => allClothes.find(item => item.id === id)).filter(Boolean);
    }

    // Get all clothing items
    getClothes() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CLOTHES));
    }

    // Get clothing items suitable for current weather
    getSuitableClothes() {
        const weather = this.getWeather();
        const currentTemp = weather.current.temperature;
        const currentCondition = weather.current.condition;
        
        const allClothes = this.getClothes();
        
        return allClothes.filter(item => {
            const tempMatch = currentTemp >= item.minTemp && currentTemp <= item.maxTemp;
            const conditionMatch = item.weather.includes(currentCondition);
            return tempMatch && conditionMatch;
        });
    }

    // Get all available stores
    getStores() {
        return STORES;
    }

    // Get store by ID
    getStore(id) {
        return STORES.find(s => s.id === id);
    }

    // Get filtered stores by category
    getStoresByCategory(category) {
        if (!category) return STORES;
        return STORES.filter(store => store.categories.includes(category));
    }

    // Get all occasions
    getOccasions() {
        return OCCASIONS;
    }

    // Get occasion by ID
    getOccasion(id) {
        return OCCASIONS.find(o => o.id === id);
    }

    // Check if a user is logged in
    isUserLoggedIn() {
        return localStorage.getItem(STORAGE_KEYS.CURRENT_USER) !== null;
    }

    // Get current user data
    getCurrentUser() {
        const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (!userId) return null;
        
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
        return users.find(user => user.id === userId) || null;
    }

    // Register a new user
    registerUser(username, email, password) {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
        
        // Check if username already exists
        if (users.some(user => user.username === username)) {
            return { success: false, message: 'اسم المستخدم موجود بالفعل' };
        }
        
        // Check if email already exists
        if (users.some(user => user.email === email)) {
            return { success: false, message: 'البريد الإلكتروني موجود بالفعل' };
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password, // In a real app, this should be hashed!
            favorites: [],
            history: {},
            preferences: {
                style: 'كاجوال',
                gender: 'male',
                favoriteColors: ['أزرق', 'أسود']
            },
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        
        // Save updated users array
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        
        // Log user in automatically
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, newUser.id);
        
        return { success: true, user: newUser };
    }

    // Login a user
    loginUser(username, password) {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
        
        const user = users.find(user => user.username === username && user.password === password);
        
        if (!user) {
            return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
        }
        
        // Set current user
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, user.id);
        
        return { success: true, user };
    }

    // Logout current user
    logoutUser() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        return { success: true };
    }

    // Add a clothing item to favorites
    toggleFavorite(clothingId) {
        const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (!userId) return { success: false, message: 'يجب تسجيل الدخول أولاً' };
        
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex === -1) return { success: false, message: 'المستخدم غير موجود' };
        
        const favorites = users[userIndex].favorites || [];
        
        // Toggle favorite status
        const index = favorites.indexOf(clothingId);
        if (index === -1) {
            favorites.push(clothingId);
        } else {
            favorites.splice(index, 1);
        }
        
        users[userIndex].favorites = favorites;
        
        // Save updated users array
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        
        return { success: true };
    }

    // Get user's favorite clothing items
    getFavorites() {
        const user = this.getCurrentUser();
        if (!user || !user.favorites) return [];
        
        const allClothes = this.getClothes();
        return user.favorites.map(id => allClothes.find(item => item.id === parseInt(id))).filter(Boolean);
    }

    // Record usage of a clothing item
    recordClothingUsage(clothingId) {
        const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (!userId) return { success: false };
        
        const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex === -1) return { success: false };
        
        // Initialize history if it doesn't exist
        if (!users[userIndex].history) {
            users[userIndex].history = {};
        }
        
        // Increment usage counter
        const history = users[userIndex].history;
        history[clothingId] = (history[clothingId] || 0) + 1;
        
        // Save updated users array
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        
        return { success: true };
    }

    // Get clothing items similar to given item
    getSimilarItems(itemId) {
        const allClothes = this.getClothes();
        const item = allClothes.find(i => i.id === itemId);
        
        if (!item) return [];
        
        return allClothes.filter(i => 
            i.id !== itemId && 
            i.category === item.category &&
            Math.abs(i.minTemp - item.minTemp) <= 5
        ).slice(0, 4);
    }

    // Simulate refreshing weather data
    refreshWeather() {
        // In a real app, this would call a weather API
        // For this demo, we'll just slightly modify the existing data
        const weather = this.getWeather();
        
        // Randomly adjust temperature by ±1 degree
        weather.current.temperature += Math.random() > 0.5 ? 1 : -1;
        
        // Update timestamp to make it look refreshed
        weather.lastUpdated = new Date().toISOString();
        
        localStorage.setItem(STORAGE_KEYS.WEATHER, JSON.stringify(weather));
        
        return weather;
    }
}

// Create and export a single instance of the DataManager
const dataManager = new DataManager();
