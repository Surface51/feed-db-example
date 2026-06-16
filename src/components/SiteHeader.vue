<script lang="ts" setup>
  import { ref } from 'vue'

  const mobileOpen = ref(false)

  const navItems = [
    {
      label: 'About',
      children: [
        { label: 'Who We Are', href: '#' },
        { label: 'Partners', href: '#' },
        { label: 'Administrative Advisors', href: '#' },
        { label: 'Committees', href: '#' },
      ],
    },
    {
      label: 'Feed Composition',
      active: true,
      children: [
        { label: 'About The Database', href: '#' },
      ],
    },
    {
      label: 'Nutrition Modeling',
      children: [
        { label: 'Animal Nutrition & Metabolism Database', href: '#' },
        { label: 'Modeling Github', href: '#' },
        { label: 'Nutrient Requirement Models', href: '#' },
        { label: 'Publications', href: '#' },
        { label: 'Shinyapps, Codes & Software', href: '#' },
      ],
    },
    {
      label: 'Feed Management',
      children: [
        { label: 'About Feed Management', href: '#' },
        { label: 'Podcasts', href: '#' },
        { label: 'Publications', href: '#' },
        { label: 'Resources', href: '#' },
        { label: 'Training and Workshops', href: '#' },
      ],
    },
    {
      label: 'Publications & Events',
      children: [
        { label: 'Abstracts & Presentations', href: '#' },
        { label: 'Peer-Reviewed Papers', href: '#' },
        { label: 'Summits', href: '#' },
        { label: 'Workshops & Symposia', href: '#' },
      ],
    },
    {
      label: 'Resources',
      children: [
        { label: 'Associations & Organizations', href: '#' },
        { label: 'National Research Council (NRC) Reports', href: '#' },
      ],
    },
  ]

  const openDropdown = ref<string | null>(null)

  function toggleDropdown(label: string) {
    openDropdown.value = openDropdown.value === label ? null : label
  }

  function closeAll() {
    openDropdown.value = null
  }
</script>

<template>
  <header id="site-header" class="site-header">
    <div class="site-header__top">
      <div class="container">
        <div class="site-header__top-inner">
          <a class="site-header__brand" href="/" rel="home" title="Home">
            <div class="site-header__logo">
              <img src="/images/logo.png" alt="National Animal Nutrition Program" />
            </div>
          </a>

          <div class="site-header__top-right d-none d-lg-flex">
            <nav class="site-header__eyebrow" aria-label="Utility navigation">
              <ul class="nav site-header__eyebrow-nav ms-0">
                <li class="nav-item"><a class="nav-link" href="#">Login</a></li>
                <li class="seperator"></li>
                <li class="nav-item"><a class="nav-link" href="#">Become a Sponsor</a></li>
                <li class="seperator"></li>
                <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
              </ul>
            </nav>
            <div class="site-header__search">
              <form action="#">
                <div class="input-group">
                  <input type="text" name="keys" class="form-control" placeholder="Search" aria-label="Search">
                  <button class="btn btn-outline-secondary" type="submit">
                    <i class="bi bi-search" aria-hidden="true"></i>
                    <span class="visually-hidden">Search</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <button
            class="navbar-toggler d-lg-none"
            type="button"
            :aria-expanded="mobileOpen"
            aria-label="Toggle navigation"
            @click="mobileOpen = !mobileOpen"
          >
            <div class="line line1"></div>
            <div class="line line2"></div>
            <div class="line line3"></div>
          </button>
        </div>
      </div>
    </div>

    <nav class="navbar navbar-expand-lg site-header__navbar" aria-label="Main navigation">
      <div class="container">
        <div class="navbar-collapse" :class="{ collapse: !mobileOpen }" id="mainNavCollapse">
          <ul class="navbar-nav w-100 ms-0">
            <li
              v-for="item in navItems"
              :key="item.label"
              class="nav-item dropdown"
              :class="{ active: item.active }"
            >
              <a
                class="nav-link dropdown-toggle"
                href="#"
                :aria-current="item.active ? 'true' : undefined"
                @click.prevent="toggleDropdown(item.label)"
                @keydown.esc="closeAll"
              >
                {{ item.label }}
              </a>
              <ul
                v-if="item.children"
                class="dropdown-menu"
                :class="{ show: openDropdown === item.label }"
              >
                <li v-for="child in item.children" :key="child.label">
                  <a class="dropdown-item" :href="child.href">{{ child.label }}</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
