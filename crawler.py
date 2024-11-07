import requests
from bs4 import BeautifulSoup
import random
import time

# List of proxies
proxies = [
    "http://proxy1:port",
    "http://proxy2:port",
    # Add more proxies as needed
]

# Function to fetch content from a URL
def fetch_page(url):
    # Select a random proxy
    proxy = random.choice(proxies)
    try:
        response = requests.get(url, proxies={"http": proxy, "https": proxy}, timeout=10)
        if response.status_code == 200:
            return response.content
    except requests.RequestException as e:
        print(f"Request error: {e}")
    return None

# Function to check if a job page is active
def is_job_page_active(content):
    soup = BeautifulSoup(content, 'html.parser')
    job_keywords = ["careers", "job openings", "apply now"]
    for keyword in job_keywords:
        if keyword.lower() in soup.text.lower():
            return True
    return False

# Crawl career pages from predefined URLs
def crawl_career_pages(urls):
    active_pages = []
    for url in urls:
        print(f"Checking {url}")
        content = fetch_page(url)
        if content and is_job_page_active(content):
            active_pages.append(url)
            print(f"Active job page found: {url}")
        time.sleep(random.uniform(2, 5))  # Avoid triggering anti-scraping protections
    return active_pages
