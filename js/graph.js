const updateG1 = (chartId) => {
    const chart = Chart.getChart(chartId);
    chart.data.datasets[0].data = max
    chart.data.datasets[1].data = med
    chart.data.datasets[2].data = min
    chart.update()
}

const updateG3 = (chartId) => {
  const chart = Chart.getChart(chartId);
  chart.data.datasets[0].data = prec
  chart.update()
}

const updateR = (chartId) => {
  const chart = Chart.getChart(chartId)
  chart.data.datasets[0].data = prom_d1
  chart.data.datasets[1].data = prom_d2
  chart.data.datasets[2].data = prom_d3
  chart.update()
}

const years = ["1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"];
const map_colors = ["rgb(0, 34, 255)", "aqua", "rgba(0, 204, 204, 0.416)", "#929292", "#f26d079f", "#f26d07", "#f20707"]
const map_id = ["#CU01", "#CU15", "#CU03", "#CU16", "#CU99", "#CU04", "#CU06", "#CU05", "#CU07", "#CU08", "#CU09", "#CU10", "#CU11", "#CU12", "#CU13", "#CU14"]
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
const max = []
const med = []
const min = []
const prec = []
const map = []
const prom_d1 = []
const prom_d2 = []
const prom_d3 = []
charge_data_line()
charge_prom()
    
function charge_data_line() {
    fetch('data/data_line.json').then(response => { return response.json(); })
    .then(base => {

        const monthG1 = document.querySelector('#g1_month').value
        const provG1 = document.querySelector('#g1_prov').value

        const monthG2 = document.querySelector('#g2_month').value
        const yearG2 = document.querySelector('#g2_year').value
        const typeG2 = document.querySelector('#g2_type').value

        const monthG3 = document.querySelector('#g3_month').value
        const provG3 = document.querySelector('#g3_prov').value

        g1_calculate(base, monthG1, provG1)
        firstGraph()

        g2_calculate(base, yearG2, monthG2, typeG2)
        secondGraph(typeG2)

        g3_calculate(base, monthG3, provG3)
        thirdGraph()

        enableEventHandlers(base)
        
    })
    .catch(error => console.error('Error:', error));
}

function charge_prom() {
  fetch('data/prom.json').then(response => { return response.json(); })
  .then(base => {

    const provR = document.querySelector('#r_prov').value
    const typeR = document.querySelector('#r_type').value

    r_calculate(base, provR, typeR)
    radarGraph()

    enableEventHandlersRadar(base)
  })
  .catch(error => console.error('Error:', error));
}

//Radar Graph
function radarGraph() {
  const data = {
    labels: months,
    datasets: [
      {
        label: "Década 1990-99",
        data: prom_d1
      },
      {
        label: "Década 2000-09",
        data: prom_d2
      },
      {
        label: "Década 2010-19 + 2020-22",
        data: prom_d3
      }
    ]
  }

  new Chart('radar', { type: 'radar', data });
}

function r_calculate(data, prov, type) {
  for (let i = 0; i < data.months.length; i++) {
    console.log(data.months[i].prov[Number(prov)], i, type)
    r_SelectType(data.months[i].prov[Number(prov)], i, type)
  }
}

function r_SelectType(num, i, type) {
  switch(type){
    case "min":
      prom_d1[i] = num.temp_min[0]
      prom_d2[i] = num.temp_min[1]
      prom_d3[i] = num.temp_min[2]
      break
    case "med":
      prom_d1[i] = num.temp[0]
      prom_d2[i] = num.temp[1]
      prom_d3[i] = num.temp[2]
      break
    default:
      prom_d1[i] = num.temp_max[0]
      prom_d2[i] = num.temp_max[1]
      prom_d3[i] = num.temp_max[2]
      break
  }
}

