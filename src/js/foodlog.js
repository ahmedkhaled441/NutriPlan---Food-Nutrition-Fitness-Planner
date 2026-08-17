import { sections, setActiveLinkByText } from "./main.js";

const foodlogTodaySection = document.getElementById("foodlog-today-section");
const loggedItems = foodlogTodaySection.querySelector("#logged-items");
const caloriesBar = foodlogTodaySection.querySelector(".calories-bar");
const proteinBar = foodlogTodaySection.querySelector(".protein-bar");
const carbsBar = foodlogTodaySection.querySelector(".carbs-bar");
const fatBar = foodlogTodaySection.querySelector(".fat-bar");
const caloriesPercent = foodlogTodaySection.querySelector(".calories-percent");
const proteinPercent = foodlogTodaySection.querySelector(".protein-percent");
const carbsPercent = foodlogTodaySection.querySelector(".carbs-percent");
const fatPercent = foodlogTodaySection.querySelector(".fat-percent");
const caloriesText = foodlogTodaySection.querySelector(".calories-text");
const proteinText = foodlogTodaySection.querySelector(".protein-text");
const carbsText = foodlogTodaySection.querySelector(".carbs-text");
const fatText = foodlogTodaySection.querySelector(".fat-text");
const noFoodLogged = document.getElementById("noFoodLogged");

const browseBtn = document.querySelector(".browse-recipes-btn");
const scanBtn = document.querySelector(".scan-product-btn");

const clearLogBtn = document.getElementById("clear-foodlog");

console.log(browseBtn);
console.log(scanBtn);

browseBtn.addEventListener("click", () => {
  Object.values(sections).forEach((section) => {
    section.classList.add("hidden");
  });
  sections.searchFilters.classList.remove("hidden");
  sections.mealCategories.classList.remove("hidden");
  sections.allRecipes.classList.remove("hidden");

  setActiveLinkByText("Meals");
});

scanBtn.addEventListener("click", () => {
  Object.values(sections).forEach((section) => {
    section.classList.add("hidden");
  });
  sections.products.classList.remove("hidden");

  setActiveLinkByText("Product");
});

let dailyLog = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  items: [],
};

const dailyGoals = {
  calories: 2000,
  protein: 50,
  carbs: 250,
  fat: 65,
};

function updateProgressBars() {
  updateBar(
    caloriesBar,
    caloriesPercent,
    caloriesText,
    dailyLog.calories,
    dailyGoals.calories
  );

  updateBar(
    proteinBar,
    proteinPercent,
    proteinText,
    dailyLog.protein,
    dailyGoals.protein
  );

  updateBar(
    carbsBar,
    carbsPercent,
    carbsText,
    dailyLog.carbs,
    dailyGoals.carbs
  );

  updateBar(fatBar, fatPercent, fatText, dailyLog.fat, dailyGoals.fat);

  caloriesText.textContent = `${dailyLog.calories} kcal`;
  proteinText.textContent = `${dailyLog.protein} g`;
  carbsText.textContent = `${dailyLog.carbs} g`;
  fatText.textContent = `${dailyLog.fat} g`;
}

function updateBar(bar, nutrientPercent, nutrientValue, value, goal) {
  const percent = (value / goal) * 100;
  const barPercent = Math.min(percent, 100);

  bar.style.width = `${barPercent}%`;

  nutrientPercent.textContent = `${Math.round(barPercent)}%`;

  if (percent >= 100) {
    bar.classList.add("bg-red-500");
    nutrientPercent.classList.add("text-red-500");
    nutrientValue.classList.add("text-red-500");
  } else {
    bar.classList.remove("bg-red-500");
    nutrientPercent.classList.remove("text-red-500");
    nutrientValue.classList.remove("text-red-500");
  }
}

