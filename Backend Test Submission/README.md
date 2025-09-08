# URL Shortener Microservice

A HTTP URL shortener microservice with analytics and logging integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

## API Endpoints

### POST /shorturls
Create a new shortened URL.

**Request:**
```json
{
    "url": "https://example.com",
    "validity": 30,
    "shortcode": "abc123"
}
```

**Response:**
```json
{
    "shortLink": "http://localhost:3000/abc123",
    "expiry": "2025-01-01T00:30:00.000Z"
}
```

### GET /shorturls/:shortcode
Get statistics for a shortened URL.

### GET /:shortcode
Redirect to the original URL (tracks clicks).

## Features
- Custom shortcodes with validation
- Configurable expiration (default 30 minutes)
- Click tracking and analytics
- Comprehensive logging
- Error handling with proper HTTP status codes
