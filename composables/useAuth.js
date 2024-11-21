export default () => {
  const { $i18n } = useNuxtApp();

  const runtimeConfig = useRuntimeConfig();
  const router = useRouter();
  const toast = useToast();
  const cookie_user = useCookie("user");
  const cookie_jwt = useCookie("jwt");
  const cookie_lang = useCookie("lang");
  const cookie_city = useCookie("city");
  const { fetchBasketCount, resetBasketCount } = useDict();

  const { stopLoading, startLoading } = useLoader();

  const useAccessToken = () =>
    useState("access_token", () => localStorage.getItem("access_token") ?? "");
  const useRefreshToken = () =>
    useState(
      "refresh_token",
      () => localStorage.getItem("refresh_token") ?? ""
    );
  const useAuthUser = () =>
    useState("auth_user", () => localStorage.getItem("auth_user") ?? "");
  const useAuthLoading = () => useState("auth_loading", () => false);
  const useAuthExist = () => useState("auth_exist", () => false);
  const useAuthModal = () => useState("auth_modal", () => "login");
  const useAuthModalOpen = () => useState("auth_modal_open", () => false);
  const useResetToken = () => useState("reset_token", () => false);
  const useResetPhone = () => useState("reset_phone", () => false);

  const setAccessToken = (newAccess) => {
    const authToken = useAccessToken();
    authToken.value = newAccess;
    localStorage.setItem("access_token", newAccess);
  };

  const setRefreshToken = (newRefresh) => {
    const authToken = useRefreshToken();
    authToken.value = newRefresh;
    localStorage.setItem("refresh_token", newRefresh);
  };

  const setUser = (newUser) => {
    const authUser = useAuthUser();
    authUser.value = newUser;
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  };

  const setIsAuthLoading = (value) => {
    const authLoading = useAuthLoading();
    authLoading.value = value;
  };

  const setAuthExist = (value) => {
    const authExist = useAuthExist();
    authExist.value = value;
  };

  const setAuthModal = (value) => {
    const authModal = useAuthModal();
    authModal.value = value;
  };

  const setAuthModalOpen = (value) => {
    const authModal = useAuthModalOpen();
    authModal.value = value;
  };

  const fetchUser = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await useFetchApi("users/show/" + cookie_user.value.id);
        setUser(user.data);
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  };

  // обновить токен
  const refreshJWT = () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (localStorage.refresh_token) {
          const tokens = await $fetch(
            runtimeConfig.public.API_URL + "auth/jwt/refresh/",
            {
              method: "POST",
              body: {
                refresh: localStorage.refresh_token,
              },
            }
          ).catch(() => {
            resolve(false);
          });

          setAccessToken(tokens.access);
          setRefreshToken(tokens.refresh);
          await fetchUser();
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  // проверка токена
  const checkJWT = async () => {
    if (localStorage.getItem("access_token")) {
      return true;
    } else {
      return false;
    }
  };

  const initAuth = () => {
    return new Promise(async (resolve, reject) => {
      setIsAuthLoading(true);
      try {
        const token_valid = await checkJWT();
        if (!token_valid) {
          setAccessToken("");
          setRefreshToken("");
          setUser("");
          setAuthExist(false);
        } else {
          await fetchUser();
          const authUser = useAuthUser();
          authUser.value = JSON.parse(localStorage.getItem("auth_user"));
          setAuthExist(true);
          cookie_user.value = {
            id: authUser?.value?.id,
            role_id: authUser?.value?.role?.id,
            type: authUser?.value?.type,
            status: authUser?.value?.status,
          };

          cookie_jwt.value = authUser?.value?.access_token;
          cookie_lang.value = authUser?.value?.lang;
          cookie_city.value = authUser?.value?.city;
        }

        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  };

  const login = ({ phone, password }) => {
    return new Promise(async (resolve, reject) => {
      try {
        startLoading();
        const data = await $fetch(runtimeConfig.public.API_URL + "auth/login", {
          method: "POST",
          body: {
            phone,
            password,
          },
          async onResponseError({ request, response, options }) {
            stopLoading();
            if (response._data?.message) {
              toast.add({
                title: $i18n.t("toast.error"),
                color: "red",
                description: response._data?.message,
              });
            } else {
              toast.add({
                title: $i18n.t("toast.error"),
                color: "red",
                description: $i18n.t("toast.error_on_server"),
              });
            }
          },
        });

        setAccessToken(data?.data.access_token);
        setUser(data?.data);
        cookie_user.value = {
          id: data?.data?.id,
          role_id: data?.data?.role?.id,
          type: data?.data?.type,
          status: data?.data?.status,
        };
        cookie_jwt.value = data?.data?.access_token;
        cookie_lang.value = data?.data?.lang;
        cookie_city.value = data?.data?.city;
        resolve(true);
        setAuthExist(true);
        setAuthModalOpen(false);
        if (data?.data?.access_token)
          await fetchBasketCount(data?.data?.access_token);
        stopLoading();
        // router.push("/");
      } catch (error) {
        stopLoading();
        reject(error);
      }
    });
  };

  const resetPassword = (contact) => {
    return new Promise(async (resolve, reject) => {
      try {
        useResetPhone().value = contact;
        startLoading();
        const data = await $fetch(
          runtimeConfig.public.API_URL + "reset/reset-password",
          {
            method: "POST",
            body: {
              phone: contact,
              // email: contact,
            },
            async onResponseError({ request, response, options }) {
              stopLoading();
              if (response._data?.message) {
                toast.add({
                  title: $i18n.t("toast.error"),
                  color: "red",
                  description: response._data?.message,
                });
              } else {
                toast.add({
                  title: $i18n.t("toast.error"),
                  color: "red",
                  description: $i18n.t("toast.error_on_server"),
                });
              }
            },
          }
        );
        stopLoading();
        if (data?.data?.token) {
          useResetToken().value = data?.data?.token;
          setAuthModal("code_confirm");
        } else {
          toast.add({
            title: $i18n.t("toast.error"),
            color: "red",
            description: $i18n.t("toast.error_on_server"),
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  const verifyResetCode = (code) => {
    return new Promise(async (resolve, reject) => {
      try {
        startLoading();
        const data = await $fetch(
          runtimeConfig.public.API_URL + "reset/verify-reset-code",
          {
            method: "POST",
            body: {
              code,
              token: useResetToken().value,
            },
            async onResponseError({ request, response, options }) {
              stopLoading();
              if (response._data?.message) {
                toast.add({
                  title: $i18n.t("toast.error"),
                  color: "red",
                  description: response._data?.message,
                });
              } else {
                toast.add({
                  title: $i18n.t("toast.error"),
                  color: "red",
                  description: $i18n.t("toast.error_on_server"),
                });
              }
            },
          }
        );
        stopLoading();
        if (data?.data?.token) {
          useResetToken().value = data?.data?.token;
          setAuthModal("reset_pass");
        } else {
          toast.add({
            title: $i18n.t("toast.error"),
            color: "red",
            description: $i18n.t("toast.error_on_server"),
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  const changePassword = (password_confirmation) => {
    return new Promise(async (resolve, reject) => {
      try {
        startLoading();
        const data = await $fetch(
          runtimeConfig.public.API_URL + "reset/change-password",
          {
            method: "POST",
            body: {
              password: password_confirmation,
              token: useResetToken().value,
            },
            async onResponseError({ request, response, options }) {
              stopLoading();
              if (response._data?.message) {
                toast.add({
                  title: $i18n.t("toast.error"),
                  color: "red",
                  description: response._data?.message,
                });
              } else {
                toast.add({
                  title: $i18n.t("toast.error"),
                  color: "red",
                  description: $i18n.t("toast.error_on_server"),
                });
              }
            },
          }
        );
        stopLoading();
        if (data) {
          toast.add({
            title: $i18n.t("toast.success"),
            description: $i18n.t("toast.success_saved"),
          });
          setAuthModal("login");
        } else {
          toast.add({
            title: $i18n.t("toast.error"),
            color: "red",
            description: $i18n.t("toast.error_on_server"),
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  const logout = () => {
    return new Promise(async (resolve, reject) => {
      try {
        setUser({});
        setAuthExist(false);
        setAccessToken("");
        cookie_user.value = {};
        cookie_jwt.value = "";
        // useBasketCount().value = 0;
        resetBasketCount();
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  };

  const registration = async (user) => {
    startLoading();
    const data = await $fetch(runtimeConfig.public.API_URL + "auth/register/", {
      method: "POST",
      body: user,
      async onResponseError({ request, response, options }) {
        stopLoading();
        if (response._data?.message) {
          toast.add({
            title: $i18n.t("toast.error"),
            color: "red",
            description: response._data?.message,
          });
        } else {
          toast.add({
            title: $i18n.t("toast.error"),
            color: "red",
            description: $i18n.t("toast.error_on_server"),
          });
        }
      },
      async onResponse({ request, response, options }) {
        stopLoading();
        if (response.ok) {
          await login({ phone: user.phone, password: user.password });
        }
      },
    });
  };

  const entityRegistration = async (user) => {
    startLoading();
    const data = await $fetch(
      runtimeConfig.public.API_URL + "entity/register/",
      {
        method: "POST",
        body: user,
        async onResponseError({ request, response, options }) {
          stopLoading();
          if (response._data?.message) {
            toast.add({
              title: $i18n.t("toast.error"),
              color: "red",
              description: response._data?.message,
            });
          } else {
            toast.add({
              title: $i18n.t("toast.error"),
              color: "red",
              description: $i18n.t("toast.error_on_server"),
            });
          }
        },
        async onResponse({ request, response, options }) {
          stopLoading();
          if (response.ok) {
            await login({ phone: user.phone, password: user.password });
          }
        },
      }
    );
  };

  const profileEdit = async (user) => {
    startLoading();
    const data = await useFetchApi("auth/edit/", {
      method: "POST",
      body: user,
      async onResponseError({ request, response, options }) {
        stopLoading();
        if (response._data?.message) {
          toast.add({
            title: $i18n.t("toast.error"),
            color: "red",
            description: response._data?.message,
          });
        } else {
          toast.add({
            title: $i18n.t("toast.error"),
            color: "red",
            description: $i18n.t("toast.error_on_server"),
          });
        }
      },
      async onResponse({ request, response, options }) {
        stopLoading();
        if (response.ok) {
          await fetchUser();
          toast.add({
            title: $i18n.t("toast.success"),
            description: $i18n.t("toast.success_saved"),
          });
        }
      },
    });
    // const data = await $fetch(runtimeConfig.public.API_URL + "auth/edit/", );
  };

  const profileEditEntity = async (user) => {
    startLoading();
    const data = await useFetchApi("entity/edit/", {
      method: "POST",
      body: user,
      async onResponseError({ request, response, options }) {
        stopLoading();
        if (response._data?.message) {
          toast.add({
            title: $i18n.t("toast.error"),
            color: "red",
            description: response._data?.message,
          });
        } else {
          toast.add({
            title: $i18n.t("toast.error"),
            color: "red",
            description: $i18n.t("toast.error_on_server"),
          });
        }
      },
      async onResponse({ request, response, options }) {
        stopLoading();
        if (response.ok) {
          await fetchUser();
          toast.add({
            title: $i18n.t("toast.success"),
            description: $i18n.t("toast.success_saved"),
          });
        }
      },
    });
    // const data = await $fetch(runtimeConfig.public.API_URL + "auth/edit/", );
  };

  const deleteUser = async () => {
    startLoading();
    const data = await useFetchApi("auth/delete/", {
      method: "DELETE",
      async onResponseError({ request, response, options }) {
        stopLoading();
        if (response._data?.message) {
          toast.add({
            title: $i18n.t("toast.error"),
            color: "red",
            description: response._data?.message,
          });
        } else {
          toast.add({
            title: $i18n.t("toast.error"),
            color: "red",
            description: $i18n.t("toast.error_on_server"),
          });
        }
      },
      async onResponse({ request, response, options }) {
        stopLoading();
        if (response.ok) {
          setUser({});
          setAuthExist(false);
          setAccessToken("");
          cookie_user.value = {};
          cookie_jwt.value = "";

          toast.add({
            title: $i18n.t("toast.success"),
            description: $i18n.t("toast.success_deleted"),
          });
        }
      },
    });
  };

  return {
    useAccessToken,
    useAuthLoading,
    useRefreshToken,
    useAuthUser,
    login,
    fetchUser,
    setIsAuthLoading,
    initAuth,
    checkJWT,
    logout,
    setAuthExist,
    useAuthExist,
    useAuthModal,
    setAuthModal,
    registration,
    setAuthModalOpen,
    useAuthModalOpen,
    entityRegistration,
    profileEdit,
    profileEditEntity,
    deleteUser,
    resetPassword,
    useResetToken,
    changePassword,
    verifyResetCode,
    useResetPhone,
  };
};
