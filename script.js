var nameInput =
    document.getElementById("expenseName");

var amountInput =
    document.getElementById("expenseAmount");

var categoryInput =
    document.getElementById("expenseCategory");

var dateInput =
    document.getElementById("expenseDate");


var addButton =
    document.getElementById("addButton");

var expenseList =
    document.getElementById("expenseList");

var totalDisplay =
    document.getElementById("total");

var summaryList =
    document.getElementById("summaryList");


var budgetInput =
    document.getElementById("budgetAmount");

var saveBudgetButton =
    document.getElementById("saveBudget");

var budgetDisplay =
    document.getElementById("budget");

var spentDisplay =
    document.getElementById("spent");

var remainingDisplay =
    document.getElementById("remaining");


var expenses =
    JSON.parse(
        localStorage.getItem("studentExpenses")
    ) || [];


/* =========================
   DISPLAY EXPENSES
========================= */

function displayExpenses() {

    expenseList.innerHTML = "";

    var expenseCount =
        document.getElementById("expenseCount");

    expenseCount.textContent =
        expenses.length;


    if (expenses.length === 0) {

        expenseList.innerHTML =
            "<p>No expenses yet. Start tracking your spending!</p>";
    }


    var totalAmount = 0;


    var categories = {
        Food: 0,
        Transport: 0,
        School: 0,
        Data: 0,
        Other: 0
    };


    for (
        var i = 0;
        i < expenses.length;
        i++
    ) {

        var expense =
            expenses[i];


        totalAmount +=
            Number(expense.amount);


        if (
            categories[
                expense.category
            ] !== undefined
        ) {

            categories[
                expense.category
            ] += Number(expense.amount);

        }


        /* EXPENSE CARD */

        var item =
            document.createElement("div");

        item.className =
            "expense-item";


        var info =
            document.createElement("div");

        info.className =
            "expense-info";


        var title =
            document.createElement("h3");

        title.textContent =
            expense.name;


        var categoryText =
            document.createElement("p");

        categoryText.textContent =
            "Category: " +
            expense.category;


        var amountText =
            document.createElement("p");

        amountText.className =
            "amount";

        amountText.textContent =
            "₦" +
            Number(expense.amount)
                .toLocaleString();


        var dateText =
            document.createElement("p");

        dateText.textContent =
            "📅 " +
            (expense.date || "No date");


        var deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-button";

        deleteButton.textContent =
            "🗑️ Delete";


        deleteButton.onclick =
            (function(index) {

                return function() {

                    expenses.splice(
                        index,
                        1
                    );


                    localStorage.setItem(
                        "studentExpenses",
                        JSON.stringify(
                            expenses
                        )
                    );


                    displayExpenses();
                };

            })(i);


        info.appendChild(title);

        info.appendChild(
            categoryText
        );

        info.appendChild(
            amountText
        );

        info.appendChild(
            dateText
        );


        item.appendChild(info);

        item.appendChild(
            deleteButton
        );


        expenseList.appendChild(
            item
        );
    }


    /* TOTAL */

    totalDisplay.textContent =
        "₦" +
        totalAmount.toLocaleString();


    /* SUMMARY */

    summaryList.innerHTML = "";


    var categoryNames = [
        "Food",
        "Transport",
        "School",
        "Data",
        "Other"
    ];


    for (
        var c = 0;
        c < categoryNames.length;
        c++
    ) {

        var categoryName =
            categoryNames[c];


        var categoryAmount =
            categories[
                categoryName
            ];


        if (categoryAmount > 0) {

            var summaryItem =
                document.createElement("p");


            var categoryLabel =
                document.createElement("span");

            categoryLabel.textContent =
                categoryName;


            var categoryValue =
                document.createElement("strong");

            categoryValue.textContent =
                "₦" +
                categoryAmount.toLocaleString();


            summaryItem.appendChild(
                categoryLabel
            );

            summaryItem.appendChild(
                categoryValue
            );


            summaryList.appendChild(
                summaryItem
            );
        }
    }


    /* BUDGET */

    var savedBudget =
        Number(
            localStorage.getItem(
                "studentBudget"
            )
        ) || 0;


    budgetDisplay.textContent =
        "₦" +
        savedBudget.toLocaleString();


    spentDisplay.textContent =
        "₦" +
        totalAmount.toLocaleString();


    var remaining =
        savedBudget - totalAmount;


    remainingDisplay.textContent =
        "₦" +
        remaining.toLocaleString();


    /* PROGRESS */

    var warning =
        document.getElementById(
            "budgetWarning"
        );


    var percentage = 0;


    if (savedBudget > 0) {

        percentage =
            (totalAmount / savedBudget) *
            100;
    }


    var progressWidth =
        percentage;


    if (progressWidth > 100) {
        progressWidth = 100;
    }


    document.getElementById(
        "progressBar"
    ).style.width =
        progressWidth + "%";


    document.getElementById(
        "progressText"
    ).textContent =
        Math.round(percentage) +
        "% used";


    /* WARNING */

    if (savedBudget <= 0) {

        warning.textContent =
            "Set a budget to start tracking.";

    } else if (
        totalAmount > savedBudget
    ) {

        warning.textContent =
            "🚨 You have exceeded your budget!";

    } else if (
        totalAmount >=
        savedBudget * 0.8
    ) {

        warning.textContent =
            "⚠️ You are close to your budget limit!";

    } else {

        warning.textContent =
            "✅ You are within your budget.";
    }
}


/* =========================
   ADD EXPENSE
========================= */

addButton.onclick = function() {

    var name =
        nameInput.value.trim();


    var amount =
        Number(
            amountInput.value
        );


    var category =
        categoryInput.value;


    var date =
        dateInput.value;


    if (
        name === "" ||
        amount <= 0 ||
        category === "" ||
        date === ""
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
        JSON.stringify(
            expenses
        )
    );


    nameInput.value = "";

    amountInput.value = "";

    categoryInput.value = "";

    dateInput.value = "";


    displayExpenses();
};


/* =========================
   SAVE BUDGET
========================= */

saveBudgetButton.onclick =
    function() {

        var budget =
            Number(
                budgetInput.value
            );


        if (budget <= 0) {

            alert(
                "Please enter a valid budget."
            );

            return;
        }


        localStorage.setItem(
            "studentBudget",
            budget
        );


        budgetInput.value = "";


        displayExpenses();


        alert(
            "Budget saved: ₦" +
            budget.toLocaleString()
        );
    };


/* =========================
   CLEAR EXPENSES
========================= */

document.getElementById(
    "clearButton"
).onclick = function() {

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


/* =========================
   RESET BUDGET
========================= */

document.getElementById(
    "resetBudget"
).onclick = function() {

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


/* =========================
   SERVICE WORKER
========================= */

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        function() {

            navigator.serviceWorker
                .register("./sw.js")
                .then(function() {

                    console.log(
                        "Service Worker registered successfully."
                    );

                })
                .catch(function(error) {

                    console.log(
                        "Service Worker registration failed:",
                        error
                    );
                });
        }
    );
}


/* =========================
   START APP
========================= */

displayExpenses();