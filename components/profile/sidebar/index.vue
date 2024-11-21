<script setup>
const cookie_user = useCookie("user");
const isOpen = ref(false);
</script>

<template>
  <div class="w-fit md:w-1/5">
    <UIcon
      name="i-heroicons-list-bullet-20-solid"
      @click="isOpen = true"
      class="w-[30px] h-[30px] block md:hidden"
    />
    <USlideover v-model="isOpen">
      <UCard
        class="flex flex-col flex-1"
        :ui="{
          body: { base: 'flex-1' },
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            ></h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpen = false"
            />
          </div>
        </template>
        <ProfileSidebarOrganization
          v-if="cookie_user?.role_id === 4 && cookie_user?.status === 'active'"
          :user="cookie_user"
        />
        <ProfileSidebarSeller
          v-else-if="
            cookie_user?.role_id === 3 && cookie_user?.status === 'active'
          "
          :user="cookie_user"
        />
        <ProfileSidebarSpecialist
          v-else-if="
            cookie_user?.role_id === 2 && cookie_user?.status === 'active'
          "
          :user="cookie_user"
        />
        <ProfileSidebarPrivate v-else :user="cookie_user" />
      </UCard>
    </USlideover>
    <ProfileSidebarOrganization
      v-if="cookie_user?.role_id === 4 && cookie_user?.status === 'active'"
      :user="cookie_user"
      class="hidden md:flex"
    />
    <ProfileSidebarSeller
      v-else-if="cookie_user?.role_id === 3 && cookie_user?.status === 'active'"
      :user="cookie_user"
      class="hidden md:flex"
    />
    <ProfileSidebarSpecialist
      v-else-if="cookie_user?.role_id === 2 && cookie_user?.status === 'active'"
      :user="cookie_user"
      class="hidden md:flex"
    />
    <ProfileSidebarPrivate v-else :user="cookie_user" class="hidden md:flex" />
  </div>
</template>
