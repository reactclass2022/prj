import EventManager from './event.js';
import { helpers } from './helpers.js';
export default new class Model extends EventManager{

    constructor(){
        super();
        this.baseEvents();
    }

    baseEvents(){
       this.addEvents(document.getElementById('submit-fin-data'),'click',(e) => {
           if(helpers.checkFormIsFill())
           {
            let [financeType] = [... document.getElementsByName('finOption')].filter(el => {
                return el.checked;
            });
            financeType = {
                'fa' : financeType.getAttribute('fa-name'),
                'en' : financeType.value
            }

            const price = {
                'fa' : document.getElementById('price-number').value,
                'en' : helpers.convertPersianNumberToEn(document.getElementById('price-number').value)
            };

            const finDate = {
                'year' : document.getElementById('date-year').value,
                'month' : document.getElementById('date-month').value,
                'day' : document.getElementById('date-day').value
            }

            const finDescription = document.getElementById('description').value;

            this.addFinanceData({
                'price' : price,
                'finDate' : finDate,
                'finType' : financeType,
                'finDescription' : finDescription
            })
           }
       });
    }

    addFinanceData(data){
        const finDataSet = localStorage.getItem('finDataSet') ? new Map(JSON.parse(localStorage.getItem('finDataSet'))) : new Map();
        const finKey = [... finDataSet.keys()].reverse()[0] ? [... finDataSet.keys()].reverse()[0] + 1 : 1;
        finDataSet.set(finKey,data);
        localStorage.setItem('finDataSet',JSON.stringify([... finDataSet]));
        this.loadTableData();
        this.loadFinTotal();
        this.initStat();
    }

    loadTableData(){
        const finDataSet = localStorage.getItem('finDataSet') ? new Map(JSON.parse(localStorage.getItem('finDataSet'))) : new Map();
        const tbl = document.getElementById('tbl');
        tbl.textContent = '';
        let flag = 0;
        [... finDataSet.keys()].reverse().forEach(key => {
            flag++;
            const data = finDataSet.get(key);
            const tr = document.createElement('tr');
            tr.setAttribute('data-id',key);
                let td = document.createElement('td');
                td.innerText = flag;
                tr.appendChild(td);
            for(let i in data)
            {
                let td = document.createElement('td');
                let dataValue = '';
                if(i == "price"){dataValue = helpers.makeNumberReadable(data[i].fa,false);}

                else if(i == "finDate")
                {
                    dataValue = `${data[i].year}/${data[i].month}/${data[i].day}`;
                }
                else if(i == "finType")
                {
                     dataValue = data[i].fa;
                }
                else
                {
                    const viewBtn = document.createElement('button');

                    const deleteBtn = document.createElement('button');

                    viewBtn.classList.add('show-btn');

                    viewBtn.innerText = 'مشاهده';

                    viewBtn.addEventListener('click' ,(e) => {

                        document.getElementById('body-modal-back').style.width = '100%'

                        document.getElementById('body-modal-back').style.height = `100%`;

                        document.getElementById('body-modal-back').style.top = `${window.scrollY}px`;

                        document.body.classList.toggle('body-modal');

                        const modalSpan = document.createElement('span');

                        modalSpan.innerText = 'بستن';

                        modalSpan.addEventListener('click',(e) => {document.getElementById('body-modal-back').click()});

                        const modalBtn = document.createElement('button');

                        modalBtn.classList.add('return');

                        modalBtn.innerText = 'بازگشت';

                        modalBtn.addEventListener('click',(e) => {document.getElementById('body-modal-back').click()});
                        
                        const finData = new Map(JSON.parse(localStorage.getItem('finDataSet')));
                        
                        const submitModal = {

                            links: [
                                modalSpan
                            ],
    
                            desc: finData.get(key).finDescription,
    
                            buttons: [
                                modalBtn,
                                ]
                            };
    
                            helpers.modalCreator(submitModal);
    
                            const modal = document.getElementById('mod');
    
                            const modalTop = Number(window.scrollY) + window.innerHeight/2 - modal.clientHeight;
    
                            modal.style.top = `${modalTop}px`;
                    })

                    deleteBtn.innerText = 'حذف';

                    deleteBtn.classList.add('delete-btn')
                    
                    deleteBtn.addEventListener('click',(e) => {

                        document.getElementById('body-modal-back').style.width = '100%'

                        document.getElementById('body-modal-back').style.height = `100%`;

                        document.getElementById('body-modal-back').style.top = `${window.scrollY}px`;

                        document.body.classList.toggle('body-modal');

                        const modalSpan = document.createElement('span');

                        modalSpan.innerText = 'بستن';

                        modalSpan.addEventListener('click',(e) => {document.getElementById('body-modal-back').click()});

                        const modalBtn = document.createElement('button');

                        modalBtn.classList.add('return');

                        modalBtn.innerText = 'بازگشت';

                        modalBtn.addEventListener('click',(e) => {document.getElementById('body-modal-back').click()});

                        const modalDeleteBtn = document.createElement('button');

                        modalDeleteBtn.classList.add('delete');

                        modalDeleteBtn.innerText = 'حذف';

                        modalDeleteBtn.addEventListener('click',(e) => {
                            const finData = new Map(JSON.parse(localStorage.getItem('finDataSet')));
                            finData.delete(key);
                            localStorage.setItem('finDataSet',JSON.stringify([... finData]));
                            tr.remove();
                            this.loadFinTotal();
                            this.loadTableData();
                            this.initStat();
                            document.getElementById('body-modal-back').click();
                        })

                        const submitModal = {

                        links: [
                            modalSpan
                        ],

                        desc: "ایا از حذف این رکورد اطمینان دارید؟",

                        buttons: [
                            modalBtn,
                            modalDeleteBtn
                            ]
                        };

                        helpers.modalCreator(submitModal);

                        const modal = document.getElementById('mod');

                        const modalTop = Number(window.scrollY) + window.innerHeight/2 - modal.clientHeight;

                        modal.style.top = `${modalTop}px`;

                    })

                    td.append(viewBtn,deleteBtn);

                    tr.appendChild(td);

                    continue;
                }

                td.innerText = dataValue;

                tr.appendChild(td);
            }

            tbl.appendChild(tr);
        })
    }

    loadFinTotal(){
        const finDataSet = localStorage.getItem('finDataSet') ? new Map(JSON.parse(localStorage.getItem('finDataSet'))) : new Map();
        let income = 0;
        let cost = 0;
        [... finDataSet.values()].forEach(data => {
            if(data.finType.en == 'income'){income= Number(income) + Number(data.price.en)};
            if(data.finType.en == 'cost'){cost= Number(cost) + Number(data.price.en)};
        });
        document.getElementById('income-area').innerHTML = helpers.makeNumberReadable(income,true);
        document.getElementById('cost-area').innerHTML = helpers.makeNumberReadable(cost,true);
    }

    loadChartYear(){
        const finDataSet = localStorage.getItem('finDataSet') ? new Map(JSON.parse(localStorage.getItem('finDataSet'))) : new Map();
        const chartYearEl = document.getElementById('chart-year');
        if(finDataSet.size < 1){return;}

        let years = [];
        [... chartYearEl].slice(1).forEach(el => {
            years.push(el.value);
        });

        [... finDataSet.values()].forEach(el => {
            if(!years.includes(el.finDate.year))
            {
                const optionEl = document.createElement('option');
                optionEl.value = el.finDate.year;
                optionEl.innerText = el.finDate.year;
                chartYearEl.appendChild(optionEl);
                optionEl.addEventListener('click',(e) => {
                    this.loadChartStat(e.target.value);
                })
            }
            years.push(el.finDate.year);
        })
    }
    loadChartStat(year = null)
    {
        const chartYearEl = document.getElementById('chart-year');
        if(!year)
        {
            [... chartYearEl.children].forEach(el => {
                if(el.selected){year = el.value};
            })   
        }
        if(year == 0){
            if(chartYearEl.children.length < 2 )
            {
                this.loadFinalChart(this.loadChartStatByYear(year));
                return;
            }
            year = chartYearEl.children[1].value;
        }

        this.loadFinalChart(this.loadChartStatByYear(year));
    }

    loadChartStatByYear(year)
    {
        const finDataSet = new Map(JSON.parse(localStorage.getItem('finDataSet')));
        const dataYear = [... finDataSet.values()].filter(el => {
            return el.finDate.year == year;
        });
        const months = helpers.makeMonths();
        dataYear.forEach(el => {
            const month = helpers.detectMonth(el.finDate.month);
            const detectedMonth = months.get(month);
            if(!detectedMonth.income){detectedMonth.income=0};
            if(!detectedMonth.cost){detectedMonth.cost=0};
            if(el.finType.en == 'income'){detectedMonth.income = Number(detectedMonth.income) + Number(el.price.en)};
            if(el.finType.en == 'cost'){detectedMonth.cost = Number(detectedMonth.cost) + Number(el.price.en)};
        })

        return months;
    }

    loadFinalChart(montData)
    {
        document.getElementById('myChart').remove();
        const chartWrapper = document.getElementById('chart');
        const chart = document.createElement('canvas');
        chart.setAttribute('id','myChart');
        chart.setAttribute('height','250')
        chartWrapper.appendChild(chart);
        const chartElem = document.getElementById('myChart');
        const labels = [... montData.keys()]
        const incomes = [... montData.values()].map(el => {
            return el.income;
        });
        const costs = [... montData.values()].map(el => {
            return el.cost;
        });
          const data = {
            labels: labels,
            datasets: [{
              label: 'درآمد',
              backgroundColor: '#2cbe26',
              borderColor: '#2cbe26',
              data: incomes,
            },
            {
                label: 'خرج',
                backgroundColor: '#e03f3f',
                borderColor: '#e03f3f',
                data: costs,
              }
        ]
          };
        
          const config = {
            type: 'line',
            data: data,
            options: {}
          };
          let myChart = new Chart(
        document.getElementById('myChart'),
      config
    );
    }

    initStat(){
        this.loadChartYear();
        this.loadChartStat();
    }

}   