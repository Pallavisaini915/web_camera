//pick the modal

const modal = document.querySelector(".modal");
const btn = document.querySelector(".modal_contanier");
const close = document.querySelector(".close");
const canvas = document.getElementById("canvas");
const camOpen = document.getElementById("btn");
const video = document.getElementById("vid");
const clickPhoto = document.getElementById("photo");
const photo = document.getElementById("pic");
const downLoadPic = document.getElementById("dnlPic");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const downloadBtn = document.getElementById("DownloadVideo");
const dlBtn = document.getElementById("download-btn");
const tx1 = document.getElementById("tx1");
const tx2 = document.getElementById("tx2");
const previewRecord = document.getElementById("previewRecord");
const buttonDiv = document.getElementById("buttonDiv");
const initbtn = document.querySelector("#btn23");
const pauseReco = document.querySelector("#pauseReco-btn");
const resumeReco = document.querySelector("#resumeReco-btn");
const toggleBtn = document.querySelector("#toggleBtn");

let streaming = false;

let all_MediaUser = null;
let blobs_recorded = [];
let media_recorder = null;
let data = "";
let obj = {};

function getValue() {
    // modal.style.display = "block";
    // canvas.style.display = "none";
    // initWebCam();
    init();
    displayVideo(video);
}

// User provide canvas
// take picture
function takePhoto(canvas) {
    const photoURL = takePicture(canvas);
    toggleBtn.style.display = "none";
    console.log(photoURL);
}

//showing video
function displayVideo(video) {
    showPreview(video)
        .then((res) => {
            modal.style.display = "block";
            canvas.style.display = "none";
        })
        .catch((err) => {
            alert(err);
        });
}

//download picture
function dnlLocal(url) {
    download(url, "pallavi.png");
}

// record video
function startRecordingVideo() {
    video.style.display = "block";
    startBtn.style.display = "none";
    stopBtn.style.display = "block";
    canvas.style.display = "none";
    pauseReco.style.display = "block";
    clickPhoto.style.display = "none";
    downLoadPic.style.display = "none";

    startRecording();
}

// stop recording video
async function stopRecordingVideo() {
    stopBtn.style.display = "none";
    dlBtn.style.display = "block";
    video.style.display = "none";
    canvas.style.display = "none";
    pauseReco.style.display = "none";
    toggleBtn.style.display = "none";
    resumeReco.style.display = "none";

    const videoRecoURL = await stopRecording();
    console.log(videoRecoURL);
    // downloadVideo(videoRecoURL, "askrajputt");
}

//add modal
function closeModal() {
    cancelPreview(video.srcObject);
    modal.style.display = "none"; // come back to original state
    window.location.reload();
}

function pauseRecordingVid() {
    pauseRecording();
    pauseReco.style.display = "none";
    resumeReco.style.display = "block";
}

function getDownloadVid() {
    const video = getVideo();
    download(video, "adityaSingh");
}

function resumeRecordingVideo() {
    resumeReco.style.display = "none";
    pauseReco.style.display = "block";

    const resumeVar = resumeRecording();
    console.log(resumeVar);
}

//if you click outside of the modal
window.onclick = function (e) {
    if (e.target == modal) {
        closeModal();
    }
};

close.addEventListener("click", closeModal);

//taking photo
clickPhoto.addEventListener("click", (ev) => {
    ev.preventDefault();
    downLoadPic.style.display = "block";
    video.style.display = "none";
    canvas.style.display = "block";
    clickPhoto.style.display = "none";
    takePhoto(canvas);
});

//download pic
downLoadPic.addEventListener("click", (e) => {
    e.preventDefault();
    dnlLocal(data);
});

function toggleCameraFunction() {
    toggleCam();
}

toggleBtn.addEventListener("click", toggleCameraFunction);

//start recording
startBtn.addEventListener("click", startRecordingVideo);
//for stopping a video
stopBtn.addEventListener("click", stopRecordingVideo);
initbtn.addEventListener("click", getValue);
pauseReco.addEventListener("click", pauseRecordingVid);
dlBtn.addEventListener("click", getDownloadVid);
resumeReco.addEventListener("click", resumeRecordingVideo);
