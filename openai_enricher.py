
import openai
import os

from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

def enrich_note(initial_note, speech_motion):
    """
    Enriches the initial note by making the text more expressive based on the given speech motion.

    Args:
        initial_note (str): The initial note to be enriched.
        speech_motion (str): The desired speech motion to be applied to the text.

    Returns:
        str: The modified text with the desired speech motion.

    Raises:
        Exception: If there is an error during the enrichment process.
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": f"You are an assistant which needs to make the text more {speech_motion}. The text will be the transcript for a video. Please only provide the modified text and nothing else. The length should be approximately the same as the initial text."},
                {"role": "user", "content": initial_note}
            ]
        )
        return response.choices[0].message['content']
    except Exception as e:
        return str(e)
