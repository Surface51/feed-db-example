<script lang="ts" setup>
  defineProps<{ title: string }>()
</script>

<template>
  <section class="page-title-section page-title-section--has-image">
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
    background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 40%, #52796f 100%);
  }
  .page-title-section--has-image {
    grid-template-rows: auto;
  }
</style>
