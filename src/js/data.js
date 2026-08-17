import { addItemToLog } from "./foodlog.js";
import { sections } from "./main.js";
import { Meal } from "./meal.js";

const appLoadingOverlay = document.getElementById("app-loading-overlay");
const recipesGrid = document.getElementById("recipes-grid");
const searchInput = document.getElementById("search-input");
const recipesCount = document.getElementById("recipes-count");

const gridViewBtn = document.getElementById("grid-view-btn");
const listViewBtn = document.getElementById("list-view-btn");
let currentView = "grid";

const mealDetailsSection = document.getElementById("meal-details");

let allMealsGlobal = [];
function addToAllMealsGlobal(meals) {
  allMealsGlobal.push(...meals);
  allMealsGlobal = Array.from(
    new Map(allMealsGlobal.map((meal) => [meal.id, meal])).values()
  );
}

function showLoading() {
  appLoadingOverlay.classList.remove("loading");
}
function hideLoading() {
  appLoadingOverlay.classList.add("loading");
}

function loader() {
  recipesGrid.innerHTML = `
    <div class="flex flex-col justify-center items-center py-12">
      <span class="loader"></span>
    </div>`;
}

function renderMeals(meals) {
  if (currentView === "grid") {
    recipesGrid.innerHTML = meals.map((meal) => meal.getMealCard()).join("");
  } else {
    recipesGrid.innerHTML = meals
      .map((meal) => meal.getMealListItem())
      .join("");
  }

  recipesCount.innerText = `Showing ${meals.length} recipes`;
}

gridViewBtn.addEventListener("click", () => {
  currentView = "grid";
  gridViewBtn.classList.add("bg-white", "shadow-sm");
  listViewBtn.classList.remove("bg-white", "shadow-sm");
  recipesGrid.classList.remove("grid-cols-2", "gap-4");
  recipesGrid.classList.add("grid-cols-4", "gap-5");
  renderMeals(allMealsGlobal.slice(0, 25));
});
listViewBtn.addEventListener("click", () => {
  currentView = "list";
  listViewBtn.classList.add("bg-white", "shadow-sm");
  gridViewBtn.classList.remove("bg-white", "shadow-sm");
  recipesGrid.classList.remove("grid-cols-4", "gap-5");
  recipesGrid.classList.add("grid-cols-2", "gap-4");

  renderMeals(allMealsGlobal.slice(0, 25));
});

export async function getChickenMeals(showOverlay = false) {
  if (showOverlay) {
    showLoading();
  } else {
    loader();
  }
  try {
    const response = await fetch(
      "https://nutriplan-api.vercel.app/api/meals/search?q=chicken"
    );
    const data = await response.json();

    const meals = data.results.map((meal) => new Meal(meal));
    addToAllMealsGlobal(meals);
    renderMeals(meals);
    return meals;
  } catch (error) {
    console.log(error);
  } finally {
    if (showOverlay) {
      hideLoading();
    }
  }
}

export async function getMealsByArea(area) {
  loader();
  try {
    const response = await fetch(
      `https://nutriplan-api.vercel.app/api/meals/filter?area=${area}`
    );
    const data = await response.json();

    const meals = data.results.map((meal) => new Meal(meal));
    addToAllMealsGlobal(meals);

    renderMeals(meals);
    recipesCount.innerText = `Showing ${meals.length} ${area} recipes`;
  } catch (error) {
    console.log(error);
  }
}

export async function getMealsByCategory(category) {
  loader();
  try {
    const response = await fetch(
      `https://nutriplan-api.vercel.app/api/meals/filter?category=${category}`
    );

    if (!response.ok) {
      recipesGrid.innerHTML = `<p class="text-center py-10 text-gray-500">Failed to load ${category} meals.</p>`;
      return;
    }

    const data = await response.json();

    if (!Array.isArray(data.results)) {
      recipesGrid.innerHTML = `<p class="text-center py-10 text-gray-500">No meals found.</p>`;
      return;
    }

    const meals = data.results.slice(0, 20).map((meal) => new Meal(meal));
    addToAllMealsGlobal(meals);

    renderMeals(meals);
    recipesCount.innerText = `Showing ${meals.length} ${category} recipes`;
  } catch (error) {
    console.log(error);
  }
}

