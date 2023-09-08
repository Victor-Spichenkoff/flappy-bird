const area = document.getElementById('area')
const comprimento = area.clientWidth

//barreiras
const abertura = 100 + 28 *2//ponta
const espacamento = 135
const parHeiht = 450
const pontaWidth = 60

//passaro
const passaro = document.getElementById('bird')
const passaroHeight = passaro.clientHeight
var passaroTop = 0


let perdeu = false


function criarElemento(tipo='div', classe) {
    let elemento = document.createElement(tipo)
    elemento.className = classe
    return elemento
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

    this.setX = (dif) => {
        let passaroLeft = passaro.style.left


        if(x > 0-pontaWidth) {
            x -= dif
            if(x < passaroLeft && x > passaroLeft - 134) {//passaro
                console.log(x, passaroLeft)
                this.colidiu()
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
    }


    this.colidiu = () => {
        let aberturaTop = c1.altura
        let passaroTop = passaro.style.top.replace('px', '')
        if(aberturaTop > passaroTop) {
            console.log('bateu')
        } else if ((aberturaTop + abertura < passaroTop)) {
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
        par1.setX(deslize)
        par2.setX(deslize)
        par3.setX(deslize)
        par4.setX(deslize)
    }
}



var alturaAtual = 1

//passaro
function Passaro() {


    this.descer = (timer) => {
        let podeDescer = true
        window.onkeydown = () => {
            // const alturaAtual = passaro.clientTop
            if (!perdeu) passaro.style.top =  `${alturaAtual -= 36}px`
            podeDescer = false
        }


        if(alturaAtual < 0 + passaroHeight) return true
        if(alturaAtual > (450 - 26)) return true

        if(podeDescer) passaro.style.top =  `${alturaAtual += 4}px`
    }
}





function Animar() {
    // const colunas = new AllColums(100)
    const colunas = new AllColums(comprimento)
    area.appendChild(colunas.colunas)

    const bird = new Passaro()

    timer = setInterval(()=> {
        colunas.move()
        let bateu = bird.descer(timer)
        if(bateu) {
            perdeu = true
            clearInterval(timer)
        }
    }, 30)
}

(function() {   new Animar()   })()
// area.appendChild(new Par().par)
// area.appendChild(new Par().par)

let h = passaro.clientHeight
let w = passaro.clientWidth
let l = passaro.style.left

console.log(h, w, l)
// Colisao

/*
** Left em 100px

pegar e ver se colide(horizonral com o passaro) - Par()
*/