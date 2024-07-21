// Import Firebase functions/methods
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

import { appSettings } from "../url.js";

// Initialize Firebase
const app = initializeApp(appSettings);
const database = getDatabase(app);
const balanceRef = ref(database, 'currentBalance');

// Reference to the transactions node
const transactionsRef = ref(database, "transactions");

// Function to add a transaction
function addTransaction(date, time, startBal, endBal) {
    const transaction = {
        date: date,
        time: time,
        startBal: startBal,
        endBal: endBal,
    };
    
    push(transactionsRef, transaction)
        .then(() => {
            console.log("Transaction added successfully");
        })
        .catch((error) => {
            console.error("Error adding transaction: ", error);
        });
}

// Function to add a transaction row to the table
// all parameters are strings
function addTransactionRow(id, date, time, startingBalance, endingBalance) {
    const tableBody = document.querySelector('#transactions-table tbody');

    // Create a new row
    const newRow = document.createElement('tr');

    // Create and append cells to the new row
    const dateCell = document.createElement('td');
    dateCell.textContent = date;
    newRow.appendChild(dateCell);

    const timeCell = document.createElement('td');
    timeCell.textContent = time;
    newRow.appendChild(timeCell);

    const startingBalanceCell = document.createElement('td');
    startingBalanceCell.textContent = startingBalance;
    newRow.appendChild(startingBalanceCell);

    const endingBalanceCell = document.createElement('td');
    endingBalanceCell.textContent = endingBalance;
    newRow.appendChild(endingBalanceCell);

    const differenceCell = document.createElement('td');
    const starting = parseFloat(startingBalance.replace('$', ''));
    const ending = parseFloat(endingBalance.replace('$', ''));
    const difference = ending - starting;
    differenceCell.textContent = `$${difference.toFixed(2)}`;
    newRow.appendChild(differenceCell);

    // Add the Firebase ID cell (hidden)
    const idCell = document.createElement('td');
    idCell.textContent = id;
    idCell.classList.add('hidden-column'); // Apply hidden column class
    newRow.appendChild(idCell);

    // Insert the new row at the top of the table body
    if (tableBody.firstChild) {
        tableBody.insertBefore(newRow, tableBody.firstChild);
    } else {
        tableBody.appendChild(newRow);
    }

    // Update the current balance
    const currBalanceEl = document.querySelector('#current-balance');
    currBalanceEl.innerHTML = "Current Balance: " + endingBalance;
}

// Listen for changes in the transactions node
onValue(transactionsRef, (snapshot) => {
    const transactionsTableBody = document.querySelector('#transactions-table tbody');
    transactionsTableBody.innerHTML = ""; // Clear existing rows

    if (snapshot.exists()) {
        const itemsArray = Object.entries(snapshot.val());
        itemsArray.forEach(([key, transaction]) => {
            addTransactionRow(key, transaction.date, transaction.time, transaction.startBal, transaction.endBal);
        });
    } else {
        console.log("No transactions found");
    }
});

function updateBalance(newBalance) {
    set(balanceRef, newBalance);
}

function checkInputValidity(input) {
    // check if input is not empty
    if (input === "") {
        alert("Please enter a number");
        return false;
    }
    // make sure we have a number
    if (isNaN(input)) {
        alert("Please enter a number");
        return false;
    }
    return true;
}

const addTransactionButton = document.querySelector('#add-transaction-button');
addTransactionButton.addEventListener('click', () => {
    let newBalance = document.querySelector('#input-field').value;
    if (!checkInputValidity(newBalance)) {
        document.querySelector('#input-field').value = ""; // Clear the input field
        return;
    }
    // decimals only up to two places
    newBalance = parseFloat(newBalance).toFixed(2);
    newBalance = `$${newBalance}`;
    updateBalance(newBalance);
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    const currBalanceEl = document.querySelector('#current-balance');
    const currentBalance = currBalanceEl.innerHTML.replace('Current Balance: ', '').trim();
    
    addTransaction(date, time, currentBalance, newBalance);
    document.querySelector('#input-field').value = ""; // Clear the input field
});

// if a row is clicked, delete it and its data from the database
// make deleting the most recent transaction not possible

// Get the table element
const table = document.getElementById('transactions-table'); // Replace with your table's ID

// Add click event listener to the table
table.addEventListener('click', (event) => {
    // Check if the clicked element is a table row
    if (event.target.tagName === 'TD') {
        const row = event.target.parentNode;
        if (row.tagName === 'TR') {
            const rowIndex = Array.from(table.getElementsByTagName('tr')).indexOf(row);
            var numRows = table.getElementsByTagName('tr').length - 1;
            if (rowIndex !== numRows) {
                alert("Can only delete oldest transaction");
            } else if (numRows === 1) {
                alert("Can't delete all transactions");
            } else {
                const confirmDelete = confirm("Delete Transaction?");
                if (confirmDelete) {
                    deleteRow(rowIndex);
                    alert("Deleted");
                } else {
                    alert("Cancelled");
                }
            }
        }
    }
});

// takes in row index and deletes that row and it's corresponding data in Firebase
function deleteRow(rowIndex) {
    const rows = table.getElementsByTagName('tr');
    if (rowIndex >= 1 && rowIndex < rows.length) {
        const idCell = rows[rowIndex].querySelector('.hidden-column');
        const id = idCell ? idCell.textContent : null;
        
        if (id) {
            const transactionRef = ref(database, `transactions/${id}`);
            set(transactionRef, null)
                .then(() => {
                    console.log("Transaction deleted from Firebase");
                })
                .catch((error) => {
                    console.error("Error deleting transaction from Firebase: ", error);
                });
        }
    }
}
