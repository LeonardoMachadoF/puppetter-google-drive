import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import 'dotenv/config';
import { chapterStartsIn, searchIn, manga } from './info.js';

const main = async () => {
    for (let i in searchIn) {
        const urls = [];
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(searchIn[i], {
            waitUntil: 'networkidle2'
        });

        let images = await page.$$('.pmHCK')
        console.log()
        for (let i in images) {
            let allImages = await images[i].$$('img')
            let res = await allImages[allImages.length - 2].evaluate(i => {
                return i.getAttribute('src')
            })
            urls.push(res.split('=')[0])
            await page.keyboard.press('ArrowRight')
        }

        const formatedArray = urls.map((a, index) => {
            return {
                imageUrl: a,
                page: index
            }
        })

        await fs.writeFile(`${manga.split(' ').join('-').toLowerCase()}-cap-${Number(chapterStartsIn) + Number(i)}.json`, JSON.stringify(formatedArray, null, 2))
        await browser.close()
    }
}

main()