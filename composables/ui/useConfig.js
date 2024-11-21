export function MainButtonConfig() {
  return {
    font: "font-semibold",
    rounded: "rounded-2xl",
    padding: {
      "2xs": "px-2 py-1",
      xs: "px-2.5 py-1.5",
      sm: "px-2.5 py-3",
      md: "px-3 py-2",
      lg: "px-3.5 py-2.5",
      xl: "px-3.5 py-2.5",
    },
    size: {
      "2xs": "text-md",
      xs: "text-xs",
      sm: "text-md",
      md: "text-md",
      lg: "text-md",
      xl: "text-md",
    },
    variant: {
      outline:
        "ring-1 ring-inset ring-current text-{color}-500 dark:text-{color}-400 hover:bg-{color}-50 disabled:bg-transparent dark:hover:bg-{color}-950 dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400",
    },
  };
}

export function WhiteButtonConfig() {
  return {
    font: "font-semibold",
    rounded: "rounded-2xl",
    padding: {
      "2xs": "px-2 py-1",
      xs: "px-2.5 py-1.5",
      sm: "px-2.5 py-3",
      md: "px-3 py-2",
      lg: "px-3.5 py-2.5",
      xl: "px-3.5 py-2.5",
    },
    size: {
      "2xs": "text-md",
      xs: "text-xs",
      sm: "text-md",
      md: "text-md",
      lg: "text-md",
      xl: "text-md",
    },
    color: {
      primary: {
        solid:
          "shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 text-gray-900 dark:text-white bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
      },
    },
    variant: {
      outline:
        "ring-1 ring-inset ring-current text-{color}-500 dark:text-{color}-400 hover:bg-{color}-50 disabled:bg-transparent dark:hover:bg-{color}-950 dark:disabled:bg-transparent focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400",
    },
  };
}

export function TransparentButtonConfig() {
  return {
    base: "flex justify-center",
    font: "font-semibold",
    rounded: "rounded-2xl",
    padding: {
      "2xs": "px-2 py-1",
      xs: "px-2.5 py-1.5",
      sm: "px-2.5 py-3",
      md: "px-3 py-2",
      lg: "px-3.5 py-2.5",
      xl: "px-3.5 py-2.5",
    },
    size: {
      "2xs": "text-md",
      xs: "text-xs",
      sm: "text-md",
      md: "text-md",
      lg: "text-md",
      xl: "text-md",
    },
    color: {
      primary: {
        solid:
          "shadow-sm ring-none  dark:ring-gray-700 text-japanese-laurel dark:text-white bg-emerald-200 hover:bg-emerald-300 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
        ghost:
          "text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
      },
    },
  };
}

export function ResetButtonConfig() {
  return {
    font: "font-semibold",
    rounded: "rounded-2xl",
    padding: {
      "2xs": "px-2 py-1",
      xs: "px-2.5 py-1.5",
      sm: "px-2.5 py-3",
      md: "px-3 py-2",
      lg: "px-3.5 py-2.5",
      xl: "px-3.5 py-2.5",
    },
    size: {
      "2xs": "text-md",
      xs: "text-xs",
      sm: "text-md",
      md: "text-md",
      lg: "text-md",
      xl: "text-md",
    },
    color: {
      primary: {
        solid:
          "shadow-sm ring-1 ring-inset ring-valencia-600 dark:ring-gray-700 text-valencia-600 dark:text-white bg-white hover:bg-gray-50 disabled:bg-white dark:bg-gray-900 dark:hover:bg-gray-800/50 dark:disabled:bg-gray-900 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
        ghost:
          "text-red-900 dark:text-white hover:bg-white dark:hover:bg-gray-900 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
      },
    },
  };
}

