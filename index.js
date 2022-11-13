import puppeteer from 'puppeteer';
import fs from 'fs/promises';

const main = async () => {
    const searchIn = ''

    const urls = [];
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(searchIn, {
        waitUntil: 'networkidle2'
    });

    let images = await page.$$('.pmHCK')
    await new Promise((resolve) => setTimeout(resolve, 2000))

    for (let i in images) {
        // await new Promise((resolve) => setTimeout(resolve, 50))
        let allImages = await images[i].$$('img')
        let res = await allImages[allImages.length - 2].evaluate(i => {
            return i.getAttribute('src')
        })
        urls.push(res.split('=')[0])
        // await new Promise((resolve) => setTimeout(resolve, 50))
        await page.keyboard.press('ArrowRight')
        // await new Promise((resolve) => setTimeout(resolve, 50))
    }

    console.log(urls)

    await fs.writeFile('urls.json', JSON.stringify(urls, null, 2))
    await browser.close()
}


main()