export function addItemToLog(item, skipSave = false) {
  dailyLog.items.push(item);
  dailyLog.calories += item.nutrients.calories;
  dailyLog.protein += item.nutrients.protein;
  dailyLog.carbs += item.nutrients.carbs;
  dailyLog.fat += item.nutrients.fat;

  renderItemCard(item);

  updateProgressBars();
  updateLoggedItemCount();
  toggleClearLogButton();

  noFoodLogged.classList.add("hidden");

  if (!skipSave) {
    saveTodayLog();
  }
  renderWeeklyOverview();
  updateWeeklyStats();
}

function renderItemCard(item) {
  const now = new Date();
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemIndex = dailyLog.items.indexOf(item);

  const card = document.createElement("div");
  card.className =
    "card flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all";

  card.innerHTML = `
    <div class="flex items-center gap-4">
      <img src="${item.image}" alt="${item.name}" class="w-14 h-14 rounded-xl object-cover" />
      <div>
        <p class="font-semibold text-gray-900">${item.name}</p>
        <p class="text-sm text-gray-500">
          ${item.servings}
          <span class="mx-1">•</span>
          <span class="text-emerald-600">${item.type}</span>
        </p>
        <p class="text-xs text-gray-400 mt-1">${time}</p>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <div class="text-right">
        <p class="text-lg font-bold text-emerald-600">${item.nutrients.calories}</p>
        <p class="text-xs text-gray-500">kcal</p>
      </div>
      <div class="hidden md:flex gap-2 text-xs text-gray-500">
        <span class="px-2 py-1 bg-blue-50 rounded">${item.nutrients.protein}g P</span>
        <span class="px-2 py-1 bg-amber-50 rounded">${item.nutrients.carbs}g C</span>
        <span class="px-2 py-1 bg-purple-50 rounded">${item.nutrients.fat}g F</span>
      </div>
      <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="${itemIndex}">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `;

  loggedItems.appendChild(card);

  const removeBtn = card.querySelector(".remove-foodlog-item");
  removeBtn.addEventListener("click", () => {
    removeItemFromLog(itemIndex);

    Swal.fire({
      toast: true,
      position: "bottom-end",
      html: `
    <span style="font-weight: 500;">
      item removed from log
    </span>
  `,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: false,
      customClass: {
        popup: "custom-blue-toast",
      },
    });
  });
}

function updateLoggedItemCount() {
  document.getElementById(
    "loggedItemCount"
  ).textContent = `Logged Items (${dailyLog.items.length})`;
}

function removeItemFromLog(index) {
  const item = dailyLog.items[index];

  dailyLog.calories -= item.nutrients.calories;
  dailyLog.protein -= item.nutrients.protein;
  dailyLog.carbs -= item.nutrients.carbs;
  dailyLog.fat -= item.nutrients.fat;

  updateProgressBars();

  const card = loggedItems
    .querySelector(`.remove-foodlog-item[data-index="${index}"]`)
    ?.closest(".card");

  if (card) card.remove();

  dailyLog.items.splice(index, 1);

  saveTodayLog();
  updateLoggedItemCount();
  toggleClearLogButton();

  renderWeeklyOverview();
  updateWeeklyStats();

  if (dailyLog.items.length === 0) {
    noFoodLogged.classList.remove("hidden");
  }

  const buttons = loggedItems.querySelectorAll(".remove-foodlog-item");
  buttons.forEach((btn, i) => (btn.dataset.index = i));
}

function clearFoodLog() {
  dailyLog = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    items: [],
  };

  loggedItems.innerHTML = "";
  noFoodLogged.classList.remove("hidden");

  updateProgressBars();
  updateLoggedItemCount();
  saveTodayLog();
  toggleClearLogButton();
  renderWeeklyOverview();
  updateWeeklyStats();
}

