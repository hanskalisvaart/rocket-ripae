let piggybank = [];
    
// Load the piggy bank from the JSON file
fetch("/data/piggybank.json")
  .then(response => response.json())
  .then(data => {
    piggybank = data;
    displayPiggybank();
    displayChart();
  })
  .catch(error => {
    console.log(error);
  });

  function addProduct() {
let productName = document.getElementById("product-name").value;
let targetAmount = parseInt(document.getElementById("target-amount").value);
let targetDate = new Date(document.getElementById("target-date").value);
if (productName && targetAmount && targetDate) {
piggybank.push({
  name: productName,
  amount: 0,
  target: targetAmount,
  targetDate: targetDate
});
document.getElementById("product-name").value = "";
document.getElementById("target-amount").value = "";
document.getElementById("target-date").value = "";
displayPiggybank();
}};

function removeProduct(item) {
piggybank.splice(item, 1);
displayPiggybank();
};


function saveResults() {
try {
// Use local storage to save the results
localStorage.setItem("piggybank", JSON.stringify(piggybank));

// Create a Blob containing the JSON data
const json = JSON.stringify(piggybank);
const blob = new Blob([json], {type: "application/json"});

// Create a link to download the Blob
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "piggybank.json";

// Click the link to download the Blob
document.body.appendChild(a);
a.click();

// Clean up the URL object
URL.revokeObjectURL(url);

// Return a success message
alert("Piggy bank data saved successfully!");
} catch (error) {
console.error("Error saving piggy bank data:", error);
alert("An error occurred while saving piggy bank data. Please try again later.");
}};

function changeTargetDate(item, value) {
let newDate = new Date(value);
if (newDate) {
piggybank[item].targetDate = newDate;
displayPiggybank();
}
else {alert("Invalid date");}
document.getElementById("target-date-" + item).value = newDate.toISOString().slice(0,10);
}


function changeAmount(item, amount) {
const newAmount = parseInt(amount);
if (isNaN(newAmount)) {alert("Please enter a valid amount");} 
else {
piggybank[item].amount = newAmount;
displayPiggybank();
displayChart();
}
document.getElementById("amount-" + item).value = piggybank[item].amount;
}

function changeAmountAndTarget(item, amount, targetAmount) {
const newAmount = parseInt(amount);
const newTargetAmount = parseInt(targetAmount);
if (isNaN(newAmount) || isNaN(newTargetAmount)) {
alert("Please enter valid amounts");
} else {
piggybank[item].amount = newAmount;
piggybank[item].target = newTargetAmount;
displayPiggybank();
}
document.getElementById("amount-" + item).value = piggybank[item].amount;
document.getElementById("target-amount-" + item).value = piggybank[item].target;
}

function displayPiggybank() {
let tableData = "";
let totalAmountSaved = 0;
let totalTargetAmount = 0;
let totalMonthlySavings = 0;

for (let item in piggybank) {
// Calculate the difference between the target date and the current date in months
const monthsToTarget = Math.round((new Date(piggybank[item].targetDate) - new Date()) / (1000 * 60 * 60 * 24 * 30));

// Calculate the amount to save per month
const monthlySavings = Math.round((piggybank[item].target - piggybank[item].amount) / monthsToTarget);

totalAmountSaved += piggybank[item].amount;
totalTargetAmount += piggybank[item].target;
totalMonthlySavings += monthlySavings;

const moveUpBtn = "<button onclick=\"moveUp('" + item + "')\" title=\"Move Up\"><span class=\"iconify\" data-icon=\"material-symbols:arrow-circle-up-outline-rounded\"></span></button>";
const changeBtn = "<button onclick=\"changeAmountAndTarget('" + item + "', document.getElementById('amount-" + item + "').value, document.getElementById('target-amount-" + item + "').value)\" title=\"Change the value\"><span class='iconify' data-icon='mdi:refresh-circle'></span><span class='currency-symbol'> €</span></button>";
const removeBtn = "<button onclick=\"removeProduct('" + item + "')\"><span class=\"iconify\" data-icon=\"mdi:alpha-x-circle-outline\" title=\"remove this product\"></span></button>"

tableData += "<tr id='" + item + "'><td>" + piggybank[item].name + "</td><td><input type='text' id='amount-" + item + "' value='" + piggybank[item].amount + "'></td><td><input type='text' id='target-amount-" + item + "' value='" + piggybank[item].target + "'></td><td>" + new Date(piggybank[item].targetDate).toLocaleDateString('en-GB', {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  }) + "</td><td>" + monthsToTarget + "</td><td><span class='currency-symbol'>€ </span>" + monthlySavings.toLocaleString() + "</td><td>" + moveUpBtn + changeBtn + removeBtn + "<input type='date' id='target-date' onchange=\"changeTargetDate('" + item + "', this.value)\"></td></tr>";
  }

// Add the footer row
// Add the footer row
const footerRow = "<tr><td><strong>Total</strong></td><td><strong><span class='currency-symbol'>€ </span>" + totalAmountSaved.toLocaleString() + "</strong></td><td><strong><span class='currency-symbol'>€ </span>" + totalTargetAmount.toLocaleString() + "</strong></td><td></td><td></td><td><strong><span class='currency-symbol'>€ </span>" + totalMonthlySavings.toLocaleString() + "</strong></td><td></td></tr>";

document.getElementById("piggybank-table").innerHTML = "<thead><tr><th>Product</th><th>Amount Saved<span class='currency-symbol'> €</span></th><th>Target Amount<span class='currency-symbol'> €</span></th><th>Target Date</th><th>Months to Target</th><th>Savings Allocation</th><th>Action</th></tr></thead><tbody>" + tableData + "</tbody><tfoot>" + footerRow + "</tfoot>";
};


