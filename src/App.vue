<template>
  <div class="py-4 flex flex-row items-center">
    <file-open v-model="config" />
    <m-button class="ml-2!" v-ripple v-color @click="newFile">新建配置</m-button>
    <m-button class="ml-2!" v-ripple :disabled="!pConfig" v-color @click="saveFile">保存文件</m-button>
  </div>
  <div class="pb-12" v-if="pConfig">
    <div>
      <m-card class="shadow-none!" v-for="item in pConfig" :key="item.package">
        <template #avatar>
          <img v-if="appInfo[item.package]" class="mdui-card-header-avatar" :src="(appInfo[item.package] as any).icon" />
          <i v-else class="mdui-card-header-avatar mdui-icon material-icons">android</i>
        </template>
        <template #title>
          {{ appInfo[item.package] ? (appInfo[item.package] as any).name : item.package }}
        </template>
        <template #subtitle>
          {{ item.package }}
        </template>
        <div class="grid grid-cols-1 sm:grid-gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="(rule, index) in item.rules" :key="index">
            <m-card>
              <div v-if="isReference(rule)">引用: {{ rule.package }}</div>
              <div v-else>
                <div class="mb-4">
                  <div v-if="rule.filter">
                    <div class="text-lg">
                      如果:
                      <m-button class="float-right" @click="handleDeleteIf(rule)" icon="close" />
                    </div>
                    <div v-for="(filter, filterKey) in rule.filter" :key="filterKey">
                      <div>{{ FieldTranslation[filterKey] }}:</div>
                      <div>
                        <m-radio v-for="(op, opKey) in FilterRuleTranslation"
                          :name="`filter-name-${item.package}-${index}-${filterKey}`" :value="opKey"
                          v-model="filter.type" class="mr-4 pl-6!">
                          {{ op }}
                        </m-radio>
                        <m-input class="pt-0!" v-if="filter.type != 'null' && filter.type != 'undefined'"
                          v-model="filter.value" :label="FieldTranslation[filterKey]" />
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <m-button @click="fillIf(rule)" v-color v-ripple block>
                      <i class="mdui-icon material-icons mt--1 mr-1">add</i>添加条件
                    </m-button>
                  </div>
                </div>
                <div class="mb-4">
                  <div v-if="rule.processor">
                    <div class="text-lg">
                      {{ rule.filter ? "那么" : "无论如何, 当收到通知时" }}:
                      <m-button class="float-right" @click="handleDeleteProcessor(rule)" icon="close" />
                    </div>
                    <div v-for="(processor, processorKey) in FieldTranslation">
                      <div>{{ processor }}:</div>
                      <m-radio :name="`filter-name-${item.package}-${index}-${processorKey}-process`" :value="true"
                        :model-value="(typeof rule.processor[processorKey] == 'string')"
                        @update:model-value="rule.processor![processorKey] = ''" class="mr-4 pl-6!">
                        替换为
                      </m-radio>
                      <m-radio :name="`filter-name-${item.package}-${index}-${processorKey}-process`" :value="false"
                        :model-value="(typeof rule.processor[processorKey] == 'string')"
                        @update:model-value="rule.processor![processorKey] = undefined" class="mr-4 pl-6!">
                        不处理
                      </m-radio>
                      <m-input class="pt-0!" v-if="typeof rule.processor[processorKey] == 'string'"
                        v-model="(rule.processor[processorKey] as string)" :label="FieldTranslation[processorKey]" />
                    </div>

                  </div>
                  <div v-else>
                    <m-button @click="fillProcessor(rule)" v-color v-ripple block>
                      <i class="mdui-icon material-icons mt--1 mr-1">add</i>添加通知整形器
                    </m-button>
                  </div>
                </div>
                <div>
                  <div class="text-lg">
                    {{ rule.processor ? "同时" : (rule.filter ? "那么" : "无论如何, 当收到通知时") }}:
                  </div>
                  <m-checkbox v-for="(op, opKey) in OperationTranslation"
                    :model-value="rule.operation?.includes(opKey) || false"
                    @update:model-value="(v) => handleUpdateOperation(rule, opKey, v)" class="mr-4 pl-6!">
                    {{ op }}
                  </m-checkbox>
                </div>
              </div>
              <template #actions>
                <m-button @click="handleDeleteRule(item, index)" v-ripple>
                  <i class="mdui-icon material-icons mt--1 mr-1">delete</i>删除规则
                </m-button>
              </template>
            </m-card>
          </div>
          <div>
            <div class="mdui-card w-full flex justify-center items-center text-xl mdui-text-color-theme-accent py-16"
              v-ripple @click="addEmptyRule(item)">
              <i class="mdui-icon material-icons mr-2">add</i>添加规则
            </div>
          </div>
        </div>
      </m-card>
      <div class="mdui-card flex items-center justify-center py-12" @click="addEmptyPackage" v-ripple>
        <i class="mdui-icon material-icons mt--1 mr-1">add</i>添加应用
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FileOpen from "./components/File.vue";
import { ref, watch, reactive } from "vue";
import { Config } from "./Interfaces/RealConfigFile";
import parseConfig from "./Utils/parser";
import serializeConfig from "./Utils/serializer";
import { isReference } from "./Utils/serializer";
import { AbstractConfig, FieldTranslation, FilterRuleTranslation, OperationTranslation, AbstractConfigItem } from "./Interfaces/AbstractConfig";
import MInput from "./components/mdui/input.vue";
import MCard from "./components/mdui/card.vue";
import MRadio from "./components/mdui/radio.vue";
import MButton from "./components/mdui/button.vue";
import MCheckbox from "./components/mdui/checkbox.vue";
import mdui from "mdui";

