import * as puppeteer from "puppeteer";

const url = "https://www.csulb.edu/beach-shops/residential-dining-menus";

let gatheredData = {};

async function scrape() {
   const browser = await puppeteer.launch();
   const page = await browser.newPage();
   await page.goto(url);
   
   // Captures the main page content (no headers/sidebars)
   const mainContent = await page.$("#main-content");
   const t = await page.evaluate(main => {
      // Page is a column layout, each object in the page column is a div.field__item
      let fieldItems = main.querySelectorAll(".field__item");
      return ;
   }, mainContent);

   console.log(t);
   
   browser.close();
}

scrape();
