const { Log } = require('./logger');

const urlStore = new Map();
const clickStats = new Map();

function generateShortcode(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

function isValidShortcode(shortcode) {
    const regex = /^[a-zA-Z0-9]{1,10}$/;
    return regex.test(shortcode);
}

function createShortUrl(originalUrl, validity = 30, customShortcode = null) {
    Log('backend', 'info', 'service', 'creating short url');
    
    if (!isValidUrl(originalUrl)) {
        Log('backend', 'error', 'service', 'invalid url provided');
        throw new Error('Invalid URL provided');
    }
    
    let shortcode = customShortcode;
    
    if (customShortcode) {
        if (!isValidShortcode(customShortcode)) {
            Log('backend', 'error', 'service', 'invalid shortcode format');
            throw new Error('Invalid shortcode format');
        }
        
        if (urlStore.has(customShortcode)) {
            Log('backend', 'error', 'service', 'shortcode already exists');
            throw new Error('Shortcode already exists');
        }
    } else {
        do {
            shortcode = generateShortcode();
        } while (urlStore.has(shortcode));
    }
    
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + validity * 60 * 1000);
    
    const urlData = {
        originalUrl: originalUrl,
        shortcode: shortcode,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        validity: validity
    };
    
    urlStore.set(shortcode, urlData);
    clickStats.set(shortcode, {
        clickCount: 0,
        clicks: []
    });
    
    Log('backend', 'info', 'service', 'short url created successfully');
    
    return {
        shortLink: `http://localhost:3000/${shortcode}`,
        expiry: expiresAt.toISOString()
    };
}

function getUrlByShortcode(shortcode) {
    Log('backend', 'info', 'service', 'retrieving url by shortcode');
    
    const urlData = urlStore.get(shortcode);
    if (!urlData) {
        Log('backend', 'warn', 'service', 'shortcode not found');
        return null;
    }
    
    const now = new Date();
    const expiresAt = new Date(urlData.expiresAt);
    
    if (now > expiresAt) {
        Log('backend', 'warn', 'service', 'shortcode has expired');
        return null;
    }
    
    return urlData;
}

function recordClick(shortcode, referrer, userAgent) {
    Log('backend', 'info', 'service', 'recording click');
    
    const stats = clickStats.get(shortcode);
    if (stats) {
        stats.clickCount++;
        stats.clicks.push({
            timestamp: new Date().toISOString(),
            referrer: referrer || 'direct',
            location: 'unknown',
            userAgent: userAgent
        });
        clickStats.set(shortcode, stats);
    }
}

function getUrlStats(shortcode) {
    Log('backend', 'info', 'service', 'retrieving url statistics');
    
    const urlData = urlStore.get(shortcode);
    if (!urlData) {
        Log('backend', 'warn', 'service', 'shortcode not found for stats');
        return null;
    }
    
    const stats = clickStats.get(shortcode) || { clickCount: 0, clicks: [] };
    
    return {
        originalUrl: urlData.originalUrl,
        shortcode: shortcode,
        createdAt: urlData.createdAt,
        expiresAt: urlData.expiresAt,
        clickCount: stats.clickCount,
        clicks: stats.clicks
    };
}

module.exports = {
    createShortUrl,
    getUrlByShortcode,
    recordClick,
    getUrlStats
};
