// firebase imports



const currBalanceEl = document.querySelector('#current-balance');
const addTransactionButton = document.querySelector('#add-transaction-button');
const transactionsTableBody = document.querySelector('#transactions-table tbody');

function addTransaction(date, time, startingBalance, endingBalance, difference) {
    // Select the table body
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
    differenceCell.textContent = difference;
    newRow.appendChild(differenceCell);
 
    // Insert the new row at the top of the table body
    if (tableBody.firstChild) {
        tableBody.insertBefore(newRow, tableBody.firstChild);
    } else {
        tableBody.appendChild(newRow);
    }

    // Update the current balance
   // currBalanceEl.innerHTML = currBalanceEl + endingBalance;
    //currBalanceEl.appendChild(endingBalance);
 }
 
 // Example usage
 addTransaction('2024-07-21', '12:34 PM', '$1000', '$800', '-$200');
 addTransaction('2024-07-22', '01:45 PM', '$800', '$600', '-$200');
 

