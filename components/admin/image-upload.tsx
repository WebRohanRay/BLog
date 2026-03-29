'use client'

import { useState, useCallback, useRef, useId } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onPublicIdChange?: (publicId: string) => void
  className?: string
  aspectRatio?: 'square' | 'video' | 'wide'
}

export function ImageUpload({
  value,
  onChange,
  onPublicIdChange,
  className,
  aspectRatio = 'video',
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const uniqueId = useId()
  const inputId = `image-upload-${uniqueId}`

  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
  }

  const handleUpload = useCallback(async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB')
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      const result = await uploadToCloudinary(file)
      
      if (result.success && result.url) {
        onChange(result.url)
        if (onPublicIdChange && result.publicId) {
          onPublicIdChange(result.publicId)
        }
      } else {
        setError(result.error || 'Upload failed')
      }
    } catch (err) {
      setError('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }, [onChange, onPublicIdChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleUpload(file)
    }
  }, [handleUpload])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }, [handleUpload])

  const handleRemove = useCallback(() => {
    onChange('')
    if (onPublicIdChange) {
      onPublicIdChange('')
    }
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [onChange, onPublicIdChange])

  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
        id={inputId}
      />

      {value ? (
        <div className="space-y-2">
          <div className={cn('relative rounded-lg overflow-hidden border-4 border-green-500 bg-muted flex items-center justify-center min-h-[200px]', aspectRatioClass[aspectRatio])}>
            <img
              src={value}
              alt="Uploaded preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 z-10"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="bg-green-500/10 text-green-600 p-2 rounded-md border border-green-500/20 text-xs break-all">
            <strong>Upload Successful!</strong><br />
            <a href={value} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-700">
              {value}
            </a>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer transition-colors',
            aspectRatioClass[aspectRatio],
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
            isUploading && 'pointer-events-none opacity-60'
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin" />
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
              <div className="rounded-full bg-muted p-3">
                <ImageIcon className="h-6 w-6" />
              </div>
              <div>
                <span className="font-medium text-foreground">Click to upload</span>
                <span className="text-sm"> or drag and drop</span>
              </div>
              <span className="text-xs">PNG, JPG or WebP (max 10MB)</span>
            </div>
          )}
        </label>
      )}

      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}

      <p className="mt-2 text-xs text-muted-foreground">
        Images are uploaded to Cloudinary and optimized automatically
      </p>
    </div>
  )
}
