import { Root as HTMLRoot, Element } from "hast"
import { visit } from "unist-util-visit"
import { QuartzTransformerPlugin } from "../types"

export interface Options {
  /** Priority for frontmatter fields to use as cover image */
  frontmatterFields: string[]
}

const defaultOptions: Options = {
  frontmatterFields: ["socialImage", "image", "cover"],
}

/**
 * Extracts the first image from post content to use as a cover/thumbnail.
 * Prioritizes frontmatter fields, falls back to first image in content.
 */
export const CoverImage: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "CoverImage",
    htmlPlugins() {
      return [
        () => {
          return async (tree: HTMLRoot, file) => {
            // Check if frontmatter already has a cover image
            const frontmatter = file.data.frontmatter
            for (const field of opts.frontmatterFields) {
              if (frontmatter?.[field]) {
                file.data.coverImage = frontmatter[field] as string
                return
              }
            }

            // Otherwise, find the first image in the content
            let firstImageUrl: string | undefined

            visit(tree, "element", (node: Element) => {
              if (firstImageUrl) return // Already found one

              if (node.tagName === "img" && node.properties?.src) {
                firstImageUrl = node.properties.src as string
              }
            })

            if (firstImageUrl) {
              file.data.coverImage = firstImageUrl
            }
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    coverImage: string
  }
}
