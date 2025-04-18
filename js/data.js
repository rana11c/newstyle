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
        favorite: true
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
        
        return {
            ...outfit,
            items: this.getOutfitItems(outfit.items)
        };
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
