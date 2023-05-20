<template>
  <ul>
    <task-item v-for="task in tasks" :key="task.id" :task="task" @remove="removeTask" @edit="editTask" />
  </ul>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useTasksStore } from '../../store/store.ts';
import TaskItem from "../TaskItem/TaskItem.vue";

export default defineComponent({
  name: 'TaskList',
  components: {
    TaskItem
  },
  props: {
    tasks: {
      type: Array,
      required: true
    }
  },
  emits: ['remove', 'edit'],
  setup(props, { emit }) {
    const tasksStore = useTasksStore();
    const tasks = computed(() => tasksStore.tasks);
    const removeTask = (id: number) => {
      emit('remove', id);
    };

    const editTask = (id: number) => {
      emit('edit', id);
    };

    return {
      removeTask,
      editTask,
      tasks,
    };
  }
});
</script>
