//require dependencies
const sql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");
const table = require("console.table");

var userSelectedId;
var userSelectedQuantity;
var newStock;
var userTotal;

//connect to the database
const connection = sql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Thisisr00t",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    //once connected, runs initial function
    displayAllProducts();    
});

function displayAllProducts() {
    //query from database and then display the results to the user
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\nWelcome! Here is the list of our products:\n");
        console.table(res);
        //once the results are displayed, start the ordering process
        getOrder();        
    });
};

function getOrder() {
    inquirer.prompt([
    {
        type: "input",
        name: "id",
        message: "Please enter the ID of the product you'd like to purchasae:",
        //answer has to be an integer and can not be empty, and has to be within range (1-10)
        validate: function validateIdRange(id) {
            return ((0 < id) && (id <= 10)) || "Please enter a valid product ID (1-10)";
        }
    },
    {
        type: "input",
        name: "quantity",
        message: "Please enter the quantity you'd like to purchase:",
        //answer has to be an integer and can not be empty
        validate: function validateQuantity(quantity) {
            var reg = /^\d+$/;
            return reg.test(quantity) || "Quantity should be a number!";
        }
    }]).then(answers => {
        userSelectedId = parseInt(answers.id);
        userSelectedQuantity = parseInt(answers.quantity);
        //once received user input, query the database and verify against inventory
        checkStock();
    });
};

function checkStock(){
    connection.query("SELECT stock_quantity FROM products WHERE item_id =" + userSelectedId, function(err,res){
        if (err) throw err;
        var currentStock = res[0].stock_quantity;
        //verify against inventory
        if (currentStock >= userSelectedQuantity) {
            newStock = currentStock - userSelectedQuantity;
            //enough items in stock, proceed to process the order
            processOrders();
        } else {
            //prompt the user to try again
            console.log("Insufficent quantity! Please try again!");
            getOrder();
        };
    });
};

function processOrders() {
    //query the database to calculate user's grand total
    connection.query("SELECT price FROM products WHERE item_id =" + userSelectedId, function(err, res) {
        if (err) throw err;
        var price = res[0].price;
        userTotal = userSelectedQuantity * price;
        //then proceed to update the database
        updateInventory();
    });
};

function updateInventory() {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: newStock
          },
          {
            item_id: userSelectedId
          }
        ],
        function(err, res) {
            console.log("Your order has been processed! Your total is: $" + userTotal + "\nHave a nice day!");
            //everything is done at this point, go on and end the connection
            connection.end();          
        }
    );
};