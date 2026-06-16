<script lang="ts" setup>
  defineProps<{ title: string }>()
</script>

<template>
  <section class="page-title-section page-title-section--has-image">
    <div class="page-title-section__media page-title-section__media--gradient" aria-hidden="true"></div>
    <div class="page-title-section__text">
      <div class="container">
        <div class="region region-page-header">
          <div class="block block-core block-page-title-block">
            <h1 class="page-title">
              <span class="field field--name-title field--type-string field--label-hidden">{{ title }}</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .page-title-section__media--gradient {
    background: url(/images/grain.jpg);
    background-size: cover;
  }
</style>
