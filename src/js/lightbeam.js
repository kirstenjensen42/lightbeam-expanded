const lightbeam = {
  websites: {},
  dataGatheredSince: null,
  numFirstParties: 0,
  numThirdParties: 0,

  async init() {
    this.websites = await storeChild.getAll();
    // this.initTPToggle();
    this.renderGraph('graph');
    this.addListeners();
    this.updateVars();
    
  },

  async initTPToggle() {
    const toggleCheckbox
      = document.getElementById('tracking-protection-control');
    const trackingProtection = document.getElementById('tracking-protection');
    const trackingProtectionDisabled
      = document.getElementById('tracking-protection-disabled');
    // Do we support setting TP
    if ('trackingProtectionMode' in browser.privacy.websites) {
      trackingProtection.hidden = false;
      trackingProtectionDisabled.hidden = true;

      const trackingProtectionState
        = await browser.privacy.websites.trackingProtectionMode.get({});
      let value = true;
      if (trackingProtectionState.value !== 'always') {
        value = false;
      }
      toggleCheckbox.checked = value;
      toggleCheckbox.addEventListener('change', () => {
        const value = toggleCheckbox.checked ? 'always' : 'private_browsing';
        browser.privacy.websites.trackingProtectionMode.set({ value });
      });
    } else {
      trackingProtection.hidden = true;
      trackingProtectionDisabled.hidden = false;
    }
  },

  renderGraph(newView) {
    document.getElementById('graphHeader').innerHTML = newView;
    if (this.view == 'graph') {
      viz.remove();
    } else if (this.view == 'venn') {
      vennCode.remove();
    } else if (this.view == 'matrix') {
      matrix.remove();
    }
    
    const transformedData = this.transformData();
    if (newView == 'graph') {
      viz.init(transformedData.nodes, transformedData.links);
    } else if (newView == 'venn') {
      vennCode.init(transformedData.nodes, transformedData.links);
    } else if (newView == 'matrix') {
      matrix.init(transformedData.nodes, transformedData.links);
    }
    this.view = newView;
    
  },

  addListeners() {
    this.downloadData();
    this.resetData();
    this.viewGraph();
    this.viewVenn();
    this.viewMatrix();
    storeChild.onUpdate((data) => {
      this.redraw(data);
    });
  },

  // Called from init() (isFirstParty = undefined)
  // and redraw() (isFirstParty = true or false).
  async updateVars(isFirstParty) {

    // initialize dynamic vars from storage
    if (!this.dataGatheredSince) {
      const { dateStr, fullDateTime } = await this.getDataGatheredSince();
      if (!dateStr) {
        return;
      }
      this.dataGatheredSince = dateStr;
      const dataGatheredSinceElement
        = document.getElementById('data-gathered-since');
      dataGatheredSinceElement.textContent = this.dataGatheredSince || '';
      dataGatheredSinceElement.setAttribute('datetime', fullDateTime || '');
    }
    if (isFirstParty === undefined) {
      this.numFirstParties = await this.getNumFirstParties();
      this.setPartyVar('firstParty');
      this.numThirdParties = await this.getNumThirdParties();
      this.setPartyVar('thirdParty');
      return;
    }

    // update on redraw
    if (isFirstParty) {
      this.numFirstParties++;
      this.setPartyVar('firstParty');
    } else {
      this.numThirdParties++;
      this.setPartyVar('thirdParty');
    }
  },

  // Updates dynamic variable values in the page
  setPartyVar(party) {
    const numFirstPartiesElement = document.getElementById('num-first-parties');
    const numThirdPartiesElement = document.getElementById('num-third-parties');
    if (party === 'firstParty') {
      if (this.numFirstParties === 0) {
        numFirstPartiesElement.textContent = '';
      } else {
        numFirstPartiesElement.textContent = `${this.numFirstParties} Sites`;
      }
    } else if (this.numThirdParties === 0) {
      numThirdPartiesElement.textContent = '';
    } else {
      const str = `${this.numThirdParties} Third Party Sites`;
      numThirdPartiesElement.textContent = str;
    }
  },

  async getDataGatheredSince() {
    const firstRequestUnixTime = await storeChild.getFirstRequestTime();
    if (!firstRequestUnixTime) {
      return {};
    }
    // reformat unix time
    let fullDateTime = new Date(firstRequestUnixTime);
    let dateStr = fullDateTime.toDateString();
    // remove day of the week
    const dateArr = dateStr.split(' ');
    dateArr.shift();
    dateStr = dateArr.join(' ');
    // ISO string used for datetime attribute on <time>
    fullDateTime = fullDateTime.toISOString();
    return {
      dateStr,
      fullDateTime
    };
  },

  async getNumFirstParties() {
    return await storeChild.getNumFirstParties();
  },

  async getNumThirdParties() {
    return await storeChild.getNumThirdParties();
  },

  // transforms the object of nested objects 'websites' into a
  // usable format for d3
  /*
    websites is expected to match this format:
    {
      "www.firstpartydomain.com": {
        favicon: "http://blah...",
        firstParty: true,
        firstPartyHostnames: false,
        hostname: "www.firstpartydomain.com",
        thirdParties: [
          "www.thirdpartydomain.com",
          ...
        ]
      },
      "www.thirdpartydomain.com": {
        favicon: "",
        firstParty: false,
        firstPartyHostnames: [
          "www.firstpartydomain.com",
          ...
        ],
        hostname: "www.thirdpartydomain.com",
        thirdParties: []
      },
      ...
    }

    nodes is expected to match this format:
    [
      {
        favicon: "http://blah...",
        firstParty: true,
        firstPartyHostnames: false,
        hostname: "www.firstpartydomain.com",
        thirdParties: [
          "www.thirdpartydomain.com",
          ...
        ]
      },
      {
        favicon: "",
        firstParty: false,
        firstPartyHostnames: [
          "www.firstpartydomain.com",
          ...
        ],
        hostname: "www.thirdpartydomain.com",
        thirdParties: []
      },
      ...
    ]

    links is expected to match this format:
    [
      {
        source: {
          favicon: "http://blah...",
          firstParty: true,
          firstPartyHostnames: false,
          hostname: "www.firstpartydomain.com",
          thirdParties: [
            "www.thirdpartydomain.com",
            ...
          ]
        },
        target: {
          favicon: "",
          firstParty: false,
          firstPartyHostnames: [
            "www.firstpartydomain.com",
            ...
          ],
          hostname: "www.thirdpartydomain.com",
          thirdParties: []
        }
      },
      ...
    ]
  */
  transformData() {
    const nodes = [];
    let links = [];
    for (const website in this.websites) {
      const site = this.websites[website];
            // console.log(site.hostname + ":" + services.getService(site.hostname));
      // var moreData = services.getService(site.hostname);
      if (site.thirdParties) {
        const thirdPartyLinks = site.thirdParties.map((thirdParty) => {
          return {
            source: website,
            target: thirdParty,
            // moreData: moreData
          };
        });
        links = links.concat(thirdPartyLinks);
      }
      nodes.push(this.websites[website]);
    }

    return {
      nodes,
      links
    };
  },

  viewGraph() {
    const viewGraph = document.getElementById('active-graph-button');
    viewGraph.addEventListener('click', async() => {
      this.renderGraph('graph');
    });
  },

  viewVenn() {
    const viewVenn = document.getElementById('venn-diagram-button');
    viewVenn.addEventListener('click', async() => {
      this.renderGraph('venn');
    });
  },

  viewMatrix() {
    const viewMatrix = document.getElementById('matrix-button');
    viewMatrix.addEventListener('click', async() => {
      this.renderGraph('matrix');
    });
  },

  downloadData() {
    const saveData = document.getElementById('save-data-button');
    saveData.addEventListener('click', async () => {
      const data = await storeChild.getAll();
      const blob = new Blob([JSON.stringify(data ,' ' , 2)],
        {type : 'application/json'});
      const url = window.URL.createObjectURL(blob);
      const downloading = browser.downloads.download({
        url : url,
        filename : 'lightbeamData.json',
        conflictAction : 'uniquify'
      });
      await downloading;
    });
  },

  resetData() {
    const resetData = document.getElementById('reset-data-button');
    const dialog = document.getElementById('reset-data-dialog');
    window.dialogPolyfill && window.dialogPolyfill.registerDialog(dialog);

    resetData.addEventListener('click', () => {
      dialog.showModal();
    });

    dialog.addEventListener('cancel', () => {
      delete dialog.returnValue;
    });

    dialog.addEventListener('close', async () => {
      if (dialog.returnValue === 'confirm') {
        await storeChild.reset();
        window.location.reload();
      }

      // This is a little naive, because the dialog might not have been
      // triggered by the reset button. But it's better than nothing.
      resetData.focus();
    });
  },

  redraw(data) {
    if (!(data.hostname in this.websites)) {
      this.websites[data.hostname] = data;
      this.updateVars(data.firstParty);
    }
    if (data.firstPartyHostnames) {
      // if we have the first parties make the link if they don't exist
      data.firstPartyHostnames.forEach((firstPartyHostname) => {
        if (this.websites[firstPartyHostname]) {
          const firstPartyWebsite = this.websites[firstPartyHostname];
          if (!('thirdParties' in firstPartyWebsite)) {
            firstPartyWebsite.thirdParties = [];
            firstPartyWebsite.firstParty = true;
          }
          if (!(firstPartyWebsite.thirdParties.includes(data.hostname))) {
            firstPartyWebsite.thirdParties.push(data.hostname);
          }
        }
      });
    }
    // const transformedData = this.transformData(this.websites);
    const transformedData = this.transformData();
    if (this.view == 'graph') {
      viz.draw(transformedData.nodes, transformedData.links);
    } else if (this.view == 'venn') {
      vennCode.draw(transformedData.nodes, transformedData.links);
    } else if (this.view == 'matrix') {
      matrix.draw(transformedData.nodes, transformedData.links);
    }
  }
};

window.onload = () => {
  lightbeam.init();
};
