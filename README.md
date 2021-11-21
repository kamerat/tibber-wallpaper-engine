# Tibber Graph (Wallpaper Engine Background)

![Preview of wallpaper](public/preview-big.png?raw=true "Preview of wallpaper")

WallpaperEngine project that uses Tibber API to show your latest power consumption(kwh), cost and the spot price.

# Usage
## Project setup
```
npm install
```

### Compiles and minifies for production
```
npm run build
```

## How use wallpaper
1. Right click WallpaperEngine and select "Create wallpaper" 
2. Drag & drop index file in drop-zone from generated dist folder from step above
3. Click "File" then "Apply wallpaper"
4. Add your [Tibber API key](https://developer.tibber.com/settings/accesstoken) in the wallpaper settings
5. Click "OK"

## TODOS
- [x] Add support for live-data via [Tibber - Pulse](https://tibber.com/no/store/produkt/pulse)
- [ ] Fix live-data to use users house-id
- [ ] Better docs
- [ ] Release on steam for easy access in wallpaperEngine browser

## Attributions
- Default background photo by Photo by <a href="https://unsplash.com/@pawel_czerwinski?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Pawel Czerwinski</a> on <a href="https://unsplash.com/collections/10591125/pawel-czerwinski?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
- [Charts.js](https://github.com/chartjs/Chart.js) & [vue-chartjs](https://github.com/apertureless/vue-chartjs)
- [Tibber API](https://developer.tibber.com/docs/overview)
  

# Development
### Compiles and hot-reloads for development
```
npm run serve
```

// TODO: Add guide for live-reload w/ symlink