export function ProfileSidebarButtonConfig() {
  return {
    font: "font-normal",
    padding: {
      "2xs": "px-2 py-1",
      xs: "px-2.5 py-1.5",
      sm: "px-1 py-1 ps-2",
      md: "px-1 py-1 ps-2",
      lg: "px-1 py-1 ps-2",
      xl: "px-1 py-1 ps-2",
    },
    size: {
      "2xs": "text-base",
      xs: "text-xs",
      sm: "text-base",
      md: "text-base",
      lg: "text-base",
      xl: "text-base",
    },
    gap: {
      "2xs": "gap-x-1",
      xs: "gap-x-2",
      sm: "gap-x-2",
      md: "gap-x-2",
      lg: "gap-x-2.5",
      xl: "gap-x-2.5",
    },
    color: {
      primary: {
        ghost:
          "text-black dark:text-white hover:bg-white dark:hover:bg-gray-900 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
      },
    },
  };
}
export function ProfileSidebarRedButtonConfig() {
  return {
    font: "font-normal",
    padding: {
      "2xs": "px-2 py-1",
      xs: "px-2.5 py-1.5",
      sm: "px-1 py-1 ps-2",
      md: "px-1 py-1 ps-2",
      lg: "px-1 py-1 ps-2",
      xl: "px-1 py-1 ps-2",
    },
    size: {
      "2xs": "text-base",
      xs: "text-xs",
      sm: "text-base",
      md: "text-base",
      lg: "text-base",
      xl: "text-base",
    },
    gap: {
      "2xs": "gap-x-1",
      xs: "gap-x-2",
      sm: "gap-x-2",
      md: "gap-x-2",
      lg: "gap-x-2.5",
      xl: "gap-x-2.5",
    },
    color: {
      primary: {
        ghost:
          "text-coral-red dark:text-white hover:bg-white dark:hover:bg-gray-900 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400",
      },
    },
  };
}

export function MainFormGroupConfig() {
  return {
    label: {
      wrapper: "flex content-center items-center justify-between",
      base: "block font-normal text-gray-700 dark:text-gray-200 w-full",
      required:
        "after:content-['*'] after:ms-0.5 after:text-red-500 dark:after:text-red-400",
    },
    size: {
      "2xs": "text-xs",
      xs: "text-xs",
      sm: "text-xs",
      md: "text-xs",
      lg: "text-xs",
      xl: "text-base",
    },
  };
}

export function MainInputConfig() {
  return {
    rounded: "rounded-2xl",
    icon: { trailing: { pointer: "" } },
    padding: {
      "2xs": "px-2 py-1",
      xs: "px-4 py-1.5",
      sm: "px-4 py-3",
      md: "px-3 py-2",
      lg: "px-3.5 py-2.5",
      xl: "px-3.5 py-2.5",
    },
    color: {
      white: {
        outline:
          "shadow-sm bg-wild-sand dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400",
      },
    },
    variant: {
      outline:
        "shadow-sm bg-wild-sand text-gray-900 dark:text-white ring-1 ring-inset ring-{color}-500 dark:ring-{color}-400 focus:ring-2 focus:ring-{color}-500 dark:focus:ring-{color}-400",
      none: "bg-transparent focus:ring-0 focus:shadow-none",
    },
    leading: {
      padding: {
        "2xs": "ps-7",
        xs: "ps-8",
        sm: "ps-10",
        md: "ps-10",
        lg: "ps-11",
        xl: "ps-12",
      },
    },
    trailing: {
      padding: {
        "2xs": "pe-7",
        xs: "pe-8",
        sm: "pe-16",
        md: "pe-16",
        lg: "pe-16",
        xl: "pe-12",
      },
    },

    default: {
      size: "sm",
      color: "white",
      variant: "none",
      loadingIcon: "i-heroicons-arrow-path-20-solid",
    },
  };
}

export function MainBreadCrumbConfig() {
  return {
    li: "text-pumice font-normal",
    active: "text-black font-normal",
    base: "font-normal",
  };
}

