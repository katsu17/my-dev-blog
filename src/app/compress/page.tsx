"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import dynamic from "next/dynamic"
import "ace-builds/src-noconflict/ace"
import "ace-builds/src-noconflict/mode-html"
import "ace-builds/src-noconflict/theme-monokai"
import styles from "../../styles/CompressPage.module.css"

// Aceエディタを動的にインポートします
const AceEditor = dynamic(() => import("react-ace"), { ssr: false })

const CompressPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [compressedImageUrl, setCompressedImageUrl] = useState("")
  const [sizeInfo, setSizeInfo] = useState("")

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    const formData = new FormData()
    formData.append("image", selectedFile)

    const response = await fetch("/api/compress", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()
    if (data.compressed_image_url) {
      setCompressedImageUrl(data.compressed_image_url)
      setSizeInfo(`Original Size: ${(data.original_size / 1024).toFixed(2)} KB
        Compressed Size: ${(data.compressed_image_size / 1024).toFixed(2)} KB
        Reduction: ${(
          (1 - data.compressed_image_size / data.original_size) *
          100
        ).toFixed(2)}%`)
    }
  }

  const downloadCompressedImage = () => {
    if (compressedImageUrl) {
      const a = document.createElement("a")
      a.href = compressedImageUrl
      a.download = "compressed_image.jpg"
      a.click()
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
      {compressedImageUrl && (
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
