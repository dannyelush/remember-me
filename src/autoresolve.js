const cards = Array.from(document.querySelectorAll('.back-view'));
const openedImage = [];

cards.forEach((c, index) => {
  const image = c.querySelector('img').src;
  if (openedImage.indexOf(image) === -1) {
    openedImage.push(image);
    setTimeout(async () => {
      // open first image
      cards[index].parentElement.click();

      // find second image
      const secondImage = cards.find((i, ind) => i.querySelector('img').src === image && index !== ind);
      setTimeout(() => {
        secondImage.parentElement.click();
      }, 300);      
    }, 1300 * (openedImage.length + 1));
  }
}, []);