<template>
  <div>
    <h1>Редактирование задачи</h1>
    <form @submit.prevent="updateTask">
      <div>
        <label for="task-text">Текст задачи:</label>
        <input id="task-text" v-model="taskText" />
      </div>
      <!-- Использование свойства taskCompleted для определения состояния выполнения задачи -->
      <div>
        <label for="task-completed">Задача выполнена:</label>
        <MyCheckbox id="task-completed" v-model="taskCompleted" @change="toggleTask(taskId)" />
      </div>
      <div>
        <label for="subtasks">Подзадачи:</label>
        <ul id="subtasks">
          <li v-for="(subtask, index) in subtasks" :key="index">
            <MyCheckbox v-model="subtasks[index].completed" @change="toggleSubtask(taskId, subtask.id)" />
            <input v-model="subtasks[index].text" />
          </li>
        </ul>
      </div>
      <button type="submit">Сохранить</button>
      <button type="button" @click="cancelEdit">Отмена</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTasksStore } from '../../store/store.ts';
import MyCheckbox from '../../components/UI/MyCheckbox/MyCheckbox.vue';

export default defineComponent({
  name: 'EditTaskPage',
  components: {
    MyCheckbox,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const tasksStore = useTasksStore();

    const taskId = Number(route.params.id);
    const task = tasksStore.tasks.find((task) => task.id === taskId);

    if (!task) {
      router.push('/');
      return;
    }

    const taskText = ref(task.text);
    const subtasks = ref(task.subtasks);

    // Использование вычисляемого свойства computed для хранения состояния выполнения задачи
    const taskCompleted = computed(() =>
        subtasks.value && subtasks.value.length > 0 && subtasks.value.every((subtask) => subtask.completed)
    );

    onMounted(() => {
      tasksStore.loadTasks();
    });

    const updateTask = () => {
      task.text = taskText.value;
      task.completed = taskCompleted.value;
      task.subtasks = subtasks.value;
      tasksStore.saveTasks();
      router.push('/');
    };

    const cancelEdit = () => {
      router.push('/');
    };

    const toggleSubtask = (taskId: number, subtaskId: number) => {
      tasksStore.toggleSubtask(taskId, subtaskId);
    };

    // Добавление нового метода toggleTask
    const toggleTask = (taskId: number) => {
      tasksStore.toggleTask(taskId);

      // Обновление локального состояния подзадач
      if (subtasks.value) {
        subtasks.value.forEach((subtask) => {
          subtask.completed = taskCompleted.value;
        });
      }
    };

    return {
      taskId,
      taskText,
      taskCompleted,
      subtasks,
      updateTask,
      cancelEdit,
      toggleSubtask,
      toggleTask,
    };
  },
});
</script>

<style lang="scss" scoped>@import "edit-task-page.scss";</style>
