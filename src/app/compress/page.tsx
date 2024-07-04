"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import imageCompression from "browser-image-compression"
import styles from "../styles/CompressPage.module.css"

const CompressPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [compressedFile, setCompressedFile] = useState<Blob | null>(null)
  const [sizeInfo, setSizeInfo] = useState("")

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }

    try {
      const compressedBlob = await imageCompression(selectedFile, options)
      setCompressedFile(compressedBlob)

      const originalSize = selectedFile.size
      const compressedSize = compressedBlob.size
      setSizeInfo(`Original Size: ${(originalSize / 1024).toFixed(2)} KB
        Compressed Size: ${(compressedSize / 1024).toFixed(2)} KB
        Reduction: ${((1 - compressedSize / originalSize) * 100).toFixed(2)}%`)
    } catch (error) {
      console.error("Error compressing the image", error)
    }
  }

  const downloadCompressedImage = () => {
    if (compressedFile) {
      const url = URL.createObjectURL(compressedFile)
      const a = document.createElement("a")
      a.href = url
      a.download = "compressed_image.jpg"
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className={styles.container}>
      <h1>Image Compressor</h1>
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        {selectedFile && (
          <span className={styles.fileInfo}>
            Selected file: {selectedFile.name}
          </span>
        )}
        <br />
        <button type="submit">Compress Image</button>
      </form>
      {compressedFile && (
        <div>
          <h2>Compressed Image</h2>
          <button
            onClick={downloadCompressedImage}
            className={styles.downloadLink}
          >
            Download Compressed Image
          </button>
          <div className={styles.sizeInfo}>{sizeInfo}</div>
        </div>
      )}
    </div>
  )
}

export default CompressPage