const config = ref<Config>();
const pConfig = ref<Record<string, AbstractConfig>>()
watch(config, (value) => {
  if (!value) return pConfig.value = undefined;
  pConfig.value = parseConfig(value);
});

const handleDeleteIf = (rule: AbstractConfigItem) => {
  mdui.confirm("确定要删除这个条件吗？", "删除条件", () => {
    rule.filter = undefined;
  });
}
const fillIf = (rule: AbstractConfigItem) => {
  rule.filter = {
    title: {
      type: "undefined",
      value: ""
    },
    description: {
      type: "undefined",
      value: ""
    },
    channelId: {
      type: "undefined",
      value: ""
    },
    notifyId: {
      type: "undefined",
      value: ""
    }
  }
}
const fillProcessor = (rule: AbstractConfigItem) => {
  rule.processor = {
    title: undefined,
    description: undefined,
    channelId: undefined,
    notifyId: undefined
  }
}
const handleDeleteProcessor = (rule: AbstractConfigItem) => {
  mdui.confirm("确定要删除这个通知整形器吗？", "删除通知整形器", () => {
    rule.processor = undefined;
  });
}
const handleUpdateOperation = (rule: AbstractConfigItem, opKey: string, v: boolean) => {
  if (!rule.operation) rule.operation = [];
  if (v) {
    rule.operation.push(opKey as any);
  } else {
    rule.operation = rule.operation.filter((op) => op != opKey);
  }
}
const addEmptyRule = (item: AbstractConfig) => {
  item.rules.push({
    filter: undefined,
    processor: undefined,
    operation: undefined
  });
}
const handleDeleteRule = (item: AbstractConfig, index: number) => {
  mdui.confirm("确定要删除这个规则吗？", "删除规则", () => {
    item.rules.splice(index, 1);
  });
}
const addEmptyPackage = () => {
  mdui.prompt("请输入包名", "添加应用", (value) => {
    if (!value) return;
    if (!pConfig.value) pConfig.value = {};
    if (pConfig.value[value]) {
      mdui.alert("包名已存在", "添加应用", () => {
        addEmptyPackage();
      });
      return;
    }
    pConfig.value[value] = {
      package: value,
      rules: []
    };
  });
}
const saveFile = () => {
  if (!pConfig.value) return;
  const result = serializeConfig(pConfig.value);
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.download = Date.now() + ".json";
  a.href = url;
  a.click();
}
const newFile = () => {
  pConfig.value = {};
}
const appInfo = reactive<Record<string, { name: string; icon: string; } | false>>({});
watch(pConfig, (value) => {
  if (!value) return;
  const packages = Object.keys(value);
  for (const pkg of packages) {
    if (appInfo[pkg] || appInfo[pkg] === false) continue;
    fetch(`api/${pkg}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.name) {
          appInfo[pkg] = {
            name: res.name,
            icon: "api/icon/" + pkg
          };
        } else {
          appInfo[pkg] = false as any;
        }
      });
  }
}, {
  deep: true
});
</script>