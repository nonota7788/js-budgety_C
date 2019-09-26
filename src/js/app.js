/*-------------------------------------*/
/* DATA MODULE
/*-------------------------------------*/
var budgetController = (function() {})();

/*-------------------------------------*/
/* UI MODULE
/*-------------------------------------*/
var UIController = (function() {})();

/*-------------------------------------*/
/* CONTROLLER MODULE
/*-------------------------------------*/
var controller = (function(budgetCtrl, UICtrl) {
  var ctrlAddItem = function() {
    //1: Get the input date
    //2: Add the item to budget controller
    //3: Add new item to UI controller
    //4: Calculate budget
    //5: Display the budget on the UI
    console.log("It works.");
  };

  document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);

  document.addEventListener("keypress", function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
