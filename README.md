# EthioVEO3 - TikTok Video Downloader

A modern, responsive TikTok video downloader website built with plain HTML, CSS, and JavaScript.

## Features

- 🎯 **Clean & Modern UI** - Beautiful gradient design with glassmorphism effects
- 📱 **Fully Responsive** - Works perfectly on all devices
- 🚀 **Fast & Efficient** - Optimized for performance
- 🎨 **Interactive Elements** - Smooth animations and hover effects
- 🔒 **CORS Handled** - Uses tikwm.com API with built-in CORS support
- ⌨️ **Keyboard Shortcuts** - Ctrl/Cmd + Enter to download, Escape to clear
- 🌐 **Real Downloads** - Actually downloads TikTok videos using tikwm.com
- 📹 **HD & SD Quality** - Multiple quality options for downloads

## 🚀 Quick Start

1. **Clone or download** the project files
2. **Open `index.html`** in your web browser
3. **Paste a TikTok video URL** in the input field
4. **Click Download** to start the process

## 📁 File Structure

```
Tiktok-Downloader/
├── index.html          # Main HTML file
├── styles.css          # CSS styling and animations
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🌐 CORS Handling

This website uses the **tikwm.com API** which handles CORS properly, allowing direct frontend integration without needing a backend server.

### How It Works:
- **Direct API calls** to `https://www.tikwm.com/api/`
- **No CORS issues** - the service is designed for frontend use
- **Real-time processing** of TikTok URLs
- **Automatic quality selection** (HD and SD options)

### API Endpoint:
```javascript
const apiUrl = `https://www.tikwm.com/api/?url=${tiktokUrl}&hd=1`;
```

### Response Format:
```json
{
  "code": 0,
  "data": {
    "title": "Video Title",
    "author": "@username",
    "cover": "thumbnail_url",
    "hdplay": "hd_download_url",
    "play": "sd_download_url"
  }
}
```

## 🎨 Customization

### Branding
- Change the brand name in `index.html` (line 9)
- Update colors in `styles.css` (search for `#ff0050` and `#667eea`)
- Modify the logo icon in `index.html` (line 25)

### Styling
- Adjust the gradient background in `styles.css` (line 18)
- Modify button colors and hover effects
- Change the color scheme to match your brand

## 🔧 Technical Details

### Supported URL Formats
- `https://www.tiktok.com/@username/video/1234567890`
- `https://vm.tiktok.com/XXXXXX/`
- `https://vt.tiktok.com/XXXXXX/`

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Dependencies
- Font Awesome 6.0.0 (CDN)
- Google Fonts - Poppins (CDN)

## ⚠️ Important Notes

1. **Legal Compliance**: Ensure you comply with TikTok's Terms of Service and local laws
2. **Rate Limiting**: Be mindful of API usage limits from tikwm.com
3. **User Privacy**: Don't collect or store user data unnecessarily
4. **No Backend Required**: This is a pure frontend solution using tikwm.com API

## 🚀 Deployment

### Static Hosting
- Upload files to Netlify, Vercel, or GitHub Pages
- No backend configuration needed - works immediately
- CORS is handled by tikwm.com API

### Local Development
- Use a local server (Python, Node.js, or Live Server extension)
- Or simply open `index.html` in your browser
- No additional setup required

## 📱 Mobile Optimization

The website is fully optimized for mobile devices with:
- Responsive design
- Touch-friendly buttons
- Optimized layouts for small screens
- Fast loading times

## 🎯 Future Enhancements

- [ ] Batch download support
- [ ] Video quality selection
- [ ] Download history
- [ ] User accounts
- [ ] API rate limiting
- [ ] Video preview
- [ ] Social sharing

## 📄 License

This project is for educational purposes. Please ensure compliance with all applicable laws and terms of service.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve this project.

---

**Built with ❤️ by EthioVEO3**