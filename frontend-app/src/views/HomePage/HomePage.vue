<template>
  <my-container>
    <div class="home-page-header">
      <h1>Список задач</h1>
      <div class="home-page-header__navigation-header">
        <button class="navigation-header__btn" @click="showAddModal = true">Добавить задачу</button>
        <!-- Изменение текста кнопки и вызов метода restoreDeletedTasks -->
        <button class="navigation-header__btn" @click="restoreDeletedTasks">Восстановить задачи</button>
        <!-- Кнопка-иконка для удаления всех задач и подзадач -->
        <button class="delete-all-btn" @click="removeAllTasks">
          <i :class="['delete-all-icon', iconClass]"></i>
          Удалить все
        </button>
        <toggle-theme></toggle-theme>
      </div>
    </div>

    <task-list :tasks="tasks" @remove="confirmRemoveTask" @edit="editTask" :remove-task="removeTask" />
    <my-modal :show="showDeleteModal" :remove-task="removeTask" @confirm="onConfirm" @cancel="cancelRemoveTask">
      <template #body>
        <p>Вы уверены, что хотите удалить эту задачу?</p>
      </template>
      <template #buttons>
        <button @click="onConfirm">Подтвердить</button>
        <button @click="cancelRemoveTask">Закрыть</button>
      </template>
    </my-modal>

    <my-modal :show="showAddModal" @confirm="onConfirmAdd" @cancel="onCancelAdd">
      <template #body>
        <add-task-form @add="addNewTask" />
      </template>
      <template #buttons>
        <button @click="closeAddModal">Закрыть</button>
      </template>
    </my-modal>

  </my-container>
</template>

<script setup lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import { useTasksStore } from '../../store/store.ts';
import { useDark, useToggle } from '@vueuse/core';
import ToggleTheme from '../../components/UI/ToggleTheme/ToggleTheme.vue';
import MyContainer from '../../components/UI/MyContainer/MyContainer.vue';
import TaskList from '../../components/TaskList/TaskList.vue';
import AddTaskForm from '../../components/AddTaskForm/AddTaskForm.vue';
import MyModal from '../../components/UI/MyModal/MyModal.vue';

defineComponent({
  name: 'HomePage',
  components: { ToggleTheme, MyContainer, TaskList, AddTaskForm, MyModal },
});

const tasksStore = useTasksStore();
const { addTask, removeTask, removeAllTasks, restoreDeletedTasks } = tasksStore;

const tasks = computed(() => tasksStore.tasks);

// Использование функций useDark и useToggle для переключения темы приложения
const isDark = useDark();
const toggleTheme = useToggle(isDark);

// Вычисление класса иконки в зависимости от текущей темы
const iconClass = computed(() => (isDark.value ? 'dark-icon' : 'light-icon'));

// Вызов метода loadData при монтировании компонента
onMounted(() => {
  loadData();
});

onBeforeRouteUpdate(() => {
  loadData();
});

const loadData = () => {
  tasksStore.loadTasks();
};

const addNewTask = (text: string, subtasks: string[]) => {
  addTask(text, subtasks);
};

const showDeleteModal = ref(false);

const confirmRemoveTask = (id: number) => {
  showDeleteModal.value = true;
  removeTask(id);
};

const cancelRemoveTask = () => {
  showDeleteModal.value = false;
};

const onConfirm = () => {
  showDeleteModal.value = false;
};

const editTask = (id: number) => {
  // Переход на редактирование задачи
};

const showAddModal = ref(false);

const onConfirmAdd = () => {
  // Обработка добавления новой задачи
  closeAddModal();
};

const closeAddModal = () => {
  showAddModal.value = false;
};
</script>

<style lang="scss" scoped>@import 'home-page.scss';</style>