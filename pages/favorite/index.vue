<script setup>
import { MainButtonConfig, MainPagination } from "~/composables/ui/useConfig";
const { useFilter } = usePageFilter();
const { startLoading, stopLoading } = useLoader();
const { fetchBasketCount } = useDict();
const cookie_jwt = useCookie("jwt");
const { t } = useI18n();
useHead({
  title: t("bread_crumb.favorite"),
});
const page = ref(1);
const refresh = () => {
  page.value = 1;
  refresh_data();
};

const fav_type = ref("medicine");
const {
  data,
  refresh: refresh_data,
  pending,
} = await useAsyncData(
  () =>
    $fetch(useRuntimeConfig().public.API_URL + "favorites/", {
      headers: {
        Authorization: `Bearer ${cookie_jwt.value}`,
      },
      params: {
        type: fav_type.value,
        page: page.value,
      },
    }),
  {
    watch: [fav_type, page],
  }
);

const { data: count_data } = await useAsyncData(() =>
  $fetch(useRuntimeConfig().public.API_URL + "favorites/", {
    headers: {
      Authorization: `Bearer ${cookie_jwt.value}`,
    },
  })
);

const connectLinks = {
  pharmacy: "",
  equipment: "",
  specialist: "",
  premise: "",
  medicine: "",
  service: "",
};

const toBasket = async (is_in_basket, id) => {
  if (is_in_basket) {
    useRouter().push("/basket");
  } else {
    startLoading();
    await useFetchApi(`medicines/basket-medicine/${id}`, {
      method: "POST",
      async onResponse() {
        stopLoading();
        fetchBasketCount();
        useRouter().push("/basket");
      },
    });
  }
};
</script>

<template>
  <div class="basket-page bg-white main-container pt-10 pb-16">
    <div
      v-if="count_data?.data?.length > 0"
      class="basket-block flex flex-wrap md:flex-nowrap gap-10"
    >
      <div class="w-full md:w-1/4">
        <CommonUiBreadCrumb
          class=""
          :links="[
            { label: $t('bread_crumb.main'), to: '/' },
            { label: $t('bread_crumb.favorite') },
          ]"
        />
        <FavoriteSidebar class="mt-10" v-model="fav_type" @refresh="refresh" />
      </div>
      <div
        v-if="data.data && data.data?.length > 0 && !pending"
        class="w-full md:w-3/4 flex flex-wrap gap-2 md:gap-6"
      >
        <div
          v-for="favorite in data?.data"
          :key="favorite?.favorite?.id"
          class="w-[48%] md:w-fit flex flex-col justify-between"
        >
          <PharmacyCard
            v-if="favorite.favorite?.type_data == 'pharmacy'"
            :product="favorite?.favorite?.user"
            @refresh="refresh"
          />
          <EquipmentCard
            v-if="fav_type == 'equipment'"
            :product="favorite?.favorite"
            @refresh="refresh"
          />

          <RoomCard
            v-if="favorite.favorite?.type_data == 'premise'"
            :product="favorite?.favorite"
            @refresh="refresh"
            class="w-full"
          />
          <ProductCard
            v-if="favorite.favorite?.type_data == 'medicine'"
            :product="favorite?.favorite"
            @refresh="refresh"
          />
          <ServiceCard
            v-if="favorite.favorite?.type_data == 'service'"
            :product="favorite?.favorite"
            @refresh="refresh"
          />
          <FavoriteCardOrganisation
            v-if="favorite.favorite?.type_data == 'entity'"
            :product="favorite?.favorite"
            @refresh="refresh"
          />
          <div class="flex flex-wrap md:flex-nowrap gap-2 mt-3">
            <div
              :class="`${
                favorite.favorite?.type_data == 'medicine'
                  ? 'w-full md:w-1/2'
                  : 'w-full'
              }`"
            >
              <CommonUiModalConnect
                v-if="favorite.favorite?.type_data == 'premise'"
                :phone="changePhoneMask(`7${favorite.favorite?.user.phone}`)"
                :phones="favorite.favorite?.user?.phones"
                :whatsapp_phone="favorite.favorite?.user?.whatsapp_phone"
                :url="``"
              />
              <CommonUiModalConnect
                v-else-if="favorite.favorite?.type_data == 'medicine'"
                :phone="changePhoneMask(`7${favorite.favorite?.user.phone}`)"
                :phones="favorite.favorite?.user?.phones"
                :whatsapp_phone="favorite.favorite?.user?.whatsapp_phone"
                :url="`entity/complaint-user/${favorite.favorite?.user?.id}`"
              />
              <CommonUiModalConnect
                v-else-if="favorite.favorite?.type_data == 'service'"
                :phone="changePhoneMask(`7${favorite.favorite?.user.phone}`)"
                :phones="favorite.favorite?.user?.phones"
                :whatsapp_phone="favorite.favorite?.user?.whatsapp_phone"
                :url="``"
              />
            </div>
            <div
              v-if="favorite.favorite?.type_data == 'medicine'"
              class="w-full md:w-1/2"
            >
              <UButton
                @click="
                  toBasket(
                    favorite?.favorite?.is_in_basket,
                    favorite?.favorite?.id
                  )
                "
                :ui="MainButtonConfig()"
                class="w-full flex justify-center text-sm"
                >{{ $t("button.to_basket") }}</UButton
              >
            </div>
          </div>
        </div>
        <div class="flex justify-center w-full mt-10">
          <UPagination
            v-model="page"
            :page-count="useFilter().value.per_page"
            :total="data?.meta?.total"
            :ui="MainPagination()"
          />
        </div>
      </div>
      <div
        v-else-if="pending"
        class="pharmacies_block flex flex-wrap gap-3 md:gap-6 mt-5"
      >
        <SkeletonCard v-for="i in 4" :key="i" class="w-[48%] md:w-[276px]" />
      </div>
      <CommonUiSpin v-else :pending="pending" class="m-auto" />
    </div>
    <div v-else>
      <FavoriteNotFound />
    </div>
  </div>
</template>

<style scoped>
.basket-product-card + .basket-product-card {
  border-top: 1px solid #f7f7f7;
}
</style>
