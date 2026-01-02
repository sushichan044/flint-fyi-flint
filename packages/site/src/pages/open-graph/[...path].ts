import type { CollectionEntry } from "astro:content";

import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const collectionEntries = await getCollection("docs", (entry) => {
	// We use static social image for top page
	if (entry.id === "index") {
		return false;
	}

	return true;
});

const pages = Object.fromEntries(
	collectionEntries.map(
		({ data, filePath, id }) =>
			[filePath, { data, id }] as [
				string,
				Pick<CollectionEntry<"docs">, "data" | "id">,
			],
	),
);

export const { GET, getStaticPaths } = OGImageRoute({
	getImageOptions: (_, page: (typeof pages)[string]) => {
		return {
			description: page.data.description,
			format: "WEBP",
			logo: {
				path: "./public/logo.png",
			},
			padding: 80,
			quality: 90,
			title: page.data.title,
		};
	},
	getSlug: (_, page: (typeof pages)[string]) => {
		return page.id + ".webp";
	},
	pages,
	param: "path", // since this file is named [...path].ts
});
