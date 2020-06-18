import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import Vuetify from 'vuetify'
import es from 'vuetify/es5/locale/es';

Vue.use(Vuetify,{
  iconfont: 'mdi'
})

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#3F51B5',
        secondary: '#78909C',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      },
    },
  },
  lang: {
    locales: { es },
    current: 'es',
  },
  iconfont: 'mdi'
})