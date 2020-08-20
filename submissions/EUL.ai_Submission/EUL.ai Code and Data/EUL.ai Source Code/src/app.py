from flask import Flask, request, make_response, jsonify

import logging

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

# Initialize ML

logging.info("Initializing ML stuff...")
import spacy
import numpy
from joblib import load

count_vect = pickle.load(open("./count_vect.pickel", "rb"))
predictor = load("./../EUL.ai Compiled Models/eula.joblib")
logging.info("ML stuff loaded...")


@app.route("/")
def index():
    return {
        "endpoints": {
            "/clause": {
                "description": "Given a clause, predicts a classification",
                "required_params": {"text": "str"},
            }
        }
    }


@app.route("/clause", methods=["POST"])
def clause():
    clause_text = request.form.get("text")
    if clause_text:
        prediction = predictor.predict_proba(count_vect.transform(clause_text))[
            :, 1
        ][0].astype(str)
        return {"text": clause_text, "prediction": prediction}
    raise InvalidUsage("No clause text provided", status_code=400)


class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv["message"] = self.message
        return rv


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

