<template>
  <button
    class="mimicry_btn relative z-10 min-h-23px min-w-23px flex-c text-#94a3b8"
    :class="{ mimicry_btn_disabled: props.loading || props.disabled }"
    :disabled="props.loading || props.disabled"
  >
    <i v-if="props.loading" i-line-md-loading-loop />

    <slot v-else>
      <i i-ep-more-filled />
    </slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
  },
})
</script>

<style lang="scss" scoped>
// 这里只能写死颜色，不可以使用var()
@property --m-button-A {
  syntax: '<color>';
  inherits: false;
  initial-value: #fff;
}

@property --m-button-B {
  syntax: '<color>';
  inherits: false;
  initial-value: #fff;
}
.mimicry_btn {
  &::before {
    background-image: linear-gradient(
      145deg,
      var(--m-button-A) 0%,
      var(--m-button-B) 100%
    );
    box-shadow: 5px 5px 12px var(--mimicry-btn-shadow-colorA),
      -5px -5px 12px var(--mimicry-btn-shadow-colorB);
    transition: 0.3s --m-button-A, 0.3s --m-button-B, 0.1s transform linear,
      0.2s box-shadow;
    @apply absolute top-0 rounded-8px content-none  select-none w-full h-full border border-#f2f3f4 dark:border-#444;
  }
  &:hover,
  &:active {
    &::before {
      --m-button-A: var(--mimicry-btn-interactive-colorA);
      --m-button-B: var(--mimicry-btn-interactive-colorB);
    }
  }

  &:active {
    &::before {
      transform: scale(1.2);
      box-shadow: 2px 2px 7px -2px #888, -5px -5px 12px #fff;
    }
  }
}
.mimicry_btn_disabled {
  cursor: not-allowed;
  // 营造一个交互没用的假象，其实只是交互了和初始颜色一样
  &:hover,
  &:active {
    &::before {
      --m-button-A: var(--mimicry-btn-color);
      --m-button-B: var(--mimicry-btn-color);
    }
  }
  &:hover {
    &::before {
      box-shadow: 5px 5px 12px var(--mimicry-btn-shadow-colorA),
        -5px -5px 12px var(--mimicry-btn-shadow-colorB) !important;
    }
  }

  &:active {
    &::before {
      transform: scale(1);
      box-shadow: 5px 5px 12px var(--mimicry-btn-shadow-colorA),
        -5px -5px 12px var(--mimicry-btn-shadow-colorB);
    }
  }
}

:root[class~='dark'] {
  // 深色下的拟态按钮,浅色和深色的shadow尺寸、交互样式不一样，所以单独写
  .mimicry_btn {
    &::before {
      --m-button-A: var(--mimicry-btn-color);
      --m-button-B: var(--mimicry-btn-color);
    }
  }
  .mimicry_btn:is(:hover, :active) {
    &::before {
      box-shadow: 1px 1px 6px #112, -3px -3px 6px #333;
    }
  }
}
</style>
