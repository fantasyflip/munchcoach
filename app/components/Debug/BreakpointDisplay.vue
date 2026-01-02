<template>
  <div class="fixed bottom-5 left-1 z-[100] flex gap-2 hover:hidden">
    <div>Breakpoint:</div>
    <div class="block sm:hidden">xs</div>
    <div class="hidden sm:block md:hidden">sm</div>
    <div class="hidden md:block lg:hidden">md</div>
    <div class="hidden lg:block xl:hidden">lg</div>
    <div class="hidden xl:block 2xl:hidden">xl</div>
    <div class="hidden 2xl:block">2xl</div>
    <div>Orientation:</div>
    <div class="hidden portrait:block">Portrait</div>
    <div class="hidden landscape:block">Landscape</div>
    <div>width: {{ width }}</div>
    <div>height: {{ height }}</div>
  </div>
</template>

<script lang="ts" setup>
const { width, height } = useWindowSize();
</script>
