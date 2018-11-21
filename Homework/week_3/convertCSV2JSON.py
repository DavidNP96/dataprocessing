import csv
import json
import pandas as pd

INPUT_CSV = "KNMI_20171231.csv"

data = pd.read_csv(INPUT_CSV, index_col=1)

data.to_json("data.json", orient = "index" )
