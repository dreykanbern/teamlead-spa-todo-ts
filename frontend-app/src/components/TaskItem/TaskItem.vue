<template>
  <li>
    <div class="task-item" @click="showSubtasks = !showSubtasks">
      <div class="task-and-subtasks">
        <div class="task-item__header">
          <my-checkbox type="checkbox" v-model="taskCompleted" @change="toggleTask(task.id)" />
          <h3 :class="{ 'completed': taskCompleted }">
            {{ task.text }}
            <span v-if="task.subtasks && task.subtasks.length > 0">
              ({{ completedSubtasks }}/{{ task.subtasks.length }})
            </span>
          </h3>
          <i v-show="task.subtasks && task.subtasks.length > 0" :class="['icon', subtasksIconClass]"></i>
        </div>

        <subtasks-list
            :subtasks="task.subtasks"
            @toggle="(subtaskId) => toggleSubtask(task.id, subtaskId)"
            v-if="task.subtasks && task.subtasks.length > 0"
            :show="showSubtasks"
        />
      </div>

      <div class="task-item__header__actions">
        <button class="button-true" @click.stop="editTask(task.id)">Редактировать</button>
        <button class="button-false" @click.stop="removeTask(task.id)">Удалить</button>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useTasksStore } from '../../store/store.ts';
import { useRouter } from 'vue-router';
import { useDark } from '@vueuse/core';
import MyCheckbox from '../UI/MyCheckbox/MyCheckbox.vue';
import SubtasksList from '../SubtasksList/SubtasksList.vue';

export default defineComponent({
  name: 'TaskItem',
  components: { MyCheckbox, SubtasksList },
  props: {
    task: {
      type: Object,
      required: true,
      default: () => ({ text: '' }),
    },
  },
  emits: ['remove', 'edit'],
  setup(props, { emit }) {
    const router = useRouter();
    const tasksStore = useTasksStore();

    // Использование локального состояния для хранения подзадач
    const subtasks = ref(props.task.subtasks);

    // Использование вычисляемого свойства computed для хранения состояния выполнения задачи
    const taskCompleted = computed(() => props.task.completed);

    // Добавление локального состояния для управления отображением подробностей задачи
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

    // Вычисление количества выполненных подзадач
    const completedSubtasks = computed(() => {
      if (!subtasks.value) return 0;
      return subtasks.value.filter((subtask) => subtask.completed).length;
    });

    const removeTask = (id: number) => {
      emit('remove', id);
    };

    const editTask = (id: number) => {
      router.push(`/edit/${id}`);
    };

    const toggleSubtask = (taskId, subtaskId) => {
      console.log('toggleSubtask called with', taskId, subtaskId);
      tasksStore.toggleSubtask(taskId, subtaskId);

      // Обновление локального состояния подзадач
      const task = tasksStore.tasks.find((task) => task.id === taskId);
      if (task && task.subtasks) {
        console.log('task and task.subtasks found');
        subtasks.value = task.subtasks;
      }
    };

    const toggleTask = (taskId) => {
      tasksStore.toggleTask(taskId);

      // Обновление локального состояния подзадач
      const task = tasksStore.tasks.find((task) => task.id === taskId);
      if (task && task.subtasks) {
        subtasks.value = task.subtasks;
      }
    };

    return {
      taskCompleted,
      removeTask,
      editTask,
      toggleSubtask,
      toggleTask,
      showSubtasks,
      subtasksIconClass,
      completedSubtasks,
    };
  },
});
</script>

<style lang="scss" scoped>
@import 'task-item.scss';
</style>
