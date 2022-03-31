export default class EventManager{
    addEvents(node , event , eventAction){
        if(Array.from(node).length > 0)
        {
            Array.from(node).forEach(element => {
                element.addEventListener(event,eventAction)
            });

            return;
        }
        node.addEventListener(event,eventAction)
    }
}