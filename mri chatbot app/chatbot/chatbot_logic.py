import os

from openai import OpenAI


def analyze_question(question, mri_prediction):
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("Missing OPENAI_API_KEY. Set it in the .env file.")

    system_prompt = (
        "You are an educational advisor for users of a service presenting "
        "experimental brain MRI image classification. You are not a doctor. "
        "Do not diagnose, predict outcomes, or recommend individual treatment. "
        "Explain that the model result is not a diagnosis and may be inaccurate; "
        "encourage consultation with a doctor or radiologist. Respond in English. "
        "For acute neurological symptoms, recommend immediate contact with emergency services. "
        "Always introduce yourself as Dobrosław and ask at the end whether you can help with anything else."
    )
    messages = [
        {"role": "system", "content": system_prompt},
        {
            "role": "user",
            "content": (
                f"Experimental model classification result: {mri_prediction}\n"
                f"User question: {question}"
            ),
        },
    ]

    client = OpenAI(api_key=api_key)
    chat_completion = client.chat.completions.create(
        messages=messages,
        model="gpt-4o-mini",
        temperature=0,
        timeout=30,
    )
    response = chat_completion.choices[0].message.content
    if not response:
        raise RuntimeError("OpenAI returned an empty response.")
    return response.strip()
