<template>
<div class="scores">
  <div>Best score: {{highscore}}</div>
  <div>Number of tries: {{tries}}</div>
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
        <img src="./../assets/que_icon.png" alt="icon">
      </div>
      <div class="view back-view">
        <img :src="`./src/assets/${card.img}.png`" alt="card-img">
      </div>
    </li>    
  </ul>
</div>

<div class="options">
  <button type="button" @click="resetBestScore">Reset best score</button>
</div>
</template>


<script setup>
import { onMounted, ref } from 'vue'

const tries = ref(0);
const highscore = ref(0);
highscore.value = localStorage.getItem('remember-me-vue-highscore') ?? 0;

const matched = ref(0);
const disableDeck = ref(false);

const allCards = ['img-1', 'img-2', 'img-3', 'img-4', 'img-5', 'img-6', 'img-7', 'img-8'];
const cards = ref([]);
let cardOne= ref("");
let cardTwo = ref("");

function shuffleCards() {
  cards.value = [];
  // Reset matched
  matched.value = 0;
  disableDeck.value = false;
  cardOne.value = "";
  cardTwo.value = "";

  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  arr.sort(() => Math.random() > 0.5 ? 1 : -1);

  cards.value = arr.reduce((acc, element) => {
    const newCard = { 
      img: allCards[element - 1], 
      flipped: false,
      shake: false,
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
    if(matched.value == 8) {
      if (!highscore.value || tries.value < highscore.value) {
        localStorage.setItem('remember-me-vue-highscore', tries.value);
        highscore.value = tries.value;
        tries.value = 0;
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
    tries.value++;
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
</script>

<style scoped>
.wrapper {
  padding: 25px;
  border-radius: 10px;
  background: #F8F8F8;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.scores {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  width: 450px;
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
  .scores {
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
  .scores {
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
}

button:hover {
  background-color: #481e58;
  border-color: #481e58;
}
</style>
