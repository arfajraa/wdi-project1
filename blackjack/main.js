$(document).ready(function () {
    console.log("jquery ready.");

    var suits = ["hearts", "diamonds", "spades", "clubs"];
    var ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    // var ranks = ["A", "A", "A", "A", "A", "A", "A", "A", "A", "K", "K", "K", "K"];
    var finalDeck = [];
    var playerHand = [];
    var dealerHand = [];
    var playerValue = 0;
    var dealerValue = 0;
    var funds = 1000;
    var status;
    var $playersCards = $("#playersCards");
    var $dealersCards = $("#dealersCards");
    var $dealButton = $("#deal");
    var $hitButton = $("#hit");
    var $standButton = $("#stand");
    var $dealersValue = $("#dealersValue");
    var $playersValue = $("#playersValue");
    var $status = $("#status");
    var $funds = $("#funds");
    var $bet = $("#bet");
    var $shuffle = $("#reshuffle");
    var $bettingStatus = $("#bettingStatus");
    var $musicButton = $("#music-control");

    //function that generates a new deck using the predefined arrays suits and ranks.
    //each element of the array is a card object that has a suit, a rank, a value in blackjack-
    //and a property "img" which evaluates to the appropriate png file based on the suit and rank of the card
    function generateDeck() {
        var newDeck = new Array();
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 13; j++) {
                var value = parseInt(ranks[j]);
                if (ranks[j] == "J" || ranks[j] == "Q" || ranks[j] == "K") {
                    value = 10;
                }
                else if (ranks[j] == "A") {
                    value = 11;
                }

                var theRank = ranks[j];
                if (ranks[j] == "J") {
                    theRank = "jack";
                }
                else if (ranks[j] == "Q") {
                    theRank = "queen";
                }
                else if (ranks[j] == "K") {
                    theRank = "king";
                }
                else if (ranks[j] == "A") {
                    theRank = "ace";
                }

                newDeck.push({
                    "suit": suits[i],
                    "rank": ranks[j],
                    "value": value,
                    "img": `${theRank}_of_${suits[i]}.png`
                })
            }
        }
        return newDeck;
    }

    //uses generateDeck() to generate 8 new decks of cards and pushes them to the finalDeck which will be played with
    function createFinalDeck() {
        //clear the deck
        finalDeck.splice(0, finalDeck.length);
        //generate 8 new decks and add their elements to the finalDeck which will be played with
        for (var i = 0; i < 8; i++) {
            // console.log('pushing new deck');
            finalDeck.push.apply(finalDeck, generateDeck());
        }
    }

    //function that takes in an array and shuffles its elements.
    function shuffleDeck(deck) {
        for (var i = deck.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = deck[i];
            deck[i] = deck[j];
            deck[j] = temp;
        }
    }


    //initializes a game, this will be called when the user clicks on the deal button.
    //it will deal 2 cards to the player and 2 cards with one facing down to the dealer 
    function deal() {
        if (parseInt($bet.val()) > funds || parseInt($bet.val()) < 1) {
            $status.html("Invalid bet.")
        }
        else {
            $bet.prop("disabled", true);
            $bettingStatus.hide(true);
            $shuffle.hide(true);
            $status.hide(true);
            playerValue = 0;
            dealerValue = 0;
            $dealersCards.empty();
            $playersCards.empty();

            $dealButton.hide(true);
            $hitButton.show(true);
            $standButton.show(true);

            hit("player");
            hit("dealer");
            var $anonCard = $("<img/>").attr("id", "dummy").addClass("card").attr("src", "./img/cards/back_of_card.jpg");
            $anonCard.hide().appendTo($dealersCards).fadeIn("slow");
            hit("player");

            $dealersValue.show(true);
            $playersValue.show(true);
        }
    }

    //directly called when the player clicks the hit button
    //this function will add a card to either the player or the dealer's hand depending on
    //the passed value which also depends on what step the game is currently on
    function hit(turn) {
        document.getElementById("dealCard").play();
        var cardFromTop = finalDeck.shift();
        var $newCard = $("<img/>");
        $newCard.addClass("card");
        $newCard.attr("src", `./img/cards/${cardFromTop.img}`);

        if (turn == "player") {
            playerHand.push(cardFromTop);
            calculateHand("player");
            if (playerValue > 21) {
                playerHand.forEach(function (element) {
                    if (element.value == 11 && playerValue > 21) {
                        element.value = 1;
                        calculateHand("player");
                    }
                });
            }
            $newCard.hide().appendTo($playersCards).fadeIn("slow");
            calculateHand("player");
            console.log(playerHand);
            console.log("player's hand value: " + playerValue);

            if (playerValue == 21) {
                stand();
            }
            else if (playerValue > 21) {
                status = "playerbust";
                endGame();
            }
        }

        else if (turn == "dealer") {
            dealerHand.push(cardFromTop);
            calculateHand("dealer");
            if (dealerValue > 21) {
                dealerHand.forEach(function (element) {
                    if (element.value == 11 && dealerValue > 21) {
                        element.value = 1;
                        calculateHand("dealer");
                    }
                });
            }
            $newCard.hide(true).appendTo($dealersCards).fadeIn("slow");

            console.log("dealer's hand value: " + dealerValue);
        }

        $hitButton.prop("disabled", false);
        // console.log("player's hand value: " + playerValue)
    }

    //function that'll calculate the value of the player or dealer's hand depending on the passed value
    function calculateHand(turn) {
        if (turn == "player") {
            playerValue = 0;
            playerHand.forEach(function (element) {
                playerValue += element.value;
            })
            document.getElementById("playersValue").innerHTML = "Value of your hand: " + playerValue;
        }
        else if (turn == "dealer") {
            dealerValue = 0;
            dealerHand.forEach(function (element) {
                dealerValue += element.value;
            })
            document.getElementById("dealersValue").innerHTML = "Value of dealer's hand: " + dealerValue;
        }
    }

    //called when the user gets a blackjack hand (21) or when they click the stand 
    //button to indicate that they'll stick with the cards in their hand.
    //it will cause the dealer to reveal their other card and keep hitting until their hand's value
    //is greater than 17 as per blackjack rules.
    function stand() {
        $dealButton.show(true);
        $hitButton.hide(true);
        $standButton.hide(true);
        $("#dummy").hide(true);
        // var check = true;
        while (dealerValue < 17) {
            // check = false;

            // window.setInterval(function(){
            hit("dealer");
            // check = true
            // }, 200)

        }
        if (playerValue == dealerValue) {
            status = "draw";
        }
        else if (playerValue == 21) {
            status = "blackjack";
        }
        else if (playerValue > dealerValue) {
            status = "playerwin";
        }
        else if (dealerValue > playerValue && dealerValue <= 21) {
            status = "dealerwin";
        }
        else if (dealerValue > 21) {
            status = "playerwin";
        }
        endGame();
    }


    //called when the game ends to change the status to show the user the outcome of the game
    function endGame() {
        $status.show(true);

        if (status == "playerbust") {
            $status.html("Bust! Better luck next time.");
            funds -= parseFloat($bet.val());
            $funds.html(funds);
        }
        else if (status == "blackjack") {
            $status.html("Blackjack! You win!");
            console.log("funds: " + funds);
            funds = funds + parseFloat($bet.val()) + (parseFloat($bet.val()) / 2);
            console.log("funds: " + funds);
            $funds.html(funds);
        }
        else if (status == "playerwin" && dealerValue > 21) {
            $status.html("Dealer bust! You win!");
            funds = funds + parseFloat($bet.val());
            $funds.html(funds);
        }
        else if (status == "playerwin") {
            $status.html("You win!");
            funds = funds + parseFloat($bet.val());
            $funds.html(funds);
        }
        else if (status == "dealerwin") {
            $status.html("House wins.");
            funds -= parseFloat($bet.val());
            $funds.html(funds);
        }
        else if (status == "draw") {
            $status.html("The game is a draw.");
        }
        console.log("funds: " + funds);
        playerHand = [];
        dealerHand = [];
        $dealButton.show(true);
        $hitButton.hide(true);
        $standButton.hide(true);
        $bet.prop("disabled", false);
        $bettingStatus.show(true);
        $shuffle.show(true);
        // $bet.val(0);
    }

    //utility function just to get a random number within a range, just used to alternate the audio on hit
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max)) + 1;
    }

    //by default the finalDeck will be created and shuffled on load, these will also be executed
    //when the player chooses to reshuffle the deck
    createFinalDeck();
    shuffleDeck(finalDeck);
    //show the available funds the player has, always starts with $1000
    $funds.html(funds);
    // console.log(finalDeck);

    //just to emphasize when it's time to place a bet
    window.setInterval(function () {
        $bettingStatus.toggleClass("betStatusColor");
    }, 250);

    //bunch of event listeners for the buttons
    //========================================
    $dealButton.on("click", deal);

    $hitButton.on("click", function () {
        var hitAudio = document.getElementById(`hit${getRandomInt(4)}`);
        hitAudio.play();
        $hitButton.prop("disabled", true);;
        window.setTimeout(function () {
            hit("player");
        }, 1000)
    });
    $shuffle.on("click", function () {
        var shuffleAudio = document.getElementById(`shuffle`);
        shuffleAudio.play();
        createFinalDeck();
        shuffleDeck(finalDeck);
        $status.html("Reshuffled deck.");
    });

    $standButton.on("click", stand);

    $musicButton.on("click", function () {
        var musicBackground = document.getElementById("backgroundMusic");
        musicBackground.volume = 0.05;
        musicBackground.play();
        $musicButton.hide(true);
    })
    // console.log(playerHand);
    // console.log(playerValue);

})