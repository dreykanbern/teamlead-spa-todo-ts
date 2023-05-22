<template>
  <ul v-show="show" class="subtasks-list-wrapper">
    <li v-for="subtask in subtasks" :key="subtask.id" class="subtasks-list-wrapper__subtasks-list">
      <my-checkbox
          type="checkbox"
          :model-value="subtask.completed"
          @update:model-value="(value) => onUpdateModelValue(subtask.id, value)"
      />
      <span :class="{ 'completed': subtask.completed }">{{ subtask.text }}</span>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MyCheckbox from '../UI/MyCheckbox/MyCheckbox.vue';

export default defineComponent({
  name: 'SubtasksList',
  components: { MyCheckbox },
  props: {
    subtasks: {
      type: Array,
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['toggle'],
  methods: {
    onUpdateModelValue(subtaskId, value) {
      console.log('onUpdateModelValue called with', subtaskId, value); // Добавленная строка
      this.$emit('toggle', subtaskId);
    },
  },
});

</script>

<style lang="scss" scoped>
@import 'subtasks-list.scss';
</style>
