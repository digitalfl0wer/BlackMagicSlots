// button for user to click 
let balance = 2500;
let resetBalance = 0;
let bet = 0
document.querySelector('.twenty').addEventListener('click', addTwenty);
document.querySelector('.fifty').addEventListener('click', addFifty);
document.querySelector('.oneHundred').addEventListener('click', addHundred);
document.querySelector('.reset').addEventListener('click', zeroBalance);

// bet storage 
function addTwenty() {
    bet = 20
    document.querySelector('.bet').innerText = `Bet: $${bet}`

}

function addFifty() {
    bet = 50
    document.querySelector('.bet').innerText = `Bet: $${bet}`
}

function addHundred() {
    bet = 100
    document.querySelector('.bet').innerText = `Bet: $${bet}`
}
function zeroBalance() {
    
    document.querySelector('.balance').innerText = `Starting Balance: $${resetBalance}`
}


document.querySelector('.spin').addEventListener('click', spinReelZ);


// use array to display character 

let slotSymbols = ['afroPick.png', 'anhk.png', 'evilEye.png', 'goldHoopEarrings.png', 'hotSauce.png', 'lavaLamp.png', 'musicRecord.png', 'sweetPotatoPie.png', 'goldGrillz.png'];

// each wheel needs random number 
let symbolShuffle = Math.floor(Math.random() * slotSymbols.length);

// elements to display the symbols 
 document.querySelector('.reelOne').src = slotSymbols[0]
 document.querySelector('.reelTwo').src = slotSymbols[5]
 document.querySelector('.reelThree').src = slotSymbols[8]


console.log(symbolShuffle)
console.log(slotSymbols.length)

// function to write text on the screen 
// for function on each wheel 
function spinReelZ() {
    let slotOneNumber = Math.floor(Math.random() * slotSymbols.length)
    let slotTwoNumber = Math.floor(Math.random() * slotSymbols.length)
    let slotThreeNumber = Math.floor(Math.random() * slotSymbols.length)

    document.querySelector('.reelOne').src = slotSymbols[slotOneNumber]
    document.querySelector('.reelTwo').src = slotSymbols[slotTwoNumber]
    document.querySelector('.reelThree').src = slotSymbols[slotThreeNumber]

    
 if (slotOneNumber == slotTwoNumber && slotTwoNumber == slotThreeNumber) {
    document.querySelector('.winner').innerText = 'You Win!!'
    balance = balance + bet
    document.querySelector('.balance').innerText = `Balance: $${balance}`


 }else {
    document.querySelector('.winner').innerText = 'You lose!!'
    balance = balance - bet
    document.querySelector('.balance').innerText = `Balance: $${balance}`

 }


}
