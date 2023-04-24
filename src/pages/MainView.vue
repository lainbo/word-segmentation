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
        class="flex flex-col overflow-hidden border border-[var(--color-fill-2)] border-l-none p-12px pb-24px"
      >
        <div class="mb-8px flex items-center justify-end"> 123 </div>
        <div class="h-full overflow-y-auto">
          <a-checkbox-group
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const 用户输入 = ref('')
const 选中的词 = ref([])
type 分词方式Type = 'grapheme' | 'word' | 'sentence' | undefined

const 分词方式 = ref<分词方式Type>('word')
const 分词方式Arr = ref([
  { label: '字', value: 'grapheme' },
  { label: '词', value: 'word' },
  { label: '句', value: 'sentence' },
])
const 分词结果Arr = ref()
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
</script>

<style lang="scss" scoped>
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
</style>
