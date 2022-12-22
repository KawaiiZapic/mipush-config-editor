export interface Config {
    version: string;
    configs: Record<string, (ConfigItem | string)[]>;
}
export interface MetaInfo {
    title?: string | null;
    description?: string | null;
    notifyId?: string | null;
    extra?: {
        channel_id?: string | null;
    }
}
export interface NewMetaInfo {
    title?: string;
    description?: string;
    notifyId?: string;
    extra?: {
        channel_id?: string;
    }
}
export interface ConfigItem {
    metaInfo?: MetaInfo;
    newMetaInfo?: NewMetaInfo;
    operation?: string;
}
