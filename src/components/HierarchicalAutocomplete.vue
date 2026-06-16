<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface TreeItem {
  id: string
  label: string
  children: TreeItem[]
}

const props = defineProps<{
  modelValue: string | null
  items: TreeItem[]
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

interface Row {
  id: string
  label: string
  fullLabel: string
  depth: number
  hasChildren: boolean
}

function buildRows(items: TreeItem[], depth = 0, parentLabel = ''): Row[] {
  const rows: Row[] = []
  for (const item of items) {
    const fullLabel = parentLabel ? `${parentLabel} — ${item.label}` : item.label
    rows.push({ id: item.id, label: item.label, fullLabel, depth, hasChildren: !!item.children?.length })
    if (item.children?.length) {
      rows.push(...buildRows(item.children, depth + 1, fullLabel))
    }
  }
  return rows
}

const allRows = computed(() => buildRows(props.items))

// Returns a pruned copy of the tree: a node is kept if its label matches OR
// any descendant matches. When a node itself matches, all its children are kept.
function filterTree(items: TreeItem[], q: string): TreeItem[] {
  return items.flatMap(item => {
    if (item.label.toLowerCase().includes(q)) {
      return [item]
    }
    const matchingChildren = filterTree(item.children ?? [], q)
    if (matchingChildren.length > 0) {
      return [{ ...item, children: matchingChildren }]
    }
    return []
  })
}

const filteredRows = computed(() => {
  const q = inputText.value.trim().toLowerCase()
  if (!q || props.modelValue !== null) return allRows.value
  return buildRows(filterTree(props.items, q))
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

function selectRow(row: Row) {
  emit('update:modelValue', row.fullLabel)
  inputText.value = row.fullLabel
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
        <div v-if="filteredRows.length === 0" class="dropdown-empty">No results found</div>
        <button
          v-for="row in filteredRows"
          :key="row.id"
          type="button"
          class="dropdown-item-btn"
          :class="{
            'is-selected': modelValue === row.fullLabel,
            'is-parent': row.hasChildren,
            'is-leaf': !row.hasChildren && row.depth > 0,
          }"
          :style="{ paddingLeft: `calc(0.85rem + ${row.depth * 0.9}rem)` }"
          @mousedown.prevent="selectRow(row)"
        >
          {{ row.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.hier-autocomplete.is-disabled {
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

/* Items that have children: bold, dark */
.dropdown-item-btn.is-parent {
  font-weight: 600;
  color: #1b4332;
}

/* Leaf items nested under a parent */
.dropdown-item-btn.is-leaf {
  font-size: 0.85rem;
  color: #555;
  background-color: #fafafa;
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
