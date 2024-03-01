// imports functions/methods from Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-30537-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")        // Gets string from the input
const addButtonEl = document.getElementById("add-button")          // Button
const shoppingListEl = document.getElementById("shopping-list")    // the unordered-list that displays the grocery list

// when button is pressed the code activates
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value   // sets the value from the input
    
    push(shoppingListInDB, inputValue)    // pushes the value from input to the shopping list database
    
    clearInputFieldEl()                   // clears the text bar that takes in input
})


// review code below
// what does onValue do?
// this is a method call where shopping list in the database is first param and a function is second param
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())   // itemsArray is an array of key/value pairs for items in the list
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            /*
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            */
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
    
    
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}