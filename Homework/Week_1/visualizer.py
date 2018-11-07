#!/usr/bin/env python
# Name: David Pantophlet
# Student number: 12466638
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# open and read movies.csv
with open('movies.csv', newline='') as csvfile:
    data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}
    reader = csv.DictReader(csvfile)

    # distilles ratings for every year
    for row in reader:
        for year in data_dict:
            rating = float(row["Rating"])
            if row["Year"] == year:
                data_dict[year].append(rating)

    # calculates averages for every years movies
    for year in data_dict:
        sums = sum(data_dict[year])
        average = sums / len(data_dict[year])
        average = round(average, 3)
        data_dict[year].clear()
        data_dict[year].append(average)

    # lists that will be used to plot data
    years = []
    ratings = []

    # fill lists with years and average of that years movies
    for year in data_dict:
        years.append(year)
        ratings.append(data_dict[year][0])

    # plot movies and averages in graph
    plt.plot(years, ratings)
    plt.axis(['2008', '2018', 8, 9])
    plt.grid(True)
    plt.xlabel('Year')
    plt.ylabel('Average Rating')
    plt.title(' IMDB average movie rating per year 2008-2017')
    plt.show()


if __name__ == "__main__":
     print(data_dict)
