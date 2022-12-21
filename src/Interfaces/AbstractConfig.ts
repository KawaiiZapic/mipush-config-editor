export type Operation = "wake" | "open" | "ignore" | "notify";

export interface FilterRule {
    type: "include" | "equal" | "regexp";
    value: string;
}

export interface ProcessRule {
    type: "string" | "reference";
    value: string;
}

export interface FilterMetaInfo {
    title?: FilterRule[];
    description?: FilterRule[];
    notifyId?: number;
    channelId?: string | null;
}
export interface AbstractConfigItem {
    filter: FilterMetaInfo;
    processor: ProcessRule;
    operation?: Operation[];
}

export interface AbstractConfig {
    package: string;
    configs: AbstractConfigItem[];
}