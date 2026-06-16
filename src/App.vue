<script lang="ts" setup>
  import SiteHeader from '@/components/SiteHeader.vue'
  import SiteFooter from '@/components/SiteFooter.vue'
</script>

<template>
  <SiteHeader />
  <router-view />
  <SiteFooter />
</template>
