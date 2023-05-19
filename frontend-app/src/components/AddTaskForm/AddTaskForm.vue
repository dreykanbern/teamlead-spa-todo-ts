<template>
  <div class="add-task-form">
    <input type="text" v-model="taskText" placeholder="Новая задача" />
    <div v-for="index in subtasks.length" :key="index">
      <input type="text" v-model="subtasks[index]" placeholder="Новая подзадача" />
      <button @click="removeSubtask(index)">Удалить</button>
    </div>
    <button @click="addSubtask">Добавить подзадачу</button>
    <button @click="onAdd">Добавить</button>
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

    const addSubtask = () => {
      subtasks.value.push('');
    };

    const removeSubtask = (index: number) => {
      subtasks.value.splice(index, 1);
    };

    const onAdd = () => {
      if (taskText.value) {
        const nonEmptySubtasks = subtasks.value.filter((subtask) => subtask.trim() !== '');
        emit('add', taskText.value, nonEmptySubtasks);
        taskText.value = '';
        subtasks.value = [];
      }
    };

    return { taskText, subtasks, addSubtask, removeSubtask, onAdd };
  },
});
</script>

<style lang="scss" scoped>@import 'add-task-form.scss';</style>

