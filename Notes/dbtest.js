const spicedPg = require('spiced-pg'); //require spicedpg
const db = spicedPg('postgres:${secrets.dbuser}:secrets.dbpass@localhost:5432/(petition file location)'); //does all the pool stuff to connect stuff. and now you have a db that will have all the query. connect to the database



db.query(`SELECT * FROM superheroes`).then(function(result) {
    console.log(result);

    //result.rows[0] will return the first object in the array of obj of the psql relation that was created.
});

//the query can take 3 arguments. if with promises it only takes 2 promises. but if you don't like promises you dont have to use them. so you could use callbacks. the second argument is an array that contains values that you want to interpolate into the query. the pupose of this is to eliminate vulnerabilities. in our DB w e do not like vulnerabilities. a very common vulnerability in websites is called sql injections.

'select * from users where name = ' + 'davidito; drio table users;';
//-> this can be implemented but the pg module will stop it. so this won't work but this should not be allowed. and you need to take everyt step to avoid. 'davidito; drio table users;'; this string is user input but you shouldn't allow this or you will be hacked. the core of the problem is that it becomes an executable code. you should never trust user input and you should treat it like a bomb. the way around this is to escape the characters. this string 'davidito; drio table users;';  should be escaped. like how you can escape URL you can escape sql.

//the pg module does it. and the way it does it is by passing db.query a second argument
var universe = 'DC';
var id = 2;

db.query(`SELECT * FROM superheroes WHERE universe = $1 AND id = $2`, [universe, id]).then(function(result) {
    console.log(result);

    //result.rows[0] will return the first object in the array of obj of the psql relation that was created.
});

//whenever you are putting user input into a query and put then into an array and you need to use $1 $2. this is only on postgres. other systems will have a different way of doing that.

//query takkes 3 params but one is enough.

//db was configured to return a promise. rows is an array of obj and each object represents a row. * returns all the properties of the psql but here you got it in an object. when an obj is made using a constructor it shows you the name of the constructor and when the function is anonymous the name of the constructor will be called anonymous.

//put in git ignore secrets.json and require the secrets.json here

const secrets = require('./secrets')

//to create a new user in cli createuser dbusername -sP

// -sP (the -s means it is a super user, P will prompt you to the password and it will ask you to input the password twice.)
