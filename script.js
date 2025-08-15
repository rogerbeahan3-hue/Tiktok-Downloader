// DOM Elements
const videoUrlInput = document.getElementById('videoUrl');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const resultSection = document.getElementById('resultSection');
const errorSection = document.getElementById('errorSection');
const loadingSection = document.getElementById('loadingSection');
const videoThumbnail = document.getElementById('videoThumbnail');
const videoTitle = document.getElementById('videoTitle');
const videoAuthor = document.getElementById('videoAuthor');
const downloadHDBtn = document.getElementById('downloadHD');
const downloadSDBtn = document.getElementById('downloadSD');
const retryBtn = document.getElementById('retryBtn');
const errorMessage = document.getElementById('errorMessage');

// Event Listeners
downloadBtn.addEventListener('click', handleDownload);
clearBtn.addEventListener('click', clearAll);
retryBtn.addEventListener('click', retryDownload);
downloadHDBtn.addEventListener('click', () => downloadVideo('hd'));
downloadSDBtn.addEventListener('click', () => downloadVideo('sd'));

// Enter key support for input
videoUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleDownload();
    }
});

// Main download function
async function handleDownload() {
    const url = videoUrlInput.value.trim();
    
    if (!url) {
        showError('Please enter a TikTok video URL');
        return;
    }
    
    if (!isValidTikTokUrl(url)) {
        showError('Please enter a valid TikTok video URL');
        return;
    }
    
    showLoading();
    hideAllSections();
    
    try {
        // Extract video ID from URL
        const videoId = extractVideoId(url);
        
        // Simulate API call (in real implementation, you'd call your backend)
        const videoInfo = await fetchVideoInfo(videoId);
        
        if (videoInfo.success) {
            showResult(videoInfo.data);
        } else {
            showError(videoInfo.message || 'Failed to fetch video information');
        }
    } catch (error) {
        console.error('Download error:', error);
        showError('An error occurred while processing the video. Please try again.');
    }
}

// Validate TikTok URL
function isValidTikTokUrl(url) {
    const tiktokPatterns = [
        /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/,
        /^https?:\/\/(www\.)?vm\.tiktok\.com\/[\w]+/,
        /^https?:\/\/(www\.)?vt\.tiktok\.com\/[\w]+/
    ];
    
    return tiktokPatterns.some(pattern => pattern.test(url));
}

// Extract video ID from URL
function extractVideoId(url) {
    // Handle different TikTok URL formats
    if (url.includes('/video/')) {
        const match = url.match(/\/video\/(\d+)/);
        return match ? match[1] : null;
    } else if (url.includes('vm.tiktok.com') || url.includes('vt.tiktok.com')) {
        // For shortened URLs, we'd need to follow the redirect
        return 'shortened';
    }
    return null;
}

// Fetch video information from tikwm.com API
async function fetchVideoInfo(videoId) {
    try {
        const tiktokUrl = videoUrlInput.value.trim();
        
        // Use tikwm.com API endpoint
        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(tiktokUrl)}&hd=1`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Debug: Log the API response to see the actual structure
        console.log('TikTok API Response:', data);
        
        // Check if the API response is successful
        if (data.code === 0 && data.data) {
            // Safely extract and validate data properties
            const title = extractSafeString(data.data.title, `TikTok Video ${videoId}`);
            const author = extractSafeString(data.data.author, '@tiktokuser');
            const thumbnail = extractSafeString(data.data.cover || data.data.thumbnail, `https://picsum.photos/300/300?random=${videoId}`);
            
            // Extract download URLs safely - try multiple possible property names
            let hdUrl = '';
            let sdUrl = '';
            
            // Try different possible property names for download URLs
            if (data.data.hdplay) {
                hdUrl = extractSafeString(data.data.hdplay, '');
            } else if (data.data.play) {
                hdUrl = extractSafeString(data.data.play, '');
            }
            
            if (data.data.play) {
                sdUrl = extractSafeString(data.data.play, '');
            } else if (data.data.hdplay) {
                sdUrl = extractSafeString(data.data.hdplay, '');
            }
            
            // If we still don't have URLs, try other possible properties
            if (!hdUrl && !sdUrl) {
                // Look for any property that might contain a URL
                for (const [key, value] of Object.entries(data.data)) {
                    if (typeof value === 'string' && value.includes('http') && (value.includes('.mp4') || value.includes('video'))) {
                        if (!hdUrl) {
                            hdUrl = value;
                        } else if (!sdUrl) {
                            sdUrl = value;
                        }
                    }
                }
            }
            
            return {
                success: true,
                data: {
                    id: videoId,
                    title: title,
                    author: author,
                    thumbnail: thumbnail,
                    downloadUrls: {
                        hd: hdUrl,
                        sd: sdUrl
                    }
                }
            };
        } else {
            return {
                success: false,
                message: data.msg || 'Failed to fetch video information'
            };
        }
        
    } catch (error) {
        console.error('API Error:', error);
        
        // Return error message for user
        return {
            success: false,
            message: 'Network error. Please check your connection and try again.'
        };
    }
}

