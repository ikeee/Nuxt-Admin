<script setup lang="ts">
interface TeacherApp {
  id: number
  slug: string
  groupId: number
  titleEn: string
  titleZh: string
  descEn: string
  descZh: string
  href: string
  icon: string
  markEn: string
  markZh: string
  status: string
  pinned: boolean
  external: boolean
}

interface TeacherGroup {
  id: number
  slug: string
  titleEn: string
  titleZh: string
  noteEn: string
  noteZh: string
  apps: TeacherApp[]
}

definePageMeta({ layout: false })

const { locale } = useI18n()
const { isLoggedIn, isAdmin } = useAuth()
const { data, pending, error } = await useFetch<{ groups: TeacherGroup[] }>('/api/teacher/apps')

const isZh = computed(() => String(locale.value).toLowerCase().startsWith('zh'))
const groups = computed(() => data.value?.groups ?? [])

const copy = computed(() => isZh.value
  ? {
      eyebrow: '教师工具',
      title: '把备课里的杂活，交给工具',
      lede: '取素材、处理视频、准备课堂材料。一个账号，所有工具。',
      browse: '浏览工具',
      register: '免费注册',
      login: '登录',
      account: '我的账号',
      dashboard: '管理后台',
      logout: '退出登录',
      footer: '仅限授权使用。请遵守平台规则与著作权法。',
      empty: '工具目录正在准备中。',
      error: '工具目录加载失败，请稍后再试。',
      live: '已上线',
      soon: '开发中',
      pinned: '置顶',
      open: '打开'
    }
  : {
      eyebrow: 'Teacher tools',
      title: 'Less busywork. More teaching.',
      lede: 'Grab materials, edit media and prepare lessons — one account for every tool.',
      browse: 'Browse tools',
      register: 'Create account',
      login: 'Log in',
      account: 'My account',
      dashboard: 'Dashboard',
      logout: 'Log out',
      footer: 'Authorized use only. Please respect platform terms and copyright.',
      empty: 'The tool catalog is being prepared.',
      error: 'The tool catalog could not be loaded. Please try again later.',
      live: 'Live',
      soon: 'Coming soon',
      pinned: 'Pinned',
      open: 'Open'
    })

function appTitle(app: TeacherApp) {
  return isZh.value ? app.titleZh : app.titleEn
}

function appDesc(app: TeacherApp) {
  return isZh.value ? app.descZh : app.descEn
}

function appMark(app: TeacherApp) {
  return isZh.value ? app.markZh : app.markEn
}

function groupTitle(group: TeacherGroup) {
  return isZh.value ? group.titleZh : group.titleEn
}

function groupNote(group: TeacherGroup) {
  return isZh.value ? group.noteZh : group.noteEn
}

useSeoMeta({
  title: 'Teacher Tools — Yunshuling',
  description: 'Small, sharp tools for teachers: materials, media and lesson preparation.',
  robots: 'noindex, nofollow, noarchive'
})
</script>

