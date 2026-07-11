from deep_translator import GoogleTranslator
from langdetect import detect


def translate_text(text: str, source: str, target: str):
    """
    Translate text and return both the translated text
    and the detected source language.
    """

    if not text.strip():
        return "", source

    try:

        detected_language = source

        if source == "auto":
            detected_language = detect(text)

        translated = GoogleTranslator(
            source=source,
            target=target
        ).translate(text)

        return translated, detected_language

    except Exception as e:
        return f"Error: {str(e)}", source