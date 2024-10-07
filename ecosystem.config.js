module.exports = {
    apps: [
      {
        name: 'nodejs-task',
        script: './app.js',
        instances: 2, // 2 replicas
        exec_mode: 'cluster',
      },
    ],
  };
  