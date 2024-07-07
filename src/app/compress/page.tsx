"use client"

import React, { useState } from "react"

const CompressPage = () => {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [compressedImageUrl, setCompressedImageUrl] = useState<string | null>(
    null
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleCompress = () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          setError("Failed to get canvas context")
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0, img.width, img.height)

        // JPEGで圧縮
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85)
        setCompressedImageUrl(compressedDataUrl)
        localStorage.setItem("compressedImage", compressedDataUrl)
        setError(null)
      }
      img.onerror = () => {
        setError("Failed to load image")
      }
      img.src = event.target?.result as string
    }
    reader.onerror = () => {
      setError("Failed to read file")
    }
    reader.readAsDataURL(file)
  }

  const handleDownload = () => {
    const compressedImage = localStorage.getItem("compressedImage")
    if (compressedImage) {
      const link = document.createElement("a")
      link.href = compressedImage
      link.download = "compressed_image.jpg"
      link.click()
    } else {
      setError("No compressed image available")
    }
  }

  return (
    <div>
      <h1>Compress Image</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleCompress}>Compress Image</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {compressedImageUrl && (
        <div>
          <h2>Compressed Image</h2>
          <img src={compressedImageUrl} alt="Compressed" />
          <button onClick={handleDownload}>Download Compressed Image</button>
        </div>
      )}
    </div>
  )
}

export default CompressPage
