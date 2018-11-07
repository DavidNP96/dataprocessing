
#!/usr/bin/env python
# Name: David Pantophlet
# Student number: 12466638
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extracts a list of highest rated movies from DOM (of IMDB page).
    Each movie contains the following fields:
    - Title
    - Rating
    - Year of release
    - Actors/actresses
    - Runtime
    """
    # global movie list that will be returned
    movies_list = []

    # find all relevent tags for information about movie
    divs = dom.find_all("div", {"class":"lister-item-content"})

    # distilles out of every div tag relevant information
    for div in divs:
        movie = []
        title = div.h3.a.string
        rating = div.div.div.strong.string
        release = div.h3.find("span", {"class" : "lister-item-year text-muted unbold"}).string.strip("()")

        # makes shure that sequels will be read properly
        if "I" in release:
            sequel, release = release.split()
            release = release.strip("()")
            title = title + " " + sequel

        # put relevant informartion in list as a single movie
        movie.append(title)
        movie.append(rating)
        movie.append(release)
        directors_and_actors = div.find_all("p", {"class" : ""})[1]

        # distilles all actors out of directors_and_actors list
        for actors in directors_and_actors:
            actors_list = []
            if "Stars" in actors:
                actors = actors.next.string
                actors_list.append(actors.strip())
                while True:
                    actors = actors.next.string
                    if not actors == None:
                        if actors.strip() == ",":
                            actors = actors.next.string
                            actors_list.append(actors.strip())
                    else:
                        break
                movie.append(actors_list)
        # get runtime
        runtime = div.find("p", {"class" : "text-muted"}).find("span", {"class" : "runtime"}).string
        time, min = runtime.split()
        movie.append(int(time))

        # fill movie list with movies
        movies_list.append(movie)

    return movies_list


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile, delimiter=",", quotechar='"', quoting=csv.QUOTE_ALL)

    # write proper csv file
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])
    for row in movies:
        writer.writerow(row)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
