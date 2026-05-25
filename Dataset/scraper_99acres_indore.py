"""
Check what 99acres actually serves to headless browser.
Run: python check_response.py
"""
import asyncio
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

URL = "https://www.99acres.com/property-in-indore-ffid?city=57&preference=S&area_unit=1&res_com=R&page=1"

async def check():
    async with async_playwright() as pw:
        # Test 1: headless (what scraper uses)
        browser = await pw.chromium.launch(headless=True)
        page = await browser.new_page(user_agent=(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        ))
        await page.goto(URL, timeout=30000, wait_until="networkidle")
        html = await page.content()
        soup = BeautifulSoup(html, "html.parser")
        
        cards = soup.find_all("div", class_="tupleNew__outerTupleWrap")
        title = soup.find("title")
        
        print("=== HEADLESS MODE ===")
        print(f"Page title: {title.text if title else 'N/A'}")
        print(f"Cards found: {len(cards)}")
        print(f"HTML length: {len(html)} chars")
        
        # Check for bot detection signals
        for keyword in ["captcha", "robot", "blocked", "access denied", "verify"]:
            if keyword in html.lower():
                print(f"[!] Bot detection keyword found: '{keyword}'")
        
        # Save headless HTML
        with open("headless_response.html", "w", encoding="utf-8") as f:
            f.write(html)
        print("Saved: headless_response.html")
        await browser.close()

asyncio.run(check())