const categoryStyles = {
  Beef: {
    icon: "fa-drumstick-bite",
    bg: "from-red-400 to-rose-500",
    card: "from-red-50 to-rose-50 border-red-200 hover:border-red-400",
  },
  Chicken: {
    icon: "fa-drumstick-bite",
    bg: "from-amber-400 to-orange-500",
    card: "from-amber-50 to-orange-50 border-amber-200 hover:border-amber-400",
  },
  Dessert: {
    icon: "fa-cake-candles",
    bg: "from-pink-400 to-rose-500",
    card: "from-pink-50 to-rose-50 border-pink-200 hover:border-pink-400",
  },
  Lamb: {
    icon: "fa-drumstick-bite",
    bg: "from-orange-400 to-amber-500",
    card: "from-orange-50 to-amber-50 border-orange-200 hover:border-orange-400",
  },
  Miscellaneous: {
    icon: "fa-bowl-rice",
    bg: "from-slate-400 to-gray-500",
    card: "from-slate-50 to-gray-50 border-slate-200 hover:border-slate-400",
  },
  Pasta: {
    icon: "fa-bowl-food",
    bg: "from-yellow-400 to-amber-500",
    card: "from-yellow-50 to-amber-50 border-yellow-200 hover:border-yellow-400",
  },
  Pork: {
    icon: "fa-bacon",
    bg: "from-rose-400 to-red-500",
    card: "from-rose-50 to-red-50 border-rose-200 hover:border-rose-400",
  },
  Seafood: {
    icon: "fa-fish",
    bg: "from-cyan-400 to-blue-500",
    card: "from-cyan-50 to-blue-50 border-cyan-200 hover:border-cyan-400",
  },
  Side: {
    icon: "fa-plate-wheat",
    bg: "from-green-400 to-emerald-500",
    card: "from-green-50 to-emerald-50 border-green-200 hover:border-green-400",
  },
  Starter: {
    icon: "fa-utensils",
    bg: "from-teal-400 to-cyan-500",
    card: "from-teal-50 to-cyan-50 border-teal-200 hover:border-teal-400",
  },
  Vegan: {
    icon: "fa-leaf",
    bg: "from-emerald-400 to-green-500",
    card: "from-emerald-50 to-green-50 border-emerald-200 hover:border-emerald-400",
  },
  Vegetarian: {
    icon: "fa-seedling",
    bg: "from-lime-400 to-green-500",
    card: "from-lime-50 to-green-50 border-lime-200 hover:border-lime-400",
  },
};

export async function loadAreas() {
  try {
    const response = await fetch(
      "https://nutriplan-api.vercel.app/api/meals/areas"
    );
    const data = await response.json();

    const areasContainer = document.getElementById("areasContainer");
    areasContainer.innerHTML = "";

    const allBtn = document.createElement("button");
    allBtn.textContent = "All Cuisines";
    allBtn.dataset.area = "All";
    allBtn.className =
      "px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 transition-all";
    areasContainer.appendChild(allBtn);

    data.results.slice(0, 10).forEach((area) => {
      const btn = document.createElement("button");
      btn.textContent = area.name;
      btn.dataset.area = area.name;
      btn.className =
        "px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all";
      areasContainer.appendChild(btn);
    });

    const areaButtons = areasContainer.querySelectorAll("button");
    areaButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const area = button.dataset.area;
        if (area === "All") {
          getChickenMeals();
        } else {
          getMealsByArea(area);
        }

        areaButtons.forEach((btn) => {
          btn.classList.replace("bg-emerald-600", "bg-gray-100");
          btn.classList.replace("text-white", "text-gray-700");
        });

        button.classList.replace("bg-gray-100", "bg-emerald-600");
        button.classList.replace("text-gray-700", "text-white");
      });
    });
  } catch (error) {
    console.log(error);
  }
}
export async function loadCategories() {
  try {
    const response = await fetch(
      "https://nutriplan-api.vercel.app/api/meals/categories"
    );
    const data = await response.json();

    if (!data.results) return;

    const categoriesGrid = document.getElementById("categories-grid");
    categoriesGrid.innerHTML = "";

    data.results.slice(0, 12).forEach((cat) => {
      const style = categoryStyles[cat.name];
      categoriesGrid.innerHTML += `
        <div
          class="category-card bg-gradient-to-br rounded-xl p-3 border ${style.card}
                 hover:shadow-md cursor-pointer transition-all group"
          data-category="${cat.name}"
        >
          <div class="flex items-center gap-2.5">
            <div
              class="text-white w-9 h-9 bg-gradient-to-br ${style.bg}
                     rounded-lg flex items-center justify-center
                     group-hover:scale-110 transition-transform shadow-sm"
            >
              <i class="fa-solid ${style.icon}"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-gray-900">${cat.name}</h3>
            </div>
          </div>
        </div>
      `;
    });

    const categoryCards = categoriesGrid.querySelectorAll(".category-card");
    categoryCards.forEach((card) => {
      card.addEventListener("click", () => {
        const category = card.dataset.category;
        getMealsByCategory(category);
      });
    });
  } catch (error) {
    console.log(error);
  }
}

