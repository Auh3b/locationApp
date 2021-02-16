# COVID-19 TESTING SITE LOCATOR

In summary: Location app for nearest covid-19 testing sites in Malawi

There is a lot of misinformation concerning covid-19. I made this app to help those that have not idea on where to get test if they are
preceiving covid symptioms.

This application is tailored for mobile use as it uses geo-location data, and it the case becauese geo-location data is more accurate on mobile as most handsets have built-in GPS as well as cell network hardware that allow for more accurate pin pointing.

When the application is started, and have allowed location data (in **setting** and **browser**), you location is reference to an array of known covid-19 testing sites from which the nearest one is displayed as well a route to get there. The nearest site is determined by [leaflet nearest neighbour](https://github.com/mapbox/leaflet-knn) leafletjs plugin

Unfortuniately, the [directions API](https://developer.mapquest.com/documentation/directions-api/) is not optimized such that in some cases the route is not the fastest.


 
Try it: [Link](https://mwcovidtestingsitelocator.netlify.app/)