export function SearchInputConfig() {
  return {
    rounded: "rounded-2xl",
    placeholder: "placeholder-gray-400 dark:placeholder-gray-500",
    padding: {
      "2xs": "px-2 py-1",
      xs: "px-4 py-1.5",
      sm: "px-4 py-3",
      md: "px-3 py-2",
      lg: "px-3.5 py-2.5",
      xl: "px-3.5 py-2.5",
    },
    color: {
      white: {
        outline:
          "shadow-sm bg-[#0000000D] dark:bg-gray-900 text-gray-900 dark:text-white ring-0 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400",
      },
    },
    variant: {
      outline:
        "shadow-sm bg-wild-sand text-gray-900 dark:text-white ring-0  dark:ring-{color}-400 focus:ring-none focus:ring-none dark:focus:ring-{color}-400",
      none: "bg-transparent focus:ring-0 focus:shadow-none",
    },
    icon: {
      leading: {
        wrapper: "absolute inset-y-0 start-0 w-full",
        pointer: "pointer-events-none focus:hidden ",
        padding: {
          "2xs": "px-2",
          xs: "px-2.5",
          sm: "px-4",
          md: "px-4",
          lg: "px-3.5",
          xl: "px-3.5",
        },
      },
    },

    default: {
      size: "sm",
      color: "white",
      variant: "none",
    },
  };
}

export function MainBadgeConfig() {
  return {
    base: "inline-flex items-center mr-2 mb-2 cursor-pointer",
    font: "font-normal",
    rounded: "rounded-xl",
    size: {
      xs: "text-xs px-1.5 py-0.5",
      sm: "text-sm px-3 py-2",
      md: "text-sm px-3 py-2",
      lg: "text-sm px-3 py-2",
    },
    color: {
      primary: {
        solid: "ring-1 ring-inset ring-wild-sand-600 bg-wild-sand",
      },
    },
  };
}
export function MainProductBadgeConfig() {
  return {
    base: "inline-flex items-center mr-2  cursor-pointer select-none",
    font: "font-normal",
    rounded: "rounded-xl",
    size: {
      xs: "text-xs px-1.5 py-0.5",
      sm: "text-sm px-3 py-2",
      md: "text-sm px-3 py-2",
      lg: "text-sm px-3 py-2",
    },
    color: {
      primary: {
        solid: "ring-1 ring-inset ring-wild-sand-600 bg-wild-sand",
      },
    },
  };
}

export function ActiveBadgeConfig() {
  return {
    base: "inline-flex items-center mb-2 mr-2 cursor-pointer",
    font: "font-normal",
    rounded: "rounded-xl",
    size: {
      xs: "text-xs px-1.5 py-0.5",
      sm: "text-sm px-3 py-2",
      md: "text-sm px-3 py-2",
      lg: "text-sm px-3 py-2",
    },
    color: {
      primary: {
        solid: "ring-1 ring-inset ring-japanese-laurel bg-emerald-200",
      },
    },
  };
}

export function ActiveProductBadgeConfig() {
  return {
    base: "inline-flex items-center  mr-2 cursor-pointer select-none",
    font: "font-normal",
    rounded: "rounded-xl",
    size: {
      xs: "text-xs px-1.5 py-0.5",
      sm: "text-sm px-3 py-2",
      md: "text-sm px-3 py-2",
      lg: "text-sm px-3 py-2",
    },
    color: {
      primary: {
        solid: "ring-1 ring-inset ring-japanese-laurel bg-emerald-200",
      },
    },
  };
}

export function MainTabConfig() {
  return {
    list: {
      background: "bg-white dark:bg-none",
      marker: {
        wrapper:
          "absolute top-[4px] left-[4px] duration-200 ease-out focus:outline-none",
        base: "w-full h-full",
        background: "bg-white dark:bg-gray-900",
        rounded: "rounded-md",
        shadow: "",
      },
      tab: {
        base: "relative inline-flex items-center justify-center flex-shrink-0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500 dark:ui-focus-visible:ring-primary-400 ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out border-solid border-b-2 border-heavy-metal",
        background: "",
        active: "text-heavy-metal dark:text-white",
        inactive:
          "text-gray-500 dark:text-gray-400 border-solid border-b-2 border-pumice",
        height: "h-8",
        padding: "px-3",
        size: "text-sm",
        font: "font-medium",
        rounded: "rounded-none",
        shadow: "",
      },
    },
  };
}

