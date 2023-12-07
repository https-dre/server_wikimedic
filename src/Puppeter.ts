import * as puppeteer from "puppeteer";


export class BotService {
  browser: puppeteer.Browser;

  constructor(headless: boolean) {
    this.browser = null as any;
    this.initializeBrowser(headless)
    .then( () => console.log('alalala'))
    .catch( () => new Error('Erro na Criação puppeteer.Browser'))
  }

  async initializeBrowser(headless: boolean): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: headless,
      args: [
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--no-sandbox"
      ]
    });
  }

  async newPage(): Promise<puppeteer.Page> {
      return this.browser.newPage();
  }

  async closeBrowser(): Promise<void> {
    // Fecha o navegador quando você terminar de usá-lo
    if (this.browser) {
      await this.browser.close();
    }
  }

  async searchMedic(medic : string) : Promise<any>
  {
    if (!this.browser) {
      throw new Error("Navegador não inicializado. Abortando pesquisa do medicamento.");
    }

    const page = await this.browser.newPage()

    await page.goto('https://consultaremedios.com.br/');
    // Espera até que o campo de busca esteja visível antes de interagir
    await page.waitForSelector('.BaseInput__medium_0');
    await page.click('.BaseInput__medium_0');
    await page.type('.BaseInput__medium_0', medic);
    

    await page.waitForSelector('.SearchAutocomplete__suggestionTitle_0')

    const resultados = await page.evaluate((medic) => {
      const suggestionTitles = document.querySelectorAll('.SearchAutocomplete__suggestionTitle_0');

      for (let i = 0; i < suggestionTitles.length; i++) {
        console.log(suggestionTitles[i])
        if (suggestionTitles[i].innerHTML.includes(medic)) {
          suggestionTitles[i].setAttribute('id', 'alvo');
          
          return suggestionTitles[i].innerHTML;
        }
      }

      return false;
    }, medic);


    console.log(resultados);
    if(resultados != false)
    {
      console.log('Selecionando Resultado Medicamento')
      await page.waitForSelector('#alvo');
      await page.click('#alvo');

      console.log('GET Contraindicação')
      await page.waitForSelector('.js-scroll-to')
      await page.click('.js-scroll-to')
      await page.waitForSelector('.panel-body')

      const indicacao = await page.evaluate(() => {
        const textContent = document.querySelectorAll('.text-content') as NodeListOf<HTMLElement>;
        let result = [];
        for (let i = 0; i < textContent.length; i++) {
          result.push(textContent[i].textContent);
          console.log(textContent[i].textContent)
        }
        return result
      });

      console.log('\nIndicação')
      console.log(indicacao[0])
      console.log('\nContraindicação')
      console.log(indicacao[1])
      await this.closeBrowser()
      return indicacao
    }
    else
    {
      console.log('Erro na pesquisa do Medicamento')
      await this.closeBrowser()
      return null
    }
  }
}

async function run() {
  const botService = new BotService(false);
  await botService.searchMedic('Paracetamol');
}

run()