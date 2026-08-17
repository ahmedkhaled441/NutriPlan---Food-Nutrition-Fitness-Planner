export class Meal {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.category = data.category;
    this.area = data.area;
    this.instructions = data.instructions;
    this.image = data.thumbnail;
    this.ingredients = data.ingredients;
    this.time = data.time;
    this.servings = data.servings;
    this.calories = data.calories;
    this.youtube = data.youtube
  }

  getMealCard() {
    return `
    <div
              class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              data-meal-id="${this.id}"
            >
              <div class="relative h-48 overflow-hidden">
                <img
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="${this.image}"
                  alt="${this.name}"
                  loading="lazy"
                />
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <span
                    class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-lg"
                  >
                  <i class="fa-solid fa-tag text-emerald-600 mr-1"></i>${this.category}
                  </span>
                  <span
                    class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-lg"
                  >
                  <i class="fa-solid fa-globe mr-1 text-blue-600"></i>${this.area}
                  </span>
                </div>
              </div>
              <div class="p-4">
                <h3
                  class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
                >
                  ${this.name}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                  ${this.instructions}
                </p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900">
                    <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                    ${this.category}
                  </span>
                  <span class="font-semibold text-gray-500">
                    <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                    ${this.area}
                  </span>
                </div>
              </div>
            </div>
    `;
  }

  getMealListItem() {
    return `
    <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-row h-40" data-meal-id="${
      this.id
    }">
      <div class="relative overflow-hidden w-20 h-full">
        <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
             src="${this.image}" alt="${this.name}" loading="lazy">
        <div class="absolute bottom-3 left-3 flex gap-2 hidden">
          <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-lg">
            <i class="fa-solid fa-utensils mr-1 text-emerald-600"></i>${
              this.category
            }
          </span>
          <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-lg">
            <i class="fa-solid fa-globe mr-1 text-blue-600"></i>${this.area}
          </span>
        </div>
      </div>
      <div class="p-4 flex-1 flex flex-col">
        <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
          ${this.name}
        </h3>
        <p class="text-xs text-gray-600 mb-3 line-clamp-2">
          ${this.instructions || ""}
        </p>
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-gray-900">
            <i class="fa-solid fa-utensils mr-1 text-emerald-600"></i> ${
              this.category
            }
          </span>
          <span class="font-semibold text-gray-500">
            <i class="fa-solid fa-globe mr-1 text-blue-600"></i> ${this.area}
          </span>
        </div>
      </div>
    </div>
  `;
  }
}