export function ProductWhiteTabConfig() {
  return {
    wrapper: "relative space-y-2 ",
    container: "relative w-full ",
    base: "focus:outline-none bg-white",
    list: {
      background: "bg-white dark:white",
      marker: {
        wrapper:
          "absolute top-[4px] left-[4px] duration-200 ease-out focus:outline-none",
        base: "w-full h-full",
        background: "bg-white dark:bg-gray-900",
        rounded: "rounded-md",
        shadow: "",
      },
      tab: {
        base: "bg-white relative inline-flex items-center justify-center flex-shrink-0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500 dark:ui-focus-visible:ring-primary-400 ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out border-solid border-b-2 border-heavy-metal",
        background: "bg-white",
        active: "text-heavy-metal dark:text-white",
        inactive:
          "bg-white text-black dark:text-gray-400 border-solid border-b-2 border-pumice font-normal",
        height: "h-8",
        padding: "px-3",
        size: "text-sm",
        font: "font-medium",
        rounded: "rounded-none",
        shadow: "",
      },
    },
  };
}

export function ProductTabConfig() {
  return {
    wrapper: "relative space-y-2 ",
    container: "relative w-full ",
    base: "focus:outline-none bg-wild-sand",
    list: {
      background: "bg-wild-sand dark:wild-sand",
      marker: {
        wrapper:
          "absolute top-[4px] left-[4px] duration-200 ease-out focus:outline-none",
        base: "w-full h-full",
        background: "bg-wild-sand dark:bg-gray-900",
        rounded: "rounded-md",
        shadow: "",
      },
      tab: {
        base: "bg-wild-sand relative inline-flex items-center justify-center flex-shrink-0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-500 dark:ui-focus-visible:ring-primary-400 ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out border-solid border-b-2 border-heavy-metal",
        background: "bg-wild-sand",
        active: "text-heavy-metal dark:text-white",
        inactive:
          "bg-wild-sand text-black dark:text-gray-400 border-solid border-b-2 border-pumice font-normal",
        height: "h-8",
        padding: "px-3",
        size: "text-sm",
        font: "font-medium",
        rounded: "rounded-none",
        shadow: "",
      },
    },
  };
}

export function ProductCarouselPrevButtonConfig() {
  return {
    color: "wild-sand",
    class:
      "rtl:[&_span:first-child]:rotate-180 absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full text-heavy-metal bg-opacity-50",
    icon: "i-heroicons-chevron-left-20-solid",
  };
}
export function ProductCarouselNextButtonConfig() {
  return {
    color: "wild-sand",
    class:
      "rtl:[&_span:last-child]:rotate-180 absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full text-heavy-metal bg-opacity-50",
    icon: "i-heroicons-chevron-right-20-solid ",
  };
}

export function MainRadioConfig() {
  return {
    wrapper: "relative flex items-start",
    container: "flex items-center h-5",
    base: "h-5 w-5 dark:checked:bg-current dark:checked:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent",
    form: "form-radio",
    color: "text-{color}-500 dark:text-{color}-400",
    background: "bg-white dark:bg-gray-900",
    border: "border border-gray-300 dark:border-gray-700",
    ring: "focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
    inner: "ms-3 flex flex-col",
    label: "text-sm font-medium text-gray-700 dark:text-gray-200",
    required: "text-sm text-red-500 dark:text-red-400",
    help: "text-sm text-gray-500 dark:text-gray-400",
    default: {
      color: "primary",
    },
  };
}

export function DeliveryMethodRadioConfig() {
  return {
    wrapper: "relative flex items-start",
    container: "flex items-center h-5",
    base: "h-5 w-5 dark:checked:bg-current dark:checked:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent",
    form: "form-radio",
    color: "text-{color}-500 dark:text-{color}-400",
    background: "bg-white dark:bg-gray-900",
    border: "border border-gray-300 dark:border-gray-700",
    ring: "focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
    inner: "ms-3 flex flex-col",
    label: "text-base font-medium text-gray-700 dark:text-gray-200",
    required: "text-sm text-red-500 dark:text-red-400",
    help: "text-sm text-gray-500 dark:text-gray-400",
    default: {
      color: "primary",
    },
  };
}

