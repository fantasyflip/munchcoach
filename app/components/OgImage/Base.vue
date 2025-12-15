<template>
  <div class="flex size-full flex-col justify-center bg-slate-950">
    <svg
      class="absolute right-0 top-0 text-cyan-500"
      width="629"
      height="593"
      viewBox="0 0 629 593"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_199_94966)">
        <path
          d="M628.5 -578L639.334 -94.4223L806.598 -548.281L659.827 -87.387L965.396 -462.344L676.925 -74.0787L1087.69 -329.501L688.776 -55.9396L1160.22 -164.149L694.095 -34.9354L1175.13 15.7948L692.306 -13.3422L1130.8 190.83L683.602 6.50012L1032.04 341.989L668.927 22.4412L889.557 452.891L649.872 32.7537L718.78 511.519L628.5 36.32L538.22 511.519L607.128 32.7537L367.443 452.891L588.073 22.4412L224.955 341.989L573.398 6.50012L126.198 190.83L564.694 -13.3422L81.8734 15.7948L562.905 -34.9354L96.7839 -164.149L568.224 -55.9396L169.314 -329.501L580.075 -74.0787L291.604 -462.344L597.173 -87.387L450.402 -548.281L617.666 -94.4223L628.5 -578Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_199_94966"
          x="0.873535"
          y="-659"
          width="1255.25"
          height="1251.52"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="40.5"
            result="effect1_foregroundBlur_199_94966"
          />
        </filter>
      </defs>
    </svg>

    <div class="w-[700px] pl-[100px]">
      <p
        v-if="headline"
        class="mb-4 text-[20px] font-semibold uppercase text-cyan-500"
      >
        {{ headline }}
      </p>
      <h1
        class="m-0 mb-4 flex items-center text-[75px] font-semibold text-white"
      >
        <span>{{ title }}</span>
      </h1>
      <p v-if="description" class="text-[28px] leading-tight text-white">
        {{ description.slice(0, 200) }}
      </p>
    </div>

    <!-- App brand mark (matches header badge styling) -->
    <div class="absolute right-[200px] top-40 flex flex-col items-center">
      <div
        class="h-[140px] w-[140px] rounded-3xl bg-cyan-500/90 text-slate-950 flex items-center justify-center font-black text-[64px] shadow-lg shadow-cyan-500/40"
      >
        AI
      </div>
    </div>

    <div class="absolute bottom-[180px] right-[135px]">
      <div class="flex items-baseline">
        <span class="text-[44px] font-extrabold tracking-tight text-white"
          >Munch</span
        >
        <span class="text-[44px] font-extrabold tracking-tight text-cyan-300"
          >Coach</span
        >
      </div>
      <div class="mt-3 h-1 w-28 rounded-full bg-cyan-500/80" />
    </div>
  </div>
</template>

<script lang="ts" setup>
// Komponenten-Props definieren
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  headline: {
    type: String,
    default: "",
  },
});
</script>
