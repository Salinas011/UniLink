function createButton({
  text,
  type = "primary",
  href = "#",
  icon = null
}) {
  const styles = {
    primary:
      "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:scale-95 md:text-base",

    secondary:
      "inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-5 py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 active:scale-95 md:text-base",

    text:
      "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 active:scale-95 md:text-base"
  };

  return `
    <a
      href="${href}"
      class="${styles[type]}"
    >
      <span>${text}</span>

      ${
        icon
          ? `<i data-lucide="${icon}" class="h-5 w-5"></i>`
          : ""
      }
    </a>
  `;
}