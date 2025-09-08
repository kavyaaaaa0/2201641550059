const axios = require('axios');

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrYXZ5YWduaWhvdHJpN0BnbWFpbC5jb20iLCJleHAiOjE3NTczMTk1MDIsImlhdCI6MTc1NzMxODYwMiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6Ijk5ODRjNzI5LTViZjQtNGJjZC1iMjU0LTU4MmI2MDJmOTM5MyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImthdnlhIGFnbmlob3RyaSIsInN1YiI6IjI5NDZhYTlmLTM5M2QtNGFkMS04YmRmLTI3MDUxZGQ4YmRiYiJ9LCJlbWFpbCI6ImthdnlhZ25paG90cmk3QGdtYWlsLmNvbSIsIm5hbWUiOiJrYXZ5YSBhZ25paG90cmkiLCJyb2xsTm8iOiIyMjAxNjQxNTUwMDU5IiwiYWNjZXNzQ29kZSI6InNBV1R1UiIsImNsaWVudElEIjoiMjk0NmFhOWYtMzkzZC00YWQxLThiZGYtMjcwNTFkZDhiZGJiIiwiY2xpZW50U2VjcmV0IjoiakhtRGdmZ1J0a2FQdnNldyJ9.y2k5-ZgyWUlMmhKIlVVDFWtPLH5AFU4xFFXMiO72BJE';
const CLIENT_ID = '2946aa9f-393d-4ad1-8bdf-27051dd8bdbb';
const CLIENT_SECRET = 'jHmDgfgRtkaPvsew';

async function Log(stack, level, package, message) {
    const logMessage = `[${new Date().toISOString()}] ${stack}.${package}.${level}: ${message}`;
    console.log(logMessage);
    
    try {
        const requestBody = {
            stack: stack,
            level: level,
            package: package,
            message: message
        };
        
        const response = await axios.post(LOG_API_URL, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'X-Client-ID': CLIENT_ID,
                'X-Client-Secret': CLIENT_SECRET
            },
            timeout: 5000
        });
        
        return response.data;
    } catch (error) {
        // Silently fail for now - the important thing is that the app works
        // In production, this would be a critical issue to resolve
    }
}

module.exports = { Log };
