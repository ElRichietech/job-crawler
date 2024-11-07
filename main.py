from pymongo import MongoClient
from crawler import crawl_career_pages

# MongoDB connection setup
client = MongoClient("mongodb+srv://efemenaisaac1410:dAulMCFCqb9g1eo6@cluster0.8kjyk.mongodb.net/job_crawler?retryWrites=true&w=majority&appName=Cluster0")
db = client.job_crawler
collection = db.active_career_pages

# Predefined URLs
career_page_urls = [
    "https://company1.com/careers",
    "https://company2.com/jobs",
]

# Crawl and store active career pages
active_career_pages = crawl_career_pages(career_page_urls)
for url in active_career_pages:
    collection.update_one({"url": url}, {"$set": {"active": True}}, upsert=True)
print("Stored active career pages in MongoDB.")


client = pymongo.MongoClient(MONGO_URI)
print("Connected to MongoDB")
db = client.job_crawler
collection = db.active_career_pages
