let flag = false;
let isClear = false;
let settingModal = document.querySelector(".model");
let result = document.getElementById("result");
let wave = document.getElementById("wave");
let mic = document.getElementById("mic");
let Langs = document.querySelectorAll(".lang_list");
let micInner = document.getElementById("micInner");
let mainBox = document.getElementById("main");
let showLang = document.getElementById("btshow");
let clear = document.getElementById("clear");
let copy = document.getElementById("copy");
let speakbtn = document.getElementById("speak");
let error = document.getElementById("err");
let errormsg = document.getElementById("errmsg");
let dark = document.getElementById("dark");
let model = document.querySelector("dialog");
//localstorage
let text = document.getElementById("text");
let ifDark = localStorage.getItem("dark");
// localstorage functions

if (ifDark === "true") {
  addDarkMode();
  dark.checked = true;
} else {
  removeDarkMode();
  dark.checked = false;
}

let innerSpeakBtn = speakbtn.querySelector("i");

function cancelError() {
  model.close();
}
Langs.forEach((lang) => {
  lang.addEventListener("click", (e) => {
    let lg = e.target.innerHTML;
    showLang.textContent = lg;
    speakHindi(lg + "भाषा चुना गया ");

    switch (lg) {
      case "Hindi":
        setLanguage("hi-IN");
        break;
      case "English":
        setLanguage("en-US");
        break;
      case "Bengali":
        setLanguage("bn-IN");
        break;
      case "Telgu":
        setLanguage("ta-IN");
        break;
      case "Tamil":
        setLanguage("ta-IN");
        break;
      case "Punjabi":
        setLanguage("pa-IN");
        break;
      case "Sanskrit":
        setLanguage("sa-IN");
        break;
      case "Urdu":
        setLanguage("ur-IN");
        break;
    }
  });
});

const recognitionSvc =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!recognitionSvc) {
  console.error("Speech recognition is not supported in this browser.");
}
let recognition;
let language;
function setLanguage(languages) {
  language = languages;
}

function startListening() {
  recognition = new recognitionSvc();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.lang = language || "en-US";
  mainBox.classList.add("animate");
  micInner.style.display = "none";
  wave.style.display = "flex";
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (event.results[0].isFinal) {
      result.innerHTML += " " + transcript;
      result.querySelector("p").remove();
    } else {
      if (!document.querySelector(".interim")) {
        const interim = document.createElement("p");
        interim.classList.add("interim");
        result.appendChild(interim);
      }
    }
    document.querySelector(".interim").innerHTML = " " + transcript;
    // result.textContent += transcript + " ";
  };

  recognition.onspeechend = () => {
    startListening();
  };

  recognition.onerror = (event) => {
    stopRecording();
    if (event.error === "no-speech") {
      openModelWithMsg(event.error, "No speech was detected");
    } else if (event.error === "audio-capture") {
      openModelWithMsg(
        event.error,
        "No microphone was found. Ensure that a microphone is installed"
      );
    } else if (event.error === "not-allowed") {
      openModelWithMsg(
        event.error,
        "Permission to use microphone is blocked. Please allow to use microphone"
      );
    } else if (event.error === "aborted") {
      openModelWithMsg(
        event.error,
        "Speech recognition failed to understand your input. Please speak clearly and check your microphone settings. Retry or type your message !"
      );
    } else {
      alert("Error occurred in recognition: " + event.error);
    }
  };

  recognition.onstart = () => {
    result.placeholder = "Listening...";
    if (isClear) {
      result.textContent = " ";
    }
  };
}

mic.addEventListener("click", () => {
  if (flag) {
    stopRecording();
    flag = false;
  } else {
    startListening();
    flag = true;
  }
});

function restartRecognition() {
  startListening();
  cancelError();
}

function openModelWithMsg(msg, dis) {
  error.textContent = msg;
  errormsg.textContent = dis;
  model.showModal();
}

function stopRecording() {
  recognition.stop();
  wave.style.display = "none";
  micInner.style.display = "grid";
  mainBox.classList.remove("animate");
  result.placeholder = " ";
}

clear.onclick = () => {
  result.textContent = null;
};
copy.onclick = () => {
  navigator.clipboard.writeText(result.textContent);
  let cp = copy.querySelector("i");
  cp.textContent = "done";
  setTimeout(() => {
    cp.textContent = "content_copy";
  }, 3000);
};

speakbtn.onclick = () => {
  speakHindi(result.textContent);
  innerSpeakBtn.textContent = "sync";
};

function speakHindi(text) {
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  utterance.voice = window.speechSynthesis.getVoices()[12];

  // Add an event listener for the 'start' event.
  utterance.onstart = function (event) {
    innerSpeakBtn.textContent = "pause";
  };
  utterance.onend = function (event) {
    innerSpeakBtn.textContent = "volume_up";
  };
  utterance.onpause = function (event) {
    innerSpeakBtn.textContent = "play_arrow";
  };

  utterance.onerror = function (event) {
    console.error("An error occurred during speech synthesis:", event.error);
  };
  if (utterance.isSpeaking) {
    speechSynthesis.pause();
  }
  speechSynthesis.speak(utterance);
}

//Helper funcitons.............

dark.addEventListener("change", (e) => {
  if (e.target.checked) {
    addDarkMode();
    localStorage.setItem("dark", "true");
  } else {
    removeDarkMode();
    localStorage.setItem("dark", "false");
  }
});

text.addEventListener("change", (e) => {
  if (e.target.checked) {
    isClear = true;
  } else {
    isClear = false;
  }
});

function addDarkMode() {
  document.body.classList.add("darkMode");
}
function removeDarkMode() {
  document.body.classList.remove("darkMode");
}

function openSettings() {
  settingModal.classList.add("show");
}
function closeSettings() {
  settingModal.classList.remove("show");
}
