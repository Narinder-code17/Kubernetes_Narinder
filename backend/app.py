from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route("/")
def home():
    return jsonify({
        "message": "Flask backend is running successfully"
    })


@app.route("/submit", methods=["POST"])
def submit():
    data = request.get_json()

    item_name = data.get("itemName")
    item_description = data.get("itemDescription")

    if not item_name or not item_description:
        return jsonify({
            "error": "Item name and item description are required"
        }), 400

    return jsonify({
        "message": "To-Do item received successfully",
        "itemName": item_name,
        "itemDescription": item_description
    }), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
