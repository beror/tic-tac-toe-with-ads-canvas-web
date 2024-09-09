const adContainer = document.getElementById('ad-container');
const adDisplayContainer = new google.ima.AdDisplayContainer(adContainer);
const adsLoader = new google.ima.AdsLoader(adDisplayContainer);
let adsManager, adPlaying;

adDisplayContainer.initialize();
adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded, false);
adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false);

function requestAd() {
    const adsRequest = new google.ima.AdsRequest();

    adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
      'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
      'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
      'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=' +
      Date.now();

    adsLoader.requestAds(adsRequest);
}

function onAdsManagerLoaded(event) {
    console.log('onAdsManagerLoaded');
    adsManager = event.getAdsManager();

    adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
    adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, onContentResumeRequested);
    adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, onContentPauseRequested);
    adsManager.addEventListener(google.ima.AdEvent.Type.PAUSED, onAdPaused);
    adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, onAdComplete);
    
    try {
        adsManager.init(canvas.width, canvas.height, google.ima.ViewMode.NORMAL);
        adsManager.start();
    } catch (adError) {
        console.log('AdsManager could not be started', adError);
    }
}

function onAdError(adErrorEvent) {
    console.log('Ad error: ' + adErrorEvent.getError());
    if(adsManager) adsManager.destroy();
    resetGame();
}

function onContentPauseRequested() {
    console.log('onContentPauseRequested');
}

function onContentResumeRequested() {
    console.log('onContentResumeRequested');
    resetGame();
}

function onAdPaused(event) {
    adsManager.resume();
}

function onAdComplete() {
    console.log('onAdComplete');
    adDisplayContainer.destroy();
}