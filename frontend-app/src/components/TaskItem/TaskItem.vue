<template>
  <li>
    <div class="task-item">
      <div class="task-item__header">
        <!-- Использование свойства taskCompleted для определения состояния выполнения задачи -->
        <my-checkbox type="checkbox" v-model="taskCompleted" @change="toggleTask(task.id)" />
        <h3>{{ task.text }}</h3>

        <subtasks-list :subtasks="task.subtasks" @toggle="toggleSubtask(task.id, subtaskId)" v-if="task.subtasks && task.subtasks.length > 0" />

        <div class="task-item__header__actions">
          <button @click="editTask(task.id)">Редактировать</button>
          <button @click="removeTask(task.id)">Удалить</button>
        </div>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
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

    // Использование локального состояния для хранения подзадач
    const subtasks = ref(props.task.subtasks);

    // Использование вычисляемого свойства computed для хранения состояния выполнения задачи
    const taskCompleted = computed(() =>
        subtasks.value && subtasks.value.length > 0 && subtasks.value.every((subtask) => subtask.completed)
    );

    const removeTask = (id: number) => {
      emit('remove', id);
    };

    const editTask = (id: number) => {
      router.push(`/edit/${id}`);
    };

    const toggleSubtask = (taskId, subtaskId) => {
      tasksStore.toggleSubtask(taskId, subtaskId);

      // Обновление локального состояния подзадач
      const task = tasksStore.tasks.find((task) => task.id === taskId);
      if (task && task.subtasks) {
        subtasks.value = task.subtasks;
      }
    };

    // Добавление нового метода toggleTask
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
    };
  },
});
</script>

<style lang="scss" scoped>@import 'task-item.scss';</style>
