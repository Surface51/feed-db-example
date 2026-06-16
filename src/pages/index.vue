<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import PageTitleSection from '@/components/PageTitleSection.vue'
import FlatAutocomplete from '@/components/FlatAutocomplete.vue'
import HierarchicalAutocomplete from '@/components/HierarchicalAutocomplete.vue'
import ExpandTransition from '@/components/ExpandTransition.vue'
import collectionsData from '@/data/collections.json'
import categoriesData from '@/data/real-categories.json'
import sourcesData from '@/data/real-sources.json'
import attributesData from '@/data/real-attributes.json'

const keyword = ref<string | null>(null)

// Flat list of all attribute labels (including children of parent attributes)
const flatAttributes = attributesData.flatMap(attr => [
  { id: attr.id, label: attr.label, children: [] as { id: string; label: string; children: [] }[] },
  ...attr.children.map(c => ({ id: c.id, label: c.label, children: [] as { id: string; label: string; children: [] }[] })),
])

// 3-level tree: category → source → attribute
const searchTreeData = categoriesData.map(cat => ({
  id: `cat-${cat.id}`,
  label: cat.label,
  children: sourcesData.map(src => ({
    id: `src-${cat.id}-${src.id}`,
    label: src.label,
    children: flatAttributes.map(attr => ({
      id: `attr-${cat.id}-${src.id}-${attr.id}`,
      label: attr.label,
      children: [] as { id: string; label: string; children: [] }[],
    })),
  })),
}))
const activeCollection = ref<string | null>(null)
const selectedCategory = ref<string | null>(null)
const selectedSource = ref<string | null>(null)
const selectedAttribute = ref<string | null>(null)

const showCategory = computed(() => activeCollection.value !== null)
const showSource = computed(() => selectedCategory.value !== null)
const showAttribute = computed(() => selectedSource.value !== null)
const showSubmit = computed(() => selectedCategory.value !== null && selectedSource.value !== null && selectedAttribute.value !== null)

watch(showCategory, (visible) => {
  if (!visible) {
    selectedCategory.value = null
    selectedSource.value = null
    selectedAttribute.value = null
  }
})

watch(selectedCategory, () => {
  selectedSource.value = null
  selectedAttribute.value = null
})

watch(selectedSource, () => {
  selectedAttribute.value = null
})

function toggleCollection(name: string) {
  activeCollection.value = activeCollection.value === name ? null : name
}

function handleSubmit() {
  console.log('Search submitted:', {
    keyword: keyword.value,
    collection: activeCollection.value,
    category: selectedCategory.value,
    source: selectedSource.value,
    attribute: selectedAttribute.value,
  })
}
</script>

<template>
  <PageTitleSection title="Feed Composition Database" />

  <div class="page-layout">
    <div class="container">
      <div class="search-page">

        <!-- Descriptive text -->
        <p class="">
          This database provides the nutrient composition summary for various feed ingredients commonly used in
          livestock diets.
        </p>
        <p class="">
          Use the search bar or select a data collection to find the nutrition data you need.
        </p>
        <p class="search-page__intro">
          The work of NANP is made possible in part by sponsors. The work of NANP is made possible in part by sponsors.
          More intro about that here.
        </p>

        <!-- Search by keyword -->
        <section class="search-page__section">
          <h2 class="">Search data by keyword</h2>
          <HierarchicalAutocomplete v-model="keyword" :items="searchTreeData" label=""
            placeholder="Search by category, source, or attribute…" />
        </section>

        <!-- Filter by collection -->
        <section class="search-page__section">
          <h2 class="">Filter data by collection</h2>
          <p class="search-page__section-desc">
            Intro here that references the National Academies of Sciences, Engineering, and Medicine (NASEM) with a link
            here: https://animalnutrition.org/nrc_reports and here: https://www.nationalacademies.org/publications/all
          </p>
          <div class="search-page__collection-grid">
            <button v-for="col in collectionsData" :key="col" type="button" class="search-page__collection-btn"
              :class="{ 'search-page__collection-btn--active': activeCollection === col }"
              @click="toggleCollection(col)">
              {{ col }}
            </button>
          </div>
        </section>

        <!-- Cascading autocomplete dropdowns -->
        <section class="search-page__section">
          <ExpandTransition>
            <div v-if="showCategory">
              <h3 class="">Select category</h3>
              <p class="search-page__section-desc">
                A category consists of related ingredients commonly used by nutritionists when formulating feed or food
                products.
              </p>

              <div class="search-page__dropdowns">
                <FlatAutocomplete v-model="selectedCategory" :items="categoriesData" label="" />

                <ExpandTransition>
                  <div v-if="showSource" class="search-page__dropdown-row">
                    <h3>Select a source</h3>
                    <p>Listed below are the ingredient sources for the category you selected. A source is the original
                      material the ingredient comes from, identified by its scientific genus and species when
                      applicable.
                    </p>
                    <FlatAutocomplete v-model="selectedSource" :items="sourcesData" label="" />
                  </div>
                </ExpandTransition>

                <ExpandTransition>
                  <div v-if="showAttribute" class="search-page__dropdown-row">
                    <h3>Select an attribute</h3>
                    <p>Finally, select an attribute to further define the ingredient. Attributes describe
                      characteristics or
                      processing methods, such as drying, grinding, or extraction. Some ingredients include a hierarchy
                      of
                      attributes, where broader categories contain more specific descriptions.</p>
                    <HierarchicalAutocomplete v-model="selectedAttribute" :items="attributesData" label="" />
                  </div>
                </ExpandTransition>
              </div>
            </div>
          </ExpandTransition>
        </section>

        <!-- Submit -->
        <ExpandTransition>
          <div v-if="showSubmit" class="search-page__submit">
            <button type="button" class="btn btn-primary btn-lg" @click="handleSubmit">
              Submit
            </button>
          </div>
        </ExpandTransition>

      </div>
    </div>
  </div>
</template>

<style scoped>
h2,
h3 {
  margin-top: 2em;
  font-weight: 900;
  color: var(--bs-primary);
}

.search-page {
  padding: 2.5rem 0 4rem;
}

.search-page__intro {
  font-size: 1rem;
  color: #444;
  margin-bottom: 2.5rem;
  line-height: 1.7;
}

.search-page__section {
  margin-bottom: 2.5rem;
}

.search-page__section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1b4332;
  margin-bottom: 0.35rem;
  border-bottom: 2px solid #d1ece0;
  padding-bottom: 0.4rem;
}

.search-page__section-desc {
  font-size: 0.875rem;
  color: #6c757d;
  margin-bottom: 0.85rem;
}

.search-page__collection-grid {
  margin: 2rem 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.search-page__collection-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
  padding: 0.375rem 1rem;
  border-radius: 999rem;
  border: 3px solid var(--bs-primary);
  background: transparent;
  color: var(--bs-primary);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.search-page__collection-btn:hover,
.search-page__collection-btn--active {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
  color: #fff;
}

.search-page__dropdowns {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.search-page__dropdown-row {
  margin-top: 1rem;
}

.search-page__submit {
  margin-top: 0.5rem;
  display: grid;
  place-content: center;
}

.search-page__submit button {
  border-radius: 999em;
  padding: .5em 2.5em;
  font-weight: bold;
}
</style>
<style>
.search-page {
  .hier-autocomplete label {
    display: none;
  }

  button,
  p {
    font-size: 20px !important;
  }

  .hier-autocomplete,
  .flat-autocomplete {
    position: relative;
  }

}

.page-layout {
  overflow-y: unset !important;
}
</style>
