<script setup lang="ts"></script>
<template>
  <div
    class="border-t border-stone-200 mt-8 py-4 text-center text-xs flex flex-col gap-2 items-center"
  >
    <div class="flex flex-row items-center justify-center gap-1.5">
      <p>
        {{ $t("madeBy") }}
        <a
          href="https://github.com/birdfromhell"
          class="hover:underline font-bold"
          >Ababil Mustaqim</a
        >
        {{ $t("with") }}
        <a href="https://nuxt.com/" class="hover:underline font-bold"
          >Nuxt.js</a
        >
      </p>
      <img
        src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Red%20Heart.png"
        alt="Red Heart"
        width="23"
        height="23"
      />
    </div>
    <Settings />
  </div>
</template>
