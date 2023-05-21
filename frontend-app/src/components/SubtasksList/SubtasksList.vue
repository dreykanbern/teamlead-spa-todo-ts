<template>
  <div class="task-item__subtasks">
    <button @click="showSubtasks = !showSubtasks">
      <!-- Иконка для раскрытия/скрытия списка подзадач -->
      <i :class="['icon', subtasksIconClass]"></i>
    </button>
    <ul v-show="showSubtasks">
      <li v-for="(subtask, index) in subtasks" :key="index">
        <my-checkbox
            type="checkbox"
            v-model="subtask.completed"
            @change="$emit('toggle', subtask.id)"
            @update:modelValue="onUpdateModelValue"
        />
        {{ subtask.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useDark } from '@vueuse/core';
import MyCheckbox from '../UI/MyCheckbox/MyCheckbox.vue';

export default defineComponent({
  name: 'SubtasksList',
  components: { MyCheckbox },
  props: {
    subtasks: {
      type: Array,
      required: true,
    },
  },
  emits: ['toggle'],
  setup() {
    const showSubtasks = ref(false);

    // Определение текущей темы
    const isDark = useDark({
      selector: 'body',
      attribute: 'data-theme',
      valueDark: 'dark',
      valueLight: 'light',
    });

    // Вычисление класса иконки в зависимости от текущей темы и состояния showSubtasks
    const subtasksIconClass = computed(() =>
        showSubtasks.value
            ? `icon-collapse-${isDark.value ? 'dark' : 'light'}`
            : `icon-expand-${isDark.value ? 'dark' : 'light'}`
    );

    // Добавленный метод для обработки события update:modelValue
    function onUpdateModelValue(value: boolean) {
      console.log('SubtasksList onUpdateModelValue called with', value);
    }

    return {
      showSubtasks,
      subtasksIconClass,
      onUpdateModelValue, // Добавленная строка
    };
  },
});
</script>

<style lang="scss" scoped>
@import "subtasks-list.scss";
</style>
