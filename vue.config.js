const fs = require('fs');

module.exports = {
    devServer: {
      open: process.platform === 'darwin',
      https: {
        key: fs.readFileSync('./prysoftgestion.com.key'),
        cert: fs.readFileSync('./prysoftgestion.com.crt')
      },
      public: 'https://66.97.47.166:80',
      disableHostCheck: true,
      hotOnly: false,
    },
    "transpileDependencies": [
      "vuetify"
    ],
  }