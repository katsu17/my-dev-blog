import { NextRequest, NextResponse } from "next/server"

const convertToHtmlTable = (data: string): string => {
  const rows = data.trim().split("\n")
  let table = "<table border='1' style='border-collapse: collapse;'>\n"
  rows.forEach((row) => {
    table += "  <tr>\n"
    const cells = row.split("\t")
    cells.forEach((cell) => {
      table += `    <td style='padding: 5px; border: 1px solid black;'>${cell}</td>\n`
    })
    table += "  </tr>\n"
  })
  table += "</table>\n"
  return table
}

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json() // リクエストボディをJSON形式で解析
    const { excel_data } = body

    if (!excel_data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 })
    }

    const table = convertToHtmlTable(excel_data)
    return NextResponse.json({ table })
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}
