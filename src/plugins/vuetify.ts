import { createThemePlugin } from '@vuetify/v0'

export default createThemePlugin({
  default: 'light',
  target: 'html',
  themes: {
    light: {
      dark: false,
      colors: {
        'primary': '#2d6a4f',
        'secondary': '#52796f',
        'background': '#ffffff',
        'surface': '#ffffff',
        'on-background': '#212121',
        'on-surface': '#212121',
      },
    },
  },
})
