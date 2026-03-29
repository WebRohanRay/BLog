// Cloudinary configuration and upload utilities
// Images are uploaded to Cloudinary, URLs are stored in Firebase

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''

// Demo mode - uses placeholder images when Cloudinary is not configured
const DEMO_MODE = !CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET

interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  bytes: number
}

interface UploadResult {
  success: boolean
  url?: string
  publicId?: string
  error?: string
}

// Upload image to Cloudinary
export async function uploadToCloudinary(file: File): Promise<UploadResult> {
  if (DEMO_MODE) {
    // In demo mode, return a placeholder URL
    console.log('[Demo] Image upload simulated:', file.name)
    return {
      success: true,
      url: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop`,
      publicId: `demo_${Date.now()}`,
    }
  }

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    formData.append('folder', 'spice-and-simmer/recipes')

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data: CloudinaryUploadResponse = await response.json()

    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

// Upload multiple images
export async function uploadMultipleToCloudinary(files: File[]): Promise<UploadResult[]> {
  return Promise.all(files.map(file => uploadToCloudinary(file)))
}

// Get optimized image URL from Cloudinary
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'auto' | 'webp' | 'jpg' | 'png'
  } = {}
): string {
  if (!url.includes('cloudinary.com')) {
    return url // Return as-is if not a Cloudinary URL
  }

  const { width, height, quality = 80, format = 'auto' } = options
  
  // Build transformation string
  const transforms: string[] = []
  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  transforms.push(`q_${quality}`)
  transforms.push(`f_${format}`)
  transforms.push('c_fill')

  // Insert transformation into URL
  const transformString = transforms.join(',')
  return url.replace('/upload/', `/upload/${transformString}/`)
}

// Delete image from Cloudinary (requires server-side API key)
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (DEMO_MODE) {
    console.log('[Demo] Image delete simulated:', publicId)
    return true
  }

  // This should be called via an API route with server-side credentials
  const response = await fetch('/api/cloudinary/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId }),
  })

  return response.ok
}

// Generate responsive image srcset
export function getResponsiveSrcSet(url: string): string {
  if (!url.includes('cloudinary.com')) {
    return url
  }

  const widths = [320, 640, 768, 1024, 1280, 1536]
  return widths
    .map(w => `${getOptimizedImageUrl(url, { width: w })} ${w}w`)
    .join(', ')
}
