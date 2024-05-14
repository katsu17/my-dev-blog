import React from "react"
import { getList } from "../../libs/microcms"

export default async function page() {
  const { contents } = await getList()

  // ページの生成された時間を取得
  const time = new Date().toLocaleString()

  if (!contents || contents.length === 0) {
    return <h1>No contents</h1>
  }

  return (
    <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
      <ul>
        {contents.map((post) => {
          return (
            <a
              href={`/${post.id}`}
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
              key={post.id}
            >
              <h2 className="mb-3 text-2xl font-semibold">
                {post.title}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p className="m-0 max-w-[30ch] text-sm opacity-50 truncate">
                {post.content.substring(21)}
              </p>
            </a>
          )
        })}
      </ul>
    </div>
  )
}
