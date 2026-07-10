from deep_translator import GoogleTranslator


def translate_text(text: str, source: str, target: str) -> str:
    """
    Translate text from source language to target language.

    Parameters:
        text (str): Text to translate.
        source (str): Source language code (e.g., 'en', 'auto').
        target (str): Target language code (e.g., 'ur').

    Returns:
        str: Translated text.
    """

    if not text.strip():
        return ""

    try:
        translated = GoogleTranslator(
            source=source,
            target=target
        ).translate(text)

        return translated

    except Exception as e:
        return f"Error: {str(e)}"