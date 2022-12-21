export interface Config {
    version: string;
    configs: Record<string, ConfigItem[]>;
}
export interface MetaInfo {
    title?: string;
    description?: string;
    extra?: {
        channel_id?: string | null;
    }
}
export interface ConfigItem {
    metaInfo?: MetaInfo;
    newMetaInfo?: MetaInfo;
    operation?: string;
}
