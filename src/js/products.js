import { addItemToLog } from "./foodlog.js";

const searchInput = document.getElementById("product-search-input");
const searchBtn = document.getElementById("search-product-btn");
const barcodeInput = document.getElementById("barcode-input");
const lookupBarcodeBtn = document.getElementById("lookup-barcode-btn");

const productsGrid = document.getElementById("products-grid");
const productsEmpty = document.getElementById("products-empty");
const productsLoading = document.getElementById("products-loading");
const productsCount = document.getElementById("products-count");
const nutriScoreButtons = document.querySelectorAll(".nutri-score-filter");

const productCategoryBtn = document.querySelectorAll(".product-category-btn");

let selectedGrade = "";

const nutrientsLimit = {
  protein: 50,
  carbs: 100,
  fat: 65,
  sugar: 50,
};

function getProductVolume(name) {
  if (!name || typeof name !== "string") return 1;

  const regex = /(\d+(\.\d+)?)\s?(l|ml)/i;
  const match = name.match(regex);

  if (!match) return 1;

  let value = parseFloat(match[1]);

  return value;
}

function getGradeColor(grade) {
  if (!grade) return "bg-gray-500";
  switch (grade.toLowerCase()) {
    case "a":
      return "bg-green-500";
    case "b":
      return "bg-lime-500";
    case "c":
      return "bg-yellow-500";
    case "d":
      return "bg-orange-500";
    case "e":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}
function getNovaColor(nova) {
  if (!nova) return;
  switch (nova) {
    case 1:
      return "bg-green-500";
    case 2:
      return "bg-yellow-500";
    case 3:
      return "bg-orange-500";
    case 4:
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

async function searchProducts(product, isBarcode = false) {
  productsEmpty.classList.add("hidden");
  productsLoading.classList.remove("hidden");
  productsGrid.innerHTML = "";
  productsCount.textContent = "";

  try {
    let response,
      data,
      products = [];

    if (isBarcode) {
      response = await fetch(
        `https://nutriplan-api.vercel.app/api/products/barcode/${product}`
      );
      data = await response.json();
      if (data?.result) {
        products = [data.result];
      } else {
        products = [];
      }
    } else {
      response = await fetch(
        `https://nutriplan-api.vercel.app/api/products/search?q=${product}`
      );
      data = await response.json();
      products = data.results || [];
    }

    if (selectedGrade) {
      products = products.filter(
        (p) => p.nutritionGrade.toLowerCase() === selectedGrade
      );
    }

    productsLoading.classList.add("hidden");

    if (!products.length) {
      productsEmpty.classList.remove("hidden");
      productsCount.textContent = "0 products found";
      return;
    }

    productsGrid.innerHTML = products
      .map(
        (product) => `
        <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-barcode="${
          product.barcode
        }">
            <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                
                    <img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" src="${
                      product.image
                    }" alt="${
          product.name
        }" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='&lt;div class=\'w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center\'&gt;&lt;i class=\'fa-solid fa-box text-gray-400 text-2xl\'&gt;&lt;/i&gt;&lt;/div&gt;'">
                
                
                <!-- Nutri-Score Badge -->
                
                    ${
                      product.nutritionGrade
                        ? `
  <div class="absolute top-2 left-2 ${getGradeColor(
    product.nutritionGrade
  )} text-white text-xs font-bold px-2 py-1 rounded uppercase">
    Nutri-Score ${product.nutritionGrade.toUpperCase()}
  </div>
`
                        : ""
                    }

                
                
                <!-- NOVA Badge -->
                
                    ${
                      product.novaGroup
                        ? `<div class="absolute top-2 right-2 ${getNovaColor(
                            product.novaGroup
                          )} text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center" title="NOVA 4">
                        ${product.novaGroup}
                    </div>`
                        : ""
                    }
                
            </div>
            
            <div class="p-4">
                <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">Coca cola</p>
                <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    ${product.name}
                </h3>
                
                <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span><i class="fa-solid fa-weight-scale mr-1"></i>${getProductVolume(
                      product.name
                    )}L</span>
                    ${
                      product.nutrients.calories
                        ? ` <span><i class="fa-solid fa-fire mr-1"></i>${product.nutrients.calories.toFixed(
                            2
                          )} kcal/100g</span>`
                        : ""
                    }
                   
                </div>
                
                <!-- Mini Nutrition -->
                <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                        <p class="text-xs font-bold text-emerald-700">${product.nutrients.protein.toFixed(
                          2
                        )}g</p>
                        <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                        <p class="text-xs font-bold text-blue-700">${product.nutrients.carbs.toFixed(
                          2
                        )}g</p>
                        <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                        <p class="text-xs font-bold text-purple-700">${product.nutrients.fat.toFixed(
                          2
                        )}g</p>
                        <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                        <p class="text-xs font-bold text-orange-700">${product.nutrients.sugar.toFixed(
                          2
                        )}g</p>
                        <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                </div>
            </div>
        </div>
      `
      )
      .join("");

    productsCount.textContent = `Found ${products.length} products for "${product}"`;

    document.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", () => {
        const barcode = card.dataset.barcode;
        openProductModal(barcode);
      });
    });
  } catch (error) {
    console.log(error);
    productsLoading.classList.add("hidden");
    productsEmpty.classList.remove("hidden");
  }
}

