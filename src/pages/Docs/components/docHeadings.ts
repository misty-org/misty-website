export interface DocHeading {
  id: string;
  title: string;
}

/** A page's sections, read from the page itself so there is no second list to keep. */
export function readDocHeadings(article: HTMLElement): DocHeading[] {
  return [...article.querySelectorAll<HTMLElement>("section[id]")].map(
    (section) => ({
      id: section.id,
      title: section.querySelector("h2")?.textContent ?? section.id,
    }),
  );
}
