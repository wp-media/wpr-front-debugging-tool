/**
 * Creates the WPR FDT panel in the devtools
 */
const createFDTPanel = () => {
  chrome.devtools.panels.create('WPR FDT', 'icon/32.png', 'fdt.html');
};
createFDTPanel();
