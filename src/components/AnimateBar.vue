<script setup lang="ts">
const emit = defineEmits([
  'start',
  'pause',
  'resume',
  'restart',
])
const btns = ref<['start', 'pause', 'resume', 'restart']>([
  'start', 'pause', 'resume', 'restart',
])
</script>

<template>
  <div class="fixed bottom-10px w-100vw flex flex-row justify-center gap-20px rounded-lg">
    <div
      v-for="(item, index) in btns"
      :key="index"
    >
      <button class="btn-primary btn" @click="emit(item)">
        {{ item }}
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
