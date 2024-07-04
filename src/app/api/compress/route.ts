import { NextRequest, NextResponse } from "next/server"
import formidable, { File, Fields, Files, IncomingForm } from "formidable"
import fs from "fs"
import sharp from "sharp"

export const runtime = "nodejs" // 必要に応じてランタイムを指定

export const POST = async (req: NextRequest) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm() as unknown as formidable.IncomingForm & {
      uploadDir: string
      keepExtensions: boolean
    }
    form.uploadDir = "./public/uploads" // 型アサーションを使用
    form.keepExtensions = true // 型アサーションを使用

    form.parse(
      req as any,
      async (err: any, fields: formidable.Fields, files: formidable.Files) => {
        // 型を明示的に指定
        if (err) {
          reject(
            NextResponse.json(
              { error: "Error parsing the file" },
              { status: 500 }
            )
          )
          return
        }
        const file = Array.isArray(files.image) ? files.image[0] : files.image
        if (!file) {
          reject(
            NextResponse.json({ error: "No file uploaded" }, { status: 400 })
          )
          return
        }
        const actualFile = file as formidable.File // 型を適切にキャスト

        const originalSize = fs.statSync(actualFile.filepath).size
        const outputFilePath = `./public/uploads/compressed_${actualFile.newFilename}`

        try {
          await sharp(actualFile.filepath)
            .jpeg({ quality: 85 })
            .toFile(outputFilePath)

          const compressedSize = fs.statSync(outputFilePath).size
          resolve(
            NextResponse.json({
              compressed_image_url: `/uploads/compressed_${actualFile.newFilename}`,
              compressed_image_size: compressedSize,
              original_size: originalSize,
            })
          )
        } catch (error) {
          reject(
            NextResponse.json(
              { error: "Error compressing the file" },
              { status: 500 }
            )
          )
        }
      }
    )
  })
}