export function DeliveryAddressRadioConfig() {
  return {
    wrapper: "relative flex items-start",
    container: "flex items-center h-5",
    base: "h-4 w-4 dark:checked:bg-current dark:checked:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent",
    form: "form-radio",
    color: "text-{color}-500 dark:text-{color}-400",
    background: "bg-white dark:bg-gray-900",
    border: "border border-gray-300 dark:border-gray-700",
    ring: "focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
    inner: "ms-3 flex flex-col",
    label: "text-base font-semibold text-[#4C4C4C] dark:text-gray-200",
    required: "text-sm text-red-500 dark:text-red-400",
    help: "text-sm text-gray-500 dark:text-gray-400",
    default: {
      color: "primary",
    },
  };
}

export function MainCheckboxConfig() {
  return {
    wrapper: "relative flex items-start",
    container: "flex items-center h-5",
    base: "h-6 w-6 checked:bg-black checked:text-black hover:checked:bg-black indeterminate:bg-black dark:checked:bg-current dark:checked:border-transparent dark:indeterminate:bg-current dark:indeterminate:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent",
    form: "form-checkbox",
    rounded: "rounded",
    color: "text-{color}-500 dark:text-{color}-400",
    background: "bg-white dark:bg-gray-900",
    border: "border border-gray-300 dark:border-gray-700",
    ring: "focus-visible:ring-2 focus-visible:ring-{color}-500 dark:focus-visible:ring-{color}-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
    inner: "ms-3 flex flex-col",
    label: "text-base font-medium text-gray-700 dark:text-gray-200",
    required: "text-sm text-red-500 dark:text-red-400",
    help: "text-sm text-gray-500 dark:text-gray-400",
    default: {
      color: "primary",
    },
  };
}

export function MainSelectConfig() {
  return {
    rounded: "rounded-2xl",

    padding: {
      "2xs": "px-2 py-1",
      xs: "px-4 py-1.5",
      sm: "px-4 py-3",
      md: "px-3 py-2",
      lg: "px-3.5 py-2.5",
      xl: "px-3.5 py-2.5",
    },
    color: {
      white: {
        outline:
          "shadow-sm bg-wild-sand dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400",
      },
    },
    variant: {
      outline:
        "shadow-sm bg-wild-sand text-gray-900 dark:text-white ring-1 ring-inset ring-{color}-500 dark:ring-{color}-400 focus:ring-2 focus:ring-{color}-500 dark:focus:ring-{color}-400",
      none: "bg-transparent focus:ring-0 focus:shadow-none",
    },
    leading: {
      padding: {
        "2xs": "ps-7",
        xs: "ps-8",
        sm: "ps-10",
        md: "ps-10",
        lg: "ps-11",
        xl: "ps-12",
      },
    },
    trailing: {
      padding: {
        "2xs": "pe-7",
        xs: "pe-8",
        sm: "pe-16",
        md: "pe-16",
        lg: "pe-16",
        xl: "pe-12",
      },
    },

    default: {
      size: "sm",
      color: "white",
      variant: "none",
      loadingIcon: "i-heroicons-arrow-path-20-solid",
    },
  };
}

export function MainSelectMenuConfig() {
  return {
    option: {
      base: "cursor-default select-none relative flex items-center justify-between gap-1",
      rounded: "rounded-md",
      padding: "px-1.5 py-1.5",
      size: "text-sm",
      color: "text-gray-900 dark:text-white",
      container: "flex items-center gap-1.5 min-w-0",
      active: "bg-gray-100 dark:bg-gray-900",
      inactive: "",
      selected: "pe-7",
      disabled: "cursor-not-allowed opacity-50",
      empty: "text-sm text-gray-400 dark:text-gray-500 px-2 py-1.5",
      icon: {
        base: "flex-shrink-0 h-5 w-5",
        active: "text-gray-900 dark:text-white",
        inactive: "text-gray-400 dark:text-gray-500",
      },
      selectedIcon: {
        wrapper:
          "absolute inset-y-0 end-0 top-1 flex items-center justify-center bg-primary rounded-full h-fit w-6 h-6",
        padding: "me-2 pe-0",
        base: "h-4 w-4 text-white dark:text-white  m-auto",
      },
      avatar: {
        base: "flex-shrink-0",
        size: "2xs",
      },
      chip: {
        base: "flex-shrink-0 w-2 h-2 mx-1 rounded-full",
      },
      create: "block truncate",
    },
  };
}

