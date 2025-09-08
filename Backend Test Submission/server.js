const express = require('express');
const cors = require('cors');
const { Log } = require('./logger');
const { createShortUrl, getUrlByShortcode, recordClick, getUrlStats } = require('./urlService');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    Log('backend', 'info', 'middleware', `${req.method} ${req.path} - incoming request`);
    next();
});

app.post('/shorturls', async (req, res) => {
    try {
        Log('backend', 'info', 'handler', 'processing create short url request');
        
        const { url, validity, shortcode } = req.body;
        
        if (!url) {
            Log('backend', 'error', 'handler', 'url field is required');
            return res.status(400).json({
                error: 'URL is required'
            });
        }
        
        const validityMinutes = validity || 30;
        
        if (typeof validityMinutes !== 'number' || validityMinutes <= 0) {
            Log('backend', 'error', 'handler', 'invalid validity value');
            return res.status(400).json({
                error: 'Validity must be a positive number'
            });
        }
        
        const result = createShortUrl(url, validityMinutes, shortcode);
        
        Log('backend', 'info', 'handler', 'short url created successfully');
        res.status(201).json(result);
        
    } catch (error) {
        Log('backend', 'error', 'handler', `error creating short url: ${error.message}`);
        res.status(400).json({
            error: error.message
        });
    }
});

app.get('/shorturls/:shortcode', async (req, res) => {
    try {
        Log('backend', 'info', 'handler', 'processing get url stats request');
        
        const { shortcode } = req.params;
        
        const stats = getUrlStats(shortcode);
        
        if (!stats) {
            Log('backend', 'warn', 'handler', 'shortcode not found for stats');
            return res.status(404).json({
                error: 'Short URL not found'
            });
        }
        
        Log('backend', 'info', 'handler', 'url stats retrieved successfully');
        res.json(stats);
        
    } catch (error) {
        Log('backend', 'error', 'handler', `error retrieving stats: ${error.message}`);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

app.get('/:shortcode', async (req, res) => {
    try {
        Log('backend', 'info', 'handler', 'processing redirect request');
        
        const { shortcode } = req.params;
        
        const urlData = getUrlByShortcode(shortcode);
        
        if (!urlData) {
            Log('backend', 'warn', 'handler', 'shortcode not found or expired');
            return res.status(404).json({
                error: 'Short URL not found or expired'
            });
        }
        
        const referrer = req.get('Referer');
        const userAgent = req.get('User-Agent');
        
        recordClick(shortcode, referrer, userAgent);
        
        Log('backend', 'info', 'handler', 'redirecting to original url');
        res.redirect(urlData.originalUrl);
        
    } catch (error) {
        Log('backend', 'error', 'handler', `error processing redirect: ${error.message}`);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

app.use((req, res) => {
    Log('backend', 'warn', 'handler', `route not found: ${req.method} ${req.path}`);
    res.status(404).json({
        error: 'Route not found'
    });
});

app.use((error, req, res, next) => {
    Log('backend', 'fatal', 'handler', `unhandled error: ${error.message}`);
    res.status(500).json({
        error: 'Internal server error'
    });
});

app.listen(PORT, () => {
    Log('backend', 'info', 'config', `server started on port ${PORT}`);
    console.log(`Server running on port ${PORT}`);
});
