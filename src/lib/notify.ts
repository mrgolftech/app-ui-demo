export function notify(message:string){
  window.dispatchEvent(new CustomEvent('kidui:toast',{detail:message}));
}
