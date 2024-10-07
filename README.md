# Node.js Task Queuing with Rate Limiting

## Overview
This project implements a Node.js API that processes tasks with a rate limiting and queuing system designed for individual users. The system ensures that no requests are dropped and manages task execution based on user-specific rate limits.

## Features
- **Rate Limiting**: Enforces a limit of 1 task per second and 20 tasks per minute per user ID.
- **Task Queuing**: Automatically queues tasks that exceed the rate limit, ensuring all requests are eventually processed.
- **Logging**: Records task completion details, including user ID and timestamp, in a log file.
- **Resilience**: Designed to handle edge cases and maintain functionality under various conditions.

## Technologies Used
- **Node.js**: JavaScript runtime for building the API.
- **Express.js**: Web framework for creating the API server.
- **Redis**: In-memory data structure store used for rate limiting and task queue management.
- **PM2**: Process manager for Node.js applications, enabling clustering and monitoring.

## Setup Instructions

### Prerequisites
- Ensure you have Node.js and npm installed on your machine.
- Redis must be installed and running on your machine.

### Installation Steps
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-name>
2.**Install Dependencies**
```bash
npm install
```
3.**Start the Redis Server**: Open a new terminal and run:
```
redis-server --port 6380
```
4.**Start the API Server**: In the terminal where you installed the dependencies, run:
```bash
npm start
```
## Configuration
- The API runs on port 3001 by default. You can change this in the app.js file by modifying the PORT variable.
- The Redis client connects to localhost on port 6380. Ensure these settings match your Redis configuration.


## Testing the API
**Using Postman**
- 1.Open Postman.
- 2.Set the request type to POST.
- 3.Enter the URL: http://localhost:3001/task.
- 4.In the body, select raw and choose JSON format.
- 5.Enter the following JSON payload:
```json
{
    "user_id": "123"
}
```
- 6.Click "Send" to test the endpoint.
## Using cURL
You can also test the API using cURL. Open your command line and run:
```
curl -X POST http://localhost:3001/task -H "Content-Type: application/json" -d "{\"user_id\": \"123\"}"
```
## Verifying Log Entries
After sending requests, check the task_logs.txt file to verify the format of the log entries:

```yaml
123 - task completed at - 2024-10-07T12:57:59.489Z
```
## Edge Case Testing
Test with multiple user IDs.
Rapidly send requests to check if the rate limiting and queuing mechanisms function as expected.
## Assumptions
- Redis is expected to be running on localhost at port 6380.
- The API is designed to handle multiple concurrent requests efficiently.
## Conclusion
- This project effectively demonstrates the implementation of a rate-limited task queuing system using Node.js and Redis. All requests are preserved and executed according to the defined limits, ensuring reliability and robustness.

## License
This project is licensed under the MIT License. Feel free to use, modify, and distribute it as you see fit.

