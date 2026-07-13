from flask import Flask, render_template, request, jsonify
from database.database import (
    initialize_database,
    save_translation,
    get_translation_history,
    delete_translation,
    clear_translation_history
)
from services.translator import translate_text

app = Flask(__name__)
initialize_database()

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/translate", methods=["POST"])
def translate():

    data = request.get_json()

    text = data.get("text", "")
    source = data.get("source", "auto")
    target = data.get("target", "en")
#error_ handling 
    if not text.strip():
        return jsonify({
            "error": "Please enter some text to translate."
        }), 400

    translated, detected_language = translate_text(
        text=text,
        source=source,
        target=target
    )

    save_translation(
        source_text=text,
        translated_text=translated,
        source_language=detected_language,
        target_language=target
    )

    return jsonify({
        "translated_text": translated
    })
@app.route("/history", methods=["GET"])
def history():

    history = get_translation_history()

    return jsonify(history)

@app.route("/history/<int:history_id>", methods=["DELETE"])
def delete_history(history_id):
    delete_translation(history_id)

    return jsonify({
        "message": "Translation deleted successfully."
        })

@app.route("/history", methods=["DELETE"])
def clear_history():

    clear_translation_history()

    return jsonify({
        "message": "History cleared successfully."
    })


if __name__ == "__main__":
    app.run(debug=True)

