/*-------------------------------------*/
/* DATA MODULE
/*-------------------------------------*/
var budgetController = (function() {
  var x = 23;

  function add(a) {
    return x + a;
  }

  return {
    publicTest(b) {
      return add(b);
    }
  };
})();

/*-------------------------------------*/
/* UI MODULE
/*-------------------------------------*/
var UIController = (function() {})();

/*-------------------------------------*/
/* CONTROLLER MODULE
/*-------------------------------------*/
var controller = (function(budgetCtrl, UICtrl) {
  var z = budgetCtrl.publicTest(5);

  return {
    anotherPublic: function() {
      console.log(z);
    }
  };
})(budgetController, UIController);

controller.anotherPublic();
