from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient("mongodb+srv://efemenaisaac1410:dAulMCFCqb9g1eo6@cluster0.8kjyk.mongodb.net/job_crawler?retryWrites=true&w=majority&appName=Cluster0")
db = client.job_crawler
collection = db.active_career_pages

# Endpoint to get active career pages
@app.route("/api/career-pages", methods=["GET"])
def get_career_pages():
    pages = list(collection.find({"active": True}, {"_id": 0}))
    return jsonify(pages)

if __name__ == "__main__":
    app.run(debug=True)