clearLogBtn.addEventListener("click", () => {
  Swal.fire({
    title: "Clear Today's Log?",
    text: "This will remove all logged food items for today.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6e7881",
    confirmButtonText: "Yes, clear it!",
  }).then((result) => {
    if (result.isConfirmed) {
      clearFoodLog();
      Swal.fire({
        title: "Cleared!",
        text: "Your food log has been cleared.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
});

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getTodayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

const todayKey = getTodayKey();
const todayLabel = getTodayLabel();

document.getElementById("todayDate").textContent = todayLabel;

function getAllLogs() {
  return JSON.parse(localStorage.getItem("dailyFoodLog")) || {};
}

function saveTodayLog() {
  const allLogs = getAllLogs();

  allLogs[todayKey] = {
    dateLabel: todayLabel,
    calories: dailyLog.calories,
    protein: dailyLog.protein,
    carbs: dailyLog.carbs,
    fat: dailyLog.fat,
    items: dailyLog.items,
  };

  localStorage.setItem("dailyFoodLog", JSON.stringify(allLogs));
}

function loadTodayLog() {
  const allLogs = getAllLogs();
  const todayLog = allLogs[todayKey];

  if (!todayLog || todayLog.items.length === 0) {
    noFoodLogged.classList.remove("hidden");
    updateProgressBars();
    updateLoggedItemCount();
    renderWeeklyOverview();
    updateWeeklyStats();
    return;
  }

  dailyLog = {
    calories: todayLog.calories,
    protein: todayLog.protein,
    carbs: todayLog.carbs,
    fat: todayLog.fat,
    items: [...todayLog.items],
  };

  loggedItems.innerHTML = "";
  noFoodLogged.classList.add("hidden");

  todayLog.items.forEach((item) => {
    renderItemCard(item);
  });
  updateProgressBars();
  updateLoggedItemCount();
  toggleClearLogButton();
  renderWeeklyOverview();
  updateWeeklyStats();
}

loadTodayLog();
toggleClearLogButton();
renderWeeklyOverview();

function toggleClearLogButton() {
  if (dailyLog.items.length === 0) {
    clearLogBtn.classList.add("hidden");
  } else {
    clearLogBtn.classList.remove("hidden");
  }
}

function getWeekDates() {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);

    days.push({
      key: day.toISOString().split("T")[0],
      label: day.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
      }),
    });
  }

  return days;
}

function renderWeeklyOverview() {
  const weekContainer = document.getElementById("weekContainer");
  weekContainer.innerHTML = "";

  const allLogs = getAllLogs();
  const todayKey = getTodayKey();
  const week = getWeekDates();

  week.forEach((day) => {
    const log = allLogs[day.key];
    const calories = log ? log.calories : 0;
    const itemsCount = log ? log.items.length : 0;
    const isToday = day.key === todayKey;

    const dayDiv = document.createElement("div");
    dayDiv.className = "text-center";
    if (isToday) dayDiv.classList.add("bg-indigo-100", "rounded-xl");

    dayDiv.innerHTML = `
      <p class="text-xs text-gray-500 mb-1">${day.label.split(" ")[1]}</p>
      <p class="text-sm font-medium text-gray-900">
        ${day.label.split(" ")[0]}
      </p>
      <div class="mt-2 ${calories > 0 ? "text-emerald-600" : "text-gray-300"}">
        <p class="text-lg font-bold">${calories}</p>
        <p class="text-xs">kcal</p>
      </div>
      ${
        itemsCount > 0
          ? `<p class="text-xs text-gray-400 mt-1">${itemsCount} items</p>`
          : ""
      }
    `;

    weekContainer.appendChild(dayDiv);
  });
}

function updateWeeklyStats() {
  const allLogs = getAllLogs();
  const week = getWeekDates();

  let totalCalories = 0;
  let totalItems = 0;
  let daysOnGoal = 0;

  week.forEach((day) => {
    const log = allLogs[day.key];
    if (log) {
      totalCalories += log.calories;
      totalItems += log.items.length;

      if (log.calories >= 1600 && log.calories <= 2000) {
        daysOnGoal += 1;
      }
    }
  });

  const avgCalories = Math.round(totalCalories / 7);

  document.getElementById("weeklyAverage").textContent = `${avgCalories} kcal`;
  document.getElementById("totalItemsWeek").textContent = `${totalItems} items`;
  document.getElementById("daysGoal").textContent = `${daysOnGoal} / 7`;
}