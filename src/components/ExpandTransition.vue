<script setup lang="ts">
function beforeEnter(el: Element) {
  const h = el as HTMLElement
  h.style.height = '0'
  h.style.opacity = '0'
  h.style.overflow = 'hidden'
}

function enter(el: Element, done: () => void) {
  const h = el as HTMLElement
  const targetHeight = h.scrollHeight
  h.style.transition = 'height 0.35s ease, opacity 0.35s ease'
  requestAnimationFrame(() => {
    h.style.height = targetHeight + 'px'
    h.style.opacity = '1'
  })
  setTimeout(() => {
    h.style.cssText = ''
    done()
  }, 360)
}

function beforeLeave(el: Element) {
  const h = el as HTMLElement
  h.style.height = h.scrollHeight + 'px'
  h.style.overflow = 'hidden'
}

function leave(el: Element, done: () => void) {
  const h = el as HTMLElement
  h.style.transition = 'height 0.25s ease, opacity 0.25s ease'
  requestAnimationFrame(() => {
    h.style.height = '0'
    h.style.opacity = '0'
  })
  setTimeout(done, 260)
}
</script>

<template>
  <Transition
    @before-enter="beforeEnter"
    @enter="enter"
    @before-leave="beforeLeave"
    @leave="leave"
  >
    <slot />
  </Transition>
</template>
