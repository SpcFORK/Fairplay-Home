// Copyright (c) 2023 SpcFORK
var
  blackFG = document.body.appendChild(
    div()
      .id$('blackfg')
      .style$({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        'background-color': 'black',
        zIndex: 999,
      })
      .get$()
  ),
  searchParams = new URLSearchParams(window.location.search);

// ---

document.addEventListener('DOMContentLoaded', async () => {

  var
    entry = document.querySelector('entry'),
    path = location.pathname,
    entryPath = `./app/${path.replace(/(\/$)|[^]($)(?=\1)/, '/entry').replace(/^\//, '')}.js`

  if (!entry) return;

  // ---

  console.warn(`Loading ${entryPath}...`);

  try {
    var r = await import_(entryPath, 'Main');
  }

  catch (e) {
    console.warn(`Failed to Fetch from ${entryPath}!`, r, e);
    return;
  }
    
  finally {
    console.warn(`Loaded ${entryPath}!!`, r);
  }

  // ---

  let MainClass =
    window?.Main
    || window?.Page
    || window?.Load
    || class _ { };

  if (!(MainClass.prototype instanceof Object)) {
    console.error(`[ERROR] Main class doesn't inherit from Object.`);
    return;
  }

  // ---
  var BaseClass = class extends MainClass { };

  // Add Static Constants
  Object.assign(BaseClass.prototype, {
    entry,
    path,
    entryPath,
  })

  Object.assign(BaseClass, BaseClass.prototype)

  if (BaseClass.PageTitle) document.title = BaseClass.PageTitle;
  
  // ---

  if (BaseClass.prototype instanceof HTMLElement) {
    let main = new BaseClass(entry);

    entry.appendChild(main);
  }

  if (BaseClass?.preload instanceof Function) {
    await BaseClass.preload();
  }

  let m = new BaseClass(entry);

  // We wait for buffer
  await sleep(500)
  console.warn(`Done ${entryPath}!!`, m, MainClass); // Logs OG CLASS

  // ---

  // Set the Transition
  const amm = 1.5;
  blackFG.style.transition = `opacity ${amm}s ease-in-out`;

  await fadeOut(blackFG, amm);
  await sleep(amm * 1000);
  blackFG.remove();

})