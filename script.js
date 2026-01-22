const form = document.getElementById('transactionForm');
const descInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const list = document.getElementById('transactionList');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let chart; // For Chart.js

function updateTotals() {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  balanceEl.textContent = income - expense;
  incomeEl.textContent = income;
  expenseEl.textContent = expense;

  renderChart(income, expense);
}

function renderList() {
  list.innerHTML = '';

  if (transactions.length === 0) {
    list.innerHTML = '<li>No transactions yet.</li>';
    return;
  }

  transactions.forEach((t, index) => {
    const li = document.createElement('li');
    li.classList.add(t.type);
    li.innerHTML = `
      ${t.description} - ₹${t.amount}
      <button onclick="removeTransaction(${index})">X</button>
    `;
    list.appendChild(li);
  });
}

function removeTransaction(index) {
  if (confirm("Are you sure you want to delete this transaction?")) {
    transactions.splice(index, 1);
    saveAndRender();
  }
}

function saveAndRender() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateTotals();
  renderList();
}

function renderChart(income, expense) {
  const ctx = document.getElementById('financeChart').getContext('2d');

  if (chart) {
    chart.destroy(); // Destroy previous chart to update
  }

  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expenses'],
      datasets: [{
        label: 'Finance Overview',
        data: [income, expense],
        backgroundColor: ['#4caf50', '#f44336'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
    }
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const description = descInput.value.trim();
  const amount = +amountInput.value;
  const type = typeSelect.value;

  if (description && amount > 0) {
    transactions.push({ description, amount, type });
    saveAndRender();
    form.reset();
  } else {
    alert("Please enter valid description and positive amount.");
  }
});

saveAndRender();
