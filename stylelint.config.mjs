/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  rules: {
    // Allow camelCase class names for CSS Modules
    "selector-class-pattern": null,
  },
};