// Helper function to safely extract string values
function extractSafeString(value, fallback) {
    if (typeof value === 'string') {
        return value.trim();
    } else if (typeof value === 'number') {
        return value.toString();
    } else if (value && typeof value === 'object') {
        // If it's an object, try to find a string property or convert to string
        console.warn('Unexpected object value:', value);
        return fallback;
    } else if (value === null || value === undefined) {
        return fallback;
    } else {
        return fallback;
    }
}

// Show result section
function showResult(videoInfo) {
    hideAllSections();
    
    // Debug: Log the video info being displayed
    console.log('Displaying video info:', videoInfo);
    
    // Safely set the thumbnail
    if (videoInfo.thumbnail && videoInfo.thumbnail !== '') {
        videoThumbnail.src = videoInfo.thumbnail;
    } else {
        videoThumbnail.src = 'https://picsum.photos/300/300?random=1';
    }
    
    // Safely set the title
    if (videoInfo.title && typeof videoInfo.title === 'string') {
        videoTitle.textContent = videoInfo.title;
    } else {
        videoTitle.textContent = 'TikTok Video';
        console.warn('Invalid title value:', videoInfo.title);
    }
    
    // Safely set the author
    if (videoInfo.author && typeof videoInfo.author === 'string') {
        videoAuthor.textContent = videoInfo.author;
    } else {
        videoAuthor.textContent = '@tiktokuser';
        console.warn('Invalid author value:', videoInfo.author);
    }
    
    // Store download URLs for later use
    if (videoInfo.downloadUrls && videoInfo.downloadUrls.hd) {
        downloadHDBtn.dataset.url = videoInfo.downloadUrls.hd;
    }
    if (videoInfo.downloadUrls && videoInfo.downloadUrls.sd) {
        downloadSDBtn.dataset.url = videoInfo.downloadUrls.sd;
    }
    
    resultSection.classList.remove('hidden');
}

// Show error section
function showError(message) {
    hideAllSections();
    errorMessage.textContent = message;
    errorSection.classList.remove('hidden');
}

// Show loading section
function showLoading() {
    hideAllSections();
    loadingSection.classList.remove('hidden');
}

// Hide all sections
function hideAllSections() {
    resultSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    loadingSection.classList.add('hidden');
}

// Clear all inputs and sections
function clearAll() {
    videoUrlInput.value = '';
    hideAllSections();
    videoUrlInput.focus();
}

// Retry download
function retryDownload() {
    hideAllSections();
    videoUrlInput.focus();
}

// Download video function
function downloadVideo(quality) {
    const button = quality === 'hd' ? downloadHDBtn : downloadSDBtn;
    const downloadUrl = button.dataset.url;
    
    if (!downloadUrl) {
        showError('Download URL not available');
        return;
    }
    
    try {
        // Create download link
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `tiktok-video-${quality}.mp4`;
        link.target = '_blank';
        
        // Add click event to trigger download
        link.click();
        
        // Show success message
        showDownloadSuccess(quality);
        
    } catch (error) {
        console.error('Download error:', error);
        showError('Download failed. Please try again.');
    }
}

// Show download success message
function showDownloadSuccess(quality) {
    // Create a temporary success notification
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${quality.toUpperCase()} download started!</span>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'Poppins', sans-serif;
        animation: slideIn 0.3s ease;
    `;
    
    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

// CORS handling for tikwm.com API
function handleCORS() {
    // Using tikwm.com API which handles CORS properly
    // No additional CORS handling needed for this endpoint
    console.log('Using tikwm.com API - CORS handled by the service');
}

// Initialize the application
function init() {
    handleCORS();
    
    // Add some interactive features
    addInputValidation();
    addCopyPasteSupport();
}

// Add input validation
function addInputValidation() {
    videoUrlInput.addEventListener('input', (e) => {
        const url = e.target.value;
        const isValid = url === '' || isValidTikTokUrl(url);
        
        if (isValid) {
            e.target.style.borderColor = '#e1e5e9';
        } else {
            e.target.style.borderColor = '#dc3545';
        }
    });
}

// Add copy-paste support
function addCopyPasteSupport() {
    videoUrlInput.addEventListener('paste', (e) => {
        // Auto-validate pasted content
        setTimeout(() => {
            const url = e.target.value;
            if (isValidTikTokUrl(url)) {
                e.target.style.borderColor = '#28a745';
            }
        }, 100);
    });
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to download
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleDownload();
    }
    
    // Escape to clear
    if (e.key === 'Escape') {
        clearAll();
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add some visual feedback for better UX
downloadBtn.addEventListener('mouseenter', () => {
    downloadBtn.style.transform = 'translateY(-3px) scale(1.02)';
});

downloadBtn.addEventListener('mouseleave', () => {
    downloadBtn.style.transform = 'translateY(0) scale(1)';
});

// Add ripple effect to buttons
function addRippleEffect(button) {
    button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Add ripple effect to all buttons
document.querySelectorAll('button').forEach(addRippleEffect);

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle); 