searchBtn.addEventListener("click", () => {
  const productSearch = searchInput.value.trim();
  if (!productSearch) return;
  searchProducts(productSearch);
});

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const productSearch = searchInput.value.trim();
    if (productSearch) searchProducts(productSearch);
  }
});

lookupBarcodeBtn.addEventListener("click", () => {
  const barcode = barcodeInput.value.trim();
  if (!barcode) return;
  searchProducts(barcode, true);
  openProductModal(barcode)
});

barcodeInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const barcode = barcodeInput.value.trim();
    if (barcode) searchProducts(barcode, true);
    openProductModal(barcode)
  }
  
});

nutriScoreButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedGrade = button.dataset.grade;
    nutriScoreButtons.forEach((b) =>
      b.classList.remove("ring-2", "ring-emerald-600")
    );
    button.classList.add("ring-2", "ring-emerald-600");

    const productSearch = searchInput.value.trim();
    if (productSearch) searchProducts(productSearch);
  });
});

function getPercent(value, max) {
  if (!value || !max) return 0;
  return Math.min((value / max) * 100, 100);
}

function getNutriStatus(grade) {
  if (!grade) return "";
  switch (grade.toUpperCase()) {
    case "A":
      return "Excellent";
    case "B":
      return "Good";
    case "C":
      return "Average";
    case "D":
      return "Poor";
    case "E":
      return "Bad";
    default:
      return "";
  }
}
function getNutriScoreModalColor(grade) {
  if (!grade) return "";
  switch (grade.toUpperCase()) {
    case "A":
      return "#038141";
    case "B":
      return "#85bb2f";
    case "C":
      return "#fecb02";
    case "D":
      return "#ee8100";
    case "E":
      return "#e63e11";
    default:
      return "";
  }
}
function getNovaModalColor(nova) {
  if (!nova) return "";
  switch (nova) {
    case 1:
      return "#038141";
    case 2:
      return "#fecb02";
    case 3:
      return "#ee8100";
    case 4:
      return "#e63e11";
    default:
      return "";
  }
}

async function openProductModal(barcode) {
  const modal = document.getElementById("product-detail-modal");
  modal.classList.remove("hidden");

  try {
    const response = await fetch(
      `https://nutriplan-api.vercel.app/api/products/barcode/${barcode}`
    );
    const data = await response.json();

    if (!data?.result) return;

    const product = data.result;
    console.log(product);

    const { nutrients } = product;

    const proteinPct = getPercent(nutrients.protein, nutrientsLimit.protein);
    const carbsPct = getPercent(nutrients.carbs, nutrientsLimit.carbs);
    const fatPct = getPercent(nutrients.fat, nutrientsLimit.fat);
    const sugarPct = getPercent(nutrients.sugar, nutrientsLimit.sugar);

    modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                
        <div class="p-6">
            <!-- Header -->
            <div class="flex items-start gap-6 mb-6">
                <div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    
                        <img src="${product.image}" alt="${
      product.name
    }" class="w-full h-full object-contain">
                    
                </div>
                <div class="flex-1">
                    <p class="text-sm text-emerald-600 font-semibold mb-1">${
                      product.brand
                    }</p>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">${
                      product.name
                    }</h2>
                    <p class="text-sm text-gray-500 mb-3">${getProductVolume(
                      product.name
                    )} L</p>
                    
                    <div class="flex items-center gap-3">
                        
                            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${getNutriScoreModalColor(product.nutritionGrade)}20">
                                <span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold" style="background-color: ${getNutriScoreModalColor(product.nutritionGrade)}">
                                    ${product.nutritionGrade.toUpperCase()}
                                </span>
                                <div>
                                    <p class="text-xs font-bold" style="color: ${getNutriScoreModalColor(product.nutritionGrade)}">Nutri-Score</p>
                                    ${
                                      getNutriStatus(product.nutritionGrade)
                                        ? `<p class="text-[10px] text-gray-600">${getNutriStatus(
                                            product.nutritionGrade
                                          )}</p>`
                                        : ""
                                    }
                                    
                                </div>
                            </div>
                        
                            ${
                              product.novaGroup
                                ? `<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${getNovaModalColor(product.novaGroup)}20">
                                <span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style="background-color: ${getNovaModalColor(product.novaGroup)}">
                                    ${product.novaGroup}
                                </span>
                                <div>
                                    <p class="text-xs font-bold" style="color: ${getNovaModalColor(product.novaGroup)}">NOVA</p>
                                    <p class="text-[10px] text-gray-600">Ultra-processed</p>
                                </div>
                            </div>`
                                : ""
                            }
                        
                    </div>
                </div>
                <button class="close-product-modal text-gray-400 hover:text-gray-600">
                    <i class="text-2xl fa-solid fa-xmark" ></i>
                </button>
            </div>
            
           <!-- Nutrition Facts -->