export async function searchMeals(value) {
  const response = await fetch(
    "https://nutriplan-api.vercel.app/api/meals/search"
  );
  const data = await response.json();
  const meals = data.results.map((meal) => new Meal(meal));
  addToAllMealsGlobal(meals);
  if (!value) {
    const displayMeals = meals.slice(0, 25);
    renderMeals(displayMeals);
    recipesCount.innerText = `Showing ${displayMeals.length} recipes`;
    return;
  }

  const searchValue = value.toLowerCase();

  const filteredMeals = allMealsGlobal.filter((meal) => {
    return (
      meal.name?.toLowerCase().includes(searchValue) ||
      meal.category?.toLowerCase().includes(searchValue) ||
      meal.area?.toLowerCase().includes(searchValue) ||
      String(meal.instructions || "")
        .toLowerCase()
        .includes(value)
    );
  });
  const filteredMealsLimit = filteredMeals.slice(0, 25);

  renderMeals(filteredMealsLimit);
  if (filteredMealsLimit.length === 0) {
    recipesGrid.innerHTML = `
    <div class = 'flex flex-col items-center justify-center py-12 text-center'>
    <div class = 'w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
    <i class = 'fa-solid fa-magnifying-glass text-2xl text-gray-400' ></i>
    </div>
    <p class='text-gray-500 text-lg'>No recipes found. Try a different search term.</p>
    </div>
    `;
  }
  recipesCount.innerText = `Showing ${filteredMealsLimit.length} recipes for "${value}"`;
}

export function search() {
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const value = searchInput.value.trim();
    searchMeals(value);
  });
}

recipesGrid.addEventListener("click", async function (e) {
  const mealCard = e.target.closest(".recipe-card");
  if (!mealCard) return;

  const mealId = mealCard.dataset.mealId;
  let meal = allMealsGlobal.find((m) => m.id == mealId);

  if (!meal?.ingredients || meal.ingredients.length === 0) {
    try {
      const response = await fetch(
        `https://nutriplan-api.vercel.app/api/meals/search?q=${meal.category}`
      );
      const data = await response.json();
      const fullMealData = data.results.find((m) => m.id == mealId);

      if (fullMealData) {
        meal = new Meal(fullMealData);
        addToAllMealsGlobal([meal]);
      }
    } catch (error) {
      console.error(error);
      return;
    }
  }

  showMealDetails(meal);
});

async function getNutrition(meal) {
  if (!meal?.ingredients || meal.ingredients.length === 0) {
    return null;
  }

  try {
    const res = await fetch(
      "https://nutriplan-api.vercel.app/api/nutrition/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "x5hmuXDbfE6nM00cgKikVAGHgJNoVnM935QLlgUv",
        },
        body: JSON.stringify({
          title: meal.name,
          ingredients: meal.ingredients.map((i) => i.ingredient),
        }),
      }
    );

    const response = await res.json();

    console.log("Nutrition API response:", response);

    if (response.success && response.data) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error("Nutrition API error:", error);
    return null;
  }
}

