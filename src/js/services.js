/*
  A script that determines whether a domain name belongs to a third party.
  Copyright 2012-2014 Disconnect, Inc.
  This program is free software: you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation, either version 3 of the License, or (at your option) any later
  version.
  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  You should have received a copy of the GNU General Public License along with
  this program. If not, see <http://www.gnu.org/licenses/>.
  Authors (one per line):
    Brian Kennish <byoogle@gmail.com>
  Original source: https://github.com/disconnectme/disconnect

  The services class has been borrowed from the repo as several of its methods were 
  useful towards using the json referenced below to label third party sites. This 
  mutated form is likewise published under the terms of GNU General Public License as 
  stated above also without warranty.
*/
const services = {
    /*
  The categories and third parties, titlecased, and URL of their homepage and
  domain names they phone home with, lowercased.
*/
moreServices: {},
googleServices: {},

getData() {
    theUrl = 'https://services.disconnect.me/disconnect-plaintext.json';
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText; 
},

/*
  Google sites are analysed in a separate file...
*/
getGoogle() {
    theUrl = '/ext-libs/shavar-prod-lists/google_mapping.json';
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
},

/* Destringifies an object. */
deserialize(object) {
  return typeof object == 'string' ? JSON.parse(object) : object;
},

/* Provides mapping for labeling */
processServices(data, services) {
  var categories = data.categories;

  for (var categoryName in categories) {
    if (categoryName.length < 12) {
      var category = categories[categoryName];
      var serviceCount = category.length;

      for (var i = 0; i < serviceCount; i++) {
        var service = category[i];

        for (var serviceName in service) {
          var urls = service[serviceName];

          for (var homepage in urls) {
            var domains = urls[homepage];
            var domainCount = domains.length;
            for (var j = 0; j < domainCount; j++)
                  services[domains[j]] = {
                  category: categoryName, name: serviceName, url: homepage
                };
          }
        }
      }
    }
  }
},

/*
  Retrieves data and builds maps if not done yet
*/
setThingsUp(){
    if (this.initiated == true) {
        return;
    }
    this.initiated = true;
    this.processServices(this.deserialize(this.getData()), this.moreServices);
    this.processServices(this.deserialize(this.getGoogle()), this.googleServices);
},

/* Retrieves the third-party metadata, if any, associated with a domain name. */
getService(domain) { return this.moreServices[domain]; },
getGoogleService(domain) { return this.googleServices[domain]; }

}