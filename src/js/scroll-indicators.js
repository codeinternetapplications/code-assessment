const scrollIndicator = document.querySelector(".swiper-scroll-indicators");
const secondSection = document.querySelector(
  ".shopify-section.section-two-column-highlight-products"
);

if (scrollIndicator && secondSection) {
  scrollIndicator.addEventListener("click", () => {
    secondSection.scrollIntoView({ block: "start", behavior: "smooth" });
  });
}
