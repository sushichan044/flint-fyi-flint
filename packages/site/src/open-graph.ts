import type { GetStaticPathsOptions } from "astro";

import { getStaticPaths } from "./pages/open-graph/[...path]";

// getStaticPaths() from astro-og-canvas can be called without arguments
// https://github.com/delucis/astro-og-canvas/blob/4f0abfbb5dcae4a28095f97ebd53ea030a618c00/packages/astro-og-canvas/src/routing.ts#L12-L22
const routes = await getStaticPaths({} as GetStaticPathsOptions);

const existingPaths = new Set(
	routes.map(
		(route) =>
			// .path exists since open-graph/[...path].ts uses param: "path"
			route.params.path,
	),
);

/**
 * Get the pathname to the og image for the given page pathname.
 * @param pathname expected to be `Astro.url.pathname`
 * @returns pathname to the og image
 */
export function getOgImagePathname(pathname: string): string {
	// We use static social image for top page
	if (pathname === "/") {
		return "/social.webp";
	}

	const imagePath = pathname.replace(/^\//, "").replace(/\/$/, "") + ".webp";

	if (existingPaths.has(imagePath)) {
		return `/open-graph/${imagePath}`;
	}

	return "/social.webp";
}