export function RadioSelectMenuConfig() {
  return {
    option: {
      base: "cursor-default select-none relative flex items-center justify-between gap-1",
      rounded: "rounded-md",
      padding: "px-1.5 py-1.5",
      size: "text-sm",
      color: "text-gray-900 dark:text-white",
      container: "flex items-center gap-1.5 min-w-0",
      active: "bg-gray-100 dark:bg-gray-900",
      inactive: "",
      selected: "pe-7",
      disabled: "cursor-not-allowed opacity-50",
      empty: "text-sm text-gray-400 dark:text-gray-500 px-2 py-1.5",
      icon: {
        base: "flex-shrink-0 h-5 w-5",
        active: "text-gray-900 dark:text-white",
        inactive: "text-gray-400 dark:text-gray-500",
      },
      selectedIcon: {
        wrapper:
          "absolute inset-y-0 end-0 top-1 flex items-center justify-center  rounded-full h-fit w-5 h-5",
        padding: "me-2 pe-0",
        base: "h-4 w-4 text-primary dark:text-white  m-auto",
      },
      avatar: {
        base: "flex-shrink-0",
        size: "2xs",
      },
      chip: {
        base: "flex-shrink-0 w-2 h-2 mx-1 rounded-full",
      },
      create: "block truncate",
    },
  };
}

export function MainToggleConfig() {
  return {
    base: "relative inline-flex flex-shrink-0 border-2 border-transparent disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none top-2",
    size: {
      "2xs": "h-1 w-8",
      xs: "h-1 w-8",
      sm: "h-1 w-8",
      md: "h-1 w-8",
      lg: "h-1 w-8",
      xl: "h-1 w-8",
      "2xl": "h-1 w-8",
    },
    container: {
      base: "pointer-events-none relative inline-block rounded-full bg-white dark:bg-gray-900 shadow transform ring-0 transition ease-in-out duration-200 -top-2 -left-[2px]",
    },
  };
}

export function MainPagination() {
  return {
    wrapper: "flex items-center -space-x-px gap-x-4",
    base: "",
    rounded:
      "first:rounded-s-xl last:rounded-e-xl rounded-xl px-4 py-2 first:px-2 last:px-2",
    default: {
      size: "xl",
      activeButton: {
        padding: {
          "2xs": "px-4 py-2",
          xs: "px-4 py-2",
          sm: "px-4 py-2",
          md: "px-4 py-2",
          lg: "px-4 py-2",
          xl: "px-4 py-2",
        },
        color: "primary",
      },
      inactiveButton: {
        padding: {
          "2xs": "px-4 py-2",
          xs: "px-4 py-2",
          sm: "px-4 py-2",
          md: "px-4 py-2",
          lg: "px-4 py-2",
          xl: "px-4 py-2",
        },
        color: "white",
      },
      firstButton: {
        color: "white",
        class: "rtl:[&_span:first-child]:rotate-180",
        icon: "i-heroicons-chevron-double-left-20-solid",
      },
      lastButton: {
        color: "white",
        class: "rtl:[&_span:last-child]:rotate-180",
        icon: "i-heroicons-chevron-double-right-20-solid",
      },
      prevButton: {
        color: "white",
        class: "rtl:[&_span:first-child]:rotate-180 rounded-4",
        icon: "i-heroicons-chevron-left-20-solid",
      },
      nextButton: {
        color: "white",
        class: "rtl:[&_span:last-child]:rotate-180",
        icon: "i-heroicons-chevron-right-20-solid",
      },
    },
  };
}
