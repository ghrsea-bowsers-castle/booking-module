var mysql = require('mysql');

//const boring = require('../mysql_boring.js');

function guestLimitGenerator () {
    return Math.floor(Math.random() * (20 - 2) + 2);
}

function serviceFeeGenerator () {
    return Math.floor(Math.random()* 100);
}

function taxesGenerator () {
    return parseFloat((Math.random()*30).toFixed(2));
}

function ratingGenerator () {
    return Math.floor(Math.random()*(6 - 3) + 3);
}

function generatePrice () {
    return Math.floor(Math.random()*1000);
}

function generateAvailability () {
    return Math.floor(Math.random()*2);
}

const dayIncrement = 86400000;

function multipleRentalPriceInfoGenerator (x) {
    const rentalsPriceInfo = [];

    for (var i = 0; i < x; i++) {
        const tempObj = {
            id: i+100,
            guest_limit: guestLimitGenerator(),
            service_fee: serviceFeeGenerator(),
            taxes: taxesGenerator(),
            rating: ratingGenerator()
        };

        rentalsPriceInfo.push(tempObj);

    }

   return rentalsPriceInfo;

}

function rentalsAvailabilityGenerator (rentals, x) {
    const rentalsAvailability = [];
    const refDate = Date.now();
    let contextCounter = 100;
    rentals.forEach((rental)=> {
        
       for (var i = 0; i < x; i++) {
           let date = new Date(refDate + dayIncrement * i).toISOString().slice(0, 10);
           date = '"' + date + '"';
           const tempObj = {
               id: contextCounter,
               rental_date: date,
               price: generatePrice(),
               available: generateAvailability(),
               views: generatePrice(),
               rental_id: rental.id
           }
           rentalsAvailability.push(tempObj);
        //    if (i ===0) {
        //        console.log(tempObj.rental_date);
        //    }
           
           contextCounter++;
       }

    })
    return rentalsAvailability;
}

const hundredRentals = multipleRentalPriceInfoGenerator(100);

const thirtyDaysOfRentals = rentalsAvailabilityGenerator(hundredRentals, 30);


const connection = mysql.createConnection({
    host: 'database',
    port: '3306',
    user: "root",
    database: "bookings",
    password: "----"
})

// console.log(tenRentals);


connection.connect((err)=>{
    if (err) {
        console.log(err);
    }
    console.log("Connected to MySQL DB");
})

hundredRentals.forEach((rental)=>{
    connection.query(
        `INSERT INTO rental_price_info 
        (id, guest_limit, service_fee, taxes, rating) 
        VALUES 
        (${rental.id}, ${rental.guest_limit}, ${rental.service_fee}, 
        ${rental.taxes}, ${rental.rating});`
    );
})


thirtyDaysOfRentals.forEach((rentalDay) => {
    connection.query(
        `INSERT INTO 
        rental_availability
        (
            id, 
            rental_date, 
            price, 
            available, 
            views, 
            rental_id
        )
        VALUES
        (
            ${rentalDay.id}, 
            ${rentalDay.rental_date}, 
            ${rentalDay.price}, 
            ${rentalDay.available}, 
            ${rentalDay.views}, 
            ${rentalDay.rental_id} 
        );`
    )
})

connection.end();


