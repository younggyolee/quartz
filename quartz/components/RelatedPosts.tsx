import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative, simplifySlug } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import style from "./styles/relatedPosts.scss"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

interface Options {
  title?: string
  limit: number
  showTags: boolean
  showDescription: boolean
  hideWhenEmpty: boolean
  weights: {
    tags: number
    outgoingLinks: number
    incomingLinks: number
  }
  filter: (f: QuartzPluginData) => boolean
}

const defaultOptions: Options = {
  limit: 5,
  showTags: true,
  showDescription: true,
  hideWhenEmpty: true,
  weights: {
    tags: 1.0,
    outgoingLinks: 0.5,
    incomingLinks: 0.3,
  },
  filter: () => true,
}

interface ScoredPost {
  file: QuartzPluginData
  score: number
  matchedTags: string[]
  linkRelation: "outgoing" | "incoming" | "bidirectional" | "none"
}

export default ((userOpts?: Partial<Options>) => {
  const RelatedPosts: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions, ...userOpts }

    // Skip if this is not a content page
    if (!fileData.slug) return null

    const currentSlug = simplifySlug(fileData.slug)
    const currentTags = fileData.frontmatter?.tags ?? []
    const currentLinks = fileData.links ?? []

    // Calculate scores for all candidate pages
    const scoredPosts: ScoredPost[] = allFiles
      .filter((file) => {
        // Exclude current page
        if (simplifySlug(file.slug!) === currentSlug) return false
        // Exclude non-content pages (tag/folder indices)
        if (file.slug?.startsWith("tags/")) return false
        // Apply user filter
        return opts.filter(file)
      })
      .map((file) => {
        const candidateSlug = simplifySlug(file.slug!)
        const candidateTags = file.frontmatter?.tags ?? []
        const candidateLinks = file.links ?? []

        // Tag similarity (Jaccard-like)
        const matchedTags = currentTags.filter((tag) => candidateTags.includes(tag))
        const tagUnionSize = new Set([...currentTags, ...candidateTags]).size
        const tagScore = tagUnionSize > 0 ? (matchedTags.length / tagUnionSize) * opts.weights.tags : 0

        // Link relationships
        const hasOutgoingLink = currentLinks.includes(candidateSlug)
        const hasIncomingLink = candidateLinks.includes(currentSlug)

        const outgoingScore = hasOutgoingLink ? opts.weights.outgoingLinks : 0
        const incomingScore = hasIncomingLink ? opts.weights.incomingLinks : 0

        // Determine relationship type
        let linkRelation: ScoredPost["linkRelation"] = "none"
        if (hasOutgoingLink && hasIncomingLink) linkRelation = "bidirectional"
        else if (hasOutgoingLink) linkRelation = "outgoing"
        else if (hasIncomingLink) linkRelation = "incoming"

        // Bidirectional bonus
        const bidirectionalBonus = linkRelation === "bidirectional" ? 0.2 : 0

        return {
          file,
          score: tagScore + outgoingScore + incomingScore + bidirectionalBonus,
          matchedTags,
          linkRelation,
        }
      })
      .filter((post) => post.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, opts.limit)

    // Hide if no related posts found
    if (opts.hideWhenEmpty && scoredPosts.length === 0) {
      return null
    }

    return (
      <div class={classNames(displayClass, "related-posts")}>
        <h3>{opts.title ?? i18n(cfg.locale).components.relatedPosts.title}</h3>
        <ul class="related-ul">
          {scoredPosts.length > 0 ? (
            scoredPosts.map(({ file, matchedTags, linkRelation }) => {
              const title = file.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
              const description = file.description

              return (
                <li class="related-li">
                  <div class="related-content">
                    <div class="title-row">
                      <a href={resolveRelative(fileData.slug!, file.slug!)} class="internal">
                        {title}
                      </a>
                      {linkRelation !== "none" && (
                        <span class={`link-indicator ${linkRelation}`} title={getLinkTitle(linkRelation)}>
                          {getLinkIcon(linkRelation)}
                        </span>
                      )}
                    </div>
                    {opts.showDescription && description && <p class="description">{description}</p>}
                    {opts.showTags && matchedTags.length > 0 && (
                      <ul class="tags">
                        {matchedTags.map((tag) => (
                          <li>
                            <a
                              class="internal tag-link"
                              href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                            >
                              {tag}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              )
            })
          ) : (
            <li class="no-related">{i18n(cfg.locale).components.relatedPosts.noRelatedFound}</li>
          )}
        </ul>
      </div>
    )
  }

  RelatedPosts.css = style
  return RelatedPosts
}) satisfies QuartzComponentConstructor

function getLinkIcon(relation: ScoredPost["linkRelation"]): string {
  switch (relation) {
    case "bidirectional":
      return "⇄"
    case "outgoing":
      return "→"
    case "incoming":
      return "←"
    default:
      return ""
  }
}

function getLinkTitle(relation: ScoredPost["linkRelation"]): string {
  switch (relation) {
    case "bidirectional":
      return "Linked both ways"
    case "outgoing":
      return "Linked from this post"
    case "incoming":
      return "Links to this post"
    default:
      return ""
  }
}
