<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface Item {
  id: number
  label: string
}

interface Group {
  group: string
  items: Item[]
}

const props = defineProps<{
  modelValue: string | null
  items: Group[]
  label: string
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const inputText = ref(props.modelValue ?? '')
const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)

const filteredGroups = computed(() => {
  const q = inputText.value.trim().toLowerCase()
  if (!q || props.modelValue !== null) return props.items
  return props.items
    .map(g => ({ ...g, items: g.items.filter(i => i.label.toLowerCase().includes(q)) }))
    .filter(g => g.items.length > 0)
})

const hasResults = computed(() => filteredGroups.value.some(g => g.items.length > 0))

function onFocus() {
  if (props.disabled) return
  if (props.modelValue !== null) {
    inputText.value = ''
    emit('update:modelValue', null)
  }
  open.value = true
}

function onInput() {
  emit('update:modelValue', null)
  open.value = true
}

function selectItem(label: string) {
  emit('update:modelValue', label)
  inputText.value = label
  open.value = false
}

function clear() {
  emit('update:modelValue', null)
  inputText.value = ''
  open.value = false
  inputEl.value?.focus()
}

function onDocMousedown(e: MouseEvent) {
  if (rootEl.value && !rootEl.value.contains(e.target as Node)) {
    open.value = false
    if (props.modelValue === null) inputText.value = ''
    else inputText.value = props.modelValue
  }
}

onMounted(() => document.addEventListener('mousedown', onDocMousedown))
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocMousedown))
</script>

<template>
  <div ref="rootEl" class="hier-autocomplete" :class="{ 'is-disabled': disabled }">
    <label class="form-label fw-semibold">{{ label }}</label>
    <div class="input-wrapper position-relative">
      <input
        ref="inputEl"
        type="text"
        class="form-control"
        :class="{ 'pe-4': modelValue !== null }"
        :placeholder="placeholder ?? `Search ${label.toLowerCase()}…`"
        :value="modelValue !== null ? modelValue : inputText"
        :disabled="disabled"
        autocomplete="off"
        @focus="onFocus"
        @input="e => { inputText = (e.target as HTMLInputElement).value; onInput() }"
      />
      <button
        v-if="modelValue !== null"
        type="button"
        class="clear-btn"
        aria-label="Clear selection"
        @mousedown.prevent="clear"
      >
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <Transition name="dropdown">
      <div v-if="open && !disabled" class="dropdown-panel shadow-sm border rounded">
        <div v-if="!hasResults" class="dropdown-empty">No results found</div>
        <template v-else>
          <template v-for="group in filteredGroups" :key="group.group">
            <div class="dropdown-group-header">{{ group.group }}</div>
            <button
              v-for="item in group.items"
              :key="item.id"
              type="button"
              class="dropdown-item-btn"
              :class="{ 'is-selected': modelValue === item.label }"
              @mousedown.prevent="selectItem(item.label)"
            >
              {{ item.label }}
            </button>
          </template>
        </template>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.hier-autocomplete {
  position: relative;
}

.hier-autocomplete.is-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.input-wrapper {
  position: relative;
}

.clear-btn {
  position: absolute;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #6c757d;
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  line-height: 1;
}

.clear-btn:hover {
  color: #212121;
}

.dropdown-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 1000;
  background: #fff;
  max-height: 260px;
  overflow-y: auto;
}

.dropdown-group-header {
  padding: 0.45rem 0.85rem 0.2rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6c757d;
  user-select: none;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.dropdown-item-btn {
  display: block;
  width: 100%;
  padding: 0.45rem 0.85rem 0.45rem 1.2rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: #212121;
  border-bottom: 1px solid #f1f3f5;
}

.dropdown-item-btn:hover,
.dropdown-item-btn:focus {
  background-color: #e8f5ee;
  color: #2d6a4f;
  outline: none;
}

.dropdown-item-btn.is-selected {
  background-color: #d1ece0;
  color: #1b4332;
  font-weight: 600;
}

.dropdown-empty {
  padding: 0.75rem 1rem;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Dropdown open/close transition */
.dropdown-enter-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
