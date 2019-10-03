/*-------------------------------------*/
/* DATA MODULE
/*-------------------------------------*/
var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, desc, val) {
      var ID, newItem;

      //Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Create new item based on 'inc' or 'exp'
      if (type === "exp") {
        newItem = new Expense(ID, desc, val);
      } else if (type === "inc") {
        newItem = new Income(ID, desc, val);
      }

      //Push it into our data structure
      data.allItems[type].push(newItem);

      // Return new element
      return newItem;
    },
    testData: function() {
      console.log(data);
    }
  };
})();

/*-------------------------------------*/
/* UI MODULE
/*-------------------------------------*/
var UIController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDiscription: ".add__description",
    inputValue: ".add__value",
    inpuBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp.
        description: document.querySelector(DOMstrings.inputDiscription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    addListItem: function(obj, type) {
      var html, element;

      //Create HTML elmement based on 'inc' or 'exp'
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html = `<div class="item clearfix" id="income-${obj.id}"><div class="item__description">${obj.description}</div>
        <div class="right clearfix"><div class="item__value">+ ${obj.value}</div>
        <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html = `<div class="item clearfix" id="expense-${obj.id}"><div class="item__description">${obj.description}</div>
        <div class="right clearfix"><div class="item__value">- ${obj.value}</div>
        <div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      }

      // Insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", html);
    },
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

/*-------------------------------------*/
/* CONTROLLER MODULE
/*-------------------------------------*/
var controller = (function(budgetCtrl, UICtrl) {
  var setupEventlistener = function() {
    var DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inpuBtn).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        event.preventDefault();
        ctrlAddItem();
      }
    });
  };

  var ctrlAddItem = function() {
    var input, newItem;
    //1: Get the input date
    input = UICtrl.getInput();

    //2: Add the item to budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    //3: Add new item to UI controller
    UICtrl.addListItem(newItem, input.type);

    //4: Calculate budget
    //5: Display the budget on the UI
  };

  return {
    init: function() {
      console.log("application has started!!");
      setupEventlistener();
    }
  };
})(budgetController, UIController);

controller.init();
