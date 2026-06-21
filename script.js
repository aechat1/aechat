const appID = 896349332; 
const server = "wss://webliveroom" + appID + "://zegocloud.com"; 

const zg = new ZegoExpressEngine(appID, server);
const roomID = 'royal_room_01';
const userID = 'user_' + Math.floor(Math.random() * 1000);

async function startRoyalLive() {
    try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        
        const localVideoView = document.getElementById('localVideo');
        const videoElement = document.createElement('video');
        videoElement.srcObject = mediaStream;
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.muted = true;
        videoElement.style.width = "100%";
        videoElement.style.height = "100%";
        videoElement.style.objectFit = "cover"; 
        
        localVideoView.appendChild(videoElement);
        console.log("تمت طباعة الكاميرا على الشاشة بنجاح!");

        await zg.loginRoom(roomID, '', { userID, userName: 'المضيف الملكي' }, { userUpdate: true });
        const localStream = await zg.createStream({ camera: { video: true, audio: true } });
        zg.startPublishingStream('stream_' + userID, localStream);
        
    } catch (error) {
        console.error("خطأ تشغيل الكاميرا: ", error);
    }
}

window.onload = () => {
    startRoyalLive();
};
function sendMessage() {
    const input = document.getElementById('chatInput');
    const chatBox = document.getElementById('chatBox');
    if(input.value.trim() === "") return;

    const msg = document.createElement('div');
    msg.className = 'chat-message';
    msg.innerHTML = `<span class="user-name">أنت:</span> ${input.value}`;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    input.value = "";
}

// دالة إرسال الهدايا المتحركة على طريقة التيك توك ملء الشاشة والشات
function sendGift(giftName) {
    const chatBox = document.getElementById('chatBox');
    const overlay = document.getElementById('tiktokGiftOverlay');
    const iconEl = document.getElementById('giftAnimationIcon');
    const textEl = document.getElementById('giftAnimationText');

    // 1. استخراج الإيموجي المناسب للحركة الكبيرة وسط الشاشة
    let emoji = "👑";
    if(giftName.includes("🏎️")) emoji = "🏎️";
    if(giftName.includes("🦁")) emoji = "🦁";

    iconEl.innerText = emoji;
    textEl.innerText = `قام أحد الداعمين بإرسال ${giftName}`;

    // 2. تشغيل الـ Animation المتحرك لملء الشاشة وإعادة تصفيره مثل تيك توك
    overlay.classList.remove('tiktok-gift-active');
    void overlay.offsetWidth; // حيلة برمجية لإعادة تشغيل الـ CSS من الصفر
    overlay.classList.add('tiktok-gift-active');

    // 3. طباعة إشعار فخم وثابت داخل صندوق الشات الكتابي بالأسفل
    const msg = document.createElement('div');
    msg.className = 'chat-message chat-gift-alert';
    msg.innerHTML = `🎁 نظام الهدايا: تم إرسال ${giftName} بنجاح في البث!`;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

let isPK = false;
function togglePK() {
    const remoteVideo = document.getElementById('remoteVideo');
    isPK = !isPK;
    remoteVideo.style.display = isPK ? 'block' : 'none';
}
