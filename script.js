var nameInput = document.getElementById("expenseName");
var amountInput = document.getElementById("expenseAmount");
var categoryInput = document.getElementById("expenseCategory");

var addButton = document.getElementById("addButton");
var expenseList = document.getElementById("expenseList");
var totalDisplay = document.getElementById("total");
var summaryList = document.getElementById("summaryList");

var budgetInput = document.getElementById("budgetAmount");
var saveBudgetButton = document.getElementById("saveBudget");
var budgetDisplay = document.getElementById("budget");
var spentDisplay = document.getElementById("spent");
var remainingDisplay = document.getElementById("remaining");

var expenses =
    JSON.parse(localStorage.getItem("studentExpenses")) || [];


function displayExpenses() {

    expenseList.innerHTML = "";

    if (expenses.length == 0) {
        expenseList.innerHTML =
            "<p>No expenses yet. Start tracking your spending!</p>";
    }

    document.getElementById("expenseCount").innerHTML =
        expenses.length;


    var totalAmount = 0;

    var food = 0;
    var transport = 0;
    var school = 0;
    var data = 0;
    var other = 0;


    for (var i = 0; i < expenses.length; i++) {

        totalAmount =
            totalAmount + expenses[i].amount;


        if (expenses[i].category == "Food") {
            food = food + expenses[i].amount;
        }

        if (expenses[i].category == "Transport") {
            transport = transport + expenses[i].amount;
        }

        if (expenses[i].category == "School") {
            school = school + expenses[i].amount;
        }

        if (expenses[i].category == "Data") {
            data = data + expenses[i].amount;
        }

        if (expenses[i].category == "Other") {
            other = other + expenses[i].amount;
        }


        var item = document.createElement("div");

        item.className = "expense-item";


        var info = document.createElement("div");


        var title = document.createElement("h3");

        title.innerHTML =
            expenses[i].name;


        var categoryText = document.createElement("p");

        categoryText.innerHTML =
            "Category: " + expenses[i].category;


        var amountText = document.createElement("p");

        amountText.innerHTML =
            "₦" + expenses[i].amount;


        var dateText = document.createElement("p");

        dateText.innerHTML =
            "📅 " + (expenses[i].date || "No date");


        var deleteButton =
            document.createElement("button");

        deleteButton.innerHTML = "🗑️";


        deleteButton.onclick =
            (function(index) {

                return function() {

                    expenses.splice(index, 1);

                    localStorage.setItem(
                        "studentExpenses",
                        JSON.stringify(expenses)
                    );

                    displayExpenses();
                };

            })(i);


        info.appendChild(title);
        info.appendChild(categoryText);
        info.appendChild(amountText);
        info.appendChild(dateText);


        item.appendChild(info);
        item.appendChild(deleteButton);


        expenseList.appendChild(item);
    }


    totalDisplay.innerHTML =
        "₦" + totalAmount;


    summaryList.innerHTML = "";


    if (food > 0) {

        summaryList.innerHTML =
            summaryList.innerHTML +
            "<p>Food: ₦" + food + "</p>";
    }


    if (transport > 0) {

        summaryList.innerHTML =
            summaryList.innerHTML +
            "<p>Transport: ₦" + transport + "</p>";
    }


    if (school > 0) {

        summaryList.innerHTML =
            summaryList.innerHTML +
            "<p>School: ₦" + school + "</p>";
    }


    if (data > 0) {

        summaryList.innerHTML =
            summaryList.innerHTML +
            "<p>Data: ₦" + data + "</p>";
    }


    if (other > 0) {

        summaryList.innerHTML =
            summaryList.innerHTML +
            "<p>Other: ₦" + other + "</p>";
    }


    var savedBudget =
        Number(localStorage.getItem("studentBudget")) || 0;


    budgetDisplay.innerHTML =
        "₦" + savedBudget;


    spentDisplay.innerHTML =
        "₦" + totalAmount;


    remainingDisplay.innerHTML =
        "₦" + (savedBudget - totalAmount);


    var warning =
        document.getElementById("budgetWarning");


    var percentage = 0;


    if (savedBudget > 0) {
        percentage =
            (totalAmount / savedBudget) * 100;
    }


    if (percentage > 100) {
        percentage = 100;
    }


    document.getElementById("progressBar").style.width =
        percentage + "%";


    document.getElementById("progressText").innerHTML =
        Math.round(percentage) + "% used";


    if (savedBudget <= 0) {

        warning.innerHTML =
            "Set a budget to start tracking.";

    } else if (totalAmount > savedBudget) {

        warning.innerHTML =
            "🚨 You have exceeded your budget!";

    } else if (totalAmount >= savedBudget * 0.8) {

        warning.innerHTML =
            "⚠️ You are close to your budget limit!";

    } else {

        warning.innerHTML =
            "✅ You are within your budget.";
    }
}


addButton.onclick = function() {

    var name = nameInput.value;

    var amount =
        Number(amountInput.value);

    var category =
        categoryInput.value;

    var date =
        document.getElementById("expenseDate").value;


    if (
        name == "" ||
        amount <= 0 ||
        category == "" ||
        date == ""
    ) {

        alert(
            "Please enter the expense, amount, category and date."
        );

        return;
    }


    expenses.push({

        name: name,

        amount: amount,

        category: category,

        date: date
    });


    localStorage.setItem(
        "studentExpenses",
        JSON.stringify(expenses)
    );


    nameInput.value = "";

    amountInput.value = "";

    categoryInput.value = "";

    document.getElementById("expenseDate").value = "";


    displayExpenses();
};


saveBudgetButton.onclick = function() {

    var budget =
        Number(budgetInput.value);


    if (budget <= 0) {

        alert("Please enter a valid budget.");

        return;
    }


    localStorage.setItem(
        "studentBudget",
        budget
    );


    budgetInput.value = "";


    displayExpenses();


    alert(
        "Budget saved: ₦" + budget
    );
};


displayExpenses();


document.getElementById("clearButton").onclick =
    function() {

        var confirmClear =
            confirm(
                "Are you sure you want to clear all expenses?"
            );


        if (confirmClear) {

            expenses = [];

            localStorage.removeItem(
                "studentExpenses"
            );

            displayExpenses();
        }
    };


document.getElementById("resetBudget").onclick =
    function() {

        var confirmReset =
            confirm(
                "Are you sure you want to reset your budget?"
            );


        if (confirmReset) {

            localStorage.removeItem(
                "studentBudget"
            );

            displayExpenses();
        }
    };