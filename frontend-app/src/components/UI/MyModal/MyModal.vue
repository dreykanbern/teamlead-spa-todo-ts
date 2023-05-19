<template>
  <div v-if="show" class="modal" @click="$emit('cancel')">
    <div class="modal-content" @click.stop>
      <slot name="body"></slot>
      <div class="modal-buttons">
        <slot name="buttons">
          <button @click="onConfirm">Подтвердить</button>
          <button @click="$emit('cancel')">Закрыть</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      required: true
    },
    removeTask: {
      type: Function,
      required: true
    }
  },
  emits: ['confirm', 'cancel'],
  methods: {
    onConfirm() {
      this.removeTask();
      this.$emit('confirm');
    }
  }
});
</script>

<style lang="scss" scoped>
@import "my-modal";
</style>

