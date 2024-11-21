module.exports = {
  apps: [
    {
      name: "Medibox",
      port: 3001,
      exec_mode: "fork",
      instances: 1,
      script: "./.output/server/index.mjs",
      args: "start",
    },
  ],
};
