import pandas as pd
import numpy as np
import spacy
from tqdm import tqdm
import pickle

import logging

logging.basicConfig(level=logging.INFO)

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split

from sklearn.ensemble import RandomForestClassifier
import csv

from sklearn import metrics
from joblib import dump

logging.info("Getting things loaded...")

# Load dataset
df = pd.read_csv("src/data/AI_ML_Challenge_Training_Data_Set_1_v1.csv")


def remove_punc(row):
    punc = """!()-[]{};:'"\,<>./?@#$%^&*_~"""
    for idx, phrase in enumerate(row):
        for elem in phrase:
            if elem in punc:
                phrase = phrase.replace(elem, "")
                row[idx] = phrase
    row = [w.lower() for w in row]
    return row


def import_data(file):
    logging.info("Importing data from %s..." % file)
    data = {}
    with open(file) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=",")
        first_row = True

        rows = list(csv_reader)
        row_count = len(rows)

        for row in tqdm(rows, total=row_count):
            if not first_row:
                phrases = remove_punc(row[1:])
                data[row[0]] = phrases
            first_row = False
    return data

def get_classification_df(data, raw):
    df = pd.DataFrame.from_dict(data, orient='index')
    df['Clause ID'] = [int(idx) for idx in df.index]

    df = df.merge(raw, on='Clause ID')
    df.index = df["Clause ID"]
    df = df.drop(columns=["Clause Text", "Clause ID"])
    return df


train_dict = import_data("src/data/keyPhrase-main.csv")
test_dict = import_data("src/data/keyPhrase-val.csv")
main = get_classification_df(train_dict, df)

Y = main["Classification"].tolist()

def get_corpus(x_dict):
    corpus_str = []
    for clause in x_dict:
        s = " "
        corpus_str.append(s.join(x_dict[clause]))
    return corpus_str

count_vect = CountVectorizer(stop_words='english')
X = count_vect.fit_transform(get_corpus(train_dict))
X_test = count_vect.transform(get_corpus(test_dict))

pickle.dump(count_vect, open("src/count_vect.pickel", "wb"))
logging.info("Vectorizer saved...")

logging.info("Splitting data into train/val/test...")
X_train, X_val, y_train, y_val = train_test_split(
    X, Y, test_size=0.15, random_state=1337
)
logging.info("Training the model...")

model = RandomForestClassifier(random_state=2020)
model.fit(X_train, y_train)


# Generate results and metrics from the model
logging.info("Generating metrics...")
ypred = model.predict_proba(X_val)[:, 1]
roc = metrics.roc_auc_score(y_val, ypred)
fpr, tpr, thresholds = metrics.roc_curve(y_val, ypred)
optimal_idx = np.argmax(tpr - fpr)
optimal_threshold = thresholds[optimal_idx]

decisions = (ypred >= optimal_threshold).astype(int)
print("Optimal threshold: {}".format(optimal_threshold))
print(
    "Precision = {}".format(metrics.precision_score(y_val, decisions, average="macro"))
)
print("Recall = {}".format(metrics.recall_score(y_val, decisions, average="macro")))
print("Accuracy = {}".format(metrics.accuracy_score(y_val, decisions)))
print("F1 = {}".format(metrics.f1_score(y_val, decisions, average="weighted")))
print("Brier Score = {}".format(metrics.brier_score_loss(y_val, decisions)))

print(metrics.confusion_matrix(y_val, decisions))

# Get most important features
logging.info("Generating metrics...")
num_features = 50
importances = model.feature_importances_
std = np.std([tree.feature_importances_ for tree in model.estimators_],
             axis=0)
indices = np.argsort(importances)[::-1][:num_features]
words = count_vect.get_feature_names()
print("The most important features to this model are:")
print([words[i] for i in indices])


logging.info("Predicting on test data...")
y_test_pred = model.predict_proba(X_test)
y_test_decisions = (y_test_pred[:, 1] >= optimal_threshold).astype(int)

test_df = pd.DataFrame.from_dict(test_dict, orient='index')
test_df['Clause ID'] = [int(idx) for idx in test_df.index]
test_df["prob_acceptable"] = y_test_pred[:, 0]
test_df['classification'] = y_test_decisions
test_df = test_df[["Clause ID", "prob_acceptable", "classification"]]
test_df.to_csv("src/results/val_results.csv", index=False)


dump(model, "src/models/eula.joblib")
logging.info("Training complete and model saved...")
