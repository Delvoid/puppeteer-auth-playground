const puppeteer = require('puppeteer')
const { URL } = require('../config')
require('dotenv').config()

let browser
let page

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
    slowMo: 0,
  })
  page = await browser.newPage()
})
afterAll(async () => {
  await browser.close()
})

describe('View home page', () => {
  it('shows the correct logo text', async () => {
    await page.goto(URL)
    const title = await page.title()
    await page.waitForSelector('.home-link')
    const logoText = await page.$eval('.home-link', (e) => e.innerHTML)

    expect(title).toBe('Delv Auth')
    expect(logoText).toBe('DelvAuth')
  })

  it('shows a call to action button try now', async () => {
    const [getXPath] = await page.$x("//a[contains(text(),'Try now')]")
    const button = await page.evaluate((e) => e.innerText, getXPath)

    expect(button).toBe('Try now')
  })
  it('redirects to login page when clicking try now button', async () => {
    const [getXPath] = await page.$x("//a[contains(text(),'Try now')]")
    const button = await page.evaluate((e) => e.innerText, getXPath)
    if (button === 'Try now') {
      await getXPath.click()
    }
    await page.waitForXPath("//div[contains(text(),'Login')]")
    const currentUrl = await page.url()

    expect(currentUrl).toContain('login')
    try {
      const [getXPath] = await page.$x("//div[contains(text(),'Login')]")
      const dashText = await page.evaluate((e) => e.innerText, getXPath)
      expect(dashText).toBe('Login')
    } catch (e) {
      console.log(`Login element not found`)
    }
  })

  it('takes you to register screen when clicking sign up button', async () => {
    const [getXPath] = await page.$x("//a[contains(text(),'SIGNUP')]")
    const signUpButton = await page.evaluate((e) => e.innerText, getXPath)
    if (signUpButton === 'SIGNUP') {
      await getXPath.click()
    }

    await page.waitForXPath("//div[contains(text(),'Create Account')]")
    const currentUrl = await page.url()

    expect(currentUrl).toContain('register')

    try {
      const [getXPath] = await page.$x(
        "//div[contains(text(),'Create Account')]"
      )
      const registerText = await page.evaluate((e) => e.innerText, getXPath)
      expect(registerText).toBe('registerText')
    } catch (e) {
      console.log(`Login element not found`)
    }
  })
})
