// libaray files

let blobs_recordedVideo = [];
let recordingStream = false;
let stopRecordingBoolean = false;
let video_recorder = null;
let media_stream;

let userVideoEl;
//CamConfig function used to take camera configuration and modes from user
let CamConfig = {
    video: {
        width: 300,
        height: 240,
        facingMode: "user",
    },
    type: "video/webm",
    audio: true,
};

function init(config = {}) {
    let camParams = { ...CamConfig, ...config };
    CamConfig = camParams;
}

//camera is toggle
// when user call this function
function toggleCam() {
    userVideoEl.srcObject = null;
    cancelPreview(); // Take back camera access
    showPreview(userVideoEl);
}

//start recording function
// get media_stream from startPreview
function startRecording() {
    recordingStream = true;
    video_recorder = new MediaRecorder(media_stream, {
        type: CamConfig.type,
    });

    video_recorder.start();
}

//stop recording is resolved only if  start recording is called
//else resolve null as a promise
function stopRecording() {
    return new Promise((resolve, reject) => {
        video_recorder.addEventListener("dataavailable", function (e) {
            blobs_recordedVideo.push(e.data);
            stopRecordingBoolean = true;
            const videoBlob = getVideo();
            resolve(videoBlob);
        });

        if (recordingStream) {
            video_recorder.stop();
        } else {
            resolve(null);
        }
    });
}

//cancel preview free the camera resources
function cancelPreview() {
    media_stream.getTracks().forEach((element) => {
        element.stop();
    });
    media_stream = null;
}

//if recordingStream is recorded and stopRecordingBoolean is stop that recording
//then return that URL
//else null
function getVideo() {
    if (recordingStream && stopRecordingBoolean) {
        let video_local = URL.createObjectURL(
            new Blob(blobs_recordedVideo, { type: CamConfig.type })
        );
        return video_local;
    }
    return null;
}

// pause started recording
function pauseRecording() {
    if (video_recorder.state === "recording") {
        video_recorder.pause();
    }
}

//resume pause recording
function resumeRecording() {
    if (video_recorder.state === "paused") {
        video_recorder.resume();
    }
}

//ShowPreview function
//take Video elemant as a paramter
//start camera based on user cam configuration and modes
function showPreview(video) {
    video.srcObject = null;
    userVideoEl = video;
    return new Promise((resolve, reject) => {
        let devices = navigator.mediaDevices;
        let constraints = {
            ...CamConfig,
        };
        if (devices && "getUserMedia" in devices) {
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then((stream) => {
                    media_stream = stream;
                    video.autoplay = true;
                    video.srcObject = stream;
                    resolve(stream);
                })
                .catch((err) => {
                    reject(err);
                });
        } else {
            reject("Web API not working");
        }
    });
}

//takePicture function used to click photo
//canvas elemant passed as a parameter
//after clicking photo it return image as a data
//which is later use to download picture what we had clicked.
function takePicture(canvasUser) {
    let context = canvasUser.getContext("2d");
    context.drawImage(
        userVideoEl,
        0,
        0,
        canvasUser.width,
        canvasUser.height
    );
    const data = canvasUser.toDataURL("image/png");
    return data;
}
//stopPreview function used to
//stop camera resources and will shut down web-cam
function stopPreview() {
    media_stream.getTracks().forEach((ele) => {
        ele.stop();
    });
    userVideoEl.srcObject = null;
}

function download(url, name) {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