<div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200">
  <h3 class="font-bold text-gray-900 mb-4">
    Nutrition Facts <span class="text-sm font-normal text-gray-500">(per 100g)</span>
  </h3>

  <div class="text-center mb-4 pb-4 border-b border-emerald-200">
    <p class="text-4xl font-bold text-gray-900">${nutrients.calories}</p>
    <p class="text-sm text-gray-500">Calories</p>
  </div>

  <div class="grid grid-cols-4 gap-4">

    <!-- Protein -->
    <div class="text-center">
      <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div class="bg-emerald-500 h-2 rounded-full"
             style="width: ${proteinPct}%"></div>
      </div>
      <p class="text-lg font-bold text-emerald-600">${nutrients.protein}g</p>
      <p class="text-xs text-gray-500">Protein</p>
    </div>

    <!-- Carbs -->
    <div class="text-center">
      <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div class="bg-blue-500 h-2 rounded-full"
             style="width: ${carbsPct}%"></div>
      </div>
      <p class="text-lg font-bold text-blue-600">${nutrients.carbs}g</p>
      <p class="text-xs text-gray-500">Carbs</p>
    </div>

    <!-- Fat -->
    <div class="text-center">
      <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div class="bg-purple-500 h-2 rounded-full"
             style="width: ${fatPct}%"></div>
      </div>
      <p class="text-lg font-bold text-purple-600">${nutrients.fat}g</p>
      <p class="text-xs text-gray-500">Fat</p>
    </div>

    <!-- Sugar -->
    <div class="text-center">
      <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div class="bg-orange-500 h-2 rounded-full"
             style="width: ${sugarPct}%"></div>
      </div>
      <p class="text-lg font-bold text-orange-600">${nutrients.sugar}g</p>
      <p class="text-xs text-gray-500">Sugar</p>
    </div>

  </div>

  <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-emerald-200">
    <div class="text-center">
      <p class="text-sm font-semibold text-gray-900">0g</p>
      <p class="text-xs text-gray-500">Saturated Fat</p>
    </div>
    <div class="text-center">
      <p class="text-sm font-semibold text-gray-900">${
        nutrients.fiber ?? 0
      }g</p>
      <p class="text-xs text-gray-500">Fiber</p>
    </div>
    <div class="text-center">
      <p class="text-sm font-semibold text-gray-900">${nutrients.sodium}g</p>
      <p class="text-xs text-gray-500">Salt</p>
    </div>
  </div>
</div>

            
            <!-- Additional Info -->
            
                <div class="bg-gray-50 rounded-xl p-5 mb-6">
                    <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <i class="text-gray-600 fa-solid fa-list"></i>
                        Ingredients
                    </h3>
                    <p class="text-sm text-gray-600 leading-relaxed">Sucre, huile de palme, NOISETTES 13%, cacao maigre 7,4%, LAIT écrémé en poudre 6,6%, LACTOSERUM en poudre, émulsifiants: lécithines [SOJA), vanilline. Sans gluten.</p>
                </div>
        
            
            
            <!-- Actions -->
            <div class="flex gap-3">
                <button class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all" data-barcode="3017620422003">
                    <i class="mr-2 fa-solid fa-plus"></i>Log This Food
                </button>
                <button class="close-product-modal flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                    Close
                </button>
            </div>
        </div>
    
            </div>
    `;

    modal.querySelector(".add-product-to-log").addEventListener("click", () => {
      Swal.fire({
        toast: true,
        position: "bottom-end",
        html: `
    <span style="font-weight: 500;">
      ${product.name} logged to your daily intake! 🎉
    </span>
  `,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: false,
        customClass: {
          popup: "custom-green-toast",
        },
      });

      addItemToLog({
        name: product.name,
        image: product.image,
        type: "product",
        nutrients: {
          calories: Math.round(product.nutrients.calories),
          protein: Math.round(product.nutrients.protein),
          carbs: Math.round(product.nutrients.carbs),
          fat: Math.round(product.nutrients.fat),
        },
        servings: product.brand,
      });

      closeProductModal();
    });

    modal.querySelectorAll(".close-product-modal").forEach((btn) => {
      btn.addEventListener("click", closeProductModal);
    });
  } catch (err) {
    console.error(err);
  }
}

function closeProductModal() {
  const modal = document.getElementById("product-detail-modal");
  modal.classList.add("hidden");
  modal.innerHTML = "";
}

productCategoryBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category;

    searchProducts(category);
  });
});