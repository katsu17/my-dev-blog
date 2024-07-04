import { NextRequest, NextResponse } from "next/server"
import formidable, { File } from "formidable"
import fs from "fs"
import sharp from "sharp"

export const config = {
  api: {
    bodyParser: false,
  },
}

const compressImage = async (
  file: File
): Promise<{ path: string; size: number }> => {
  const outputFilePath = `./public/uploads/compressed_${file.newFilename}`
  await sharp(file.filepath).jpeg({ quality: 85 }).toFile(outputFilePath)
  const stats = fs.statSync(outputFilePath)
  return {
    path: outputFilePath,
    size: stats.size,
  }
}

export async function POST(req: NextRequest) {
  const form = new formidable.IncomingForm() as any
  form.uploadDir = "./public/uploads"
  form.keepExtensions = true

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
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
      const originalSize = fs.statSync(file.filepath).size
      const compressedImage = await compressImage(file)

      resolve(
        NextResponse.json({
          compressed_image_url: `/uploads/${compressedImage.path
            .split("/")
            .pop()}`,
          compressed_image_size: compressedImage.size,
          original_size: originalSize,
        })
      )
    })
  })
}
