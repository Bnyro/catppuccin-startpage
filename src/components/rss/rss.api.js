class RssFeedClient {
	constructor(url) {
		this.url = url;
	}

	async getFeed() {
	  if (!this.url) return;

		const resp = await fetch(this.url);
		const rawFeed = await resp.text();

		const dom = new window.DOMParser().parseFromString(rawFeed, "text/xml");
		const articles = dom.querySelectorAll("rss channel item");
		return [...articles.values()].map((article) => {
			const imageEl =
				[...article.querySelectorAll("item > *")].filter(
					(el) => el.tagName === "content:encoded",
				)[0] ?? null;
			const image = imageEl?.textContent
				? new window.DOMParser()
						.parseFromString(imageEl.textContent, "text/html")
						.querySelector("img")?.src
				: null;
			return {
				link: article.querySelector("link").innerHTML,
				title: article.querySelector("title").innerHTML,
				description: article.querySelector("description").innerHTML,
				image: image,
				date: new Date(article.querySelector("pubDate").innerHTML),
			};
		});
	}
}
