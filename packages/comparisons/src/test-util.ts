import { comparisons, type LinterRuleReference } from "./index.ts";
import type { CoveredESLintPluginPrefix } from "./plugin-registry.ts";

interface GroupedComparisons {
	// Known keys (builtin + registry plugins) are always present; any other key may be undefined.
	eslint: Record<string, PluginRuleMap | undefined> &
		Record<CoveredESLintPluginPrefix, PluginRuleMap> & {
			builtin: PluginRuleMap;
		};
}

type MaybeLiteral<T extends string> = (string & {}) | T;

type PluginRuleMap = Record<string, LinterRuleReference[] | undefined>;

export function groupByLinterAndPlugin(
	comp: typeof comparisons,
): GroupedComparisons {
	const eslint: GroupedComparisons["eslint"] = {
		builtin: {},
		vitest: {},
	};

	for (const comparison of comp) {
		for (const rule of comparison.eslint ?? []) {
			const [plugin, ruleName] = extractESLintRuleMeta(rule);
			eslint[plugin] ??= {};
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			eslint[plugin]![ruleName] = comparison.eslint;
		}
	}

	return { eslint };
}

function extractESLintRuleMeta(
	rule: LinterRuleReference,
): [plugin: MaybeLiteral<"builtin">, ruleName: string] {
	if (rule.url.startsWith("https://eslint.org/docs")) {
		return ["builtin", rule.name];
	}

	const parts = rule.name.split("/");
	// 3-part: @scope/plugin/rule → plugin="@scope/plugin", ruleName="rule"
	// 2-part: plugin/rule or @scope/rule → plugin=parts[0], ruleName=parts[1]
	const isThreePart = rule.name.startsWith("@") && parts.length === 3;
	const plugin = isThreePart ? `${parts[0]}/${parts[1]}` : parts[0];
	const ruleName = isThreePart ? parts[2] : parts[1];

	if (!plugin || !ruleName) {
		throw new Error(`Could not extract plugin and rule name from ${rule.name}`);
	}

	return [plugin, ruleName];
}
