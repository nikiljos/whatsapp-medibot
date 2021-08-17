const axios = require('axios');

async function vaccineData(pin) {

    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    var formattedDate = date + "-" + month + "-" + year;

    // console.log(formattedDate)

    url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=" + pin + "&date=" + formattedDate;
    return await axios.get(url)
        .then(response => {
            let tCap = 0;
            let tCap1 = 0;
            let tCap2 = 0;
            cowinData = response.data
                // console.log(url)



            function length(jsonData) {
                return Object.keys(jsonData).length;
            }

            x = length(cowinData.centers);


            // console.log(x)

            // dName = cowinData.sessions[0].district_name

            var availableCap = 0;

            // if (resError == 1) {
            //   let er = "<div > Sorry, Seems like some error occured.Pls try again < /div>"
            // }



            for (m = 0; m < x; m++) {




                y = length(cowinData.centers[m].sessions)

                for (n = 0; n < y; n++) {

                    let cap = cowinData.centers[m].sessions[n].available_capacity;
                    let cap1 = cowinData.centers[m].sessions[n].available_capacity_dose1;
                    let cap2 = cowinData.centers[m].sessions[n].available_capacity_dose2;
                    tCap += cap;
                    tCap1 += cap1;
                    tCap2 += cap2;

                }
            }
            tCenters = x;
            return ({
                tCap,
                tCap1,
                tCap2,
                tCenters
            })



        })
        .catch(e => {
            throw (e)
        })
}
module.exports = vaccineData;