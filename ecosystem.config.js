module.exports = {
  apps: [
    {
      name: 'leapify-service',
      script: 'npm run start:prod',
      interpreter: 'none',
      ignore_watch: ['.git', 'node_modules'],
      watch: ['dist'],
    },
  ],
};
