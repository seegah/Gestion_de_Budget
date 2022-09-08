const itemCtrl = (function () {
  const Item = function (id, description, amount) {
    this.id = id;
    this.description = description;
    this.amount = amount;
  };

  const data = {
    items: [],
  };
  return {
    logData: function () {
      return data;
    },
    addMoney: function (description, amount) {
      //créer un id au hasard
      let ID = itemCtrl.createID();
      //créer new item
      newMoney = new Item(ID, description, amount);
      //poussez le dans le tableau
      data.items.push(newMoney);

      return newMoney;
    },
    createID: function () {
      //créer au hasard des nombres compris entre 0 et 10000 pour les id
      const idNum = Math.floor(Math.random() * 10000);
      return idNum;
    },
    getIdNumber: function (item) {
      //get the item id
      const amountId = item.parentElement.id;
      //break the id into an array
      const itemArr = amountId.split("-");
      //get the id number
      const id = parseInt(itemArr[1]);

      return id;
    },
    deleteAmountArr: function (id) {
      //get all the ids
      const ids = data.items.map(function (item) {
        return item.id;
      });

      const index = ids.indexOf(id);
      data.items.splice(index, 1);
    },
  };
})();

const UICtrl = (function () {
  const UISelectors = {
    incomeBtn: "#add__income",
    expenseBtn: "#add__expense",
    description: "#description",
    amount: "#amount",
    moneyEarned: "#amount__earned",
    moneyAvailable: "#amount__available",
    moneySpent: "#amount__spent",
    incomeList: "#income__container",
    expensesList: "#expenses__container",
    incomeItem: ".income__amount",
    expenseItem: ".expense__amount",
    itemsContainer: ".items__container",
  };

  return {
    getSelectors: function () {
      return UISelectors;
    },
    getDescriptionInput: function () {
      return {
        descriptionInput: document.querySelector(UISelectors.description).value,
      };
    },
    getValueInput: function () {
      return {
        amountInput: document.querySelector(UISelectors.amount).value,
      };
    },
    addIncomeItem: function (item) {
      //Créer une nouvelle section
      const div = document.createElement("div");
      //ajouter une classe
      div.classList = "item income";
      //ajouter un id dans item
      div.id = `item-${item.id}`;
      //ajouter du html
      div.innerHTML = `
            <h4>${item.description}</h4>
            <div class="item__income">
              <span class="income__amount">${item.amount}</span>
              <p class="symbol">FCFA</p>
            </div>
            <i class="fa-solid fa-trash-can"></i>
            `;
      //insérer des revenus dans list
      document
        .querySelector(UISelectors.incomeList)
        .insertAdjacentElement("beforeend", div);
    },
    clearInputs: function () {
      document.querySelector(UISelectors.description).value = "";
      document.querySelector(UISelectors.amount).value = "";
    },
    updateEarned: function () {
      //tous les éléments revenu
      const allIncome = document.querySelectorAll(UISelectors.incomeItem);
      //array with all incomes
      const incomeCount = [...allIncome].map((item) => +item.innerHTML);
      //calculer le budget total
      const incomeSum = incomeCount.reduce(function (a, b) {
        return a + b;
      }, 0);
      //affichage du budget total
      const earnedTotal = (document.querySelector(
        UISelectors.moneyEarned
      ).innerHTML = incomeSum.toFixed(0));
    },
    addExpenseItem: function (item) {
      //créer une nouvelle section
      const div = document.createElement("div");
      //ajouter une classe
      div.classList = "item expense";
      //ajouter un id dans item
      div.id = `item-${item.id}`;
      //ajouter du  html
      div.innerHTML = `
            <h4>${item.description}</h4>
            <div class="item__expense">
                <span class="expense__amount">${item.amount}</span>
                <p class="symbol">FCFA</p>
            </div>
            <i class="fa-solid fa-trash-can"></i>
            `;
      //insérer des dépenses dans la liste
      document
        .querySelector(UISelectors.expensesList)
        .insertAdjacentElement("beforeend", div);
    },
    updateSpent: function () {
      //tous les éléments dépenses
      const allExpenses = document.querySelectorAll(UISelectors.expenseItem);
      //tableau de toutes les dépenses
      const expenseCount = [...allExpenses].map((item) => +item.innerHTML);
      //calculer le total des dépenses
      const expenseSum = expenseCount.reduce(function (a, b) {
        return a + b;
      }, 0);
      // Afficher les dépenses totales
      const expensesTotal = (document.querySelector(
        UISelectors.moneySpent
      ).innerHTML = expenseSum);
    },
    updateAvailable: function () {
      const earned = document.querySelector(UISelectors.moneyEarned);
      const spent = document.querySelector(UISelectors.moneySpent);
      const available = document.querySelector(UISelectors.moneyAvailable);
      available.innerHTML = (+earned.innerHTML - +spent.innerHTML).toFixed(0);
    },
    deleteAmount: function (id) {
      //create the id we will select
      const amountId = `#item-${id}`;
      //select the amount with the id we passed
      const amountDelete = document.querySelector(amountId);
      //remove from ui
      amountDelete.remove();
    },
  };
})();

const App = (function () {
  //event listeners
  const loadEventListeners = function () {
    //get ui selectors
    const UISelectors = UICtrl.getSelectors();
    //ajouter un nouveau revenu
    document
      .querySelector(UISelectors.incomeBtn)
      .addEventListener("click", addIncome);
    //ajouter une nouvelle dépense
    document
      .querySelector(UISelectors.expenseBtn)
      .addEventListener("click", addExpense);

    document
      .querySelector(UISelectors.itemsContainer)
      .addEventListener("click", deleteItem);
  };

  //ajouter revenu
  const addIncome = function () {
    //obtenir la description et la valeur du montant
    const description = UICtrl.getDescriptionInput();
    const amount = UICtrl.getValueInput();
    //si les entrées ne sont pas vides
    if (description.descriptionInput !== "" && amount.amountInput !== "") {
      const newMoney = itemCtrl.addMoney(
        description.descriptionInput,
        amount.amountInput
      );
      //add item to the list
      UICtrl.addIncomeItem(newMoney);
      //effacer les entrées
      UICtrl.clearInputs();
      //mettre à jour le budget
      UICtrl.updateEarned();
      //calculer le solde
      UICtrl.updateAvailable();
    }
  };

  //ajouter dépense
  const addExpense = function () {
    //obtenir la description et la valeur du montant
    const description = UICtrl.getDescriptionInput();
    const amount = UICtrl.getValueInput();
    //si les entrées ne sont pas vides
    if (description.descriptionInput !== "" && amount.amountInput !== "") {
      const newMoney = itemCtrl.addMoney(
        description.descriptionInput,
        amount.amountInput
      );
      UICtrl.addExpenseItem(newMoney);
      //effacer les entrées
      UICtrl.clearInputs();
      //mettre à jour les dépenses
      UICtrl.updateSpent();
      //calculer le solde
      UICtrl.updateAvailable();
    }
  };

  const deleteItem = function (e) {
    if (e.target.classList.contains("fa-solid")) {
      const id = itemCtrl.getIdNumber(e.target);
      UICtrl.deleteAmount(id);
      itemCtrl.deleteAmountArr(id);
      //mettre à jour le budget
      UICtrl.updateEarned();
      //mettre à jour les dépenses
      UICtrl.updateSpent();
      //calculer le solde
      UICtrl.updateAvailable();
    }

    e.preventDefault();
  };

  //initialisation des fonctions
  return {
    init: function () {
      loadEventListeners();
    },
  };
})(itemCtrl, UICtrl);

App.init();
