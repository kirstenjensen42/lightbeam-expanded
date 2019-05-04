# Project Background
As part of a course on systems of privacy and anonymity I developed this project interacting with the challenge of providing more easily digistable information to ordinary users about certain fairly hidden interactions they are having as they use the internet, namely information about the third party HTTP requests involved as they visit sites. While some of these third party interactions deliver content or services for the primary party many are involved in data collection, gathering data from the user for uses such as advertising or analytics. As these interactions are hidden within the average browsing experience it is important that tools be available for users to visualize them. My intention with this project was to offer a user friendly application that provided a multi-faceted display of realtime data regarding third party connections.

## Acknowledgements
Much previous work has been done relating to third party interactions on the internet. Among that work, for example, are some excellent programs offering protection and relief from unsavory connections, particularly relating to advertising and analysis and particularly entities know to "follow" a user from site to site using identifing cookies (these are known as trackers). Ghostery and Privacy Badger are both excellent extensions that will block sites known to be unwanted or identified by the user as unwanted. Both are easy to use and offer consice and helpful information about third party interactions and I highly recommend either.
My work on this project has been possible because of several projects in particular. Firefox Lightbeam is described more below, but the following have also been a help to me and have provided parts of this repository.
### Shavar Prod Lists Repository
https://github.com/mozilla-services/shavar-prod-lists
This repository provided json used to label known third party sites into categories.
### Disconnect
https://github.com/disconnectme/disconnect
This repositor provided methods to use the above json to label a site given the domain.

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
    
### Using the extension
Once you have visited a website data will begin to appear on the view screen base on that view is selected. Three buttons offer different view of the data: a connected graph, a venn diagram, and a matrix (or table). As you visit more sites the data from those will be added. A button allows you to reset the data back to nothing, otherwise data will persist from session to session.

# Insights
This tool has allowed me to understand more which of the regular sites I visit have particularly high interactions with third parties. The matrix view offering labeling of those third parties has helped me understand more about those interactions. All this has made me realize the value of tools such as Ghostery and Privacy Badger. My intension was to show this tool to others and understand their insights as well, potentially enhancing the design based on feedback. This part of the project has not been completed yet.

# Limitations
As mentioned above this project would gain much from feedback from other users, and that is a future goal. There also remain some bugs and limitations of the application. For instance the data structures used (or sometimes the way they are used) are not the most efficient and the program can get bogged down when many connections have been made. This bug is inherent in the original program as well. I believe the implementation of persistent data that could be querried and cached as needed could address much of this issue. This is left at present for future work.
