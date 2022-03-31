import EventManager from './event.js';
import model from './model.js';
import { helpers } from './helpers.js';
export default new class View extends EventManager{
    static lastEvent;
    constructor(){
        super();
        this.baseEvents();
    }

    baseEvents(){

        this.addEvents(document.getElementsByClassName('form-radio-wrapper'),'click',(e) => {
            e.currentTarget.children[0].checked = true;

            document.getElementById('price-number').focus();
            
        })

        

        this.addEvents(document.getElementById('price-number'),'keydown',(e) => {
            if(this.checkInputKeyCode(e))
            {
                if(Number.isInteger(Number(e.key)))
                {
                    e.target.value = `${e.target.value}${helpers.convertNumberToPersianNumber(e.key)}`
                    e.preventDefault();
                }
                return;
            }
            e.preventDefault();
        });

        this.addEvents(document.getElementById('price-number'),'keyup',(e) =>{
            document.getElementById('price-text').innerText = `${wordifyfa(e.target.value)} تومان`;
        });

        this.addEvents(document.getElementById('date-day'),'keydown',(e) => {
            this.dateInputFilter(e,'date-month',[1,31],2);
        })  
        this.addEvents(document.getElementById('date-month'),'keydown',(e) => {
            this.dateInputFilter(e ,'date-year',[1,12],2);
        })  
        this.addEvents(document.getElementById('date-year'),'keydown',(e) => {
            this.dateInputFilter(e ,'description',[1300,1500],4);
        })  
        this.addEvents(document.getElementById('submit-fin-data'),'click',(e) => {

            document.body.classList.toggle('body-modal');

            window.scrollTo({ top: 0, behavior: 'smooth' });

            document.getElementById('body-modal-back').style.width = '100%'

            document.getElementById('body-modal-back').style.height = '100%';

            document.getElementById('body-modal-back').style.top = '0';

            document.getElementById('body-modal-back').style.left = '0';

            const modalSpan = document.createElement('span');

            modalSpan.innerText = 'بستن';

            modalSpan.addEventListener('click',(e) => {document.getElementById('body-modal-back').click()});

            const modalBtn = document.createElement('button');

            modalBtn.classList.add('return');

            modalBtn.innerText = 'بازگشت';

            modalBtn.addEventListener('click',(e) => {document.getElementById('body-modal-back').click()});

            let modalDesc = '';

            if(helpers.checkFormIsFill()){
                this.formReset();
                
                modalDesc = "اطلاعات با موفقیت ثبت شد";

            }

            else

            {

                modalDesc = "لطفا فرم را به درستی پر کنید";

            }

            const submitModal = {

                links: [
                    modalSpan
                ],

                desc: modalDesc,

                buttons: [
                    modalBtn
                ]
            };

            helpers.modalCreator(submitModal);

            const modal = document.getElementById('mod');

            const val = `${modal.clientHeight}px`;

            modal.style.top = `calc(50% - ${val})`;

        })

        this.addEvents(document.getElementById('body-modal-back'),'click',(e) => {
            
            document.body.classList.toggle('body-modal');

            document.getElementById('body-modal-back').style.width = '0'

            document.getElementById('body-modal-back').style.height = '0';

            document.getElementById('mod').style.top = "-50%";
            
        })
    }

    checkInputKeyCode(e){
        if(e.keyCode == 8 || e.ctrlKey || e.keyCode > 46 && e.keyCode < 59 || e.keyCode > 95 && e.keyCode < 106)
        {
            return true;
        }
    }

    checkMaxLimitOfNumber(number,range = []){

        const inputNumber =number.split('').map(element => {
            return helpers.convertNumberToPersianNumber(element,true);
        }).join('');

        return inputNumber < range[0] || inputNumber > range[1] ? false : true;
    }

    dateInputFilter(e,focusElement,range,maxNumberLength){

        const inputLength = e.target.value.length + 1;

            if(this.checkInputKeyCode(e))
            {
                let newInputValue = '';

                if(Number.isInteger(Number(e.key)))
                {
                    newInputValue = `${e.target.value}${helpers.convertNumberToPersianNumber(e.key)}`;
                }

                if((new RegExp('[۰-۹]').exec(e.key)))
                {
                    newInputValue = `${e.target.value}${e.key}`;
                }

                if(inputLength > 1)
                {
                    if(e.ctrlKey || e.keyCode == 8){

                        if(e.ctrlKey){View.lastEvent = e;};

                        return;
                    }
                    
                    if(inputLength == maxNumberLength && !View.lastEvent)
                    {
                        if(!this.checkMaxLimitOfNumber(newInputValue,range))

                        {
                            e.preventDefault();
                            
                            return;
                        }

                        e.target.value = newInputValue;

                        e.preventDefault();

                        document.getElementById(focusElement).focus();

                        return;
                    }

                    if(View.lastEvent && View.lastEvent.ctrlKey)
                    {
                        e.target.value = helpers.convertNumberToPersianNumber(e.key);

                        e.preventDefault();

                        View.lastEvent = null;

                        return;
                    }
                    
                    if(inputLength < maxNumberLength)
                    {
                        e.target.value = newInputValue;

                        e.preventDefault();

                        return;
                    }

                    e.preventDefault();

                    document.getElementById(focusElement).focus();

                    return;
                }
                e.target.value = newInputValue;

                e.preventDefault();

                return;
            }

            e.preventDefault();

            return;
    }

    formReset(){
        document.getElementById('price-number').value = '';
        document.getElementById('date-year').value = '';
        document.getElementById('date-month').value = '';
        document.getElementById('date-day').value = '';
        document.getElementById('description').value = '';
        document.getElementById('price-text').innerText = 'تومان'
    }
}
