import csv
import json
import pandas as pd

# get right input csv
INPUT_CSV = "data.csv"

# Loads data in dataframe
data = pd.read_csv(INPUT_CSV)


# gets required data
# data = data.loc[:,["LOCATION", "SUBJECT", "Value"]]

data = data.pivot(index='LOCATION', columns='SUBJECT', values='Value')

print(data)

# cleans data form duplicates and set index right
# data = data.drop_duplicates(subset=["LOCATION"], keep="first")
#data = data.set_index("LOCATION")

# converts data to json file
data.to_json("data.json", orient = "index")
