const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const { off } = require('process');

    //let currentPage=""
    chrome.runtime.onMessage.addListenerdd((obj,sender,response) =>{
        const {type,value,pageURL}=obj;
        if(type==="NEW"){
            
            scrapeAmexData(pageURL)
            
        }
        console.log(currentPage)
    })
    async function scrapeAmexData(url) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
    
        
        const data = await page.evaluate(() => {
            const title = document.querySelector('title').innerText.trim();
    
            
    
            const termsSection = document.querySelector('.terms-content');
            if (!termsSection) {
                throw new Error('Terms section not found on the page');
            }
          
    
            const points = Array.from(termsSection.querySelectorAll('.margin-bottom-tnc'));
            const termsAndConditions = points.map(row => {
                const point = Array.from(row.querySelectorAll('p'));
                const pointData = {
                    points: point.map(p => p.textContent.trim())
                };
                return pointData;
            });
            
           
            
    
    
            
            const rows = Array.from(termsSection.querySelectorAll('.row'));
            const interestRatesAndCharges = rows.map(row => {
                const columns = row.querySelectorAll('.col-left p[role="rowheader"], .col-right p[role="cell"]');
                const rowData = {};
                columns.forEach(column => {
                    const key = column.getAttribute('id');
                    const value = column.textContent.trim();
                    rowData[key] = value;
                });
                return rowData;
            });
            
            
            return { title,interestRatesAndCharges,termsAndConditions};
        });
    
        await browser.close();
    
        // Save data to a JSON file
        await fs.writeFile('amex_data.json', JSON.stringify(data, null, 2));
        console.log('Data saved to amex_data.json');
    }
    
    //scrapeAmexData('https://www.americanexpress.com/us/credit-cards/card-application/apply/prospect/terms/gold-card/91190-10-0/?pznOfferCode=100XT-3ILS3W-221P-KUB#offer-terms');
    
    document.addEventListener('DOMContentLoaded', () => {
        const button = document.getElementById('fetch');
        if (button) {
            button.addEventListener('click', () => {
                // Replace 'your-button-id' with the actual ID of your button
                chrome.runtime.sendMessage({ type: "NEW", cardURL: window.location.href });
            });
        }
    });