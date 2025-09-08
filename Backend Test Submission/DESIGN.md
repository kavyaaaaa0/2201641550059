# Design Document - URL Shortener Microservice

## Architectural Overview

Simple three-layer microservice architecture with Express.js framework, in-memory storage, and comprehensive logging integration.

## Technology Choices

### Framework: Express.js
- Lightweight and fast development
- Excellent middleware support
- Simple RESTful routing

### Storage: In-Memory Maps
- Fast read/write operations
- No external dependencies
- Two Maps: urlStore for URL data, clickStats for analytics

### Logging: HTTP API Integration
- Custom logging middleware with Bearer token authentication
- Structured logging with stack, level, package, message format
- Comprehensive application lifecycle logging

## Core Components

### Logger (logger.js)
- Reusable logging function with HTTP API calls
- Bearer token authentication
- Error handling with fallback

### URL Service (urlService.js)
- Business logic separation
- Shortcode generation and validation
- URL expiration management
- Click tracking and statistics

### API Server (server.js)
- Express application with middleware
- RESTful endpoint implementation
- Comprehensive error handling
- Request/response logging

## Key Features

### Shortcode Management
- Random alphanumeric generation (6 chars default)
- Custom shortcode support with validation
- Collision detection and uniqueness

### Expiration System
- Default 30-minute validity
- ISO 8601 timestamp format
- Automatic expiration checking

### Analytics
- Click tracking with timestamps
- Referrer and user agent capture
- Statistics aggregation per shortcode

### Error Handling
- Appropriate HTTP status codes
- Descriptive error messages
- Comprehensive logging for debugging

## API Endpoints

1. POST /shorturls - Create shortened URL
2. GET /shorturls/:shortcode - Retrieve statistics
3. GET /:shortcode - Redirect with click tracking

## Assumptions

- No authentication required for API access
- In-memory storage sufficient for evaluation
- Single instance deployment
- Basic analytics without real geolocation
- HTTP protocol acceptable