//First Graph
function firstGraph() {
    const data = {
        labels: years,
        datasets:[
            {
                label: 'Temperatura máxima media',
                data: max,
                borderColor: "#f2070794",
                tension: .5,
                pointBorderWidth: 3,
                fill: false
            },
            {
                label: 'Temperatura media',
                data: med,
                borderColor: "rgb(252, 252, 150)",
                tension: .5,
                pointBorderWidth: 3,
                fill: false
            },
            {
                label: 'Temperatura mínima media',
                data: min,
                borderColor: "rgba(0, 34, 255, 0.5)",
                tension: .5,
                pointBorderWidth: 3,
                fill: false
            }
        ]
    }

    const options = {
        responsive: true,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip : {
            position : "nearest"
          }
        },
        scales: {
          y: {
            min: 10,
            max: 40,
          }
        }
    }

    new Chart('g1', { type: 'line', data, options });
}

function g1_calculate(data, month, prov) {
  for (let i = 0; i < data.months[Number(month)].prov[Number(prov)].years.length; i++) {
    var num = g1_selectType(data.months[Number(month)].prov[Number(prov)].years[i].stations);
    max[i] = num[0]; 
    med[i] = num[2]; 
    min[i] = num[3]; 
  }
}

function g1_selectType(num) {
    const response = [];
    var med = 0;
    var count = 0;
    response[0] = Number.MIN_VALUE;
    response[2] = null;
    response[3] = Number.MAX_VALUE;
    
    for (let i = 0; i < num.length; i++) {
      if (num[i].temp != '') {
        med += Number(num[i].temp);
        count++;
      }
    
      if (num[i].temp_max != '') {
        if (Number(num[i].temp_max) > response[0]) {
          response[0] = Number(num[i].temp_max);
          response[1] = num[i].name;
        }
      }
    
      if (num[i].temp_min != '') {
        if (Number(num[i].temp_min) < response[0]) {
          response[3] = Number(num[i].temp_min);
          response[4] = num[i].name;
        }
      }
    }
    
    if (count != 0) {
      response[2] = med / count;
    }
    if (response[0] == Number.MIN_VALUE) response[0] = null;
    if (response[3] == Number.MAX_VALUE) response[3] = null;
    return response;
}

//Second Graph
function secondGraph(type) {
  var values;
  switch(type){
    case "min":
      values = [10.5, 13, 15.5, 18, 20.5, 23, 25.5, 28]
      break
    case "med":
      values = [16, 18, 20, 22, 24, 26, 28, 30]
      break
    default:
      values = [20.5, 23, 25.5, 28, 30.5, 33, 35.5, 38]
      break
  }

  var colors = setColors(values)
  for (let i = 0; i < map.length; i++) {
    document.querySelector(map_id[i]).setAttribute("fill", colors[i])
    if (document.querySelector(map_id[i]).hasAttribute("data-original-title")) {
      document.querySelector(map_id[i]).removeAttribute("data-original-title")
    }
    if (map[i] == null) {
      document.querySelector(map_id[i]).setAttribute("data-original-title", "No se encontraron resultados")
      continue
    }
    document.querySelector(map_id[i]).setAttribute("data-original-title", map[i])
  }

  let range = document.querySelector("#values-legend")
  range.innerHTML =
    `<p>${values[7]}</p>
    <p>${values[6]}</p>
    <p>${values[5]}</p>
    <p>${values[4]}</p>
    <p>${values[3]}</p>
    <p>${values[2]}</p>
    <p>${values[1]}</p>
    <p>${values[0]}</p>`
}

function g2_calculate(data, year, month, type) {
  for (let i = 0; i < data.months[Number(month)].prov.length; i++) {
    map[i] = g2_selectType(data.months[Number(month)].prov[i].years[Number(year)].stations, type)
  }
}

function g2_selectType(num, type) {
  switch(type) {
    case "med":
      var med = 0
      var count = 0
      for (let i = 0; i < num.length; i++) {
        if (num[i].temp != '') {
          med += Number(num[i].temp)
          count++
        }
      }
      if (count != 0) return Math.round(med / count)
      break
    
    case "max":
      var max = Number.MIN_VALUE
      for (let i = 0; i < num.length; i++) {
        if (num[i].temp_max != '') {
          if (Number(num[i].temp_max) > max) max = Number(num[i].temp_max);
        }
      }
      if (max != Number.MIN_VALUE) return max
      break
      
    default:
      var min = Number.MAX_VALUE
      for (let i = 0; i < num.length; i++) {
        if (num[i].temp_min != '') {
          if (Number(num[i].temp_min) < min) min = Number(num[i].temp_min);
        }
      }
      if (min != Number.MAX_VALUE) return min
      break
    }
  return null;
}

