let currentMessages = []; // Initialisiere die aktuellen Daten außerhalb der Funktion
const today = new Date();
const months = [
  "Jan.",
  "Feb.",
  "Mar.",
  "Apr.",
  "May",
  "Jun.",
  "Jul.",
  "Aug.",
  "Sep.",
  "Oct.",
  "Nov.",
  "Dec.",
];
let userLogin;
// Rufe die Funktion regelmäßig auf (z.B., alle 5 Sekunden)
setInterval(updateMessages, 5000);
//updateMessages();

async function sendMessage(token, user) {
  const todayDate = formatDate(today);
  let fd = new FormData();
  urlId = secondToLastChar(window.location.pathname);
  url = "/chat" + urlId + "/";
  fd.append("textmessage", messagefield.value);
  fd.append("csrfmiddlewaretoken", token);
  fd.append("key1", urlId);
  try {
    messageContainer.innerHTML += `
        <div class="right-box fly-in-box">
          <div class="right-box-text">
          <div class="box-text-header">
        ${user} <span class="color-gray"> [${todayDate}]</span>
          </div>
        <i>${messagefield.value}</i>
          </div>
        </div> `;
    scrollDown();
    let response = await fetch(url, {
      method: "POST",
      body: fd,
    });
    //checkNewMassage(response);
    //document.getElementById("deleteMessage").remove();
    // messageContainer.innerHTML += `

    document.getElementById("messagefield").value = "";
  } catch (e) {
    console.error("Error", e);
  }
}

function formatDate(date) {
  // Überprüfe, ob es sich um ein Date-Objekt handelt
  if (date instanceof Date) {
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Verwende padStart, um sicherzustellen, dass der Tag immer aus einer Ziffer besteht
    const paddedDay = String(day).padStart(1, "0");

    return `${month} ${paddedDay}, ${year}`;
  } else {
    // Wenn kein Date-Objekt, gehe davon aus, dass es das "YYYY-MM-DD"-Format ist
    const [year, month, day] = date.split("-");
    const monthIndex = parseInt(month, 10) - 1; // Monate sind 0-basiert im Date-Objekt

    const paddedDay = String(day).padStart(1, "0");

    return `${months[monthIndex]} ${paddedDay}, ${year}`;
  }
}

function updateMessages() {
  if (userLogin != undefined) {
    var dataToSend = {
      key1: window.location,
    };
    fetch("/update_messages/" + "?" + new URLSearchParams(dataToSend), {
      method: "GET",
    }) // Passe die URL entsprechend an
      .then((response) => response.json())
      .then((data) => {
        // Vergleiche die erhaltenen Daten mit den aktuellen Daten
        if (JSON.stringify(data) !== JSON.stringify(currentMessages)) {
          // Aktualisiere die Anzeige nur, wenn sich die Daten geändert haben
          currentMessages = data; // Aktualisiere die aktuellen Daten
          // Wandele den JSON-String in ein JavaScript-Array um
          messageContainer.innerHTML = "";
          data.forEach((message) => {
            let date = formatDate(message.created_at);
            if (userLogin == message.author)
              messageContainer.innerHTML += `
                <div class="right-box">
                    <div class="right-box-text">
                        <div class="box-text-header">
                        ${message.author} <span class="color-gray"> ${message.created_time} [${date}]</span>
                        </div>
                        <i>${message.text}</i>
                    </div>
                </div> `;
            else {
              messageContainer.innerHTML += `
                <div class="left-box">
                    <div class="left-box-text">
                        <div class="box-text-header">
                         <span class="color-gray"> [${date}] ${message.created_time}</span> ${message.author}
                        </div>
                        <i>${message.text}</i>
                    </div>
                </div> `;
            }
          });
          scrollDown();
        }
      })

      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function scrollDown() {
  var scrollDiv = document.getElementById("messageContainer");
  scrollDiv.scrollTop = scrollDiv.scrollHeight;
}

function secondToLastChar(str) {
  // Check if the string is long enough
  if (str.length >= 2) {
    // Return the second-to-last character
    return str.charAt(str.length - 2);
  } else {
    // If the string is too short, return null or handle an error
    return null; // Or throw an error, depending on your requirements
  }
}
