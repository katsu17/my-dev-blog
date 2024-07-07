import React from "react"
import parse, {
  domToReact,
  HTMLReactParserOptions,
  DOMNode,
  Element,
} from "html-react-parser"

interface BlogPostProps {
  content: string
}

const BlogPost: React.FC<BlogPostProps> = ({ content }) => {
  const options: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {
      if (domNode instanceof Element) {
        const { name, children } = domNode
        if (name === "h1") {
          return (
            <h1 className="text-2xl font-bold py-4">
              {domToReact(children as DOMNode[], options)}
            </h1>
          )
        }
        if (name === "h2") {
          return (
            <h2 className="text-xl font-semibold py-4">
              {domToReact(children as DOMNode[], options)}
            </h2>
          )
        }
        if (name === "p") {
          return (
            <p className="text-base leading-relaxed my-3">
              {domToReact(children as DOMNode[], options)}
            </p>
          )
        }
      }
    },
  }

  return <div>{parse(content, options)}</div>
}

export default BlogPost
