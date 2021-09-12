const { throws } = require('assert');
const selling = require('./selling.json');
// console.log(selling.SellingItems.length);

async function loadData() {

        var title = "";
        var price = "0";
        var description = "";

        for (let i = 0; i < 2; i++) {
            title = selling.SellingItems[i].title;
            price = selling.SellingItems[i].price;
            description = selling.SellingItems[i].description;

            console.log("in load data" + title, price, description);

            await postItem(title, price, description);
        }

}


async function postItem(title, price, description) {

    console.log("In postItem" + title, price, description);

    const puppeteer = require('puppeteer');
    url = "https://post.craigslist.org/c/sea";
    return (async () => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 })
        await page.goto(url);
        await page.waitForTimeout(1000);
        //-------------------------------------------------
        //-------------------------------------------------
        // seattle 
        await page.click('[type="radio"][name="n"][value="1"]');
        await page.waitForTimeout(1500);
        // for sale by owner
        await page.click('[type="radio"][name="id"][value="fso"]');
        await page.waitForTimeout(1500);
        // General for sale
        await page.click('[type="radio"][name="id"][value="5"]');
        await page.waitForTimeout(1500);
        //-------------------------------------------------
        //-------------------------------------------------
        // title
        await page.type('#PostingTitle', title);
        // price
        await page.type('[name=price]', price);
        // description
        await page.type('#PostingBody', description);
        // city
        await page.type('#geographic_area', 'Edmonds');
        // zip code
        await page.type('#postal_code', '98026');
        // condition good
        await page.click('[id="ui-id-1-button"]');
        await page.click('[id="ui-id-7"]');
        // email
        await page.type('[name=FromEMail]', 'sartaj_96@hotmail.com');
        // phone/text
        await page.click('[name="show_phone_ok"]');
        await page.type('[name=contact_phone]', '2062288181');
        await page.type('[name=contact_name]', 'mike');
        // submit
        await page.waitForTimeout(3000);
        await page.click('[name="go"]');
        await page.waitForTimeout(2000);
        //-------------------------------------------------
        //-------------------------------------------------
        //              [map location]
        await page.click('[class="continue bigbutton"]')
        await page.waitForTimeout(2000);
        //-------------------------------------------------
        //-------------------------------------------------
        //              [image upload]

        // have function that goes through pic folder and finds pic with 
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click("[id='plupload']"),
        ]);

        // find file in folder,  gives us the file name with title
        var pics = findPics(title);
        await fileChooser.accept(pics);

        /// await fileChooser.accept(['C:/Users/lenovo/Desktop/sell/mini fridge1.jpg', 'C:/Users/lenovo/Desktop/sell/mini fridge2.jpg']);


        //              [continue button]
        await page.waitForTimeout(10000);
        await page.click('[class="done bigbutton"]');
        await page.waitForTimeout(5000);
        //-------------------------------------------------
        //-------------------------------------------------
        //              [publish button]
        await page.click('[name="go"]');
        await page.waitForTimeout(5000);
        //-------------------------------------------------
        //-------------------------------------------------

        await browser.close();


        //catch the error and show user
    })().catch(error => { console.error("Something bad happend...", error); });
}

function findPics(title) {

    // have file exception if file not found, dont upload random file. 

    img_path = "C:/Users/lenovo/Desktop/Auto Poster/sell/";
    var fs = require('fs');

    var files = fs.readdirSync(img_path);

    title = title.toLowerCase();
    // console.log("Looking for " + title);
    var fileArray = []

    // find file where name = mini fridge 
    for (var i = 0; i < files.length; i++) {
        files[i].toLowerCase();
        console.log("found file named " +files[i])
        //print(files[i]);
        if (files[i].includes(title)) {
            fileArray.push(img_path + files[i]);
            // console.log(files[i]);
        }
    }
    if (fileArray.length == 0) {
        throw 'Image not found for ' + title
    }

    return fileArray;


}


loadData();
