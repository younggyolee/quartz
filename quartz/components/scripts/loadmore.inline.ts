document.addEventListener("nav", () => {
  const containers = document.querySelectorAll(".page-list-loadmore")

  for (const container of containers) {
    const items = container.querySelectorAll<HTMLElement>(".section-li")
    const loadMoreBtn = container.querySelector<HTMLButtonElement>(".load-more-btn")
    const initialLimit = parseInt(container.getAttribute("data-initial-limit") || "5", 10)
    const loadMoreCount = parseInt(container.getAttribute("data-load-more-count") || "5", 10)

    let visibleCount = initialLimit

    // Hide items beyond initial limit
    items.forEach((item, index) => {
      if (index >= initialLimit) {
        item.classList.add("hidden")
      }
    })

    // Hide button if all items are visible
    if (loadMoreBtn && items.length <= initialLimit) {
      loadMoreBtn.style.display = "none"
    }

    const handleLoadMore = () => {
      const newVisibleCount = Math.min(visibleCount + loadMoreCount, items.length)

      for (let i = visibleCount; i < newVisibleCount; i++) {
        items[i].classList.remove("hidden")
      }

      visibleCount = newVisibleCount

      // Hide button if all items are now visible
      if (loadMoreBtn && visibleCount >= items.length) {
        loadMoreBtn.style.display = "none"
      }
    }

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", handleLoadMore)
      window.addCleanup(() => loadMoreBtn.removeEventListener("click", handleLoadMore))
    }
  }
})
