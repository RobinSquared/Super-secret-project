const express = require('express');

const app = express();
const port = 3000;


// Time counts down from 30 minutes
// Every 10 seconds there's a chance to do one of a few events
// Events:
// - Double the timer
// - Half the timer
// - Change the value of a second up or down
// - Reset the value of a second
// - Add/remove time

var timer = 1800; // 30 minutes in seconds
var secondValue = 1; // Initial value of a second (1 second)
var eventTimer = 1;
var curEvent = "none";
const formatShortTime = s => new Date(s * 1000).toISOString().substring(11, 19);
let eventHistory = [];

function recordEvent(eventName, currentTimer) {
    eventHistory.unshift({
        time: new Date().toTimeString().substring(0, 8),
        event: eventName,
        timer: formatShortTime(currentTimer)
    })
}

if(timer >= 0) {
    /*setTimeout(function tick() {
        timer -= secondValue;
        console.log(`Time left: ${timer} seconds`);
    }, 1000)*/

    var interval = setInterval(function() {
        timer -= 1;
    }, secondValue * 1000);

    var eventInterval = setInterval(function() {
        var randomEvent = Math.floor(Math.random() * 100); // Random number between 1 and 100

        if(randomEvent <= 2) {
            timer = timer * 2;
            curEvent = "Doubled Timer";
            // Add to Event History
            
        } else if(randomEvent <= 3) {
            timer = timer / 2;
            curEvent = "Halved Timer";
        } else if(randomEvent <= 4) {
            secondValue = secondValue + 0.25;
            curEvent = "Added 0.25 to Second Value";
        } else if(randomEvent <= 5) {
            secondValue = secondValue - 0.25;
            curEvent = "Removed 0.25 from Second Value";
        } else if(randomEvent <= 6) {
            secondValue = 1;
            curEvent = "Reset Second Value";
        } else if(randomEvent <= 10) {
            timer += 600;
            curEvent = "Added 10 minutes to timer";
        } else if(randomEvent <= 11) {
            timer -= 600;
            curEvent = "Removed 10 minutes from timer";
        } else if(randomEvent <= 15) {
            timer -= 300;
            curEvent = "Removed 5 minutes from timer";
        } else if(randomEvent <= 20) {
            timer += 300;
            curEvent = "Added 5 minutes to timer";
        } else if(randomEvent <= 30) {
            timer += 60;
            curEvent = "Added 1 minute to timer";
        } else if(randomEvent <= 35) {
            timer -= 60;
            curEvent = "Removed 1 minute from timer";
        }
        
        else {
            curEvent = "None";
        }
        if(eventHistory.length > 10) {
            eventHistory = eventHistory.slice(0, 10);
        }
        
        recordEvent(curEvent, timer);

        function logValues() {
            console.log(`Time left: ${formatShortTime(timer)}`);
            console.log(`Event: ${curEvent}`);
        }
        
        logValues();

        // Update website display with new values


    }, eventTimer * secondValue * 1000);
}

app.get('/timer', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Timer</title>
                <style>
                    body {
                        background-color: #1818184b;
                        color: white;
                        font-size: 75px;
                    }
                </style>
            <head>

            <body>
                <h1 id="timer">Loading...</h1>

                <script>
                    async function updateTimer() {
                        const response = await fetch('./json');
                        const data = await response.json();
                        document.getElementById('timer').textContent = data.timer;
                    }

                    setInterval(updateTimer, 1000);
                    updateTimer();
                </script>
            </body>
        </html>    
    `)
});

app.get('/event', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Event</title>
                <style>
                    body {
                        background-color: #1818184b;
                        color: white;
                        font-size: 75px;
                    }
                </style>
            <head>

            <body>
                <h1 id="event">Loading...</h1>

                <script>
                    async function updateEvent() {
                        const response = await fetch('./json');
                        const data = await response.json();
                        document.getElementById('event').textContent = data.curEvent;
                    }

                    setInterval(updateEvent, 1000);
                    updateEvent();
                </script>
            </body>
        </html>    
    `)
});

app.get('/eventhistory', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Event History</title>
        <style>
          body {
            color: white;
            font-size: 75px;
            text-align: left;
            padding-right: 50px;
          }

          li {
            list-style: none;
          }
        </style>
      </head>
      <body>
        <div style="background-color: #181818b7;">
            <h1>Recent Events</h1>
            <ul id="history"></ul>
        </div>

        <script>
          async function updateHistory() {
            const response = await fetch('/json');
            const data = await response.json();

            const list = document.getElementById('history');
            list.innerHTML = data.eventHistory.map(item =>
              \`<li>Time: \${item.time} - Event: \${item.event}</li>\`
            ).join('');
          }

          setInterval(updateHistory, 1000);
          updateHistory();
        </script>
      </body>
    </html>
  `);
});

app.get('/json', (req, res) => {
    res.json({
        timer: formatShortTime(timer),
        curEvent: curEvent,
        eventHistory: eventHistory
    })
})

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Timer Overlay</title>
            </head>
            <body>
                <p>
                    You can find the timer <a href="./timer">here</a>
                </p>
                <p></p>
                <p>
                    You can find the event <a href="./event">here</a>
                </p>
                <p></p>
                <p>
                    You can find the event history <a href="./eventhistory">here</a>
                </p>
            </body>
        </html>    
    `)
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});