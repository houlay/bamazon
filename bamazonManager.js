//require dependencies
const sql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");
const table = require("console.table");

var choice;
var productName;
var departmentName;
var price;
var stockQuantity;
var addedStock;
var currentStock;
var newStock;
var targetId;

//connect to the database
const connection = sql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    //once connected, runs initial function
    mainMenu();    
});

function mainMenu() {
    //display options to user
    inquirer.prompt([
    {        
        type: "list",
        name: "userChoice",
        message: "Welcome! What would you like to do?",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Quit"
        ]
    }]).then(answers => {
            choice = answers.userChoice;
            //act based on user choice
            switch (choice) {
                case "View Products for Sale":
                displayAllProducts();
                break;
                case "View Low Inventory":
                queryLowInventory();
                break;
                case "Add to Inventory":
                addToInventory();
                break;
                case "Add New Product":
                addNewProduct();
                //insertIntoDatabase();
                break;
                case "Quit":
                connection.end();
                break;
            };
        }
    );
};

function displayAllProducts() {
    //query from database and then display the results to the user
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\nWelcome! Here is the list of our products:\n");
        console.table(res);
        //return to main menu
        mainMenu();        
    });
};

function queryLowInventory() {
    //query the database to check for any items with stock_quantity less than 5
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) throw err;
        if (res[0] === undefined) {
            console.log("All inventory is good!")
            //return to main menu
            mainMenu();
        } else {
            //print any item with a stock_quantiy lower than 5
            console.table(res);
            //then return to main menu
            mainMenu();
        };
    })
};

function addNewProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "product",
            message: "Please enter the name of the product:"
        },
        {
            type: "input",
            name: "department",
            message: "Please enter the name of the department:"
        },
        {
            type: "input",
            name: "price",
            message: "Please enter the price of the product:",
            //input has to be a float/int and cannot be empty
            validate: function validatePrice(price) {
                return (!isNaN(price)) || "Please enter a valid price!(format: ##.##)"
            }
        },
        {
            type: "input",
            name: "stock",
            message: "Please enter the quantity of the product:",
            //input has to be an int and cannot be empty
            validate: function validateStock(stock) {
                return (stock % 1 === 0) || "Please enter a valid number!"
            }
        }
    ]).then(results => {
        productName = results.product;
        departmentName = results.department;
        price = parseFloat(results.price).toFixed(2);
        stockQuantity = parseInt(results.stock);
        //write to database
        insertIntoDatabase();
    });
};

function insertIntoDatabase() {
    connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUE ('" + productName + "', '" + departmentName + "', " + price + "," + stockQuantity + ")", function(err, res) {
        if (err) throw err;
        console.log("You have successfully added this new product!");
        mainMenu();
    })
};

function addToInventory() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "Please enter the ID of the product you wish to restock:",
            //id has to be an int and cannot be empty
            validate: function validateStock(id) {
                return (id % 1 === 0) || "Please enter a valid number!"
            }
        },
        {
            type: "input",
            name: "stock",
            message: "Please enter the number of items you wish to add to inventory:",
            //id has to be an int and cannot be empty
            validate: function validateStock(stock) {
                return (stock % 1 === 0) || "Please enter a valid number!"
            }
        }
    ]).then(results => {
        targetId = results.id;
        addedStock = parseInt(results.stock);
        //query the database again to get the existing stock
        getStock();
    })
};

function getStock(){
    connection.query("SELECT stock_quantity FROM products WHERE item_id =" + targetId, function(err,res){
        if (err) throw err;
        //calculate what the updated stock quantity should be
        currentStock = parseInt(res[0].stock_quantity);
        newStock = currentStock + addedStock;
        //proceed to update the database
        updateDatabase();
    })
};

function updateDatabase() {
    connection.query("UPDATE products SET stock_quantity =" + newStock + " WHERE item_id =" + targetId, function(err, res) {
        if (err) throw err;
        console.log("You have successfully added more stock!");
        mainMenu();
    })
};