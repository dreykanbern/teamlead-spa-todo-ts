<template>
  <my-container>
    <div class="home-page-header">

      <h1>Список задач</h1>
      <div class="home-page-header__navigation-header">
        <button class="navigation-header__btn">Добавить</button>
        <toggle-theme></toggle-theme>
      </div>

    </div>
  </my-container>

</template>

<script setup lang="ts">
import { defineComponent } from 'vue';
import ToggleTheme from "../../components/UI/ToggleTheme/ToggleTheme.vue";
import MyContainer from "../../components/UI/MyContainer/MyContainer.vue";

defineComponent({
  name: "HomePage",
  components: {ToggleTheme, MyContainer}
});
</script>

<style lang="scss" scoped>
@import "home-page.scss";
</style>