import whisper

class Audio_to_text:

    def __init__(self):
        self.model = whisper.load_model("base")

    def translation_to_french(self, filename):
        audio = whisper.load_audio(filename)
        result = self.model.transcribe(audio)
        return result["text"]