import { notFound } from "next/navigation"
import parse from "html-react-parser"
import { getDetail, getList } from "../libs/microcms"
import Image from "next/image"

export async function generateStaticParams() {
  const { contents } = await getList()
  const paths = contents.map((post) => {
    return {
      postId: post.id,
    }
  })

  return [...paths]
}

export default async function Page({
  params: { postId },
}: {
  params: { postId: string }
}) {
  const post = await getDetail(postId)

  // ページの生成された時間を取得
  const time = new Date().toLocaleDateString()

  if (!post) {
    notFound()
  }
  return (
    <div className="max-w-[1200px]">
      <div className="flex justify-between">
        <h1 className="font-bold text-lg">{post.title}</h1>
        <h2>{time}</h2>
      </div>
      <div className="relative ">
        <Image
          src={post.eyecatch ? `${post.eyecatch?.url}` : "/eyeCatchNoImage.jpg"}
          layout="responsive"
          //   fill={true}
          width={600}
          height={300}
          alt={`${post.title}`}
        />
      </div>
      <div>{parse(post.content)}</div>
    </div>
  )
}
