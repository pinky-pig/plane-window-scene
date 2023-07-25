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
      <button
        class="inline-block cursor-pointer rounded-10px border-solid px-4 py-1 text-white"
        @click="emit(item)"
      >
        {{ item.toUpperCase() }}
      </button>
    </div>
  </div>
</template>

<style scoped>
button{
  position: relative;
  background: linear-gradient(243deg, #1b242b, #424f5e);
  border: 1px solid #4e5566;
}
button:hover{
  background: #424f5e;
}
button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/noise.png');
  background-repeat: repeat;
  opacity: .04;
  pointer-events: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
</style>
