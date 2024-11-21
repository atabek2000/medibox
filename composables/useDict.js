export default () => {
  const runtimeConfig = useRuntimeConfig();
  const { $i18n } = useNuxtApp();
  const { t } = $i18n;
  const cookie_jwt = useCookie("jwt");

  const useCities = () =>
    useState("cities", () => JSON.parse(localStorage.getItem("cities")) ?? []);
  const useMetadata = () =>
    useState(
      "metadatas",
      () => JSON.parse(localStorage.getItem("metadatas")) ?? []
    );
  const useSpecialities = () =>
    useState(
      "specialities",
      () => JSON.parse(localStorage.getItem("specialities")) ?? []
    );
  const useDicts = () =>
    useState(
      "dictionary",
      () => JSON.parse(localStorage.getItem("dictionary")) ?? {}
    );
  const useBasketCount = () => useState("basket_count", () => 0);
  const useRoles = () =>
    useState("roles", () => [
      {
        id: 1,
        value: "admin",
        name: "Админ",
        name_en: "Админ",
        name_kk: "Админ",
      },
      {
        id: 2,
        value: "specialist",
        name: "Специалист",
        name_en: "Specialist",
        name_kk: "Маман",
      },
      {
        id: 3,
        value: "seller",
        name: "Продавец",
        name_en: "Seller",
        name_kk: "Сатушы",
      },
      {
        id: 4,
        value: "Health Organization",
        name: "Организация здравоохранения",
        name_en: "Health Organization",
        name_kk: "Денсаулық сақтау ұйымы",
      },
    ]);

  const useGender = () =>
    useState("genders", () => [
      {
        value: "woman",
        label: t("fields.gender.female"),
      },
      {
        value: "man",
        label: t("fields.gender.male"),
      },
    ]);

  const useEquipmentType = () =>
    useState("equipment_type", () => [
      {
        value: "sale",
        label: t("filter.sale"),
      },
      {
        value: "rent",
        label: t("filter.rent"),
      },
    ]);

  const useDuration = () =>
    useState("duration", () => [
      {
        value: "daily",
        label: t("fields.duration.daily"),
      },
      {
        value: "monthly",
        label: t("fields.duration.monthly"),
      },
      {
        value: "long_term",
        label: t("fields.duration.long_term"),
      },
    ]);

  const setDicts = (value) => {
    const dicts = useDicts();
    dicts.value = value;
    localStorage.setItem("dictionary", JSON.stringify(value));
  };

  const setCities = (value) => {
    const cities = useCities();
    cities.value = value;
    localStorage.setItem("cities", JSON.stringify(value));
  };

  const setMetadata = (value) => {
    const cities = useMetadata();
    cities.value = value;
    localStorage.setItem("metadatas", JSON.stringify(value));
  };

  const fetchBasketCount = (token) => {
    return new Promise(async (resolve, reject) => {
      try {
        const bc = await $fetch(
          runtimeConfig.public.API_URL + "basket/count-items/",
          {
            headers: {
              Authorization: `Bearer ${token ?? cookie_jwt.value}`,
            },
          }
        ).catch(() => {
          resolve(false);
        });

        const basket_count = useBasketCount();
        basket_count.value = Number(bc.data ?? 0);
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  };

  const resetBasketCount = () => {
    const bc = useBasketCount();
    bc.value = 0;
  };

  const setSpecialities = (value) => {
    const specs = useSpecialities();
    specs.value = value;
    localStorage.setItem("specialities", JSON.stringify(value));
  };

  const fetchCities = () => {
    return new Promise(async (resolve, reject) => {
      try {
        // if (!useCities().value) {
        const cities = await $fetch(
          runtimeConfig.public.API_URL + "cities/"
        ).catch(() => {
          resolve(false);
        });
        setCities(cities.data);
        // }
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  };

  const fetchMetadata = () => {
    return new Promise(async (resolve, reject) => {
      try {
        // if (!useCities().value) {
        const cities = await $fetch(
          runtimeConfig.public.API_URL + "metadata/"
        ).catch(() => {
          resolve(false);
        });
        console.log(cities.data);
        
        setMetadata(cities.data);
        // }
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  };

  const fetchDictionary = () => {
    return new Promise(async (resolve, reject) => {
      try {
        // if (!useDicts().value) {
        const dicts = await $fetch(
          runtimeConfig.public.API_URL + "dictionary/"
        ).catch(() => {
          resolve(false);
        });
        setDicts(dicts.data);
        // }
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  };

  const fetchSpecialities = () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!useCities().value) {
          const cities = await $fetch(
            runtimeConfig.public.API_URL + "categories/"
          ).catch(() => {
            resolve(false);
          });
          setSpecialities(cities.data);
        }
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  };

  const initDicts = async () => {
    await fetchCities();
    await fetchDictionary();
    await fetchBasketCount();
    await fetchMetadata();
    // await fetchSpecialities();
  };

  return {
    useCities,
    useMetadata,
    useRoles,
    useSpecialities,
    useGender,
    initDicts,
    useDicts,
    useDuration,
    useEquipmentType,
    fetchBasketCount,
    useBasketCount,
    resetBasketCount,
  };
};
