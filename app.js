const express = require('express');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const redis = require('redis');
const fs = require('fs');
const path = require('path');


const redisClient = redis.createClient({
  host: '127.0.0.1',
  port: 6380,        
  enable_offline_queue: false,
});

// Log file setup
const logFile = path.join(__dirname, 'task_logs.txt');

// Rate limiter setup
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 20, 
  duration: 60, 
  keyPrefix: 'rateLimiter',
  inmemoryBlockOnConsumed: 20, 
  blockDuration: 1,
  execEvenly: true, 
  insuranceLimiter: new RateLimiterRedis({
    storeClient: redisClient,
    points: 1,
    duration: 1,
  }),
});

const app = express();
app.use(express.json());

// Task function to log completion
async function task(user_id) {
  const logMessage = `${user_id} - task completed at - ${new Date(Date.now()).toISOString()}\n`;
  fs.appendFile(logFile, logMessage, (err) => {
    if (err) console.error('Failed to write log', err);
  });
}

// Queue for tasks
const taskQueue = {};

const processQueue = (userId) => {
  if (taskQueue[userId] && taskQueue[userId].length > 0) {
    const nextTask = taskQueue[userId].shift();
    task(nextTask.userId);
    rateLimiter.consume(nextTask.userId).then(() => {
      processQueue(userId);
    }).catch((err) => {
      // Wait for rate limiter reset
      setTimeout(() => processQueue(userId), 1000);
    });
  }
};

// API route to handle task requests
app.post('/task', async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).send('user_id is required');
  }

  try {
    await rateLimiter.consume(user_id);
    task(user_id);
    res.status(200).send('Task processed');
  } catch (rejRes) {
    // Add to queue if rate limit is exceeded
    if (!taskQueue[user_id]) {
      taskQueue[user_id] = [];
    }
    taskQueue[user_id].push({ userId: user_id });

    res.status(429).send('Rate limit exceeded, task queued');
  }
});

// Start the server on port 3001
const PORT = process.env.PORT || 3001; // Set the desired port here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
