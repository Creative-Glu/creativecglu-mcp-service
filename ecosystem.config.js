module.exports = {
  apps: [
    {
      name: 'creativeglue-mcp-service',
      script: 'npm run start:prod',
      interpreter: 'none',
      ignore_watch: ['.git', 'node_modules'],
      watch: ['dist'],
    },
  ],
};
