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
  await page.setDefaultTimeout(10000)
  await page.setDefaultNavigationTimeout(20000)
})
afterAll(async () => {
  await browser.close()
})

describe('Login a valid user', () => {
  it('shows loging form', async () => {
    await page.goto(`${URL}/login`)
    await page.setViewport({ width: 1280, height: 1800 })
    const title = await page.title()
    await page.waitForSelector('.home-link')
    const logoText = await page.$eval('.home-link', (e) => e.innerHTML)

    try {
      const [getXPath] = await page.$x("//div[contains(text(),'Login')]")
      const loginText = await page.evaluate((e) => e.innerText, getXPath)
      expect(loginText).toBe('registerText')
    } catch (e) {
      console.log(`Login element not found`)
    }
    expect(title).toBe('Delv Auth')
    expect(logoText).toBe('DelvAuth')
  })

  it('logs gives error on incorrect details', async () => {
    await page.waitForSelector('input[name=email]')

    await page.type('input[name=email]', 'fakeemail@email.com')
    await page.type('input[name=password]', 'fakepassword')

    const button = await page.click('button[type="submit"]')

    await page.waitForXPath("//div[contains(text(),'Invalid credentials')]")

    try {
      const [getXPath] = await page.$x(
        "//div[contains(text(),'Invalid credentials')]"
      )
      const loginErrorText = await page.evaluate((e) => e.innerText, getXPath)
      expect(loginErrorText).toBe('Invalid credentials')
    } catch (e) {
      console.log(`Login error element not found`)
      throw 'Login error element not found'
    }
  })
  it('logs users in on correct details', async () => {
    await page.waitForSelector('input[name=email]')

    await page.$eval('input[name=email', (el) => (el.value = ''))
    await page.type('input[name=email]', process.env.valid_email)
    await page.$eval('input[name=password', (el) => (el.value = ''))
    await page.type('input[name=password]', process.env.valid_password)

    await page.click('button[type="submit"]')

    await page.waitForXPath("//div[contains(text(),'Dashboard')]")

    try {
      const [getXPath] = await page.$x("//div[contains(text(),'Dashboard')]")
      const dashboardText = await page.evaluate((e) => e.innerText, getXPath)
      expect(dashboardText).toBe('Dashboard')
    } catch (e) {
      console.log(`Dashboard element not found`)
      throw 'Dashboard element not found'
    }
  })
})
