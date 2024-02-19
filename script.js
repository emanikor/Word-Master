const letters   = document.querySelectorAll('.scoreboard-letter')
const loadingDiv   = document.querySelector('.infor-bar')
const ANSWER_LENGHT = 5
let isLoading =  false;
let done = false;


async function innit(){
let currentGuess ='';
let currentRow = 0;

const res = await fetch("https://words.dev-apis.com/word-of-the-day");
const resObj = await res.json();
const word = resObj.word.toUpperCase();
const wordParts = word.split("");
setLoading(false) ;
console.log(word);


async function commit(){
    if(currentGuess.length != ANSWER_LENGHT){
        // do nothing
        return;
    }

    // todo  validate the row
       isLoading = true;
      setLoading(true);
      const res = await fetch("https://words.dev-apis.com/validate-word", {
        method : "post",
        body : JSON.stringify({word: currentGuess})

        
      });
      console.log(res)
      

      const resObj = await res.json();
      const validWord =resObj.validWord;
    //   const { validWord} =

      isLoading = false;
      setLoading(false);


      if (!validWord){
        markInvalidWord();
        return;
      }
    // todo marking correct or wrong 


const guessParts = currentGuess.split("");
const map = makeMap(wordParts);
console.log(map)


for(let i = 0; i < ANSWER_LENGHT; i++){
// mark as correct

if (guessParts[i] === wordParts[i]) {
    letters[currentRow * ANSWER_LENGHT + i].classList.add("correct");
     map[guessParts[i]]--;
   
  }
  console.log(guessParts[i])
}


 
for(let i = 0; i < ANSWER_LENGHT; i++){
    if (guessParts[i] === wordParts[i]) {
        // do nothing
    }else if(wordParts.includes(guessParts[i])&&map[guessParts[i]] > 0){
        letters[currentRow * ANSWER_LENGHT + i].classList.add("close");
        map[guessParts[i]]--;
    }else {
        letters[currentRow * ANSWER_LENGHT + i].classList.add("wrong");
    
    }
}

    // todo did they win or loose
    currentRow++;
    if (currentGuess ===word){
        // win 
        alert("you win")
    
        document.querySelector('.brand').classList.add("winner")
        done= true;
        return;
    } else if(currentRow === ROUNDS){
        alert(`you lose, the word was ${word}`)
        done = true;
    }
    currentGuess ='';
    
}


    function addLetter(letter){
      if(currentGuess.length < ANSWER_LENGHT ){
      currentGuess +=letter;
    } else{
        currentGuess =currentGuess.substring(0, currentGuess.length -1) + letter;
    }
    letters[ANSWER_LENGHT * currentRow + currentGuess.length -1].innerText =letter;
    }


    function backspace(){
        currentGuess =currentGuess.substring(0, currentGuess.length -1) ;
        letters[ANSWER_LENGHT * currentRow + currentGuess.length].innerText ="";
    }


    function markInvalidWord(){

        for (let i = 0; i < ANSWER_LENGHT; i++){
            letters[currentRow * ANSWER_LENGHT + i].classList.remove("invalid");
            setTimeout(function (){
                letters[currentRow * ANSWER_LENGHT + i].classList.remove("invalid");
            }, 10)
        }
        // alert("not in valid word")
    }




    document.addEventListener('keydown',  function handleKeyPress(event ){
        
        if(done || isLoading){
            // do nothhing
            return  
        }
        
        const action =event.key;
       

        if(action === 'Enter'){
            commit();

        }
        else if(action=== 'Backspace'){
            backspace();
            console.log('yes')       
         }
         else if(isLetter(action)){
            addLetter(action.toUpperCase())
                   
         }
         else{
            // do nothhing 
         }
    })
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
  }

  function setLoading(isLoading) {
    loadingDiv.classList.toggle("hidden", !isLoading);
  }

  function makeMap(array){
    const obj ={};
    for(let i = 0; i < array.length; i++){
        const letter = array[i]
         if(obj[letter]){
            obj[letter]++;
         }else{
            obj[letter] =1
         }
    }
    return obj;
  }
innit()