export default defineNuxtRouteMiddleware(async (to, from) => {
  const router = useRouter();
  const cookie_user = useCookie("user");
  const cookie_city = useCookie("city");

  const { resetFilters, setFilters } = usePageFilter();

  const { setAuthModal, setAuthModalOpen } = useAuth();

  resetFilters();
  setFilters("city_id", cookie_city.value?.id);
  if (
    !cookie_user?.value?.id &&
    (to.path.includes("profile") ||
      to.path.includes("favorite") ||
      to.path.includes("basket"))
  ) {
    setAuthModal("login");
    setAuthModalOpen(true);
    router.push("/");
  }
});
