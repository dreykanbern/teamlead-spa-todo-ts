<template>
  <my-container>
    <div class="home-page-header">
      <h1>Список задач</h1>
      <div class="home-page-header__navigation-header">
        <button class="navigation-header__btn" @click="showAddModal = true">Добавить задачу</button>
        <button class="navigation-header__btn" @click="restoreDeletedTasks">Восстановить задачи</button>
        <button class="delete-all-btn button-false" @click="removeAllTasks">
          <i :class="`delete-all-icon ${iconClass} button-false`"></i>
          Удалить все
        </button>
        <toggle-theme></toggle-theme>
      </div>
    </div>

    <task-list :tasks="tasks" @remove="confirmRemoveTask" />
    <my-modal :show="showDeleteModal" @confirm="onConfirm" @cancel="cancelRemoveTask">
      <template #body>
        <h3>Вы уверены, что хотите удалить эту задачу?</h3>
      </template>
      <template #buttons>
        <button class="button-true" @click="onConfirm">Подтвердить</button>
        <button class="button-false" @click="cancelRemoveTask">Закрыть</button>
      </template>
    </my-modal>

    <my-modal :show="showAddModal" @cancel="onCancelAdd">
      <template #body>
        <add-task-form ref="addTaskFormRef" @add="addNewTask" />
      </template>
      <template #buttons>
        <button class="button-true" @click="saveAndCloseAddModal">Сохранить</button>
        <button class="button-false" @click="closeAddModal">Закрыть</button>
      </template>
    </my-modal>

  </my-container>
</template>

<script setup lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useTasksStore } from '../../store/store.ts';
import { useDark } from '@vueuse/core';
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

// Использование функции useDark для переключения темы приложения
const isDark = useDark();

// Вычисление класса иконки в зависимости от текущей темы
const iconClass = computed(() => (isDark.value ? 'dark-icon' : 'light-icon'));

onMounted(() => {
  loadData();
});

const loadData = () => {
  tasksStore.loadTasks();
};

const addNewTask = (text: string, subtasks: string[]) => {
  addTask(text, subtasks);
};

const showDeleteModal = ref(false);
let taskIdToRemove = null;

const confirmRemoveTask = (id: number) => {
  taskIdToRemove = id;
  showDeleteModal.value = true;
};

const cancelRemoveTask = () => {
  showDeleteModal.value = false;
  taskIdToRemove = null;
};

const onConfirm = () => {
  if (taskIdToRemove) {
    removeTask(taskIdToRemove);
    taskIdToRemove = null;
  }
  showDeleteModal.value = false;
};

const showAddModal = ref(false);

const closeAddModal = () => {
  showAddModal.value = false;
};

// Получение ссылки на компонент AddTaskForm
const addTaskFormRef = ref<InstanceType<typeof AddTaskForm>>();

// Метод для сохранения новой задачи и закрытия модального окна
const saveAndCloseAddModal = () => {
  // Вызов метода onAdd из компонента AddTaskForm
  addTaskFormRef.value?.onAdd();
  closeAddModal();
};
</script>

<style lang="scss" scoped>@import 'home-page.scss';</style>
