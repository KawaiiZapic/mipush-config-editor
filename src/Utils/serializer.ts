import { AbstractConfig, AbstractConfigReference, AbstractConfigItem, FilterMetaInfo, FilterRule } from "../Interfaces/AbstractConfig";
import { Config, ConfigItem, MetaInfo, NewMetaInfo } from "../Interfaces/RealConfigFile";
import escapeRegexp from "escape-string-regexp";
import { isEmptyObject } from "./utils";

export default (config: Record<string, AbstractConfig>): Config => {
    const result: Config = {
        version: "0.1.0",
        configs: {}
    };

    for (const key in config) {
        result.configs[key] = [];
        const item = config[key];
        item.rules.forEach((rule) => {
            if (isReference(rule)) {
                result.configs[key].push((rule as AbstractConfigReference).package);
                return;
            } else {
                const _result = {} as ConfigItem;
                if (rule.filter) {
                    const filter = rule.filter;
                    const metaInfo = {} as MetaInfo;
                    if (filter.title.type != "undefined") metaInfo.title = parseFilterRule(filter.title);
                    if (filter.description.type != "undefined") metaInfo.description = parseFilterRule(filter.description);
                    if (filter.notifyId.type != "undefined") metaInfo.notifyId = parseFilterRule(filter.notifyId);
                    if (filter.channelId.type != "undefined") metaInfo.extra = { channel_id: parseFilterRule(filter.channelId) };
                    if (!isEmptyObject(metaInfo)) {
                        _result.metaInfo = metaInfo;
                    }
                }
                if (rule.processor) {
                    const processor = rule.processor;
                    const metaInfo = {} as NewMetaInfo;
                    if (typeof processor.title != "undefined") metaInfo.title = processor.title;
                    if (typeof processor.description != "undefined") metaInfo.description = processor.description;
                    if (typeof processor.notifyId != "undefined") metaInfo.notifyId = processor.notifyId;
                    if (typeof processor.channelId != "undefined") metaInfo.extra = { channel_id: processor.channelId };
                    if (!isEmptyObject(metaInfo)) {
                        _result.newMetaInfo = metaInfo;
                    }
                }
                if (rule.operation) {
                    _result.operation = rule.operation.join("|");
                }
                if (!isEmptyObject(_result)) {
                    result.configs[key].push(_result);
                }
            }
        });
    }

    return result;
}

export const isReference = (rule: AbstractConfigReference | AbstractConfigItem): rule is AbstractConfigReference => {
    return typeof (rule as AbstractConfigReference).package === "string";
}

export const parseFilterRule = (filter: FilterRule): string | null => {
    if (filter.type == "null") return null;
    if (filter.type === "equal") {
        return "^" + escapeRegexp(filter.value) + "$";
    } else if (filter.type === "include") {
        return escapeRegexp(filter.value);
    } else {
        return filter.value;
    }
}