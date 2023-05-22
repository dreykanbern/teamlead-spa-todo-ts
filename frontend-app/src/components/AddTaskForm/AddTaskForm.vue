<template>
  <div class="add-task-form">
    <input type="text" v-model="taskText" placeholder="Новая задача" class="task-input" />

    <div class="subtask-wrapper">
      <div v-for="(subtask, index) in subtasks" :key="index" class="subtask-wrapper__subtask-item">
        <input type="text" v-model="subtasks[index]" placeholder="Новая подзадача" />
        <button @click="removeSubtask(index)">Удалить</button>
      </div>
      <button @click="addSubtask" class="add-subtask-button" :disabled="subtasks.length >= maxSubtasks">Добавить подзадачу</button>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'AddTaskForm',
  emits: ['add'],
  setup(_, { emit }) {
    const taskText = ref('');
    const subtasks = ref<string[]>([]);
    const maxSubtasks = 10;

    const addSubtask = () => {
      if (subtasks.value.length < maxSubtasks) {
        subtasks.value.push('');
      }
    };

    const removeSubtask = (index: number) => {
      subtasks.value.splice(index, 1);
    };

    const onAdd = () => {
      if (taskText.value.trim()) {
        const nonEmptySubtasks = subtasks.value.filter((subtask) => subtask.trim() !== '');
        emit('add', taskText.value, nonEmptySubtasks);
        taskText.value = '';
        subtasks.value = [];
      }
    };

    return { taskText, subtasks, addSubtask, removeSubtask, onAdd, maxSubtasks };
  },
});
</script>

<style lang="scss" scoped>@import 'add-task-form.scss';</style>
