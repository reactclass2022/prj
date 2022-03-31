import view from './view.js'
import model from './model.js'
class Controller{

    init(){
        model.loadFinTotal();
        model.loadTableData();  
        model.initStat();
    }
}

(new Controller()).init();
