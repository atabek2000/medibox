<script setup>
import { MainCheckboxConfig } from "~/composables/ui/useConfig";
const { locale } = useI18n();
const props = defineProps({
  product: {
    type: Object,
    default: {},
  },
  selected: {
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
  delivery_method: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["onSelectOne", "onChangeCount"]);

const count = ref(1);

const increment = (e) => {
  e.stopPropagation();
  count.value = count.value + 1;
  emits("onChangeCount", { id: props.product.id, count: count.value });
};
const decrement = (e) => {
  e.stopPropagation();
  if (count.value < 2) {
    return;
  }
  count.value = count.value - 1;
  emits("onChangeCount", { id: props.product.id, count: count.value });
};

const onChangePrice = (e) => {
  if (count.value < 1) count.value = 1;
  emits("onChangeCount", { id: props.product.id, count: count.value });
};

const onSelectOne = () => {
  emits("onSelectOne", props.product.id);
};
</script>
<template>
  <div
    class="basket-product-card flex gap-2 p-4 cursor-pointer"
    :class="active ? ' bg-emerald-300' : ''"
  >
    <UCheckbox
      :ui="MainCheckboxConfig()"
      @change="onSelectOne"
      :modelValue="selected"
      @click="(e) => e.stopPropagation()"
    />

    <div class="flex gap-2 w-full">
      <img
        :src="
          product.basket.medicine?.photo && product.basket.medicine?.photo[0]
            ? product.basket.medicine?.photo[0]
            : '/common/avatar.png'
        "
        alt="medicine"
        class="max-w-28 rounded-xl w-[100px] h-[80px] object-cover"
      />
      <div class="flex flex-col justify-between w-full">
        <div class="flex justify-between">
          <div>
            <p class="font-semibold text-base">
              {{
                product.basket.medicine?.[
                  locale === "ru" ? "name" : `name_${locale}`
                ]
              }}
            </p>
            <p class="font-normal text-sm text-japanese-laurel">
              {{
                $t("content.from", {
                  seller:
                    product.basket?.user?.[
                      locale === "ru"
                        ? "organisation_name"
                        : `organisation_name_${locale}`
                    ],
                })
              }}
            </p>
          </div>
          <p class="text-xs text-valencia">
            {{
              !delivery_method && selected ? $t("content.select_delivery") : ""
            }}
          </p>
        </div>
        <div class="flex justify-between items-center">
          <p class="font-bold text-base">
            <span
              :class="
                product.basket?.is_promotion ? 'line-through text-pumice' : ''
              "
              >{{ priceFormat(product.basket?.price) }}</span
            >
            <span v-if="product.basket?.is_promotion" class="ms-2">{{
              priceFormat(product.basket?.promotion)
            }}</span>
          </p>
          <div v-if="selected" class="flex items-center">
            <!-- <UButton variant="link" class="p-0" @click="decrement">
              <img src="~assets/svg/basket/minus-icon.svg" alt="minus" />
            </UButton>
            <p class="font-normal text-base px-[14px]">{{ count }}</p>
            <UButton variant="link" class="p-0" @click="increment">
              <img src="~assets/svg/basket/plus-icon.svg" alt="plus" />
            </UButton> -->
            <UInput
              class="w-24"
              v-model="count"
              type="number"
              min="1"
              @change="onChangePrice"
            >
              <template #trailing>
                <img src="~assets/svg/common/input-pen.svg" alt="" />
              </template>
            </UInput>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
