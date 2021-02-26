"use strict"

const $audio = document.getElementById('audio'),
    $score = document.getElementById('score'),
    $step = document.getElementById('steps'),
    $timer = document.getElementById('timer'),
    $start = document.getElementById('start'),
    $board = document.getElementById('board'),
    $setting=document.getElementById('setting'),
    $refresh= document.getElementById('refresh'),
    cards = [
        {
            answer: '2C',
            image: './images/cards/2C.png'
        },
        {
            answer: 'QC',
            image: './images/cards/QC.png'
        },
        {
            answer: 'JH',
            image: './images/cards/JH.png'
        },
        {
            answer: 'QS',
            image: './images/cards/QS.png'
        },
        {
            answer: '9D',
            image: './images/cards/9D.png'
        },
        {
            answer: '7H',
            image: './images/cards/7H.png'
        }
    ];

let timerInterval,
    selection = [],
    timer = 120,
    steps = 0,
    score = 3;

const shuffle = (arrayOfItems) => {
    let counter = arrayOfItems.length;

    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = arrayOfItems[counter];
        arrayOfItems[counter] = arrayOfItems[index];
        arrayOfItems[index] = temp;
    }

    return arrayOfItems;
}

const countTime = () => {
    timerInterval = setInterval(() => {
        --timer;
        $timer.innerText = timer;

        if (timer === 0) {
            clearInterval(timerInterval);
            setTimeout(() => {
                Swal.fire({
                     icon: 'error',
                    title: 'Game Over',       
                    showConfirmButton: true,
                    confirmButtonText: 'Play Again'
                }).then((result) => {
                     if (result.isConfirmed) {
                        timer = 120,
                        steps = 0,
                        score = 3;
                        $step.innerText="0";
                        $score.innerText="3";
                        $board.innerHTML="";
                        $timer.innerText="120";
                    } 
                })
                $start.classList.remove('hide');
            }, 800)
        }
    }, 1000);
}

const countStep = () => {
    ++steps;
    $step.innerText = steps;
}

const calcScore = () => {
    const rating3Limit = (cards.length / 2) + 2,
        rating2Limit = cards.length,
        rating1Limit = (cards.length * 1.5);

    const is3Stars = steps <= rating3Limit,
        is2Stars = steps >= rating2Limit && steps < rating1Limit,
        is1star = steps >= rating1Limit;

    if (is3Stars) {
        score = 3;
    } else if (is2Stars) {
        score = 2;
    } else if (is1star) {
        score = 1;
    }
    $score.innerText = score;
}

const checkIfGameOver = () => {
    const openCards = (document.getElementsByClassName('open')).length;

    if ((cards.length * 2) === openCards) {
        clearInterval(timerInterval);
        setTimeout(() => {
            Swal.fire({
                title: 'Game Over',
                icon: 'success',
                showConfirmButton: true,
                confirmButtonText: 'Play Again'
            }).then((result) => {
                if (result.isConfirmed) {
                    timer = 120,
                        steps = 0,
                        score = 3;
                        $step.innerText="0";
                        $score.innerText="3";
                        $board.innerHTML="";
                        $timer.innerText="120";
                    //startGame();
                }
            })
            $start.classList.remove('hide');
        }, 800)
    }

}

const checkGameState = () => {
    countStep();
    calcScore();
    checkIfGameOver();
}

const printCards = (cardsArray) => {
    const shuffledCards = shuffle([...cardsArray, ...cardsArray]);
    $board.innerHTML = '';
    shuffledCards.forEach((card) => {
        const liElement = document.createElement('li');
        liElement.dataset.answer = card.answer;

        const imgElement = document.createElement('img');
        imgElement.src = card.image;
        imgElement.alt = card.answer;
        imgElement.title = card.answer;

        liElement.appendChild(imgElement);
        $board.appendChild(liElement);
    })
}

const startGame = () => {
 
    printCards(cards);
    countTime();
}

const flipCards = (isCorrect) => {
    $board.classList.add('compare');
    setTimeout(() => {
        const flippedCards = Array.from(document.getElementsByClassName('flip'));
        flippedCards.forEach(card => {
            if (isCorrect) {
                card.classList.replace('flip', 'open');
            } else {
                card.classList.remove('flip');
            }
        });
        $board.classList.remove('compare');
        checkGameState();
    }, 800);
}

$board.addEventListener('click', ($event) => {
    const isCard = $event.target.localName === 'li';
    const isOpenedCard = $event.target.classList.contains('open');
    const isFlippedCard = $event.target.classList.contains('flip');
    if (!isCard || isOpenedCard || isFlippedCard) { return; }

    const currentUserSelection = $event.target.dataset.answer;
    $event.target.classList.add('flip');
    selection.push(currentUserSelection);

    if (selection.length === 2) {
        const isCorrectAnswer = selection[0] === selection[1];
        flipCards(isCorrectAnswer);
        selection = [];
    }
})

$start.addEventListener('click', () => {
    startGame();
    $start.classList.add('hide');
})
