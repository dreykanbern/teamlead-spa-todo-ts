<template>
  <li>
    <div class="task-item">
      <div class="task-item__header">
        <!-- Использование вычисляемого свойства для определения значения чекбокса задачи -->
        <my-checkbox type="checkbox" v-model="isTaskCompleted" />
        <h3>{{ task.text }}</h3>

        <div class="task-item__subtasks" v-if="task.subtasks && task.subtasks.length > 0">
          <button @click="showSubtasks = !showSubtasks">
            <!-- Иконка для раскрытия/скрытия списка подзадач -->
            <i :class="['icon', subtasksIconClass]"></i>
          </button>
          <ul v-if="showSubtasks">
            <li v-for="(subtask, index) in task.subtasks" :key="index">
              <my-checkbox type="checkbox" v-model="subtask.completed" />
              {{ subtask.text }}
            </li>
          </ul>
        </div>

        <div class="task-item__header__actions">
          <button @click="editTask(task.id)">Редактировать</button>
          <button @click="removeTask(task.id)">Удалить</button>
        </div>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useDark } from '@vueuse/core';
import MyCheckbox from "../UI/MyCheckbox/MyCheckbox.vue";

export default defineComponent({
  name: 'TaskItem',
  components: {MyCheckbox},
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  emits: ['remove', 'edit'],
  setup(props, { emit }) {
    const showSubtasks = ref(false);

    // Определение текущей темы
    const isDark = useDark({
      selector: 'body',
      attribute: 'data-theme',
      valueDark: 'dark',
      valueLight: 'light',
    });

    // Вычисление значения чекбокса задачи
    const isTaskCompleted = computed({
      get: () =>
          props.task.subtasks &&
          props.task.subtasks.length > 0 &&
          props.task.subtasks.every((subtask) => subtask.completed),
      set: (value) => {
        if (props.task.subtasks && props.task.subtasks.length > 0) {
          props.task.subtasks.forEach((subtask) => {
            subtask.completed = value;
          });
        }
      },
    });

    const removeTask = (id: number) => {
      emit('remove', id);
    };

    const editTask = (id: number) => {
      emit('edit', id);
    };

    // Вычисление класса иконки в зависимости от текущей темы и состояния showSubtasks
    const subtasksIconClass = computed(() => {
      let iconClass = showSubtasks.value
          ? `icon-collapse-${isDark.value ? 'dark' : 'light'}`
          : `icon-expand-${isDark.value ? 'dark' : 'light'}`;
      return iconClass;
    });

    return {
      showSubtasks,
      isTaskCompleted,
      removeTask,
      editTask,
      subtasksIconClass,
    };
  },
});
</script>

<style lang="scss" scoped>@import 'task-item.scss';</style>
