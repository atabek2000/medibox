export default () => {
  const default_filter_temp = {
    // page: 1,
    per_page: 10,
    sort: undefined,
    city_id: undefined,
    search: undefined,
    category_id: undefined,
    // type: "sale",
  };

  const useFilter = () => useState("page_filters", () => default_filter_temp);

  const setFilters = (key, value) => {
    const filters = useFilter();
    filters.value[key] = value;
    // filters.value.page = 1;
  };

  const setPage = (page) => {
    const filters = useFilter();
    // filters.value.page = page;
  };

  const resetFilters = () => {
    const filters = useFilter();
    filters.value.page = 1;
    filters.value.city_id = undefined;
    filters.value.sort = undefined;
    filters.value.search = undefined;
    filters.value.type = undefined;
    filters.value.duration = undefined;
    filters.value.actual = undefined;
    filters.value.category_id = undefined;
    filters.value.sub_organisation_type_id = undefined;
    filters.value.purpose_id = undefined;
    filters.value.dentistry_type_id = undefined;
  };

  return { useFilter, setFilters, resetFilters, setPage };
};
