import gsap from 'gsap';

class Under{
  constructor(){
    console.log('--------------under---------------');
    console.log(gsap);
  }
}

(() => {
  window.addEventListener('load', () => {
    const under = new Under();
  }, false);
})();