function moveUp(item) {
if (item > 0) {
const temp = piggybank[item];
piggybank[item] = piggybank[item - 1];
piggybank[item - 1] = temp;
displayPiggybank();
}};


// Display the piggy bank when the page loads
displayPiggybank();

// Add event listeners to buttons
document.getElementById("add-product").addEventListener("click", addProduct);
document.getElementById("save-results").addEventListener("click", saveResults);

function changeCurrency() {

const currencySelector = document.getElementById('currency-selector');
const currencySymbolElements = document.querySelectorAll('.currency-symbol');

const currencySymbols = {
USD: ' $',
EUR: ' €',
JPY: ' ¥',
GBP: ' £',
AUD: ' A$',
CAD: ' C$',
CHF: ' CHF',
CNY: ' ¥',
HKD: ' HK$',
NZD: ' NZ$',
};

for (let i = 0; i < currencySymbolElements.length; i++) {
const currency = currencySelector.value;
const currencySymbol = currencySymbols[currency];
currencySymbolElements[i].textContent = currencySymbol;
}
};


function displayChart() {
const ctx = document.getElementById('piggybank-chart').getContext('2d');
const labels = Object.values(piggybank).map(item => item.name);
const data = Object.values(piggybank).map(item => item.amount);
const data2 = Object.values(piggybank).map(item => item.target);
const chart = new Chart(ctx, {
type: 'bar',
data: {
  labels: labels,
  datasets: [{
    label: 'Amount Saved',
    data: data,
    backgroundColor: 
    ['rgba(255, 0, 0, 0.4)',
    'rgba(255, 165, 0, 0.4)',
    'rgba(255, 255, 0, 0.4)',
    'rgba(0, 128, 0, 0.4)',
    'rgba(0, 0, 255, 0.4)',
    'rgba(75, 0, 130, 0.4)',
    'rgba(238, 130, 238, 0.4)'],
    borderColor: 
    ['rgba(255, 0, 0, 1)',
    'rgba(255, 165, 0, 1)',
    'rgba(255, 255, 0, 1)',
    'rgba(0, 128, 0, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(75, 0, 130, 1)',
    'rgba(238, 130, 238, 1)'],
    borderWidth: 1
  },
  {
    label: 'Target Amount',
    data: data2,
    backgroundColor: 
    ['rgba(255, 0, 0, 0.4)',
    'rgba(255, 165, 0, 0.4)',
    'rgba(255, 255, 0, 0.4)',
    'rgba(0, 128, 0, 0.4)',
    'rgba(0, 0, 255, 0.4)',
    'rgba(75, 0, 130, 0.4)',
    'rgba(238, 130, 238, 0.4)'],
    borderColor: 
    ['rgba(255, 0, 0, 1)',
    'rgba(255, 165, 0, 1)',
    'rgba(255, 255, 0, 1)',
    'rgba(0, 128, 0, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(75, 0, 130, 1)',
    'rgba(238, 130, 238, 1)'],
    borderWidth: 1
  }]
},
options: {
  scales: {
    y: {beginAtZero: true,
      ticks: {
    color: '#ACACAC'
  }},
  x: {ticks: {
    color: '#ACACAC'
  }}
  },
  plugins: {
    zoom: {
      zoom: {wheel: {
          enabled: true,
          mode: "y"
        },
        pinch: {
          enabled: true
        },
        mode: 'y',
        drag: {
          enabled: true,
        },
      },
      limits: {
              y: {min: 0, max: 35000}
            }
    },
  }}});};
