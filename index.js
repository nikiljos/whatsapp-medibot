require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const express = require('express')
const app = express()


const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));

const tips = require('./tips.js');
const cowin = require('./cowin.js')

app.get('*', (req, res) => {
    res.status(404).send("<h1>Sorry, Nothing's here</h1>")
})

app.post('/', function(req, res) {
    // console.log(req.body.Body)

    if (req.body.Body != undefined) {
        sendResponse(req.body);
        res.status(200).send("success");
    } else {
        res.status(400).send("failure")
    }



})

async function sendResponse(data) {

    let input = data.Body;

    components = input.split(" ");
    // console.log(components)
    let param = ""

    for (i = 1; i < components.length; i++) {
        param += ` ${components[i]}`
    }
    if (param[0] == " ") {
        param = param.substring(1)
    }


    let paramEncode = encodeURI(param)
    command = components[0].toLowerCase()

    param = param.toUpperCase();

    // console.log(command, param)

    if (command == "doc" && param) {
        client.messages
            .create({
                from: `whatsapp:${process.env.FROM_NUMBER}`,
                body: `Click this link to search for Dr. ${param} on *QKdoc*\n\nhttps://www.qkdoc.com/create-appointment/?search=${paramEncode}`,
                to: data.From
            })
            .then(message => console.log(data.From, "doc message", message.sid));

    } else if (command == "buy" && param) {
        client.messages
            .create({
                from: `whatsapp:${process.env.FROM_NUMBER}`,
                body: `Click these links to buy ${param} on the given sites\n\n*Netmeds*\nhttps://www.netmeds.com/catalogsearch/result?q=${paramEncode}\n\n*1mg*\nhttps://www.1mg.com/search/all?name=${paramEncode}\n\n*Pharmeasy*\nhttps://pharmeasy.in/search/all?name=${paramEncode}`,
                to: data.From
            })
            .then(message => console.log(data.From, "buy message", message.sid));

    } else if (command == "vaccine" && param) {
        cowin(param)
            .then(coData => {

                client.messages
                    .create({
                        from: `whatsapp:${process.env.FROM_NUMBER}`,
                        body: `Vaccination Availability in Pincode *${param}*\n\n💉Available Slots: *${coData.tCap}*\n\n          Dose 1: *${coData.tCap1}*\n          Dose 2: *${coData.tCap2}*\n\n💉Total Centers Listed: *${coData.tCenters}*\n\nBook your slots on CoWin portal\nhttps://cowin.gov.in`,
                        to: data.From
                    })
                    .then(message => console.log(data.From, "slot message", message.sid));
            })
            .catch(e => {

                client.messages
                    .create({
                        from: `whatsapp:${process.env.FROM_NUMBER}`,
                        body: "Some *Error* ocured⚠️\n\nPls check the PIN code that you entered and try again🙏",
                        to: data.From
                    })
                    .then(message => console.log(data.From, "error slot message", message.sid));

            })


    } else if (command == "consult") {
        client.messages
            .create({
                from: `whatsapp:${process.env.FROM_NUMBER}`,
                body: `Here are some popular Online Consultation services\n\n*Tata Health*\nhttps://www.tatahealth.com/insta-doc\n\n*Appolo 247*\nhttps://www.apollo247.com/\n\n*1mg*\nhttps://www.1mg.com/online-doctor-consultation\n\n*Practo*\nhttps://www.practo.com/consult`,
                to: data.From
            })
            .then(message => console.log(data.From, "buy message", message.sid));

    } else if (command == "health" || command == "tip" || command == "tips") {

        let n = Math.floor(Math.random() * tips.length)
        client.messages
            .create({
                from: `whatsapp:${process.env.FROM_NUMBER}`,
                mediaUrl: [tips[n].url],
                body: `_Health Tip_\n\n*${tips[n].head}*\n\n${tips[n].disc}\n\n_Source:_ WHO`,
                to: data.From
            })
            .then(message => console.log(data.From, "tip message", message.sid));

    } else if (command == "help") {
        client.messages
            .create({
                from: `whatsapp:${process.env.FROM_NUMBER}`,
                body: `Send any of these commands and see the magic🗝️\n\n*doc* _DOCTOR'S NAME_ 👉 to search for a doctor\n\n*buy* _MEDICINE NAME_ 👉 to search and buy a medicine\n\n*vaccine* _PINCODE_ 👉 To find the number of vaccination slots available for each dose in a PIN Code\n\n*consult online* 👉 Links to popular online doctor consultation services\n\n*health tips* 👉 to get a health tip\n\n`,
                to: data.From
            })
            .then(message => console.log(data.From, "help message", message.sid));

    } else {
        client.messages
            .create({
                from: `whatsapp:${process.env.FROM_NUMBER}`,
                body: `Seems like you entered an invalid command😯\n\nSend *help* to list out all available commands🤠`,
                to: data.From
            })
            .then(message => console.log(data.From, "error message", message.sid));
    }


}

app.listen(process.env.PORT || 5000, () => console.log("server running"))