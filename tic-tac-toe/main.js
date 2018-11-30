$(document).ready(function () {
  console.log("document ready.");
  var firstPlayer = "player1";
  var secondPlayer = "player2";
  var currentTurn = "x";
  var currentPlayer = "";



  swal("Enter first player's name:", {
    content: "input",
  })
    .then((value) => {
      firstPlayer = value;
      if(value == undefined || value == null || value == ""){
        firstPlayer = "player1";
      }

      swal(`${firstPlayer}, choose your icon:`, {
        buttons: {
          X: {
            text: "X",
            value: "x",
          },
          O: {
            text: "O",
            value: "o",
          }
        },
      })
        .then((value) => {
          currentTurn = value;
          if(value == undefined || value == null || value == ""){
            currentTurn = "x";
          }

          swal("Enter second player's name:", {
            content: "input",
          })
            .then((value) => {
              secondPlayer = value;
              if(value == undefined || value == null || value == ""){
                secondPlayer = "player2";
              }
            })
        })

      currentPlayer = firstPlayer;
  
      var playerNameTag = document.getElementById("playerName")
      playerNameTag.innerHTML = `${currentPlayer}'s turn.`
      playerNameTag.hidden = false;


      var moves = 0;
      // var arr = [1,2,3,4,5,6,7,8,9];

      //iniitialize
      for (i = 1; i < 10; i++) {
        $(`#${i}`).attr("value", `${i}`);
      }


      function play(id) {
        var $thisNode = $(`#${id}`);
        $thisNode[0].setAttribute("value", currentPlayer);

        $thisNode.addClass(`${currentTurn}Icon`);

        $thisNode.off("click");

        // for (i = 0; i < arr.length; i ++){
        //   arr.splice(i-1)
        // }

        if (currentPlayer == firstPlayer) {
          currentPlayer = secondPlayer;
        } else {
          currentPlayer = firstPlayer;
        }
        playerNameTag.innerHTML = `${currentPlayer}'s turn.`

        if (currentTurn == "x") {
          currentTurn = "o";
        } else {
          currentTurn = "x";
        }
        moves++;
        checkForWinner();
      }

      // function computerPlay(){

      // }

      function checkForWinner() {
        console.log(`#1's value is ${$("#1")[0].getAttribute("value")}`);
        console.log(`#2's value is ${$("#2")[0].getAttribute("value")}`);
        console.log(`#3's value is ${$("#3")[0].getAttribute("value")}`);
        if (
          $("#1")[0].getAttribute("value") === $("#2")[0].getAttribute("value") &&
          $("#1")[0].getAttribute("value") === $("#3")[0].getAttribute("value")
        ) {
          $allNodes.off("click");
          console.log(`${$("#1")[0].getAttribute("value")} is the winner!`);
          winnerPrompt($("#1")[0].getAttribute("value"));
        } else if (
          $("#4")[0].getAttribute("value") === $("#5")[0].getAttribute("value") &&
          $("#4")[0].getAttribute("value") === $("#6")[0].getAttribute("value")
        ) {
          $allNodes.off("click");
          console.log(`${$("#4")[0].getAttribute("value")} is the winner!`);
          winnerPrompt($("#4")[0].getAttribute("value"));
        } else if (
          $("#7")[0].getAttribute("value") === $("#8")[0].getAttribute("value") &&
          $("#7")[0].getAttribute("value") === $("#9")[0].getAttribute("value")
        ) {
          $allNodes.off("click");
          console.log(`${$("#7")[0].getAttribute("value")} is the winner!`);
          winnerPrompt($("#7")[0].getAttribute("value"));
        } else if (
          $("#1")[0].getAttribute("value") === $("#4")[0].getAttribute("value") &&
          $("#1")[0].getAttribute("value") === $("#7")[0].getAttribute("value")
        ) {
          $allNodes.off("click");
          console.log(`${$("#1")[0].getAttribute("value")} is the winner!`);
          winnerPrompt($("#1")[0].getAttribute("value"));
        } else if (
          $("#2")[0].getAttribute("value") === $("#5")[0].getAttribute("value") &&
          $("#2")[0].getAttribute("value") === $("#8")[0].getAttribute("value")
        ) {
          $allNodes.off("click");
          console.log(`${$("#2")[0].getAttribute("value")} is the winner!`);
          winnerPrompt($("#2")[0].getAttribute("value"));
        } else if (
          $("#3")[0].getAttribute("value") === $("#6")[0].getAttribute("value") &&
          $("#3")[0].getAttribute("value") === $("#9")[0].getAttribute("value")
        ) {
          $allNodes.off("click");
          console.log(`${$("#3")[0].getAttribute("value")} is the winner!`);
          winnerPrompt($("#3")[0].getAttribute("value"));
        } else if (
          $("#1")[0].getAttribute("value") === $("#5")[0].getAttribute("value") &&
          $("#1")[0].getAttribute("value") === $("#9")[0].getAttribute("value")
        ) {
          $allNodes.off("click");
          console.log(`${$("#1")[0].getAttribute("value")} is the winner!`);
          winnerPrompt($("#1")[0].getAttribute("value"));
        } else if (
          $("#3")[0].getAttribute("value") === $("#5")[0].getAttribute("value") &&
          $("#3")[0].getAttribute("value") === $("#7")[0].getAttribute("value")
        ) {
          $allNodes.off("click");
          console.log(`${$("#3")[0].getAttribute("value")} is the winner!`);
          winnerPrompt($("#3")[0].getAttribute("value"));
        } else {
          if (moves == 9) {
            {
              console.log("DRAW GAME");
              winnerPrompt("DRAW");
            }
          }
        }
      }

      function winnerPrompt(winnerName) {
        playerNameTag.hidden = true;
        if (winnerName == "DRAW") {
          swal("The game is a draw!")
            .then(() => {
              location.reload();
            })
        }
        else {
          swal(`Congratulations, ${winnerName}`, "You have won!", "success")
            .then(() => {
              location.reload();
            })
        }

      }

      var $allNodes = $(".node");

      // console.log($allNodes);
      $allNodes.on("click", function () {
        play(this.id);
      });

    })

});