const SELECTORS = {
  HEADER_BUTTON: '[data-role="header-button"]',
  NAVMENU: '[data-role="navmenu"]'
};
const initHeader = ({ widget }) => {
  const headerButtons = widget.querySelectorAll(SELECTORS.HEADER_BUTTON);
  const navmenu = widget.querySelector(SELECTORS.NAVMENU);
  if (!headerButtons.length || !navmenu) {
    return;
  }
  const isTouchDevice = () => {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  };
  const setHeaderHeight = () => {
    if (widget) {
      const headerHeight = widget.clientHeight;
      document.documentElement.style.setProperty("--size--header-height", `${headerHeight}px`);
    }
  };
  setHeaderHeight();
  let isAnimating = false;
  const onTransitionEnd = (e) => {
    if (e.target !== navmenu || e.propertyName !== "height") return;
    navmenu.removeEventListener("transitionend", onTransitionEnd);
    if (widget.classList.contains("js--open")) {
      navmenu.style.height = "auto";
    }
    isAnimating = false;
  };
  const setInitialState = () => {
    widget.classList.remove("js--open");
    headerButtons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });
    navmenu.setAttribute("aria-hidden", "true");
    navmenu.style.height = "0px";
  };
  const openMenu = () => {
    if (isAnimating) return;
    isAnimating = true;
    widget.classList.add("js--open");
    headerButtons.forEach((button) => {
      button.setAttribute("aria-expanded", "true");
    });
    navmenu.setAttribute("aria-hidden", "false");
    const targetHeight = navmenu.scrollHeight;
    navmenu.style.height = "0px";
    navmenu.addEventListener("transitionend", onTransitionEnd);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        navmenu.style.height = `${targetHeight}px`;
      });
    });
    document.addEventListener("click", handleDocumentClick);
  };
  const closeMenu = () => {
    if (isAnimating) return;
    isAnimating = true;
    headerButtons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });
    navmenu.setAttribute("aria-hidden", "true");
    const currentHeight = navmenu.style.height === "auto" || !navmenu.style.height ? navmenu.scrollHeight : parseFloat(navmenu.style.height) || navmenu.scrollHeight;
    navmenu.style.height = `${currentHeight}px`;
    navmenu.addEventListener("transitionend", onTransitionEnd);
    widget.classList.remove("js--open");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        navmenu.style.height = "0px";
      });
    });
    if (isTouchDevice() && window.innerWidth < 991) {
      removeStickyHover();
    }
  };
  const toggleMenu = () => {
    const isOpen = widget.classList.contains("js--open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };
  const handleDocumentClick = (e) => {
    if (!widget.contains(e.target)) {
      closeMenu();
    }
  };
  const removeStickyHover = () => {
    document.body.classList.add("no-hover");
    setTimeout(() => {
      document.body.classList.remove("no-hover");
    }, 300);
  };
  const handleButtonClick = (e) => {
    e.preventDefault();
    toggleMenu();
  };
  const handleButtonTouchEnd = (e) => {
    e.preventDefault();
    toggleMenu();
  };
  setInitialState();
  headerButtons.forEach((button) => {
    button.addEventListener("click", handleButtonClick);
    if (isTouchDevice()) {
      button.addEventListener("touchend", handleButtonTouchEnd);
    }
  });
  window.addEventListener("resize", () => {
    setHeaderHeight();
    if (widget.classList.contains("js--open")) {
      closeMenu();
    }
  });
  window.addEventListener("scroll", () => {
    if (widget.classList.contains("js--open")) {
      closeMenu();
    }
  });
};
const WIDGET_SELECTOR = '[data-widget="header"]';
const widgets = document.querySelectorAll(WIDGET_SELECTOR);
widgets.forEach((widget) => {
  initHeader({ widget });
});
