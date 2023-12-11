let audioPlaying = false;
let speechInstance;
let audioBlob;
let sharedLink;

async function convertPDFToAudio() {
    const fileInput = document.getElementById('pdfFile');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a PDF file.');
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const pdfData = new Uint8Array(event.target.result);
        // Load the PDF using PDF.js
        pdfjsLib.getDocument({ data: pdfData }).promise.then(async function(pdf) {
            let text = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                content.items.forEach(item => {
                    text += item.str + ' ';
                });
            }

            if (audioPlaying) {
                stopAudio();
            }

            speechInstance = responsiveVoice.speak(text, "UK English Female", { rate: 1, onend: () => { audioPlaying = false; } });
            audioPlaying = true;

            // Generate MP3 and prepare download link
            responsiveVoice.OnSpeakComplete = function() {
                responsiveVoice.export(text, "audio/mpeg", {onExportComplete: function(blob) {
                    const audioFileName = file.name.replace(/\.[^/.]+$/, "") + '_audio.mp3'; // Naming convention for audio file
                    audioBlob = blob;
                    const downloadLink = document.getElementById('downloadLink');
                    downloadLink.href = URL.createObjectURL(blob);
                    downloadLink.download = audioFileName; // Set the name for downloading the audio file
                    downloadLink.style.display = 'inline';
                }});
            };
        }, function (error) {
            console.error('Error: ' + error.message);
        });
    };
    fileReader.readAsArrayBuffer(file);
}








// Play Audio Function
function playAudio() {
    if (speechInstance && !audioPlaying) {
        responsiveVoice.resume(speechInstance);
        audioPlaying = true;
    }
}

// Pause Audio Function
function pauseAudio() {
    if (speechInstance && audioPlaying) {
        responsiveVoice.pause(speechInstance);
        audioPlaying = false;
    }
}

// Stop Audio Function
function stopAudio() {
    if (speechInstance && audioPlaying) {
        responsiveVoice.cancel(speechInstance);
        audioPlaying = false;
    }
}






// Share Audio Function
function shareAudio() {
    if (audioBlob) {
        // Logic to share audio link via various platforms (WhatsApp, Facebook, Twitter)
        alert('Sharing audio...');
        // Example: You might want to implement a share link for a specific platform here
        // For instance, opening a new window or redirecting to a sharing link
    } else {
        alert('Please convert PDF to audio first.');
    }
}

// Share on WhatsApp Function
function shareOnWhatsApp() {
    if (audioBlob) {
        // Logic to share audio on WhatsApp
        const shareLink = 'https://wa.me/?text=' + encodeURIComponent(sharedLink || URL.createObjectURL(audioBlob));
        window.open(shareLink);
    } else {
        alert('Please convert PDF to audio first.');
    }
}

// Share on Facebook Function
function shareOnFacebook() {
    if (audioBlob) {
        // Logic to share audio on Facebook
        const shareLink = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(sharedLink || URL.createObjectURL(audioBlob));
        window.open(shareLink);
    } else {
        alert('Please convert PDF to audio first.');
    }
}

// Share on Twitter Function
function shareOnTwitter() {
    if (audioBlob) {
        // Logic to share audio on Twitter
        const shareLink = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(sharedLink || URL.createObjectURL(audioBlob));
        window.open(shareLink);
    } else {
        alert('Please convert PDF to audio first.');
    }
}





// Attach functions to the global scope
window.convertPDFToAudio = convertPDFToAudio;
window.playAudio = playAudio;
window.pauseAudio = pauseAudio;
window.stopAudio = stopAudio;
window.shareAudio = shareAudio;
window.shareOnWhatsApp = shareOnWhatsApp;
window.shareOnFacebook = shareOnFacebook;
window.shareOnTwitter = shareOnTwitter;
