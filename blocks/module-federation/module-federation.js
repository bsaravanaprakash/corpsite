function getCellValue(cell) {
  if (!cell) return '';
  const link = cell.querySelector('a[href]');
  return link ? link.href : cell.textContent.trim();
}

function readConfig(block) {
  const rows = [...block.children];
  const cell = (i) => getCellValue(rows[i]?.children[0]);
  return {
    scope: cell(0),
    modulePath: cell(1),
    remoteEntry: cell(2),
  };
}

function initModule(scope, modulePath, root) {
  if (window[scope]) {
    window[scope]
      .get(modulePath)
      .then((factory) => {
        const initApp = factory && factory().default;
        if (initApp) {
          initApp({ rootElement: root });
        }
        if (!initApp) {
          // eslint-disable-next-line no-console
          console.error(`${scope} has not been loaded`);
        }
      });
  } else {
    // eslint-disable-next-line no-console
    console.error(`${scope} has not been loaded`);
  }
}

function initializeMFE(scope, modulePath, remoteEntry, root) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  // eslint-disable-next-line func-names
  script.onload = function () {
    initModule(scope, modulePath, root);
  };
  script.src = remoteEntry;
  document.getElementsByTagName('head')[0].appendChild(script);
}

export default function decorate(block) {
  const { scope, modulePath, remoteEntry } = readConfig(block);

  if (!scope || !modulePath || !remoteEntry) {
    return;
  }

  const root = document.createElement('div');
  block.replaceChildren(root);
  initializeMFE(scope, modulePath, remoteEntry, root);
}
