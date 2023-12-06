import * as puppeteer from "puppeteer";

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-setuid-sandbox",
    "--no-sandbox"
  ]
  });

  const page = await browser.newPage();

  await page.goto('https://consultaremedios.com.br/');

  const medic = "Buscopan";

  // Espera até que o campo de busca esteja visível antes de interagir
  await page.waitForSelector('.BaseInput__medium_0');
  await page.click('.BaseInput__medium_0');
  await page.type('.BaseInput__medium_0', medic);
  await page.screenshot({ path: './outDir/puppeteer/consulta.png' });

  const resultados = await page.evaluate((medic) => {
    const suggestionTitles = document.querySelectorAll('.SearchAutocomplete__suggestionTitle_0');

    for (let i = 0; i < suggestionTitles.length; i++) {
      if (suggestionTitles[i].innerHTML.includes(medic)) {
        suggestionTitles[i].setAttribute('id', 'alvo');
        return true;
      }
    }

    return false;
  }, medic);

  console.log(resultados);

  
    await page.waitForSelector('#alvo');
    await page.click('#alvo');


    console.log("Indicação")
    const indicacao = await page.evaluate(() => {
      const panel_body = document.querySelector('.panel-body') as HTMLElement | null;
      if (panel_body) {
        return panel_body.children[0].textContent?.trim() || null;
      }
      return null;
    });

    console.log(indicacao);
  

  
}

main();