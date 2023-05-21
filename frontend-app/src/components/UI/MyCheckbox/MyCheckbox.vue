<template>
  <label class="checkbox-container">
    <input
        type="checkbox"
        :checked="modelValue"
        @change="onChange"
    />
    <span class="checkmark"></span>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MyCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  methods: {
    onChange(event: Event) {
      console.log('MyCheckbox onChange called with', event.target.checked); // Добавленная строка
      this.$emit('update:modelValue', event.target.checked);
    },
  },
});
</script>

<style lang="scss" scoped>
@import "my-checkbox";
</style>
