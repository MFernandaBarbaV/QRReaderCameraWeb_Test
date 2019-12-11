// QRCODE reader Copyright 2011 Lazar Laszlo
// http://www.webqr.com

var gCtx = null;
var gCanvas = null;
//var c = 0;
var stype = 0;
var gUM = false;
var webkit = false;
var moz = false;
var v = null;
var timeout = null;

var vidhtml = '<video id="v" autoplay></video>';

function initCanvas(w, h) {
    try {
        gCanvas = document.getElementById("qr-canvas");
        gCanvas.style.width = w + "px";
        gCanvas.style.height = h + "px";
        gCanvas.width = w;
        gCanvas.height = h;
        gCtx = gCanvas.getContext("2d");
        gCtx.clearRect(0, 0, w, h);
    } catch (e) {
        alert("error en initcanvas: " + e);
    }
}

function captureToCanvas() {
    try {
        if (stype != 1)
            return;
        if (gUM) {
            try {
                gCtx.drawImage(v, 0, 0);
                try {
                    qrcode.decode();
                }
                catch (e) {
                    console.log("error decode:  "+e);
                    timeout =    setTimeout(captureToCanvas, 500);
                };
            }
            catch (e) {
                console.log("error drawimag: "+e);
                timeout =    setTimeout(captureToCanvas, 500);
            };
        }
    } catch (e) {
        alert("error en capturetocanvas: " + e);
    }
}

function read(a) {
    try {
       // stype = 0;
     //   alert(a);
        var html = "<h1><span class=\"label label-info\">" + a + "</span></h1>";
        html = " <h4><p class=\"bg-primary text-center\">" + a + "</p></h4>";
        document.getElementById("result").innerHTML = html;

      
        
    } catch (e) {
       alert("error en read: " + e);
    }
}

function isCanvasSupported() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

function success(stream) {

    try {
        v.srcObject = stream;
        v.play();

        gUM = true;
        timeout =   setTimeout(captureToCanvas, 500);
    } catch (e) {
        alert("error en success: " + e);
    }
}

function fnerror(error) {
    alert("error: " + error);
    gUM = false;
    return;
}

function load() {
    if (isCanvasSupported() && window.File && window.FileReader) {
        initCanvas(800, 600);
        qrcode.callback = read;
     //   document.getElementById("mainbody").style.display = "inline";
        setwebcam();
    }
    else {
        alert("sorry your browser is not supported");
        document.getElementById("mainbody").style.display = "inline";
        document.getElementById("mainbody").innerHTML = '<p id="mp1">QR code scanner for HTML5 capable browsers</p><br>' +
            '<br><p id="mp2">sorry your browser is not supported</p><br><br>' +
            '<p id="mp1">try <a href="http://www.mozilla.com/firefox"><img src="firefox.png"/></a> or <a href="http://chrome.google.com"><img src="chrome_logo.gif"/></a> or <a href="http://www.opera.com"><img src="Opera-logo.png"/></a></p>';
    }
}

function setwebcam() {
    
           //qrcode.callback = read;
    var link = document.getElementById('outdiv');
    link.style.display = 'block';
    var options = true; // true: funciona camara trasera en chrome android, camara delantera en safari ios, no fnciona en chrome ios
    // false: funciona camara trasera en chrome android, nada coin ios
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
            navigator.mediaDevices.enumerateDevices()
                .then(function (devices) {
                    devices.forEach(function (device) {
                        if (device.kind === 'videoinput') {
                            if (device.label.toLowerCase().search("back") > -1)
                                options = { 'deviceId': { 'exact': device.deviceId }, 'facingMode': 'environment' };
                           console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
                        }
                      
                    });
                    setwebcam2(options);
                });
        }
        catch (e) {
            console.log(e);
            alert("error en setwebcam: " + e);
        }
    }
    else {
     
        setwebcam2(options);
    }

}

function setwebcam2(options) {
    try {
      
       document.getElementById("result").innerHTML = "";
        if (stype == 1) {
            setTimeout(captureToCanvas, 500);
            return;
        }
        var n = navigator;
        document.getElementById("outdiv").innerHTML = vidhtml;
        v = document.getElementById("v");

      

        if (n.mediaDevices != undefined && n.mediaDevices.getUserMedia) {
                       
            n.mediaDevices.getUserMedia({ video: options, audio: false }).
                then(function (stream) {
                    success(stream);
                }).catch(function (error) {
                    fnerror(error)
                });

        }
        else
            if (n.getUserMedia) {
                alert("getUserMedia");
                webkit = true;
                n.getUserMedia({ video: options, audio: false }, success, error);

            }
            else if (n.webkitGetUserMedia) {
                alert("webkitGetUserMedia");
                webkit = true;
                n.webkitGetUserMedia({ video: options, audio: false }, success, error);

            }
            else {
                alert("explorador no compatible.");
            }
            
        
        stype = 1;
        setTimeout(captureToCanvas, 500);
    } catch (e) {
        alert("error en setwebcam2: " + e);
    }
}

function closeWebCam() {

    try {
        document.getElementById("outdiv").innerHTML = "";

        //var link = document.getElementById('outdiv');
        //link.style.display = 'none';
        stype = 0;
        gUM = false;
       // qrcode.callback = null;

        if (v.srcObject != undefined) {
            let tracks = v.srcObject.getTracks();

            tracks.forEach(function (track) {
                track.stop();
            });

            v.srcObject = null;
        }
        clearTimeout(timeout);
    } catch (e) {
        alert("error al cerrar la camara: " + e);
    }
}
