<template>
  <button @click="toggleTheme()" class="theme-toggle-button">
    <i :class="['theme-toggle-icon', iconClass]"></i>
    Сменить тему
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useDark, useToggle } from "@vueuse/core";

export default defineComponent({
  setup() {
    const isDark = useDark({
      selector:'body',
      attribute:'data-theme',
      valueDark: 'dark',
      valueLight: 'light',
    })

    const toggleTheme = useToggle(isDark)

    const iconClass = computed(() => {
      return isDark.value ? 'dark-icon' : 'light-icon';
    })

    return {
      isDark,
      iconClass,
      toggleTheme,
    }
  }
});
</script>

<style lang="scss" scoped>
@import "toggle-theme.scss";
</style>