// start balance with 2500 
    let balance = 1000
    let bet = 0

//20 bet click button
// event listener that call 20 bet function
    document.querySelector('.twenty').addEventListener('click', addTwenty)

//50 bet click button
    //event listener that calls 50 bet button
    document.querySelector('.fifty').addEventListener('click', addFifty)

//100 bet click button
    //event listener that calls 100 bet button
    document.querySelector('.oneHundred').addEventListener('click', addHundred)


// bet 20 function
    function addTwenty() {
         bet = 20
        document.querySelector('.bet').innerText = `Bet: $${bet}`
    }


// bet 50 function
    function addFifty() {
        bet = 50

    document.querySelector('.bet').innerText = `Bet: $${bet}`
}

// bet 100 function
function addHundred() {
        bet = 100
            document.querySelector('.bet').innerText = `Bet: $${bet}`   

        document.querySelector('.balance').innerText = `Balance: $${balance}`   

}

// what can they do
// what do they expect 
// what do they see 
//REELS
document.querySelector('.spin').addEventListener('click',spinReels)
let reelOne = document.querySelector('.reelOne').src = 'questionmark.png'
let reelTwo = document.querySelector('.reelTwo').src = 'questionmark.png'
let reelThree = document.querySelector('.reelThree').src = 'questionmark.png'


    //display result
//  directions for each reel to spin 
function spinReels(){
   

// conditional for first reel 

    let randomOne = Math.floor(Math.random() * 5) + 1

    if (randomOne  == 1){
        reelOne = document.querySelector('.reelOne').src = 'afroPick.png'
    }else if (randomOne == 2) {
        reelOne = document.querySelector('.reelOne').src = 'goldGrillz.png'
    }else if (randomOne == 3){
        reelOne = document.querySelector('.reelOne').src = 'lavaLamp.png'
    }else if(randomOne == 4){
        reelOne = document.querySelector('.reelOne').src = 'anhk.png'
    }else if (randomOne == 5){
        reelOne = document.querySelector('.reelOne').src = 'sweetPotatoPie.png'
    } 



// conditinal for the second reel 
    let randomTwo = Math.floor(Math.random() * 5) + 1

    if (randomTwo  == 1){
        reelTwo = document.querySelector('.reelTwo').src = 'afroPick.png'
    }else if (randomTwo == 2) {
        reelTwo = document.querySelector('.reelTwo').src = 'goldGrillz.png'
    }else if (randomTwo == 3){
        reelTwo = document.querySelector('.reelTwo').src = 'lavaLamp.png'
    }else if(randomTwo == 4){
        reelTwo = document.querySelector('.reelTwo').src = 'anhk.png'
    }else if (randomTwo == 5){
        reelTwo = document.querySelector('.reelTwo').src = 'sweetPotatoPie.png'
    }  

// conditional for the third reel 

    let randomThree = Math.floor(Math.random() * 5) + 1

    if (randomThree  == 1){
        reelThree = document.querySelector('.reelThree').src = 'afroPick.png'
    }else if (randomThree == 2) {
        reelThree = document.querySelector('.reelThree').src = 'goldGrillz.png'
    }else if (randomThree == 3){
        reelThree = document.querySelector('.reelThree').src = 'lavaLamp.png'
    }else if(randomThree == 4){
        reelThree = document.querySelector('.reelThree').src = 'anhk.png'
    }else if (randomThree == 5){
        reelThree = document.querySelector('.reelThree').src = 'sweetPotatoPie.png'
    } 

    
    if (reelOne == reelTwo && reelTwo == reelThree){
        balance = (bet * 10) + balance 
        document.querySelector('.winner').innerHTML = 'You Win!!'
        document.querySelector('.balance').innerText = `Balance: $${balance}`

    }else{
        balance = balance - bet

        document.querySelector('.winner').innerHTML = 'Try again, Winning is in your future!!'
        document.querySelector('.balance').innerText = `Balance: $${balance}`
    }return

} 

    // display if they win or lose 

document.querySelector('.reset').addEventListener('click',resetReels)

function resetReels(){
    let resetBalance = 2500
    document.querySelector('.balance').innerHTML = `Starting Balance: $${resetBalance}`
     reelOne = document.querySelector('.reelOne').src = 'questionmark.png'
     reelTwo = document.querySelector('.reelTwo').src = 'questionmark.png'
     reelThree = document.querySelector('.reelThree').src = 'questionmark.png'

}