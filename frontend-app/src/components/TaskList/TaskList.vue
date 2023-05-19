<template>
  <ul>
    <task-item v-for="task in tasks" :key="task.id" :task="task" @remove="removeTask" @edit="editTask" />
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
    const removeTask = (id: number) => {
      emit('remove', id);
    };

    const editTask = (id: number) => {
      emit('edit', id);
    };

    return {
      removeTask,
      editTask
    };
  }
});
</script>
