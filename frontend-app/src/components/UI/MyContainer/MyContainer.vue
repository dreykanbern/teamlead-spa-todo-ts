<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';
 defineComponent({
  name: "MyContainer",
});
</script>

<style scoped lang="scss">
 @import "my-container";
</style>