function setColors(values) {
  const colors = []
  for (let i = 0; i < map.length; i++) {
    if (map[i] == null) {
      colors[i] = "#111"
      continue
    }
    for (let j = 1; j < values.length; j++) {
      if (map[i] < values[j]) {
        colors[i] = map_colors[j-1]
        break
      }
    }    
  }
  return colors
}

//Third Graph
function thirdGraph() {
  const data = {
    labels: years,
    datasets:[
        {
            label: 'Precipitaciones',
            data: prec,
            borderColor: 'rgba(0, 0, 265, 0.5)',
            tension: .5,
            pointBorderWidth: 3,
            fill: false
        }
    ]
}

const options = {
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'index',
    }
}

new Chart('g3', { type: 'line', data, options });
}

function g3_calculate(data, month, prov) {
  for (let i = 0; i < data.months[Number(month)].prov[Number(prov)].years.length; i++) {
    var num = g3_selectType(data.months[Number(month)].prov[Number(prov)].years[i].stations);
    prec[i] = num[0]; 
  }
}

function g3_selectType(num) {
  const response = [];
  response[0] = Number.MIN_VALUE;
  
  for (let i = 0; i < num.length; i++) { 
    if (num[i].precipitation != '') {
      if (Number(num[i].precipitation) > response[0]) {
        response[0] = Number(num[i].precipitation);
        response[1] = num[i].name;
      }
    }
  }
  
  if (response[0] == Number.MIN_VALUE) response[0] = null;
  return response;
}

const enableEventHandlersRadar = data => {

  document.querySelector('#r_prov').onchange = e => {
    const { value } = e.target.selectedOptions[0]
    const type = document.querySelector('#r_type').value
    r_calculate(data, value, type)
    updateR('radar')
  }

  document.querySelector('#r_type').onchange = e => {
    const { value } = e.target.selectedOptions[0]
    const prov = document.querySelector('#r_prov').value
    r_calculate(data, prov, value)
    updateR('radar')
  }

}
const enableEventHandlers = data => {

    document.querySelector('#g1_month').onchange = e => {
        
        const { value } = e.target.selectedOptions[0]
        const prov = document.querySelector('#g1_prov').value
        g1_calculate(data, value, prov)
        updateG1('g1')
    }

    document.querySelector('#g1_prov').onchange = e => {

        const { value } = e.target.selectedOptions[0]
        const month = document.querySelector('#g1_month').value
        g1_calculate(data, month, value)
        updateG1('g1')
    }

    document.querySelector('#g2_month').onchange = e => {
        
      const { value } = e.target.selectedOptions[0]
      const year = document.querySelector('#g2_year').value
      const type = document.querySelector('#g2_type').value
      g2_calculate(data, year, value, type)
      secondGraph(type)
  }

    document.querySelector('#g2_year').onchange = e => {

      const { value } = e.target.selectedOptions[0]
      const month = document.querySelector('#g2_month').value
      const type = document.querySelector('#g2_type').value
      g2_calculate(data, value, month, type)
      secondGraph(type)
  }

    document.querySelector('#g2_type').onchange = e => {

      const { value } = e.target.selectedOptions[0]
      const year = document.querySelector('#g2_year').value
      const month = document.querySelector('#g2_month').value
      g2_calculate(data, year, month, value)
      secondGraph(value)
  }

    document.querySelector('#g3_month').onchange = e => {
        
      const { value } = e.target.selectedOptions[0]
      const prov = document.querySelector('#g3_prov').value
      g3_calculate(data, value, prov)
      updateG3('g3')
  }

    document.querySelector('#g3_prov').onchange = e => {

      const { value } = e.target.selectedOptions[0]
      const month = document.querySelector('#g3_month').value
      g3_calculate(data, month, value)
      updateG3('g3')
  }
}

