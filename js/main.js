const amount = document.getElementById('amount')
const select = document.querySelectorAll(".select")
const from = document.getElementById('from')
const to = document.getElementById('to')
const result = document.getElementById('rate')
const btnConvert = document.getElementById("convert-icon")
const calculateBtn = document.querySelector(".convert")

async function getRate() {
    const response = await fetch(`https://api.exchangerate.host/latest?base=USD`)
    let data = await response.json()
    const rates = data.rates

    if(response) {
        updateOptions(from, getList(rates))
        updateOptions(to, getList(rates))
    } else {
        throw new Error(response.status)
    }
}

getRate()

function getList(rates) {
    return Object.keys(rates).map((item) => {
        const li = document.createElement('li')
        li.innerHTML = `<span>${item}</span>`
        li.addEventListener("click", (e) => {
            const selectedListItem = e.target
            const parentSpan = selectedListItem.parentElement.parentElement.querySelector('span')
            parentSpan.innerHTML = item
            selectedListItem.parentElement.querySelectorAll("li").forEach((li) => {
                li.classList.remove('active')
            })
            selectedListItem.classList.add("active")
            calculate()
        })
        return li
    })
}

function updateOptions(select, options) {
    ul = document.createElement("ul")
    options.forEach((option) => {
        ul.appendChild(option)
    })
    select.appendChild(ul)

}


async function calculate() {
    if(amount.value === "" || amount.value ==="0"){
        return
    } 

    calculateBtn.innerHTML = "calculating..."
    calculateBtn.disabled = true

    const fromCurrency = from.querySelector("span").innerHTML
    const toCurrency = to.querySelector("span").innerHTML

    try {
        const response = await fetch(`https://api.exchangerate.host/latest?base=${fromCurrency}&symbols=${toCurrency}&amount=${amount.value}&places=2`)
        if(!response.ok) {
            throw new Error(response.status)
        }
        const data = await response.json()
        const rate = data.rates[toCurrency]
        result.innerHTML = `${rate} ${toCurrency}`

    }
    catch(error) {
        console.error(error)
    }finally {
        btnConvert.innerHTML = "Convert"
        calculateBtn.disabled = false
    }
}

select.forEach((item) => {
    item.addEventListener("click", () => {
        item.classList.toggle("active")
    })
})

document.addEventListener("click", (e) => {
    if (!e.target.closest(".select")) {
        select.forEach((item) => {
            item.classList.remove("active")
        })
    }
})

amount.addEventListener("input", function() {
    this.value = this.value.replace(/[^0-9]/g,"")
    calculate()
})

calculateBtn.addEventListener("click", () =>{
    calculate()
})

btnConvert.addEventListener("click", () => {
    const fromSelectd = from.querySelector("span").innerHTML
    const toSelectd = to.querySelector("span").innerHTML

    from.querySelector("span").innerHTML = toSelectd
    to.querySelector("span").innerHTML = fromSelectd
    calculate()
})