export type Operation = "wake" | "open" | "ignore" | "notify";

export type FilterRule = FilterRuleNormal | FilterRuleRegExp;
export interface FilterRuleNormal {
    type: "include" | "equal" | "null" | "undefined";
    value: string;
}

export interface FilterRuleRegExp {
    type: "regexp";
    value: string;
    variables: string[];
}

export interface FilterMetaInfo {
    title: FilterRule;
    description: FilterRule;
    notifyId: FilterRule;
    channelId: FilterRule;
}

export interface ProcessorMetaInfo {
    title?: string;
    description?: string;
    notifyId?: string;
    channelId?: string;
}
export interface AbstractConfigItem {
    filter?: FilterMetaInfo;
    processor?: ProcessorMetaInfo;
    operation?: Operation[];
}

export interface AbstractConfigReference {
    package: string;
}

export interface AbstractConfig {
    package: string;
    name?: string;
    icon?: string;
    rules: (AbstractConfigItem | AbstractConfigReference)[];
}

export enum FieldTranslation {
    title = "标题",
    description = "内容",
    notifyId = "通知 ID",
    channelId = "通知渠道 ID"
}
export enum FilterRuleTranslation {
    include = "包括",
    equal = "等于",
    regexp = "正则",
    null = "为空",
    undefined = "任意"
}

export enum OperationTranslation {
    wake = "唤醒应用",
    open = "打开应用",
    ignore = "屏蔽",
    notify = "正常通知"
}