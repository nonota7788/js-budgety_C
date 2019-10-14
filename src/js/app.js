/*-------------------------------------*/
/* DATA MODULE
/*-------------------------------------*/
var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(el) {
      sum += el.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
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
    deleteItem: function(type, id) {
      var ids, index;
      //id = 3
      //data.allItems[type][id]    id - 6
      //[1, 3, 4, 6, 9]
      // index ... 2

      ids = data.allItems[type].map(function(el) {
        return el.id;
      });

      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calculateBudget: function() {
      // Calculate total income and expsenses
      calculateTotal("inc");
      calculateTotal("exp");

      // Calculate budget (total income - total expenses)
      data.budget = data.totals.inc - data.totals.exp;

      // Calaculate percentage (total expenses / total income)
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function() {
      return {
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        budget: data.budget,
        percentage: data.percentage
      };
    },
    calculatePercentage: function() {
      data.allItems.exp.forEach(function(el) {
        el.calcPercentage(data.totals.inc);
      });
    },
    getPercentage: function() {
      var allPer;
      allPer = data.allItems.exp.map(function(el) {
        return el.getPercentage();
      });
      return allPer;
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
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    totalIncLabel: ".budget__income--value",
    totalExpLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    itemPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  var formatNumber = function(num, type) {
    var numSplit, int, dec;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split(".");

    int = parseInt(numSplit[0]);
    int = int.toLocaleString("en-US");

    dec = numSplit[1];

    return `${type === "exp" ? "-" : "+"} ${int}.${dec}`;
  };

  var nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp.
        description: document.querySelector(DOMstrings.inputDiscription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addListItem: function(obj, type) {
      var html, element, value;

      //Create HTML elmement based on 'inc' or 'exp'
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        value = formatNumber(obj.value, type);
        html = `<div class="item clearfix" id="inc-${obj.id}"><div class="item__description">${obj.description}</div>
        <div class="right clearfix"><div class="item__value">${value}</div>
        <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        value = formatNumber(obj.value, type);
        html = `<div class="item clearfix" id="exp-${obj.id}"><div class="item__description">${obj.description}</div>
        <div class="right clearfix"><div class="item__value">${value}</div>
        <div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      }

      // Insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", html);
    },
    deleteListItem: function(selectorId) {
      var targetNode;
      targetNode = document.getElementById(selectorId);
      targetNode.parentNode.removeChild(targetNode);
    },
    clearfields: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        `${DOMstrings.inputDiscription}, ${DOMstrings.inputValue}`
      );
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(element) {
        element.value = "";
      });
      fieldsArr[0].focus();
    },
    displayBudget: function(obj) {
      var type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(
        DOMstrings.totalIncLabel
      ).textContent = formatNumber(obj.totalInc, "inc");
      document.querySelector(
        DOMstrings.totalExpLabel
      ).textContent = formatNumber(obj.totalExp, "exp");

      if (obj.percentage !== -1) {
        document.querySelector(
          DOMstrings.percentageLabel
        ).textContent = `${obj.percentage} %`;
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },
    dispalyPercentage: function(percentage) {
      var nodeList = document.querySelectorAll(DOMstrings.itemPercLabel);

      nodeListForEach(nodeList, function(current, index) {
        if (percentage[index] !== -1) {
          current.textContent = `${percentage[index]}%`;
        } else {
          current.textContent = "---";
        }
      });
    },
    displayMonth: function() {
      var date = new Date().toLocaleString("en-US", {
        month: "long",
        year: "numeric"
      });
      document.querySelector(DOMstrings.dateLabel).textContent = date;
    },
    changeInputFocus: function() {
      var nodeList;
      nodeList = document.querySelectorAll(
        `${DOMstrings.inputType}, ${DOMstrings.inputDiscription}, ${DOMstrings.inputValue}`
      );
      nodeListForEach(nodeList, function(cur) {
        cur.classList.toggle("red-focus");
      });
      document.querySelector(DOMstrings.inpuBtn).classList.toggle("red");
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
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
    document
      .querySelector(DOM.inputType)
      .addEventListener("change", UICtrl.changeInputFocus);
  };

  var upadteBudget = function() {
    //1: Calculate the budget
    budgetCtrl.calculateBudget();

    //2: Return the budget
    var budget = budgetCtrl.getBudget();

    //3: Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  var updatePercentage = function() {
    var perArr;
    //1: Calculate percentage
    budgetCtrl.calculatePercentage();

    //2: Get percentage
    perArr = budgetCtrl.getPercentage();

    //3: Update the UI
    UICtrl.dispalyPercentage(perArr);
  };

  var ctrlAddItem = function() {
    var input, newItem;
    //1: Get the input data
    input = UICtrl.getInput();

    if (input.description !== "" && input.value !== 0 && !isNaN(input.value)) {
      //2: Add the item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //3: Add new item to UI controller
      UICtrl.addListItem(newItem, input.type);

      //4: Clear input fields
      UICtrl.clearfields();

      //5: Calculate and update budget
      upadteBudget();

      //6: Calaculate and show the percentage
      updatePercentage();
    }
  };

  var findParent = function(el, className) {
    while ((el = el.parentElement) && !el.classList.contains(className));
    return el;
  };

  var ctrlDeleteItem = function(event) {
    var itemDelete, itemID, splitId, type, ID;

    itemDelete = findParent(event.target, "item__delete");
    if (itemDelete) {
      itemID = itemDelete.parentNode.parentNode.id;
      splitId = itemID.split("-");
      type = splitId[0];
      ID = parseInt(splitId[1]);

      //1: Delete  the item from data structure (data.allItem.inc or exp)
      budgetCtrl.deleteItem(type, ID);

      //2: Delete the item from the UI
      UICtrl.deleteListItem(itemID);

      //3: Recalculate　and show the budget
      upadteBudget();

      //4: Calaculate and show the percentage
      updatePercentage();
    }
  };

  return {
    init: function() {
      console.log("application has started!!");
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        totalInc: 0,
        totalExp: 0,
        budget: 0,
        percentage: -1
      });
      setupEventlistener();
    }
  };
})(budgetController, UIController);

controller.init();
