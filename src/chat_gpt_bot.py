import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import undetected_chromedriver as uc

class Chat_gpt_bot:

    def __init__(self):
        options = uc.ChromeOptions()
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-blink-features=AutomationControlled')

        self.driver = uc.Chrome(options=options)

    def send_prompt(self, prompt):
        self.driver.get("https://chatgpt.com/")
        element = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'p[data-placeholder="Poser une question"]'))
        )
        search_bar = self.driver.find_element("css selector", 'p[data-placeholder="Poser une question"]')
        search_bar.clear()
        search_bar.send_keys(prompt)
        search_bar.send_keys(Keys.RETURN)
        element = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'div[data-message-author-role="assistant"]'))
        )
        time.sleep(6)
        response_elem = self.driver.find_element("css selector", 'div[data-message-author-role="assistant"]')
        result = response_elem.text
        self.driver.close()
        return result




