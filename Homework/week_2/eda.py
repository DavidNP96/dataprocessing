
# Name: David Pantophlet
# Student number: 12466638
# I have excluded surinam from the data because its GDP seems like a unrealistic
# outlier

import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import json

def load_csv(input_csv):
    """
    loads csv into a dataframe and returns cleaned dataframe
    """

    data = pd.read_csv(input_csv)
    data = data.loc[:,['Country', 'Region', 'GDP ($ per capita) dollars', 'Pop. '
        'Density (per sq. mi.)', 'Infant mortality (per 1000 births)']]
    data = clean(data)
    return(data)

def clean(data):
    """
    gets rid of non-numeric values in numeric collumns
    replaces ',' with '.'
    drops every column with missing values
    """
    # replace ',' with '.' for infantmortality column and tus it into floats
    data['Infant mortality (per 1000 births)'] = data['Infant mortality '
        '(per 1000 births)'].str.replace(',','.')
    data['Infant mortality (per 1000 births)'] = pd.to_numeric(data['Infant '
        'mortality (per 1000 births)'])

    # strips 'dollars from strings in collumns'
    data['GDP ($ per capita) dollars'].replace(regex=True,inplace=True,to_replace=r'\D',value=r'')

    data['GDP ($ per capita) dollars'] = pd.to_numeric(data['GDP '
        '($ per capita) dollars'])

    # drops outlier
    data['GDP ($ per capita) dollars'] = data['GDP ($ per capita) '
        'dollars'].drop(index = data['GDP ($ per capita) dollars'].idxmax())

    data = data.replace('unknown', np.nan)
    data = data.dropna()
    return(data)

def col_info(column):
    """
    retrieve mean, mode, median and standard deviation
    """

    info = {}
    col_mean = data[column].mean()
    col_mode = data[column].mode()[0]
    col_median = data[column].median()
    col_std =  data[column].std()
    info['mean'] = col_mean
    info['mode'] = col_mode
    info['median'] = col_median
    info['std'] = col_std
    return f'mean: {col_mean} mode: {col_mode} median{col_median} standard.dev: {col_std}'

def clm_histogram(column):
    """
    plots histogram for collumns
    """

    data[column].plot.hist()
    plt.show()

def five_num_sum(column):
    """
    returns five number summary for column
    """
    num_sum = data[column].describe()
    return(num_sum)

def clm_bxplt(column):
    """
    plots boxplot for collumns
    """

    data.boxplot(column=[column])
    plt.show()

def json_convert():
    """
    converts dataframe to json and outputs a json file
    """

    new_data = data.loc[:,['Country', 'Region', 'GDP ($ per capita)     '
        'dollars', 'Pop. Density (per sq. mi.)', 'Infant mortality (per 1000 births)']]
    new_data = new_data.set_index("Country")
    new_data.to_json('eda.json', orient = 'index')



if __name__ == "__main__":
    data = load_csv('input.csv')
    clm_histogram('GDP ($ per capita) dollars')
    print(col_info('GDP ($ per capita) dollars'))
    print(five_num_sum('Infant mortality (per 1000 births)'))
    clm_bxplt('Infant mortality (per 1000 births)')
    json_convert()
