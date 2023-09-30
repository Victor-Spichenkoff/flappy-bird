const area = document.getElementById('area')
const comprimento = area.clientWidth
const pontuacao = document.getElementById('pontuacao')

//barreiras
const abertura = 100 + 28 *2//ponta
const espacamento = 135
const parHeiht = 450
const pontaWidth = 60
const pontaHeight = 28

//passaro
const passaro = document.getElementById('bird')
const passaroHeight = passaro.clientHeight
var passaroTop = 50
let passaroLeft = 100


let perdeu = false//bug no git

var podePerder = false
setTimeout(()=>{
    podePerder = true 
}, 3000)




function criarElemento(tipo='div', classe) {
    let elemento = document.createElement(tipo)
    elemento.className = classe
    return elemento
}


function aumentarPontos() {
    pontuacao.innerText = Number(pontuacao.innerText) + 1
}


function perder() {
    const pontos = pontuacao.innerText

    area.innerHTML =`        
        <div id="perdeu">
            <p>Sua pontuação foi: ${pontos}</p>
            <p>Aperte <srong>F5</srong> para recomeçar</p>
        </div>`
}


function Coluna(reverse = false) {
    const base = criarElemento('span', 'base')
    const ponta = criarElemento('span', 'ponta')
    this.coluna =  criarElemento('div', 'coluna')
    if(reverse) {
        this.coluna.appendChild(ponta)
        this.coluna.appendChild(base)
    } else {
        this.coluna.appendChild(base)
        this.coluna.appendChild(ponta)
    }


    this.setAltura = altura => {
        base.style.height = `${altura}px`
    }


    this.altura = base + ponta
}


function calcularAltura() {
    const a1 = parseInt(Math.random() * (parHeiht - 150))

    const a2 = parHeiht - abertura - a1
    return {a1, a2}
}

function Par(start=0) {
    this.par = criarElemento('div', 'par')
    let x = start


    const { a1, a2 } = calcularAltura()

    const c1 = new Coluna()
    const c2 = new Coluna(true)

    c1.setAltura(a1)
    c2.setAltura(a2)

    this.par.appendChild(c1.coluna)
    this.par.appendChild(c2.coluna)

    this.par.style.left = `${start}px`//tirar o 400

    this.aberturaTop = a1

    this.setX = (dif) => {
        if (x == 100) aumentarPontos()//já passou, pode contar

        if(x > 0-pontaWidth) {
            x -= dif
            if(x <= passaroLeft + 34 && x >= passaroLeft - 60) {//passaro
                const bateu = this.colidiu()
                if(bateu) return true
            }
        } else {
            x = comprimento
            this.novaAltura()
        }
        this.par.style.left = `${x}px`
    }


    this.novaAltura = () => {
        const { a1, a2 } = calcularAltura()

        c1.setAltura(a1)
        c2.setAltura(a2)

        this.aberturaTop = a1
    }


    this.colidiu = () => {
        let passaroTop = passaro.style.top.replace('px', '')

        if(this.aberturaTop + pontaHeight > passaroTop) {
            return true
            console.log('bateu')
            console.log(`Abertura top: ${this.aberturaTop} passaroTop: ${passaroTop}`)
        } else if ((this.aberturaTop + abertura -56 < passaroTop)) {
            // console.log((this.aberturaTop + abertura - pontaHeight))
            return true
            console.log('perdeu')
        }
    }
}


function AllColums(xBase) {
    const par1 = new Par(xBase)
    const par2 = new Par(xBase + espacamento + pontaWidth)    
    const par3 = new Par(xBase + 2 *(espacamento + pontaWidth))    
    const par4 = new Par(xBase + 3 *(espacamento + pontaWidth))    

    this.colunas = criarElemento('div', 'colunas')

    this.colunas.appendChild(par1.par)
    this.colunas.appendChild(par2.par)
    this.colunas.appendChild(par3.par)
    this.colunas.appendChild(par4.par)


    let deslize = 3

    this.move = () => {
        let bateu1 = par1.setX(deslize)
        let bateu2 = par2.setX(deslize)
        let bateu3 = par3.setX(deslize)
        let bateu4 = par4.setX(deslize)
        if(bateu1 || bateu2 || bateu3 || bateu4) return true
    }
}



var alturaAtual = passaroTop

//passaro
function Passaro() {
    let vezes = 0//para esperar um pouci em em pé

    this.descer = (timer) => {
        let podeDescer = true
        window.onkeydown = () => {
            // const alturaAtual = passaro.clientTop
            if (!perdeu) passaro.style.top =  `${alturaAtual -= 36}px`
            passaro.classList.remove('descer')
            passaro.classList.add('subir')
            podeDescer = false
            vezes = 0
        }


        if(alturaAtual < 0 + passaroHeight) return true
        if(alturaAtual > (450 - 26)) return true

        if(podeDescer) {
            passaro.style.top =  `${alturaAtual += 4}px`
            vezes++
            if(vezes == 6) {
                passaro.classList.remove('subir')
                passaro.classList.add('descer')
            }
        }
    }
}





function Animar() {
    // const colunas = new AllColums(100)
    const colunas = new AllColums(comprimento)
    area.appendChild(colunas.colunas)

    const bird = new Passaro()

    timer = setInterval(()=> {
        let bateuColuna = colunas.move()
        let bateuPassaro = bird.descer(timer)
        if(bateuPassaro || bateuColuna) {
            perdeu = true
            setTimeout(()=> {
                if(podePerder) perder()

            }, 10)
            
            clearInterval(timer)
        }
    }, 30)
}



Animar()



/*
** Left em 100px

ele bate só se for pela frente (por dentro não vai)
*/