<template>
  <div class="min-h-screen bg-default">
    <header class="sticky top-0 z-40 border-b border-default bg-default/85 backdrop-blur">
      <UContainer class="flex h-16 items-center gap-3">
        <NuxtLink
          to="/"
          class="flex min-w-0 items-center gap-2.5"
        >
          <span class="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-inverted">
            <UIcon
              name="i-lucide-graduation-cap"
              class="size-5"
            />
          </span>
          <span class="min-w-0">
            <span class="block truncate text-sm font-semibold text-highlighted">Yunshuling</span>
            <span class="block truncate text-[11px] text-muted">Teacher Tools</span>
          </span>
        </NuxtLink>

        <nav class="ml-auto hidden items-center gap-1 md:flex">
          <a
            href="#tools"
            class="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-elevated hover:text-highlighted"
          >
            {{ copy.browse }}
          </a>
          <UButton
            v-if="isLoggedIn"
            :to="isAdmin ? '/dashboard' : '/profile'"
            color="neutral"
            variant="ghost"
            :label="isAdmin ? copy.dashboard : copy.account"
          />
          <UButton
            v-if="isLoggedIn"
            to="/logout"
            color="neutral"
            variant="ghost"
            :label="copy.logout"
          />
          <template v-else>
            <UButton
              to="/login"
              color="neutral"
              variant="ghost"
              :label="copy.login"
            />
            <UButton
              to="/register"
              color="primary"
              :label="copy.register"
            />
          </template>
        </nav>

        <div class="ml-auto flex items-center gap-2 md:ml-0">
          <AppLanguageSelect />
          <UButton
            v-if="!isLoggedIn"
            to="/register"
            color="primary"
            size="sm"
            class="md:hidden"
            :label="copy.register"
          />
        </div>
      </UContainer>
    </header>

    <main>
      <UContainer class="pb-16 pt-16 sm:pt-24">
        <div class="max-w-3xl">
          <UBadge
            color="primary"
            variant="soft"
            size="lg"
          >
            {{ copy.eyebrow }}
          </UBadge>
          <h1 class="mt-6 text-4xl font-semibold tracking-tight text-highlighted sm:text-6xl">
            {{ copy.title }}
          </h1>
          <p class="mt-5 max-w-2xl text-lg leading-8 text-muted">
            {{ copy.lede }}
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <UButton
              to="#tools"
              size="xl"
              icon="i-lucide-arrow-down"
              :label="copy.browse"
            />
            <UButton
              v-if="!isLoggedIn"
              to="/register"
              size="xl"
              color="neutral"
              variant="soft"
              icon="i-lucide-user-plus"
              :label="copy.register"
            />
            <UButton
              v-else
              :to="isAdmin ? '/dashboard' : '/profile'"
              size="xl"
              color="neutral"
              variant="soft"
              icon="i-lucide-layout-dashboard"
              :label="isAdmin ? copy.dashboard : copy.account"
            />
          </div>
        </div>
      </UContainer>

      <UContainer
        id="tools"
        class="pb-20"
      >
        <UAlert
          v-if="error"
          color="error"
          variant="subtle"
          :title="copy.error"
          class="mb-8"
        />

        <div
          v-if="pending"
          class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <UCard
            v-for="i in 6"
            :key="i"
            class="h-56 animate-pulse"
          >
            <div class="h-4 w-24 rounded bg-elevated" />
            <div class="mt-5 h-6 w-2/3 rounded bg-elevated" />
            <div class="mt-3 h-4 w-full rounded bg-elevated" />
            <div class="mt-2 h-4 w-4/5 rounded bg-elevated" />
          </UCard>
        </div>

        <div
          v-else-if="!groups.length"
          class="rounded-2xl border border-dashed border-default p-12 text-center text-muted"
        >
          {{ copy.empty }}
        </div>

        <template v-else>
          <div
            v-for="group in groups"
            :key="group.id"
            class="mb-14 last:mb-0"
          >
            <div class="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 class="text-2xl font-semibold tracking-tight text-highlighted">
                {{ groupTitle(group) }}
              </h2>
              <p class="text-sm text-muted">
                {{ groupNote(group) }}
              </p>
            </div>

            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <template
                v-for="app in group.apps"
                :key="app.id"
              >
                <NuxtLink
                  v-if="app.status !== 'soon'"
                  :to="app.href"
                  :target="app.external ? '_blank' : undefined"
                  :rel="app.external ? 'noopener noreferrer' : undefined"
                  class="group block h-full"
                >
                  <UCard class="h-full transition duration-300 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-xl">
                    <div class="flex items-start gap-3">
                      <span class="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        <UIcon
                          :name="app.icon"
                          class="size-5"
                        />
                      </span>
                      <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <h3 class="font-semibold text-highlighted">
                            {{ appTitle(app) }}
                          </h3>
                          <UBadge
                            v-if="app.pinned"
                            color="info"
                            variant="soft"
                            size="sm"
                          >
                            {{ copy.pinned }}
                          </UBadge>
                          <UBadge
                            color="primary"
                            variant="soft"
                            size="sm"
                          >
                            {{ copy.live }}
                          </UBadge>
                        </div>
                        <p class="mt-3 text-sm leading-6 text-muted">
                          {{ appDesc(app) }}
                        </p>
                      </div>
                    </div>
                    <template #footer>
                      <div class="flex items-center gap-3">
                        <UBadge
                          color="neutral"
                          variant="subtle"
                          size="sm"
                        >
                          {{ appMark(app) }}
                        </UBadge>
                        <span class="ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
                          {{ copy.open }}
                          <UIcon
                            name="i-lucide-arrow-right"
                            class="size-4 transition group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </template>
                  </UCard>
                </NuxtLink>

                <UCard
                  v-else
                  class="h-full border-dashed bg-elevated/40"
                >
                  <div class="flex items-start gap-3">
                    <span class="grid size-11 shrink-0 place-items-center rounded-xl bg-elevated text-muted">
                      <UIcon
                        :name="app.icon"
                        class="size-5"
                      />
                    </span>
                    <div>
                      <div class="flex items-center gap-2">
                        <h3 class="font-semibold text-highlighted">
                          {{ appTitle(app) }}
                        </h3>
                        <UBadge
                          color="neutral"
                          variant="soft"
                          size="sm"
                        >
                          {{ copy.soon }}
                        </UBadge>
                      </div>
                      <p class="mt-3 text-sm leading-6 text-muted">
                        {{ appDesc(app) }}
                      </p>
                    </div>
                  </div>
                </UCard>
              </template>
            </div>
          </div>
        </template>
      </UContainer>
    </main>

    <footer class="border-t border-default">
      <UContainer class="flex flex-col gap-2 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>{{ copy.footer }}</span>
        <span>© 2026 深圳市云树灵教育科技有限公司</span>
      </UContainer>
    </footer>
  </div>
</template>