async function showMealDetails(mealobj) {
  Object.values(sections).forEach((sec) => sec.classList.add("hidden"));
  mealDetailsSection.classList.remove("hidden");

  document.querySelector("#header h1").innerHTML = "Recipe Details";
  document.querySelector("#header p").innerHTML =
    "View full recipe information and nutrition facts";

  let mealDataForModal = mealobj;
  mealDetailsSection.innerHTML = `<p class="text-center py-10 text-gray-500">Loading...</p>`;

  try {
    const searchRes = await fetch(
      `https://nutriplan-api.vercel.app/api/products/search?q=${mealobj.name}&page=1&limit=1`
    );
    const searchData = await searchRes.json();
    const product = searchData.results?.[0];

    const response = await fetch(
      `https://nutriplan-api.vercel.app/api/meals/search?q=${mealobj.name}`
    );
    const data = await response.json();
    const youtubeLink = data.results[0].youtube;
    console.log(youtubeLink);

    console.log("nutrients", product);
    console.log("mealobj", mealobj);

    let nutrients = {};
    let totalCalories = 0;
    let protein = 0,
      carbs = 0,
      fat = 0,
      fiber = 0,
      sugar = 0,
      saturatedFat = 0;
    let cholesterol = 0;
    let sodium = 0;
    if (product) {
      const nutrition = await getNutrition(mealobj);

      if (nutrition) {
        totalCalories = Math.round(nutrition.totals?.calories || 0);
      
        protein = Math.round(nutrition.totals?.protein || 0);
        carbs = Math.round(nutrition.totals?.carbs || 0);
        fat = Math.round(nutrition.totals?.fat || 0);
        fiber = Math.round(nutrition.totals?.fiber || 0);
        sugar = Math.round(nutrition.totals?.sugar || 0);
        saturatedFat = Math.round(nutrition.totals?.saturatedFat || 0);
        cholesterol = Math.round(nutrition.totals?.cholesterol || 0);
        sodium = Math.round(nutrition.totals?.sodium || 0);
      }

      const servings = Number(mealobj.servings) || 4;

      const caloriesPerServing = Math.round(totalCalories / servings);
      const proteinPerServing = Math.round(protein / servings);
      const carbsPerServing = Math.round(carbs / servings);
      const fatPerServing = Math.round(fat / servings);

      const calculateMacroPercentage = (macroValue, total) =>
        macroValue && total ? Math.round((macroValue / total) * 100) : 0;
      const totalMacros = protein + carbs + fat;
      const proteinPercent = calculateMacroPercentage(protein, totalMacros);
      const carbsPercent = calculateMacroPercentage(carbs, totalMacros);
      const fatPercent = calculateMacroPercentage(fat, totalMacros);
      const fiberPercent = Math.min(Math.round((fiber / 28) * 100), 100);
      const sugarPercent = Math.min(Math.round((sugar / 50) * 100), 100);
      const satFatPercent = Math.min(
        Math.round((saturatedFat / 20) * 100),
        100
      );

      const time = mealobj.time || "30 min";

      // Ingredients HTML
      const ingredientsHtml =
        mealobj.ingredients
          ?.map(
            (ing) => `
      <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
        <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
        <span class="text-gray-700"><span class="font-medium text-gray-900">${ing.measure}</span> ${ing.ingredient}</span>
      </div>
    `
          )
          .join("") || "";

      // Instructions HTML
      const instructionsHTML =
        mealobj.instructions
          ?.map(
            (step, i) => `
      <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
        <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
          ${i + 1}
        </div>
        <p class="text-gray-700 leading-relaxed pt-2">${step}</p>
      </div>
    `
          )
          .join("") || "";

      mealDetailsSection.innerHTML = `
      <div class="max-w-7xl mx-auto">
        <button id="back-to-meals-btn" class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Back to Recipes</span>
        </button>

        <!-- Hero -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div class="relative h-80 md:h-96">
            <img src="${mealobj.thumbnail || mealobj.image}" alt="${
        mealobj.name
      }" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-8">
              <div class="flex items-center gap-3 mb-3">
                <span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${
                  mealobj.category
                }</span>
                <span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${
                  mealobj.area
                }</span>
              </div>
              <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">${
                mealobj.name
              }</h1>
              <div class="flex items-center gap-6 text-white/90">
                <span class="flex items-center gap-2"><i class="fa-solid fa-clock"></i> ${time}</span>
                <span class="flex items-center gap-2"><i class="fa-solid fa-utensils"></i> ${servings} servings</span>
                <span class="flex items-center gap-2"><i class="fa-solid fa-fire"></i> ${caloriesPerServing} cal/serving</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-3 mb-8">
          <button id="log-meal-btn" class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all" data-meal-id="${
            mealobj.id
          }">
            <i class="fa-solid fa-clipboard-list"></i>
            <span>Log This Meal</span>
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Left -->
          <div class="lg:col-span-2 space-y-8">

            <!-- Ingredients -->
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-list-check text-emerald-600"></i> Ingredients
                <span class="text-sm font-normal text-gray-500 ml-auto">${
                  mealobj.ingredients?.length || 0
                } items</span>
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">${ingredientsHtml}</div>
            </div>

            <!-- Instructions -->
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-shoe-prints text-emerald-600"></i> Instructions
              </h2>
              <div class="space-y-4">${instructionsHTML}</div>
            </div>

            <!-- Video -->
            ${
              youtubeLink
                ? `
            <div class="bg-white rounded-2xl shadow-lg p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-video text-red-500"></i> Video Tutorial
              </h2>
              <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                <iframe src="https://www.youtube.com/embed/${
                  youtubeLink.split("v=")[1]
                }" class="absolute inset-0 w-full h-full" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
              </div>
            </div>`
                : ""
            }

          </div>

          <!-- Right / Nutrition -->
          <div class="space-y-6">
                        <!-- Nutrition Facts -->
                        <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                                Nutrition Facts
                            </h2>
                            <div id="nutrition-facts-container">
            <p class="text-sm text-gray-500 mb-4">Per serving</p>
            
            <div class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">
                <p class="text-sm text-gray-600">Calories per serving</p>
                <p class="text-4xl font-bold text-emerald-600">${caloriesPerServing}</p>
                <p class="text-xs text-gray-500 mt-1">Total: ${totalCalories} cal</p>
            </div>
            
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span class="text-gray-700">Protein</span>
                    </div>
                    <span class="font-bold text-gray-900">${protein}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-emerald-500 h-2 rounded-full" style="width: ${proteinPercent}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="text-gray-700">Carbs</span>
                    </div>
                    <span class="font-bold text-gray-900">${carbs}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: ${carbsPercent}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span class="text-gray-700">Fat</span>
                    </div>
                    <span class="font-bold text-gray-900">${fat}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-purple-500 h-2 rounded-full" style="width: ${fatPercent}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span class="text-gray-700">Fiber</span>
                    </div>
                    <span class="font-bold text-gray-900">${fiber}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-orange-500 h-2 rounded-full" style="width: ${fiberPercent}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span class="text-gray-700">Sugar</span>
                    </div>
                    <span class="font-bold text-gray-900">${sugar}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-pink-500 h-2 rounded-full" style="width: ${sugarPercent}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-red-500"></div>
                        <span class="text-gray-700">Saturated Fat</span>
                    </div>
                    <span class="font-bold text-gray-900">${saturatedFat}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-red-500 h-2 rounded-full" style="width: ${satFatPercent}%"></div>
                </div>
            </div>

            
            <div class="mt-6 pt-6 border-t border-gray-100">
                <h3 class="text-sm font-semibold text-gray-900 mb-3">Other</h3>
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Cholesterol</span>
                        <span class="font-medium">${cholesterol}mg</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Sodium</span>
                        <span class="font-medium">${sodium}mg</span>
                    </div>
                </div>
            </div>
          </div>
         </div>
        </div>
      </div>
   </div>
    `;

      const logMealBtn = document.getElementById("log-meal-btn");
      logMealBtn.addEventListener("click", () => {
        openLogMealModal({
          id: mealDataForModal.id,
          name: mealDataForModal.name,
          image: mealDataForModal.thumbnail || mealDataForModal.image,
          calories: caloriesPerServing,
          protein: proteinPerServing,
          carbs: carbsPerServing,
          fat: fatPerServing,
        });
      });
    }
  } catch (err) {
    console.error("Error loading meal details:", err);
    mealDetailsSection.innerHTML = `<div class="max-w-7xl mx-auto text-center p-8">Error loading meal details. Please try again.</div>`;
  }

  document
    .getElementById("back-to-meals-btn")
    ?.addEventListener("click", () => {
      mealDetailsSection.classList.add("hidden");
      sections.searchFilters.classList.remove("hidden");
      sections.mealCategories.classList.remove("hidden");
      sections.allRecipes.classList.remove("hidden");
    });
}

