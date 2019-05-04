# Project Background
As part of a course on systems of privacy and anonymity I developed this project interacting with the challenge of providing more easily digistable information to ordinary users about certain fairly hidden interactions they are having as they use the internet, namely information about the third party HTTP requests involved as they visit sites. While some of these third party interactions deliver content or services for the primary party many are involved in data collection, gathering data from the user for uses such as advertising or analytics. As these interactions are hidden within the average browsing experience it is important that tools be available for users to visualize them. My intention with this project was to offer a user friendly application that provided a multi-faceted display of realtime data regarding third party connections.

## Acknowledgements


# Lightbeam Extended (A Firefox Browser Extension)

## About Firefox Lightbeam
Firefox Lightbeam is a web extension for visualizing first party and third party HTTP requests between websites in real time used to educate the public about privacy. It provided the base code for this project and can be found at https://github.com/mozilla/lightbeam-we.
The visualization provided in Firefox Lightbeam is a connected graph of first and third party sites that have connected to the user during the browsing experience. First party sites (the sites directly requested) appear as circles and third party sites appear as triangles.

## About Lightbeam Extended
I have extended the visualization options for Lightbeam by adding two new views.
- A venn diagram view allows the viewer to notice the overlapping third parties when visiting multiple sites.
- A matrix view lists primary parties and third parties in a table. As the table is sortable a view can further evaluate the data. In this view known third parties are also labled into various categories, offering further information about the type of third parties that are connected with a visited site.

## Quick Start
For ease of downloading this application has been set up with all its dependencies and whatnot

### Clone the repository or download the zip file

### Run the web extension
Open Firefox and load `about:debugging` in the URL bar.
    - Click the [Load Temporary Add-on](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox) button and select the `manifest.json` file within the source directory of this repository.
    - You should now see the Lightbeam icon on the top right bar of the browser.
    - Click the Lightbeam icon to launch the web extension.


