<template>
  <my-container>
    <h1>Редактирование задачи</h1>
    <form @submit.prevent="updateTask" class="edit-form">
      <h3>Задача</h3>
      <div class="edit-form__header">
        <label for="task-completed">Выполнение:</label>
        <MyCheckbox
            id="task-completed"
            v-model="taskCompleted"
            @change="toggleTask(taskId)"
        />
        <label for="task-text">Текст задачи:</label>
        <input type="text" id="task-text" v-model="taskText" />
      </div>

      <div>
        <h3>Подзадачи:</h3>
        <ul id="subtasks" class="edit-form__subtasks">
          <li v-for="(subtask, index) in subtasks" :key="index" class="subtask-item">
            <label>Выполнение:</label>
            <MyCheckbox
                v-model="subtasks[index].completed"
                @change="toggleSubtask(taskId, subtask.id)"
            />
            <input type="text" placeholder="Напишите что-нибудь" v-model="subtasks[index].text" />
            <button type="button" @click="removeSubtask(subtask.id)">Удалить</button>
          </li>
        </ul>

        <div v-if="showAddSubtaskForm" class="edit-form__add-subtask-form">
          <label for="new-subtask-text">Текст новой подзадачи:</label>
          <input placeholder="Напишите что-нибудь" type="text" id="new-subtask-text" v-model="newSubtaskText" />
          <div class="add-subtask-button">
            <button type="button" @click="addSubtask">Добавить</button>
            <button type="button" @click="cancelAddSubtask">Отмена</button>
          </div>

        </div>

        <button
            class="button-true"
            type="button"
            @click="showAddSubtaskForm = true"
            v-if="!showAddSubtaskForm"
        >
          Добавить подзадачу
        </button>
      </div>

      <div class="edit-form__buttons">
        <button class="button-true" type="submit">Сохранить</button>
        <button class="button-false" type="button" @click="cancelEdit">Отмена</button>
      </div>

    </form>
  </my-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTasksStore } from '../../store/store.ts';
import MyCheckbox from '../../components/UI/MyCheckbox/MyCheckbox.vue';
import MyContainer from '../../components/UI/MyContainer/MyContainer.vue';

export default defineComponent({
  name: 'EditTaskPage',
  components: {
    MyContainer,
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
        subtasks.value &&
        subtasks.value.length > 0 &&
        subtasks.value.every((subtask) => subtask.completed)
    );

    onMounted(() => {
      tasksStore.loadTasks();
    });

    const updateTask = () => {
      // Обновление задачи с новыми значениями с помощью метода updateTask из хранилища tasksStore
      tasksStore.updateTask(taskId, taskText.value, taskCompleted.value, subtasks.value);
      router.push('/');
    };

    const cancelEdit = () => {
      router.push('/');
    };

    const toggleSubtask = (taskId: number, subtaskId: number) => {
      tasksStore.toggleSubtask(taskId, subtaskId);
    };

    const toggleTask = (taskId: number) => {
      tasksStore.toggleTask(taskId);

      // Обновление локального состояния подзадач
      if (subtasks.value) {
        subtasks.value.forEach((subtask) => {
          subtask.completed = taskCompleted.value;
        });
      }
    };

    // Добавление новых свойств для управления отображением формы добавления новой подзадачи
    const showAddSubtaskForm = ref(false);
    const newSubtaskText = ref('');

    const addSubtask = () => {
      // Проверка, что текст подзадачи не пустой
      if (newSubtaskText.value) {
        // Добавление новой подзадачи с введенным текстом в массив subtasks
        subtasks.value.push({
          id: Date.now(),
          text: newSubtaskText.value,
          completed: false,
        });

        newSubtaskText.value = '';
        showAddSubtaskForm.value = false;

        tasksStore.saveTasks();
      }
    };

    const cancelAddSubtask = () => {
      // Сброс значения свойства newSubtaskText и скрытие формы добавления новой подзадачи
      newSubtaskText.value = '';
      showAddSubtaskForm.value = false;
    };

    const removeSubtask = (subtaskId: number) => {
      subtasks.value = subtasks.value.filter((subtask) => subtask.id !== subtaskId);
      tasksStore.saveTasks();
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
      showAddSubtaskForm,
      newSubtaskText,
      addSubtask,
      cancelAddSubtask,
      removeSubtask
    };
  },
});
</script>

<style lang="scss" scoped>@import "edit-task-page.scss";</style>

