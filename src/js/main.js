/**
 * NutriPlan - Main Entry Point
 *
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */

import { getChickenMeals, loadAreas, loadCategories, search } from "./data.js";
import './products.js'
const navLinks = document.querySelectorAll(".nav-link");
export const sections = {
  searchFilters: document.getElementById("search-filters-section"),
  mealCategories: document.getElementById("meal-categories-section"),
  allRecipes: document.getElementById("all-recipes-section"),
  mealDetails: document.getElementById("meal-details"),
  products: document.getElementById("products-section"),
  foodlog: document.getElementById("foodlog-section"),
};

const pageTitle = document.querySelector("#header h1");
const pageDescription = document.querySelector("#header p");




export function hideAllSections() {
  Object.values(sections).forEach((section) => {
    section.classList.add('hidden')
  });
}

function setActiveLink(activeLink) {
  navLinks.forEach((link) => {
    link.classList.remove("bg-emerald-50", "text-emerald-700");
    link.classList.add("text-gray-600", "hover:bg-gray-50");
    const span = link.querySelector("span");
    span.classList.remove("font-semibold");
    span.classList.add("font-medium");
  });
  activeLink.classList.remove("text-gray-600", "hover:bg-gray-50");
  activeLink.classList.add("bg-emerald-50", "text-emerald-700");
  const span = activeLink.querySelector("span");
  span.classList.remove("font-medium");
  span.classList.add("font-semibold");
}

export function setActiveLinkByText(text) {
  navLinks.forEach((link) => {
    if (link.innerText.includes(text)) {
      setActiveLink(link);
    }
  });
}


function showMealsHome() {
  updateHeader(
    "Meals & Recipes",
    "Discover delicious and nutritious recipes tailored for you"
  );
  sections.searchFilters.classList.remove('hidden')
  sections.mealCategories.classList.remove('hidden')
  sections.allRecipes.classList.remove('hidden')
}
export function updateHeader(title, des) {
  pageTitle.innerHTML = title;
  pageDescription.innerHTML = des;
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    hideAllSections();
    setActiveLink(link);

    const text = link.innerText;
    let tab = "#home";

    if (text.includes("Meals")) {
      showMealsHome();
      tab = "#home";
    }
    if (text.includes("Product")) {
      updateHeader(
        "Product Scanner",
        "Search packaged foods by name or barcode"
      );
      sections.products.classList.remove('hidden');
      tab = "#products";
    }
    if (text.includes("Food")) {
      updateHeader("Food Log", "Track your daily nutrition and food intake");
      sections.foodlog.classList.remove('hidden');
      tab = "#foodlog";
    }

    location.hash = tab;
  });
});

window.addEventListener("hashchange", () => {
  const hash = location.hash;

  hideAllSections();

  if (!hash || hash === "#home") {
    showMealsHome();
    setActiveLinkByText("Meals");
  } else if (hash === "#products") {
    updateHeader(
      "Product Scanner",
      "Search packaged foods by name or barcode"
    );
    sections.products.classList.remove('hidden');
    setActiveLinkByText("Product");
  } else if (hash === "#foodlog") {
    updateHeader("Food Log", "Track your daily nutrition and food intake");
    sections.foodlog.classList.remove('hidden');
    setActiveLinkByText("Food");
  }
});


hideAllSections();
showMealsHome();
getChickenMeals(true)
loadAreas();
loadCategories()
search()


