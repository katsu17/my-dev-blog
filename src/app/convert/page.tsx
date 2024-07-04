"use client"

import { useState, useEffect, FormEvent } from "react"
import dynamic from "next/dynamic"
import "ace-builds/src-noconflict/ace"
import "ace-builds/src-noconflict/mode-html"
import "ace-builds/src-noconflict/theme-monokai"
import styles from "../styles/ConvertPage.module.css"

// Aceエディタを動的にインポートします
const AceEditor = dynamic(() => import("react-ace"), { ssr: false })

const ConvertPage = () => {
  const [excelData, setExcelData] = useState("")
  const [table, setTable] = useState("")

  const handleConvert = async (e: FormEvent) => {
    e.preventDefault()

    const response = await fetch("/api/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ excel_data: excelData }), // JSON形式でデータを送信
    })

    if (response.ok) {
      const data = await response.json()
      if (data.table) {
        setTable(data.table)
      }
    } else {
      console.error("Error:", response.statusText)
    }
  }

  return (
    <div className={styles.container}>
      <h1>Excel to HTML Table Converter</h1>
      <form onSubmit={handleConvert}>
        <textarea
          value={excelData}
          onChange={(e) => setExcelData(e.target.value)}
          rows={10}
          cols={50}
          placeholder="Paste your Excel data here"
        ></textarea>
        <br />
        <button type="submit">Convert</button>
      </form>
      {table && (
        <div className={styles.table}>
          <h2>Generated HTML Table</h2>
          <AceEditor
            mode="html"
            theme="monokai"
            name="html_editor"
            value={table}
            onChange={(newValue) => setTable(newValue)} // 変更時にプレビューを更新
            editorProps={{ $blockScrolling: true }}
            setOptions={{ useWorker: false }}
          />
          <div dangerouslySetInnerHTML={{ __html: table }} />
        </div>
      )}
    </div>
  )
}

export default ConvertPage
