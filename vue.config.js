const fs = require('fs');

module.exports = {
    devServer: {
      open: process.platform === 'darwin',
      port: 80,
      https: {
        key: fs.readFileSync('./cert/cert.crt'),
        cert: fs.readFileSync('./cert/keyarchive.key')
      },
      public: 'https://66.97.47.166',
      disableHostCheck: true,
      hotOnly: false,
    },
    "transpileDependencies": [
      "vuetify"
    ],
  }