function openLogMealModal(meal) {
  document.getElementById("log-meal-modal")?.remove();

  const modal = document.createElement("div");
  modal.id = "log-meal-modal";
  modal.className =
    "fixed inset-0 bg-black/50 flex items-center justify-center z-50";

  modal.innerHTML = `
    <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
      <div class="flex items-center gap-4 mb-6">
        <img src="${meal.image}" alt="${meal.name}" class="w-16 h-16 rounded-xl object-cover">
        <div>
          <h3 class="text-xl font-bold text-gray-900">Log This Meal</h3>
          <p class="text-gray-500 text-sm">${meal.name}</p>
        </div>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Number of Servings</label>
        <div class="flex items-center gap-3">
          <button id="decrease-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200">−</button>
          <input type="number" id="meal-servings" value="1" min="0.5" step="0.5"
            class="w-20 text-center text-xl font-bold border-2 border-gray-200 rounded-lg py-2">
          <button id="increase-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200">+</button>
        </div>
      </div>

      <div class="bg-emerald-50 rounded-xl p-4 mb-6">
        <p class="text-sm text-gray-600 mb-2">Estimated nutrition:</p>
        <div class="grid grid-cols-4 gap-2 text-center">
          <div>
            <p class="text-lg font-bold text-emerald-600" id="modal-calories">${meal.calories}</p>
            <p class="text-xs text-gray-500">Calories</p>
          </div>
          <div>
            <p class="text-lg font-bold text-blue-600" id="modal-protein">${meal.protein}g</p>
            <p class="text-xs text-gray-500">Protein</p>
          </div>
          <div>
            <p class="text-lg font-bold text-amber-600" id="modal-carbs">${meal.carbs}g</p>
            <p class="text-xs text-gray-500">Carbs</p>
          </div>
          <div>
            <p class="text-lg font-bold text-purple-600" id="modal-fat">${meal.fat}g</p>
            <p class="text-xs text-gray-500">Fat</p>
          </div>
        </div>
      </div>

      <div class="flex gap-3">
        <button id="cancel-log-meal" class="flex-1 py-3 bg-gray-100 rounded-xl">Cancel</button>
        <button id="confirm-log-meal" class="flex-1 py-3 bg-blue-600 text-white rounded-xl">
          Log Meal
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  setupLogMealControls(meal);
}

function setupLogMealControls(meal) {
  const servingsInput = document.getElementById("meal-servings");

  const caloriesEl = document.getElementById("modal-calories");
  const proteinEl = document.getElementById("modal-protein");
  const carbsEl = document.getElementById("modal-carbs");
  const fatEl = document.getElementById("modal-fat");

  function updateValues() {
    const servings = parseFloat(servingsInput.value);

    caloriesEl.textContent = Math.round(meal.calories * servings);
    proteinEl.textContent = Math.round(meal.protein * servings) + "g";
    carbsEl.textContent = Math.round(meal.carbs * servings) + "g";
    fatEl.textContent = Math.round(meal.fat * servings) + "g";
  }

  document.getElementById("increase-servings").onclick = () => {
    servingsInput.value = (+servingsInput.value + 0.5).toFixed(1);
    updateValues();
  };

  document.getElementById("decrease-servings").onclick = () => {
    if (servingsInput.value > 0.5) {
      servingsInput.value = (+servingsInput.value - 0.5).toFixed(1);
      updateValues();
    }
  };

  servingsInput.addEventListener("input", updateValues);

  document.getElementById("cancel-log-meal").onclick = closeLogMealModal;

  document.getElementById("confirm-log-meal").onclick = () => {
    const servings = parseFloat(servingsInput.value);
    Swal.fire({
      title: "Meal Logged!",
      html: `
    <p style="margin: 0 0 6px; color: #555; font-size: 18px;">
      ${meal.name} (${servings} serving) has been added to your daily log.
    </p>

    <p style="
      margin: 0;
      color: #009966;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
    ">
      +${Math.round(meal.calories * servings)} calories
    </p>
  `,
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });

    addItemToLog({
      name: meal.name,
      image: meal.image,
      type: "recipe",
      nutrients: {
        calories: Math.round(meal.calories * servings),
        protein: Math.round(meal.protein * servings),
        carbs: Math.round(meal.carbs * servings),
        fat: Math.round(meal.fat * servings),
      },
      servings: `${servings} servings`,
    });
    closeLogMealModal();
  };
}

function closeLogMealModal() {
  document.getElementById("log-meal-modal")?.remove();
}