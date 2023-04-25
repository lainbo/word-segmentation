<template>
  <div class="h-full flex flex-col p-20px">
    <div class="mb-8px flex items-center space-x-8px">
      <span class="text-16px">分割粒度: </span>
      <a-radio-group v-model="分词方式" @change="开始分词()">
        <a-radio v-for="(item, index) in 分词方式Arr" :key="index" :value="item.value">{{
          item.label
        }}</a-radio>
      </a-radio-group>
    </div>

    <div class="grid grid-cols-2 flex-1 overflow-hidden rounded-xl shadow-xl">
      <a-textarea
        v-model="用户输入"
        class="user_input rounded-l-xl"
        placeholder="请输入文字"
      />

      <div
        class="right_main flex flex-col overflow-hidden border border-[var(--color-fill-2)] border-l-none px-12px pb-24px pt-6px"
      >
        <div class="operation_btn mb-8px flex items-center justify-end space-x-8px">
          <MimicryBtn
            :disabled="!分词结果Arr.length"
            class="h-25px w-25px"
            @click="复制结果()"
          >
            <i class="i-ri-translate text-17px"></i>
          </MimicryBtn>
          <a-dropdown trigger="hover" @select="切换搜索引擎($event as string)">
            <MimicryBtn
              :disabled="!分词结果Arr.length"
              class="h-25px w-25px"
              @click="搜索结果()"
            >
              <i class="i-ph-magnifying-glass-bold"></i>
            </MimicryBtn>
            <template #content>
              <a-doption
                v-for="item in 搜索引擎选项"
                :key="item.value"
                :value="item.value"
              >
                <div
                  class="drop_item"
                  :class="{ 'text-primary': item.value === 选中的搜索引擎 }"
                >
                  <div class="flex items-center space-x-4px">
                    <i :class="item.icon"></i>
                    <span>{{ item.label }}</span>
                  </div>
                  <span v-if="item.value === 选中的搜索引擎" i-entypo-check></span>
                </div>
              </a-doption>
            </template>
          </a-dropdown>

          <MimicryBtn
            :disabled="!分词结果Arr.length"
            class="h-25px w-25px"
            @click="复制结果()"
          >
            <i class="i-mingcute-copy-2-line"></i>
          </MimicryBtn>
        </div>
        <div class="h-full overflow-y-auto">
          <a-checkbox-group
            v-if="分词结果Arr.length > 0"
            v-model="选中的词"
            class="checkbox_wrapper flex flex-wrap gap-10px overflow-hidden"
          >
            <a-checkbox v-for="item in 分词结果Arr" :key="item.index" :value="item.index">
              <template #checkbox="{ checked }">
                <a-tag
                  size="large"
                  :bordered="!checked"
                  color="arcoblue"
                  :checked="checked"
                  checkable
                >
                  {{ item.segment }}
                </a-tag>
              </template>
            </a-checkbox>
          </a-checkbox-group>
          <div v-else class="h-full flex-c flex-1 flex-col">
            <div>
              <i
                i-line-md-coffee-half-empty-twotone-loop
                class="text-120px text-#aaa"
              ></i>
            </div>
            <p class="mt-16px">左边输入的文字，将会分词在这里</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue'

const 用户输入 = ref('')
const 选中的词 = ref([])
type 分词方式Type = 'grapheme' | 'word' | 'sentence' | undefined

const 搜索引擎选项 = ref([
  {
    label: '必应',
    value: 'bing',
    icon: 'i-logos-bing',
    url: 'https://www.bing.com/search?q=%s',
  },
  {
    label: '谷歌',
    value: 'google',
    icon: 'i-logos-google-icon',
    url: 'https://www.google.com/search?q=%s',
  },
  {
    label: '百度',
    value: 'baidu',
    icon: 'i-simple-icons-baidu text-#306cff',
    url: 'https://www.baidu.com/s?wd=%s',
  },
])
const 选中的搜索引擎 = useStorage('searchEngines', 'bing')
const utools = window?.utools
function utoolsInit() {
  utools.subInputBlur()
  选中的搜索引擎.value = utools.dbStorage.getItem('searchEngines') || 'bing'
}

function 切换搜索引擎(se: string) {
  选中的搜索引擎.value = se
  if (utools) {
    utools.dbStorage.setItem('searchEngines', se)
  }
}

const 分词方式 = ref<分词方式Type>('word')
const 分词方式Arr = ref([
  { label: '字', value: 'grapheme' },
  { label: '词', value: 'word' },
  { label: '句', value: 'sentence' },
])

const 分词结果Arr = ref<any>([])
function 开始分词() {
  const 分词结果 = new Intl.Segmenter('zh-CN', { granularity: 分词方式.value }).segment(
    用户输入.value
  )
  分词结果Arr.value = Array.from(分词结果).filter(item => item.segment.trim() !== '')
  选中的词.value = []
}

watch(用户输入, () => {
  开始分词()
})
interface 分词结果item {
  segment: string
  index: number
  input: string
  isWordLike: boolean
}
const 拼接选中的词 = ref('')
watch(选中的词, () => {
  拼接选中的词.value = 选中的词.value
    .sort((a, b) => a - b)
    .map(index => {
      return 分词结果Arr.value.find((item: 分词结果item) => item.index === index).segment
    })
    .join('')
})
const { copy: 复制 } = useClipboard() // 复制结果功能
function 复制结果() {
  复制(拼接选中的词.value)
  Message.success('复制成功')
}
function 搜索结果() {
  const 搜索引擎url =
    搜索引擎选项.value.find(item => item.value === 选中的搜索引擎.value)?.url ||
    'https://www.baidu.com/s?wd=%s'
  const 拼接出来的url = 搜索引擎url?.replace('%s', encodeURIComponent(拼接选中的词.value))
  openUrl(拼接出来的url)
}

onMounted(() => {
  if (!window?.utools) {
    return
  }
  utoolsInit()
})
</script>

<style lang="scss" scoped>
.operation_btn {
  @apply opacity-30 transition-cusbezier-200;
}
.right_main:is(:hover) {
  .operation_btn {
    opacity: 1;
  }
}
.checkbox_wrapper:deep(.arco-checkbox) {
  margin: 0;
  overflow: hidden;
}
.checkbox_wrapper {
  :deep(.arco-tag-size-large) {
    font-size: 16px;
    white-space: break-spaces;
  }
  :deep(.arco-tag-size-large) {
    height: fit-content;
    line-height: 26px;
  }
}
.user_input:deep(.arco-textarea) {
  font-size: 17px;
  @apply h-full pr-26px bg-#ffffff resize-none dark:bg-#242425a6;
}
.drop_item {
  @apply flex items-center space-x-4px;
}
</style>
