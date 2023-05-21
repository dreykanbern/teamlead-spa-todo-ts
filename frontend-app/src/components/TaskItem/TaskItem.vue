<template>
  <li>
    <div class="task-item">
      <div class="task-item__header">
        <!-- Использование вычисляемого свойства для определения значения чекбокса задачи -->
        <my-checkbox type="checkbox" v-model="isTaskCompleted" @change="updateSubtasksCheckbox" />
        <h3>{{ task.text }}</h3>

        <subtasks-list :subtasks="task.subtasks" @toggle="toggleSubtask(task.id, $event)" v-if="task.subtasks && task.subtasks.length > 0" />

        <div class="task-item__header__actions">
          <button @click="editTask(task.id)">Редактировать</button>
          <button @click="removeTask(task.id)">Удалить</button>
        </div>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useTasksStore } from '../../store/store.ts';
import { useRouter } from 'vue-router';
import MyCheckbox from '../UI/MyCheckbox/MyCheckbox.vue';
import SubtasksList from '../SubtasksList/SubtasksList.vue';

export default defineComponent({
  name: 'TaskItem',
  components: { MyCheckbox, SubtasksList },
  props: {
    task: {
      type: Object,
      required: true,
      default: () => ({ text: "" }),
    },
  },
  emits: ['remove', 'edit'],
  setup(props, { emit }) {
    const router = useRouter();
    const tasksStore = useTasksStore();
    const { subtasks } = props.task;

    // Вычисление значения чекбокса задачи
    const isTaskCompleted = computed({
      get: () =>
          subtasks && subtasks.length > 0 && subtasks.every((subtask) => subtask.completed),
      set: (value) => {
        if (subtasks && subtasks.length > 0) {
          subtasks.forEach((subtask) => {
            subtask.completed = value;
          });
        }
      },
    });

    const updateSubtasksCheckbox = () => {
      if (subtasks && subtasks.length > 0) {
        subtasks.forEach((subtask) => {
          subtask.completed = isTaskCompleted.value;
        });
      }
    };

    const removeTask = (id: number) => {
      emit('remove', id);
    };

    const editTask = (id: number) => {
      router.push(`/edit/${id}`);
    };

    const toggleSubtask = (taskId, subtaskId) => {
      tasksStore.toggleSubtask(taskId, subtaskId);
      const subtask = subtasks.find((subtask) => subtask.id === subtaskId);
      if (subtask) {
        subtask.completed = !subtask.completed;
      }
    };

    return {
      isTaskCompleted,
      removeTask,
      editTask,
      toggleSubtask,
      updateSubtasksCheckbox,
    };
  },
});
</script>

<style lang="scss" scoped>@import 'task-item.scss';</style>
