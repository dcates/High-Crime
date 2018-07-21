from flask import Flask,json,jsonify,render_template
import datetime as dt

# import plotly.plotly as py
# import plotly.graph_objs as go

import sqlalchemy as sa
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import relationship, Session
from sqlalchemy import create_engine,func,desc

engine = create_engine("sqlite:///denver_crime_sqlite.db")
Base = automap_base()
Base.prepare(engine, reflect=True)
Base.classes.keys()

Crime = Base.classes.crime
Crime_THC = Base.classes.crime_thc
Traffic_Accidents = Base.classes.traffic_accidents

session = Session(engine)

app = Flask(__name__)

# @app.route("/")
# def home():
#     # """Render Home Page."""
#     return render_template("index.html")

# @app.route("/bar_data")
@app.route("/")
def denver_crime_data():

    year = [2013,2014,2015,2016,2017]

    population = [648.162,662.855,680.658,693.292,703.462]


  # CRIME
    crime_2013 = session.query(Crime.REPORTED_DATE).\
        filter(sa.func.strftime("%Y", Crime.REPORTED_DATE) == "2013").\
        count()/100
    crime_2014 = session.query(Crime.REPORTED_DATE).\
        filter(sa.func.strftime("%Y", Crime.REPORTED_DATE) == "2014").\
        count()/100
    crime_2015 = session.query(Crime.REPORTED_DATE).\
        filter(sa.func.strftime("%Y", Crime.REPORTED_DATE) == "2015").\
        count()/100
    crime_2016 = session.query(Crime.REPORTED_DATE).\
        filter(sa.func.strftime("%Y", Crime.REPORTED_DATE) == "2016").\
        count()/100
    crime_2017 = session.query(Crime.REPORTED_DATE).\
        filter(sa.func.strftime("%Y", Crime.REPORTED_DATE) == "2017").\
        count()/100
    crime=[crime_2013,crime_2014,crime_2015,crime_2016,crime_2017]

  # THC
    thc_2013 = session.query(Crime_THC.REPORTDATE).\
        filter(sa.func.strftime("%Y", Crime_THC.REPORTDATE) == "2013").\
        count()
    thc_2014 = session.query(Crime_THC.REPORTDATE).\
        filter(sa.func.strftime("%Y", Crime_THC.REPORTDATE) == "2014").\
        count()
    thc_2015 = session.query(Crime_THC.REPORTDATE).\
        filter(sa.func.strftime("%Y", Crime_THC.REPORTDATE) == "2015").\
        count()
    thc_2016 = session.query(Crime_THC.REPORTDATE).\
        filter(sa.func.strftime("%Y", Crime_THC.REPORTDATE) == "2016").\
        count()
    thc_2017 = session.query(Crime_THC.REPORTDATE).\
        filter(sa.func.strftime("%Y", Crime_THC.REPORTDATE) == "2017").\
        count()
    thc=[thc_2013,thc_2014,thc_2015,thc_2016,thc_2017]

  # Traffic Accidents
    traffic_2013 = session.query(Traffic_Accidents.REPORTED_DATE).\
        filter(sa.func.strftime("%Y", Traffic_Accidents.REPORTED_DATE) == "2013").\
        count()/100
    traffic_2014 = session.query(Traffic_Accidents.REPORTED_DATE).\
        filter(sa.func.strftime("%Y", Traffic_Accidents.REPORTED_DATE) == "2014").\
        count()/100
    traffic_2015 = session.query(Traffic_Accidents.REPORTED_DATE).\
        filter(sa.func.strftime("%Y", Traffic_Accidents.REPORTED_DATE) == "2015").\
        count()/100
    traffic_2016 = session.query(Traffic_Accidents.REPORTED_DATE).\
        filter(sa.func.strftime("%Y", Traffic_Accidents.REPORTED_DATE) == "2016").\
        count()/100
    traffic_2017 = session.query(Traffic_Accidents.REPORTED_DATE).\
        filter(sa.func.strftime("%Y", Traffic_Accidents.REPORTED_DATE) == "2017").\
        count()/100
    traffic=[traffic_2013,traffic_2014,traffic_2015,traffic_2016,traffic_2017]

  # Map Data
    results = session.query(sa.func.strftime("%Y",Crime.REPORTED_DATE),Crime.REPORTED_DATE,Crime.GEO_LON,Crime.GEO_LAT).\
        filter(Crime.OFFENSE_TYPE.contains("drug-marijuana")).all()

    REPORTED_DATE = [result[1] for result in results]
    GEO_LON = [result[2] for result in results]
    GEO_LAT = [result[3] for result in results]
    

  # Generate the plot trace
    compiledData = {
        "REPORTED_DATE": REPORTED_DATE,
        "GEO_LON": GEO_LON,
        "GEO_LAT": GEO_LAT,
        "trace1": {
            "x": year,
            "y": crime,
            "type": "bar",
            "name": "Crime (100)",
            "marker":{
                "color":"black"
            }
        },
        "trace2": {
            "x": year,
            "y": thc,
            "type": "bar",
            "name": "Marijuana Crime",
            "marker":{
                "color":"green"
            }
        },
        "trace3": {
            "x": year,
            "y": traffic,
            "type": "bar",
            "name": "Traffic Accidents (100)",
            "marker":{
                "color": 'RGB(160,214,180)'
            }
        },
        "population":{
            "x": year,
            "y": population,
            "name": "Denver Population (1000)"
        },
        "layout": {
            "title": "Crime in Denver",
            "legend": {
                "orientation": "h" 
            },
            "margin": { "t": 100, "b":100, "l":50, "r":300},
            "header":{"align":"left"},
            "titlefont": {"family": "Arial","size": 30}
        }
    }

    return render_template("index.html", compiledData=compiledData,GEO_LON=GEO_LON, GEO_LAT=GEO_LAT,REPORTED_DATE=REPORTED_DATE)
    # return jsonify(compiledData)

@app.route("/all")
def all():
    """List all available api routes."""
      # Map Data
    results = session.query(sa.func.strftime("%Y",Crime.REPORTED_DATE),Crime.REPORTED_DATE,Crime.GEO_LON,Crime.GEO_LAT).\
        filter(Crime.OFFENSE_TYPE.contains("drug-marijuana")).all()

    REPORTED_DATE = [result[1] for result in results]
    GEO_LON = [result[2] for result in results]
    GEO_LAT = [result[3] for result in results]

    high_data = {
            "REPORTED_DATE": REPORTED_DATE,
            "GEO_LON": GEO_LON,
            "GEO_LAT": GEO_LAT
    }

    return jsonify(high_data)

@app.route("/map")
def map():
    """List all available api routes."""
      # Map Data
    results = session.query(sa.func.strftime("%Y",Crime.REPORTED_DATE),Crime.REPORTED_DATE,Crime.GEO_LON,Crime.GEO_LAT).\
        filter(Crime.OFFENSE_TYPE.contains("drug-marijuana")).all()

    REPORTED_DATE = [result[1] for result in results]
    GEO_LON = [result[2] for result in results]
    GEO_LAT = [result[3] for result in results]

    high_data = {
            "REPORTED_DATE": REPORTED_DATE,
            "GEO_LON": GEO_LON,
            "GEO_LAT": GEO_LAT
    }

    return render_template("map.html", REPORTED_DATE=REPORTED_DATE,GEO_LAT=GEO_LAT,GEO_LON=GEO_LON)

@app.route("/unemployment")
def unemployment():
    return render_template("unemployment_index.html")

if __name__ == "__main__":
    app.run(debug=True)