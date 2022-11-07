<template>
<div class="scores second-wrapper">
  <div>Best score: {{highscore}}</div>
  <div>Score: {{score}}</div>
</div>

<div class="wrapper">      
  <ul class="cards">
    <li 
      class="card" 
      :class="{'flip': card.flipped, 'shake': card.shake}" 
      v-for="(card, index) in cards" 
      :key="index" 
      @click="flipCard(card)"
      >
      <div class="view front-view">
        <img src="/assets/que_icon.png" alt="icon">
      </div>
      <div class="view back-view">
        <img :src="`/assets/${card.img}.png`" alt="card-img">
      </div>
    </li>    
  </ul>
</div>

<div class="options second-wrapper">
  <button type="button" @click="resetBestScore">Reset best score</button>
  <div class="themes">
    <p>Pick theme:</p>
    <p>
      <input type="radio" name="theme" id="drinks" value="drinks" v-model='theme'/>
      <label for="drinks">Drinks</label>
    </p>
    <p>
      <input type="radio" name="theme" id="animals" value="animals" v-model='theme'/>
      <label for="animals">Animals</label>
    </p>
  </div>
</div>
</template>


<script setup>
import { onMounted, ref, watch } from 'vue'

const score = ref(0);
const highscore = ref(0);
highscore.value = localStorage.getItem('remember-me-vue-highscore') ?? 0;

const matched = ref(0);
const disableDeck = ref(false);

const allCards = {
  drinks: ['img-1', 'img-2', 'img-3', 'img-4', 'img-5', 'img-6', 'img-7', 'img-8'], 
  animals: ['camel', 'cat', 'chicken', 'chimpanzee', 'dog', 'duck', 'fox', 'red-panda']
};
const cards = ref([]);
let cardOne= ref("");
let cardTwo = ref("");

function shuffleCards() {
  cards.value = [];
  // Reset matched
  matched.value = 0;
  score.value = 0;
  disableDeck.value = false;
  cardOne.value = "";
  cardTwo.value = "";

  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  arr.sort(() => Math.random() > 0.5 ? 1 : -1);

  cards.value = arr.reduce((acc, element) => {
    const newCard = { 
      img: allCards[theme.value][element - 1], 
      flipped: false,
      shake: false,
      index: element - 1
    };
    acc.push(newCard)
    return acc;
  }, []);
}

function shakeCards() {
  setTimeout(() => {
    cardOne.value.shake = true;
    cardTwo.value.shake = true;
  }, 400);
}

function hideCards() {
  setTimeout(() => {
    cardOne.value.shake = false;
    cardOne.value.flipped = false;
    cardTwo.value.shake = false;
    cardTwo.value.flipped = false;

    cardOne.value = cardTwo.value = "";
    disableDeck.value = false;
  }, 1200);
}

function matchCards() {
  let img1 = cardOne.value.img;
  let img2 = cardTwo.value.img;
  if(img1 === img2) {
    matched.value++;
    if(matched.value === 8) {
      if (!highscore.value || score.value < highscore.value) {
        localStorage.setItem('remember-me-vue-highscore', score.value);
        highscore.value = score.value;        
      }
      restartGame();
    }
    cardOne.value = cardTwo.value = "";
    return disableDeck.value = false;
  }
  shakeCards();
    
  hideCards();
};

function flipCard(cardElem) {
  if(cardOne.value !== cardElem && !disableDeck.value) {
    cardElem.flipped = true;
    if(!cardOne.value) {
      return cardOne.value = cardElem;
    }
    cardTwo.value = cardElem;
    disableDeck.value = true;
    score.value++;
    matchCards();
  }
}

function restartGame() {
  setTimeout(() => {
    return shuffleCards();
  }, 1000);
}

onMounted(() => { 
  shuffleCards();
})

function resetBestScore() {
  localStorage.setItem('remember-me-vue-highscore', 0);
  highscore.value = 0;
}

const theme = ref();
theme.value = localStorage.getItem('remember-me-vue-theme') ?? 'drinks';

watch(theme, (newTheme) => {
  cards.value.forEach(c => {
    c.img = allCards[theme.value][c.index];
  })
  localStorage.setItem('remember-me-vue-theme', newTheme);
})
</script>

<style scoped>
.wrapper {
  padding: 25px;
  border-radius: 10px;
  background: #F8F8F8;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
.second-wrapper {  
  width: 450px;
}
.scores {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.cards, 
.card, 
.view {
  display: flex;
  align-items: center;
  justify-content: center;
}
.cards {
  height: 400px;
  width: 400px;
  flex-wrap: wrap;
  justify-content: space-between;
}
.cards .card {
  cursor: pointer;
  list-style: none;
  user-select: none;
  position: relative;
  perspective: 1000px;
  transform-style: preserve-3d;
  height: calc(100% / 4 - 10px);
  width: calc(100% / 4 - 10px);
}
.card.shake {
  animation: shake 0.35s ease-in-out;
}
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-13px);
  }
  40% {
    transform: translateX(13px);
  }
  60% {
    transform: translateX(-8px);
  }
  80% {
    transform: translateX(8px);
  }
}
.card .view {
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 7px;
  background: #fff;
  pointer-events: none;
  backface-visibility: hidden;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  transition: transform 0.25s linear;
}
.card .front-view img {
  width: 45px;
}
.card .back-view img {
  max-width: 45px;
}
.card .back-view {
  transform: rotateY(-180deg);
}
.card.flip .back-view {
  transform: rotateY(0);
}
.card.flip .front-view{
  transform: rotateY(180deg);
}
@media screen and (max-width: 700px) {
  .second-wrapper {
    width: 400px;
  } 
  .cards {
    height: 350px;
    width: 350px;
  }
  .card .front-view img {
    width: 40px;
  }
  .card .back-view img {
    max-width: 40px;
  }
}
@media screen and (max-width: 530px) {
  .second-wrapper {
    width: 350px;
  } 
  .cards {
    height: 300px;
    width: 300px;
  }
  .card .front-view img {
    width: 35px;
  }
  .card .back-view img {
    max-width: 35px;
  }
}

.options {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

button {
  cursor: pointer;
  font-size: 14px;
  border-radius: 3px;
  padding: 6px 10px;
  color: #fff;
  background-color: #2d1238;
  border-color: #2d1238;
  text-transform: uppercase;
  width: fit-content;
  margin-inline: auto;
}

button:hover {
  background-color: #481e58;
  border-color: #481e58;
}

.themes {
  margin-top: 20px;
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  color: #ffffff;
}

[type='radio'] {
  accent-color: #481e58;
  margin-right: 3px;
}
</style>
