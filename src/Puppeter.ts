import * as puppeteer from "puppeteer"

async function main() {
    const browser = await puppeteer.launch({ headless : false})
    const page = await browser.newPage()
    await page.goto('https://consultaremedios.com.br/')


    const medic = "Buscopan"
    await page.click('.BaseInput__medium_0')
    await page.type('.BaseInput__medium_0', medic)
    await page.screenshot({ path : './outDir/puppeteer/consulta.png'})

    const resultados = await page.evaluate(()=>{
        const suggestionTitles = document.querySelectorAll('.SearchAutocomplete__suggestionTitle_0')
        const medic = "Buscopan"
        for (let i = 0; i < suggestionTitles.length; i++) {
            if(suggestionTitles[i].innerHTML.includes(medic))
            {
                suggestionTitles[i].setAttribute('id', 'alvo') 

                return true
            }
        }
    })

    console.log(resultados)
    if(resultados == true)
    {
        page.click('#alvo')
        const indicacao = await page.evaluate(()=>{
            const panel_body = document.querySelector('.panel-body')
            if(panel_body)
            {
                return panel_body.children[0]
            }
        })
        console.log(indicacao)
    }

    
}

main()