const helpers = {
    convertNumberToPersianNumber(number,en = false)
    {
        const faNumbers = new Map();

        faNumbers.set('0','۰').set('1','۱').set('2','۲').set('3','۳').set('4','۴')

            .set('5','۵').set('6','۶').set('7','۷').set('8','۸').set('9','۹');

        if(!en)
        {
            return faNumbers.get(number) ? faNumbers.get(number) : number;
        }

        return [... faNumbers][[... faNumbers.values()].indexOf(number)][0]
    },
    convertPersianNumberToEn(number){
         return number.split('').map(element => {

            return this.convertNumberToPersianNumber(element,true);

        }).join('');
    },

    modalCreator(structure){

        let modal = document.getElementById('mod');

        modal = this.modalReset(modal);

        structure.links.forEach(el => {

            modal.getElementsByClassName('links')[0].append(el);

        })

        modal.getElementsByClassName('desc')[0].append(structure.desc);

        structure.buttons.forEach(el => {

            modal.getElementsByClassName('buttons')[0].append(el);

        })

    },
    modalReset(modal){

        modal.getElementsByClassName('links')[0].textContent = '';

        modal.getElementsByClassName('buttons')[0].textContent = '';

        modal.getElementsByClassName('desc')[0].textContent = '';
        
        return modal;
    },

    checkFormIsFill(){

        const data = [document.getElementById('price-number'),document.getElementById('date-day'),

        document.getElementById('date-month'),

        document.getElementById('date-year'),

        document.getElementById('description')

        ]

        return data.filter(el => {

            return el.value.length < 1;

        }).length < 1 ? true : false
    },

    makeNumberReadable(num,en){
        const givenNumber = en ? num : this.convertPersianNumberToEn(num);
        const internationalNumberFormat = new Intl.NumberFormat('fa')
        return internationalNumberFormat.format(givenNumber);
    },
    makeMonths(){
        return new Map([
            ['فروردین',{cost : 0 , income: 0}],
            ['اردیبهشت',{cost : 0 , income: 0}],
            ['خرداد',{cost : 0 , income: 0}],
            ['تیر',{cost : 0 , income: 0}],
            ['مرداد',{cost : 0 , income: 0}],
            ['شهریور',{cost : 0 , income: 0}],
            ['مهر',{cost : 0 , income: 0}],
            ['آبان',{cost : 0 , income: 0}],
            ['آذر',{cost : 0 , income: 0}],
            ['دی',{cost : 0 , income: 0}],
            ['بهمن',{cost : 0 , income: 0}],
            ['اسفند',{cost : 0 , income: 0}]
        ]);
    },

    detectMonth(number){
        number = number.slice(0,1).replace('۰','')+number.slice(1);
        const months = new Map([
            ['۱','فروردین'],
            ['۲','اردیبهشت'],
            ['۳','خرداد'],
            ['۴','تیر'],
            ['۵','مرداد'],
            ['۶','شهریور'],
            ['۷','مهر'],
            ['۸','آبان'],
            ['۹','آذر'],
            ['۱۰','دی'],
            ['۱۱','بهمن'],
            ['۱۲','اسفند']
        ])
        return months.get(number);
    }
}

export {helpers};
