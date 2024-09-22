import { promises as fs } from 'fs';
import Beastcss from 'beastcss';

const beastcss = new Beastcss({
  pruneSource: true, // uklanjanje kritičnog CSS-a iz eksternih stilova
  minifyCss: true, // minifikacija CSS-a
  preloadExternalStylesheets: true, // preloading eksternih CSS-ova
  asyncLoadExternalStylesheets: true, // asinkrono učitavanje eksternih CSS-ova
  merge: true
});

(async () => {
  try {
    // Učitaj generisani HTML fajl iz dist direktorijuma
    const htmlPath = './.output/public/index.html';
    const html = await fs.readFile(htmlPath, 'utf-8');

    // Obradi HTML i uvrsti kritični CSS
    const processedHtml = await beastcss.process(html);

    // Sačuvaj optimizovani HTML nazad u fajl
    await fs.writeFile(htmlPath, processedHtml, 'utf-8');

    // Ukloni kritični CSS iz eksternih stilova
    await beastcss.pruneSources();

    console.log('CSS optimizacija završena!');
  } catch (err) {
    console.error('Došlo je do greške prilikom optimizacije:', err);
  }
})();
