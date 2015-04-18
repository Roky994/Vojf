# -- coding: utf-8 --

from geopy.geocoders import Nominatim
from geopy import geocoders
from geopy.exc import GeocoderTimedOut
import json
import re
import timeit

start = timeit.default_timer()

# Unlimited (I think) slower geocode
#geolocator = Nominatim()

# Google API geocoder, 2500 requests per day
geolocator = geocoders.GoogleV3('AIzaSyCH2VhXz62ktmXFZhvLZiEkJRDCLbyO2ss')

with open('rpu-z-naslov.txt') as f:
    content = f.readlines()

i = 0
all = len(content)

file = open('pu-lat-lon.csv', 'w')
file.write("sifrapu,lat,lon\n")

#for line in content[2500:]: For merging
for line in content:
    line = line.split('"')
    print line

    if line[9] == "None":
        address = line[7]
    else:
        address = line[9]

   # print address
    try:
        location = geolocator.geocode(address)
        if location:
            print (location.address, (location.latitude, location.longitude))
            file.write(line[1] + "," + str(location.latitude) + "," + str(location.longitude) + "\n")
            i += 1
    except GeocoderTimedOut as e:
        continue

file.close()

print "successfully geocoded: %d seconds" % float(i/all)

stop = timeit.default_timer()
print stop - start