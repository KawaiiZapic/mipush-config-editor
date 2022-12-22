import { AbstractConfig, AbstractConfigItem, FilterMetaInfo, FilterRule, ProcessorMetaInfo } from "../Interfaces/AbstractConfig";
import { Config, MetaInfo, NewMetaInfo } from "../Interfaces/RealConfigFile";
import { isEmptyObject } from "./utils";

export default (config: Config): Record<string, AbstractConfig> => {
    const real = config.configs;
    if (!real) throw Error("Invalid config file: no configs found");
    const result: Record<string, AbstractConfig> = {};
    for (const key in real) {
        result[key] = {
            package: key,
            rules: []
        };
        const item = real[key];
        for (const rule of item) {
            if (typeof rule === "string") {
                result[key].rules.push({
                    package: rule
                });
                continue;
            }
            const configItem = {} as AbstractConfigItem;
            if (rule.metaInfo) {
                const filter = FilterRuleParser(rule.metaInfo);
                if (!isEmptyObject(filter)) {
                    configItem.filter = filter;
                }

            }
            if (rule.newMetaInfo) {
                const filter = ProcessRuleParser(rule.newMetaInfo);
                if (!isEmptyObject(filter)) {
                    configItem.processor = filter;
                }
            }
            if (rule.operation) {
                configItem.operation = rule.operation
                    .split("|")
                    .filter((op) => {
                        const ops = ["wake", "open", "ignore", "notify"];
                        if (!ops.includes(op)) {
                            console.warn(`Invalid operation: ${op}`);
                            return false;
                        }
                        return true;
                    }) as ("wake" | "open" | "ignore" | "notify")[];
            }

            if (!isEmptyObject(configItem)) {
                result[key].rules.push(configItem);
            }
        }
    }
    return result;
}

const FilterRuleParser = (info: MetaInfo): FilterMetaInfo => {
    const result: FilterMetaInfo = {
        title: FilterExpressionParser(info.title),
        description: FilterExpressionParser(info.description),
        notifyId: FilterExpressionParser(info.notifyId),
        channelId: FilterExpressionParser(info.extra?.channel_id)
    };
    return result;
}

const FilterExpressionParser = (expression: string | null | undefined): FilterRule => {
    if (expression === null) {
        return {
            type: "null",
            value: ""
        };
    } else if (expression === undefined) {
        return {
            type: "undefined",
            value: ""
        };
    }
    const isFullMatch = /\^(.*?)\$/.exec(expression);
    if (isFullMatch) {
        return {
            type: "equal",
            value: isFullMatch[1]
        };
    } else if (isRegExp(expression)) {
        const variables: string[] = [];
        for (const match of expression.matchAll(/\(\?\<(.*?)\>/g)) {
            variables.push(match[1]);
        }
        return {
            type: "regexp",
            value: expression,
            variables
        };
    } else {
        return {
            type: "include",
            value: expression
        };
    }
}

const isRegExp = (expression: string): boolean => {
    let isEscape = false;
    let tokens = ["^", "$", ".", "*", "+", "?", "(", ")", "[", "]", "{", "}", "|", "\\"];
    const escapeTokens = ["d", "w", "s", "p"]

    for (const char of expression) {
        if (isEscape) {
            isEscape = false;
            if (escapeTokens.includes(char.toLowerCase())) {
                return true;
            }
            continue;
        }
        if (char === "\\") {
            isEscape = true;
            continue;
        }
        if (tokens.includes(char)) {
            return true;
        }
    }
    return false;
}

const ProcessRuleParser = (info: NewMetaInfo): ProcessorMetaInfo => {
    const result: ProcessorMetaInfo = {};
    if (typeof info.title != "undefined") result.title = info.title;
    if (typeof info.description != "undefined") result.description = info.description;
    if (typeof info.notifyId != "undefined") result.notifyId = info.notifyId;
    if (typeof info.extra?.channel_id != "undefined") result.channelId = info.extra.channel_id;
    return result;
}