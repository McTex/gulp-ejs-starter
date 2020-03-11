import gsap from 'gsap';

class Main{
  constructor(){
    console.log('--------------main---------------');
    console.log(gsap);
  }
}

(() => {
  window.addEventListener('load', () => {
    const main = new Main();
  }, false);
})();
