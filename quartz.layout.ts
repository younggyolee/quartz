import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.Flex({
      components: [
        { Component: Component.PageTitle(), grow: true },
        { Component: Component.Search() },
        { Component: Component.Darkmode() },
        { Component: Component.Explorer({ title: "Posts" }) },
      ],
    }),
  ],
  afterBody: [
    Component.RecentNotes({ limit: 10 }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    // Component.ConditionalRender({
    //   component: Component.Breadcrumbs(),
    //   condition: (page) => page.fileData.slug !== "index",
    // }),
    // Component.ArticleTitle(),
    // Component.ContentMeta(),
    // Component.TagList(),
    // Component.ConditionalRender({
    //   component: Component.RecentNotes({
    //     title: "Latest Posts",
    //     limit: 5,
    //     linkToMore: "posts" as SimpleSlug,
    //     filter: (f) => f.slug?.startsWith("posts/") && !f.slug?.endsWith("/index"),
    //   }),
    //   condition: (page) => page.fileData.slug === "index",
    // }),
  ],
  left: [],
  right: [],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [],
  right: [],
}
