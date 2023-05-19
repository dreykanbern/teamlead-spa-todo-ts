<template>
  <label class="checkbox-container">
    <input type="checkbox" v-model="modelValue" />
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
});
</script>

<style lang="scss" scoped>
@import "my-checkbox";
</style>
