<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface Item {
  id: string
  label: string
}

const props = defineProps<{
  modelValue: string | null
  items: Item[]
  label: string
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const inputText = ref('')
const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)

const filteredItems = computed(() => {
  const q = inputText.value.trim().toLowerCase()
  if (!q || props.modelValue !== null) return props.items
  return props.items.filter(i => i.label.toLowerCase().includes(q))
})

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
  <div ref="rootEl" class="flat-autocomplete" :class="{ 'is-disabled': disabled }">
    <label v-if="label" class="form-label fw-semibold">{{ label }}</label>
    <div class="position-relative">
      <input
        ref="inputEl"
        type="text"
        class="form-control"
        :class="{ 'pe-4': modelValue !== null }"
        :placeholder="placeholder ?? `Search…`"
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
        <div v-if="filteredItems.length === 0" class="dropdown-empty">No results found</div>
        <button
          v-for="item in filteredItems"
          :key="item.id"
          type="button"
          class="dropdown-item-btn"
          :class="{ 'is-selected': modelValue === item.label }"
          @mousedown.prevent="selectItem(item.label)"
        >
          {{ item.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.flat-autocomplete.is-disabled {
  opacity: 0.5;
  pointer-events: none;
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
  left: 0;
  right: 0;
  z-index: 1000;
  background: #fff;
  max-height: 260px;
  overflow-y: auto;
}

.dropdown-item-btn {
  display: block;
  width: 100%;
  padding: 0.45rem 0.85rem;
  text-align: left;
  background: none;
  border: none;
  border-bottom: 1px solid #f1f3f5;
  cursor: pointer;
  font-size: 0.9rem;
  color: #212121;
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

.dropdown-enter-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-leave-active { transition: opacity 0.1s ease, transform 0.1s ease; }
.dropdown-enter-from,
.dropdown-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
