/*-------------------------------------*/
/* DATA MODULE
/*-------------------------------------*/
var budgetController = (function() {})();

/*-------------------------------------*/
/* UI MODULE
/*-------------------------------------*/
var UIController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDiscription: ".add__description",
    inputValue: ".add__value",
    inpuBtn: ".add__btn"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp.
        description: document.querySelector(DOMstrings.inputDiscription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
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
    //1: Get the input date
    var input = UICtrl.getInput();
    console.log(input);

    //2: Add the item to budget controller
    //3: Add new item to UI controller
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
