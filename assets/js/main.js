const mealsEl = document.querySelector(".meals__content")
const favoriteContainer = document.querySelector(".favorite__list")

const searchInput = document.querySelector(".search__content input")
const searchButton = document.querySelector(".search__content button")

getRandomMeal()
fetchFavMeals()

// ==================== getRandomMeal() ====================
async function getRandomMeal() {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    const respData = await resp.json()
    const randomMeal = respData.meals[0]

    addMeal(randomMeal, true)
    console.log(randomMeal)
}

// ==================== getMealById(id) ====================
async function getMealById(id) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id)

    const respData = await resp.json()
    const meal = respData.meals[0]

    return meal
}

// ==================== getMealsBySearch(term) ====================
async function getMealsBySearch(term) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term)

    const respData = await resp.json()
    const meals = respData.meals

    return meals
}

// ==================== addMeal(mealData, random = false) ====================
function addMeal(mealData, random = false) {
    const mealsContent = document.querySelector(".meals__content")
    const mealDiv = document.createElement("div")
    mealsContent.classList.add("meal")

    mealDiv.innerHTML = `
    
    <div class="meal-header">
    ${
        random
            ? `
        <span class="random"> Random Recipe </span>`
            : ""
    }
    
    <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />
    </div>
    
    <div class="meal-body">
    <h4>${mealData.strMeal}</h4>
    <button class="fav-btn">
    <i class="fas fa-heart"></i>
    </button>
    
    
    </div>`

    const btn = mealDiv.querySelector(".meal-body .fav-btn")

    btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) {
            removeMealLocalStorage(mealData.idMeal)
            btn.classList.remove("active")
        } else {
            addMealLocalStorage(mealData.idMeal)
            btn.classList.add("active")
        }

        fetchFavMeals()
    })

    mealsContent.append(mealDiv)
}

// ==================== addMealLocalStorage(mealId) ====================
function addMealLocalStorage(mealId) {
    const mealIds = getMealsLocalStorage()

    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]))
}

// ==================== removeMealLocalStorage(mealId) ====================
function removeMealLocalStorage(mealId) {
    const mealIds = getMealsLocalStorage()

    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter((id) => id !== mealId)))
}

// ==================== getMealsLocalStorage() ====================
function getMealsLocalStorage() {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"))

    return mealIds === null ? [] : mealIds
}

// ==================== fetchFavMeals() ====================
async function fetchFavMeals() {
    //clean the container
    favoriteContainer.innerHTML = ""

    const mealIds = getMealsLocalStorage()

    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i]

        meal = await getMealById(mealId)
        addMealFav(meal)
    }
}

// ==================== addMealFav(mealData) ====================
function addMealFav(mealData) {
    const favMeal = document.createElement("li")

    favMeal.innerHTML = `      
    <img
    src="${mealData.strMealThumb}" 
    alt="${mealData.strMeal}" />
    <span>${mealData.strMeal}</span>
    <button class="clear"><i class="fa-solid fa-xmark"></i></i></button>
    `
    const btnClr = favMeal.querySelector(".clear")

    btnClr.addEventListener("click", () => {
        const btnClrFav = document.querySelector(".meal-body .fav-btn")
        removeMealLocalStorage(mealData.idMeal)
        btnClrFav.classList.remove("active")

        fetchFavMeals()
    })
    favoriteContainer.append(favMeal)
}

searchButton.addEventListener("click", async () => {
    //clean container
    mealsEl.innerHTML = ""

    const search = searchInput.value
    const meals = await getMealsBySearch(search)

    if (meals) {
        meals.forEach((meal) => {
            addMeal(meal)
        })
    }
})
