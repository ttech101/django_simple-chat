let currentMessages = []; // Initialize the current data outside the function
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
// Call the function regularly (e.g. every 5 seconds)
setInterval(updateMessages, 5000);

/**
 * This function sends a message to the database
 */

async function sendMessage(token, user) {
  const todayDate = formatDate(today);
  let fd = new FormData();
  urlId = secondToLastChar(window.location.pathname);
  url = "/chat" + urlId + "/";
  fd.append("textmessage", messagefield.value);
  fd.append("csrfmiddlewaretoken", token);
  fd.append("key1", urlId);
  try {
    createMessageInput(todayDate, user, messagefield.value);
    scrollDown();
    await fetch(url, {
      method: "POST",
      body: fd,
    });
    document.getElementById("messagefield").value = "";
  } catch (e) {
    console.error("Error", e);
  }
}

/**
 * This function creates the layout for a single message
 */

function createMessageInput(todayDate, user, messagefield) {
  return (messageContainer.innerHTML += `
        <div class="right-box fly-in-box">
          <div class="right-box-text">
          <div class="box-text-header">
        ${user} <span class="color-gray"> [${todayDate}]</span>
          </div>
        <i>${messagefield}</i>
          </div>
        </div> `);
}

/**
 * This function formats the date
 */

function formatDate(date) {
  if (date instanceof Date) {
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const paddedDay = String(day).padStart(1, "0");
    return `${month} ${paddedDay}, ${year}`;
  } else {
    const [year, month, day] = date.split("-");
    const monthIndex = parseInt(month, 10) - 1;
    const paddedDay = String(day).padStart(1, "0");
    return `${months[monthIndex]} ${paddedDay}, ${year}`;
  }
}

/**
 * This function updates the individual chat rooms
 */

function updateMessages() {
  let dataToSend = checkUserLogin(userLogin);
  fetch("/update_messages/" + "?" + new URLSearchParams(dataToSend), {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      if (JSON.stringify(data) !== JSON.stringify(currentMessages)) {
        currentMessages = data;
        messageContainer.innerHTML = "";
        data.forEach((message) => {
          let date = formatDate(message.created_at);
          if (userLogin == message.author) {
            createTemplateRightBox(
              date,
              message.created_time,
              message.author,
              message.text
            );
          } else {
            createTemplateLeftBox(
              date,
              message.created_time,
              message.author,
              message.text
            );
          }
        });
        scrollDown();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/**
 * This function checks whether the user is logged in
 */

function checkUserLogin(userLogin) {
  if (userLogin != undefined) {
    return {
      key1: window.location,
    };
  }
}

/**
 * This function creates the layout for a single message right
 */
function createTemplateRightBox(date, created_time, author, text) {
  return (messageContainer.innerHTML += `
            <div class="right-box">
              <div class="right-box-text">
                <div class="box-text-header">
                  ${author} <span class="color-gray"> ${created_time} [${date}]</span>
                </div>
                <i>${text}</i>
              </div>
            </div> `);
}

/**
 * This function creates the layout for a single message left
 */
function createTemplateLeftBox(date, created_time, author, text) {
  return (messageContainer.innerHTML += `
                <div class="left-box">
                    <div class="left-box-text">
                        <div class="box-text-header">
                         <span class="color-gray"> [${date}] ${created_time}</span> ${author}
                        </div>
                        <i>${text}</i>
                    </div>
                </div> `);
}

/**
 * This function automatically scrolls down the messages
 */
function scrollDown() {
  var scrollDiv = document.getElementById("messageContainer");
  scrollDiv.scrollTop = scrollDiv.scrollHeight;
}

/**
 * This function formats the chats according to room numbers
 */
function secondToLastChar(str) {
  if (str.length >= 2) {
    return str.charAt(str.length - 2);
  } else {
    return null;
  }
}
