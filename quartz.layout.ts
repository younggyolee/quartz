import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.Flex({
      components: [
        { Component: Component.PageTitle() },
        {
          Component: Component.Flex({
            components: [
              { Component: Component.Search() },
              { Component: Component.Darkmode() },
              { Component: Component.Explorer({ title: "Posts" }) },
            ],
          }),
          grow: true,
          justify: "flex-end",
        },
      ],
    }),
  ],
  afterBody: [
    Component.Comments({
      provider: "giscus",
      options: {
        repo: "younggyolee/quartz",
        repoId: "R_kgDOQhHgwg",
        category: "Announcements",
        categoryId: "DIC_kwDOQhHgws4Cz2TY",
        mapping: "pathname",
        strict: false,
        reactionsEnabled: true,
        inputPosition: "bottom",
        lang: "en",
      },
    }),
    Component.ConditionalRender({
      component: Component.RelatedPosts({ limit: 5 }),
      condition: (props) => props.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.RecentNotes({ limit: 10, showTags: false }),
      condition: (props) => props.fileData.slug !== "index",
    }),
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
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (props) => props.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (props) => props.fileData.slug !== "index",
    }),
    // Show RecentNotes as main content on index page
    Component.ConditionalRender({
      component: Component.RecentNotes({ limit: 10, showTags: false }),
      condition: (props) => props.fileData.slug === "index",
    }),
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
