export interface ESLintPluginEntry {
	/**
	 * The name of the npm package for the plugin, e.g. "eslint-plugin-vitest".
	 */
	package: string;

	/**
	 * The prefix used in ESLint rule names for this plugin, e.g. "vitest" for "eslint-plugin-vitest". This is used to extract the plugin name from rule names in the comparisons data.
	 */
	prefix: string;
}

// Plugin registry: key -> entry
export const eslintPluginRegistry = {
	vitest: {
		package: "@vitest/eslint-plugin",
		prefix: "vitest",
	},
} as const satisfies Record<string, ESLintPluginEntry>;

export type CoveredESLintPluginPrefix = keyof typeof eslintPluginRegistry;
