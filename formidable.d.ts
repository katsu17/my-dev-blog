import * as formidable from "formidable"

declare module "formidable" {
  interface IncomingForm {
    uploadDir?: string
    keepExtensions?: boolean
    parse(
      req: any,
      callback: (
        err: any,
        fields: formidable.Fields,
        files: formidable.Files
      ) => void
    ): void
  }
}
