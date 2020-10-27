module.exports = {
    devServer: {
      open: process.platform === 'darwin',
      host: '66.97.47.166',
      port: 80,
      https: true,
      key: './prysoftgestion.com.key',
      cert: './prysoftgestion.com.crt',
      disableHostCheck: true,
      hotOnly: false,
    },
    "transpileDependencies": [
      "vuetify"
    ],
  }