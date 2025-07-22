import "materialize-css";

declare global {
  interface Window {
    M: any;
  }
}

export default defineNuxtPlugin(() => {
  // por exemplo, inicializa tooltips
  if (process.client) {
    document.addEventListener("DOMContentLoaded", function () {
      const elems = document.querySelectorAll(".tooltipped");
      // Ensure Materialize CSS is globally available
      const M = window.M;
      M.Tooltip.init(elems);
    });
  }
});
