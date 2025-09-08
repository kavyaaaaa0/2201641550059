# Evaluation Logger Middleware

A reusable logging middleware package for sending logs to the evaluation service.

## Installation

```bash
npm install
```

## Usage

```javascript
const { Log } = require('./logger');

// Log function signature: Log(stack, level, package, message)
await Log('backend', 'info', 'service', 'user created successfully');
await Log('backend', 'error', 'handler', 'invalid request data');
```

## Parameters

- **stack**: 'backend' or 'frontend'
- **level**: 'debug', 'info', 'warn', 'error', 'fatal'
- **package**: Component name like 'handler', 'service', 'controller', etc.
- **message**: Descriptive log message
