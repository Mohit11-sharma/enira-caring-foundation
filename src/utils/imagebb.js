const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

class ImageBBService {
  constructor() {
    this.apiKey = IMGBB_API_KEY;
    this.uploadUrl = IMGBB_UPLOAD_URL;
    
    if (!this.apiKey) {
      console.warn('⚠️ ImageBB API key not found. Please add VITE_IMGBB_API_KEY to your .env file.');
    } else {
      console.log('🔧 ImageBB Service initialized with API key:', `${this.apiKey.substring(0, 8)}...`);
    }
  }

  /**
   * Upload image to ImageBB and return the URL
   * @param {File} imageFile - The image file to upload
   * @param {string} name - Optional name for the image
   * @returns {Promise<Object>} - Returns the image data object
   */
  async uploadImage(imageFile, name = null) {
    console.log('🔧 ImageBB Service - Starting upload process...');
    
    if (!this.apiKey) {
      console.error('❌ ImageBB API key is not configured');
      throw new Error('ImageBB API key is not configured. Please add VITE_IMGBB_API_KEY to your environment variables.');
    }

    if (!imageFile) {
      console.error('❌ No image file provided');
      throw new Error('No image file provided');
    }

    // Validate file type
    if (!this.isValidImageType(imageFile)) {
      console.error('❌ Invalid file type:', imageFile.type);
      throw new Error('Invalid file type. Please upload a valid image (jpg, jpeg, png, gif, bmp, webp)');
    }

    // Validate file size (ImageBB free tier limit is 32MB, but we'll use 5MB for better UX)
    if (!this.isValidFileSize(imageFile, 5 * 1024 * 1024)) {
      console.error('❌ File too large:', this.formatFileSize(imageFile.size));
      throw new Error('File size too large. Maximum size is 5MB');
    }

    try {
      console.log('🖼️ Uploading image to ImageBB:', {
        fileName: imageFile.name,
        fileSize: this.formatFileSize(imageFile.size),
        fileType: imageFile.type,
        apiKey: this.apiKey ? `${this.apiKey.substring(0, 8)}...` : 'NOT_SET'
      });

      // Convert file to base64 for ImageBB API
      const base64Image = await this.fileToBase64(imageFile);
      
      console.log('📝 Image converted to base64, length:', base64Image.length);

      const formData = new FormData();
      formData.append('key', this.apiKey);
      formData.append('image', base64Image);
      
      if (name) {
        formData.append('name', name);
      }

      // Set expiration to never expire (0) for permanent storage
      formData.append('expiration', '0');

      const response = await fetch(this.uploadUrl, {
        method: 'POST',
        body: formData
      });

      console.log('📡 ImageBB Response status:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = 'Failed to upload image';
        try {
          const errorData = await response.json();
          console.error('❌ ImageBB API Error:', errorData);
          errorMessage = errorData.error?.message || errorData.message || errorMessage;
        } catch (parseError) {
          console.error('❌ Failed to parse error response:', parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('📋 ImageBB Response data:', data);
      
      if (data.success && data.data) {
        const imageData = {
          url: data.data.url,
          displayUrl: data.data.display_url,
          deleteUrl: data.data.delete_url,
          thumbnail: data.data.thumb?.url,
          medium: data.data.medium?.url,
          title: data.data.title,
          size: data.data.size
        };
        
        console.log('✅ Image uploaded successfully to ImageBB:', imageData.url);
        return imageData;
      } else {
        console.error('❌ Upload failed - Invalid response:', data);
        throw new Error(data.error?.message || 'Upload failed - Invalid response from ImageBB');
      }
    } catch (error) {
      console.error('❌ ImageBB upload error:', error);
      
      // Provide more specific error messages
      if (error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to ImageBB. Please check your internet connection.');
      } else if (error.message.includes('API key')) {
        throw new Error('ImageBB API key is invalid or not configured properly.');
      } else {
        throw new Error(`Image upload failed: ${error.message}`);
      }
    }
  }

  /**
   * Convert file to base64 string
   * @param {File} file 
   * @returns {Promise<string>}
   */
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Remove the data URL prefix (data:image/jpeg;base64,)
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => {
        console.error('❌ FileReader error:', error);
        reject(new Error('Failed to convert image to base64'));
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload multiple images
   * @param {File[]} imageFiles - Array of image files
   * @returns {Promise<Object[]>} - Returns array of image URLs and data
   */
  async uploadMultipleImages(imageFiles) {
    console.log('📦 Uploading multiple images:', imageFiles.length);
    
    const uploadPromises = imageFiles.map((file, index) => 
      this.uploadImage(file, `image_${index}_${Date.now()}`)
    );

    try {
      const results = await Promise.all(uploadPromises);
      console.log('✅ All images uploaded successfully:', results.length);
      return results;
    } catch (error) {
      console.error('❌ Multiple image upload error:', error);
      throw error;
    }
  }

  /**
   * Check if file type is valid
   * @param {File} file 
   * @returns {boolean}
   */
  isValidImageType(file) {
    const validTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp'
    ];
    return validTypes.includes(file.type.toLowerCase());
  }

  /**
   * Check if file size is valid
   * @param {File} file 
   * @param {number} maxSize - Maximum size in bytes (default 5MB)
   * @returns {boolean}
   */
  isValidFileSize(file, maxSize = 5 * 1024 * 1024) {
    return file.size <= maxSize;
  }

  /**
   * Get file size in human readable format
   * @param {number} bytes 
   * @returns {string}
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Check if API key is configured
   * @returns {boolean}
   */
  isConfigured() {
    return Boolean(this.apiKey);
  }

  /**
   * Get API status
   * @returns {Object}
   */
  getStatus() {
    return {
      configured: this.isConfigured(),
      apiKey: this.apiKey ? `${this.apiKey.substring(0, 8)}...` : 'NOT_SET',
      uploadUrl: this.uploadUrl
    };
  }
}

export const imageBBService = new ImageBBService();

// Export for debugging - only in browser environment
if (typeof window !== 'undefined') {
  window.imageBBService = imageBBService;
  console.log('🔧 ImageBB Service Status:', imageBBService.getStatus());
}