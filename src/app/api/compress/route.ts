import { NextApiRequest, NextApiResponse } from "next"
import formidable, { File } from "formidable"
import fs from "fs"
import sharp from "sharp"

export const runtime = "nodejs"

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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm()
    ;(form as any).uploadDir = "./public/uploads" // 型アサーションを使用
    ;(form as any).keepExtensions = true // 型アサーションを使用

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: "Error parsing the file" })
        return
      }
      const file = (files.image as File[])[0] // 型を適切にキャスト
      const originalSize = fs.statSync(file.filepath).size
      const compressedImage = await compressImage(file)
      res.status(200).json({
        compressed_image_url: `/uploads/${compressedImage.path
          .split("/")
          .pop()}`,
        compressed_image_size: compressedImage.size,
        original_size: originalSize,
      })
    })
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}

export default handler
