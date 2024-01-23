function generateYearsArray() {
    return Array.from({length: 36}, (_, i) => 1896 + (i * 4)); 
}
const years = generateYearsArray();
const pos_line = []

run()

function run() {
    fetch('data/data.json').then(response => { return response.json(); })
    .then(data => {
        lineGraph(data)
        enableEventHandlers(data)
    })
}

//Grafico Lineal
const lineGraph = base => {
    const values = lineForm(base, true);
    
    const data = {
        labels: values[0],
        datasets:[
            {
                label: "Posición por año",
                data: values[1],
                borderColor: 'rgba(0, 34, 255, 0.5)',
                tension: .5,
                pointBorderWidth: 3,
                fill: false
            }
        ]
    }
 
    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 32,
                reverse: true
            }
        }
    }
    new Chart('line_graph', { type: 'line', data, options });
}


const lineForm = (data, recalc) => {
    const val_years = []
    const val_pos = []

    if (recalc) {
        const country = document.querySelector('#line_country').value
        const sport = document.querySelector('#line_sport').value
        const gender = document.querySelector('#line_gender').value
        calc_pos(data, country, sport, gender)
    }

    for (let i = 0; i < years.length; i++) {
        val_years[i] = years[i]
        val_pos[i] = pos_line[i]
    }

    return [val_years, val_pos]
}

const calc_pos = (data, country, sport, gender) => {
    for (let i = 0; i < years.length; i++) {
        pos_line[i] = 32       
    }

    for (let i = 0; i < data.length; i++) {
        if (data[i].country_noc == country && data[i].sport == sport && data[i].sex == gender) {
            let aux = (data[i].year - 1896)/4
            pos_line[aux] = data[i].pos
        }
    }
}

//Handlers de select
const enableEventHandlers = data => {

    document.querySelector('#line_country').onchange = e => {
        const val = lineForm(data, true)
        updateLine('line_graph', val)
    }

    document.querySelector('#line_sport').onchange = e => {
        const val = lineForm(data, true)
        updateLine('line_graph', val)
    }

    document.querySelector('#line_gender').onchange = e => {
        const val = lineForm(data, true)
        updateLine('line_graph', val)
    }
}

//Update
const updateLine = (chartId, val) => {
    const chart = Chart.getChart(chartId);
    chart.data.labels = val[0];
    chart.data.datasets[0].data = val[1];
    //* estas fueron las lineas que comente me parece que la sintaxis no es esa
    // chart.options.scales.y[0].min = 0;
    // chart.options.scales.y[0].max = 10;
    chart.update();   
}


// Obtener el elemento select
var select = document.getElementById("line_country");

// Leer el archivo JSON
fetch('data/countries_noc.json')
.then(response => response.json())
.then(data => {
    // Agregar las opciones al elemento select
    data.forEach(function(country) {
    var option = document.createElement('option');
    option.text = country.country;
    option.value = country.country_noc;
    select.add(option);
    });
});