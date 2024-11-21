<script setup>
const faq_list = ref([]);
onBeforeMount(() => {
  const { useDicts } = useDict();
  faq_list.value = useDicts().value.faqs;
});
const { locale } = useI18n();
const opened = ref(0);
</script>
<template>
  <div class="faq-block">
    <UAccordion
      :items="faq_list"
      :ui="{
        wrapper: 'flex flex-col w-full ',
        container: `mb-3    `,
        // container: `mb-3 bg-emerald bg-opacity-10 rounded-xl py-4 px-5`,
      }"
    >
      <template #default="{ item, index, open }">
        <div
          class="py-4 px-5 rounded-xl"
          :class="open ? 'bg-emerald bg-opacity-10' : 'bg-wild-sand'"
        >
          <UButton
            @click="opened = index"
            color="gray"
            variant="ghost"
            class="border-none p-0 hover:bg-wild-sand hover:bg-opacity-0 w-full justify-between"
            :ui="{ rounded: 'rounded-xl' }"
          >
            <div>
              <span class="text-black text-base font-semibold">{{
                item?.[locale === "ru" ? "question" : `question_${locale}`]
              }}</span>
            </div>
            <template #trailing>
              <div class="flex justify-end">
                <img
                  src="~assets/svg/common/plus-green.svg"
                  alt="plus"
                  class="transform transition-transform duration-200"
                  :class="[open && 'rotate-[135deg]']"
                />
              </div>
            </template>
          </UButton>
          <div v-if="open">
            <p class="text-base font-normal text-heavy-metal mt-1">
              {{ item?.[locale === "ru" ? "answer" : `answer_${locale}`] }}
            </p>
          </div>
        </div>
      </template>
      <template #item="{ item }"> <p></p> </template>
    </UAccordion>
  </div>
</template>
