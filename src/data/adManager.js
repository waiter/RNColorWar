import {AdMobInterstitial} from 'react-native-admob';

const ad = {
  keys: {
    home: 'ca-app-pub-5825705564244333/3763261605',
    end: 'ca-app-pub-5825705564244333/5239994809'
  },
  // testDeviceID: '00fda71dc67fc13903cb9f0be47c0a35',
  testDeviceID: 'EMULATOR',
  isNoAd: false,
  isReady: false,
  isChecking: false,
  init: function() {
    AdMobInterstitial.setTestDeviceID(ad.testDeviceID);
    AdMobInterstitial.setAdUnitID(ad.keys.video);
    // AdMobInterstitial.addEventListener('interstitialDidClose', ad.interstitialDidClose);
    ad.interstitialDidClose();
  },
  interstitialDidClose: function() {
    AdMobInterstitial.requestAd((error) => {
      ad.checkReady();
    });
  },
  checkReady: function(force) {
    if ((!ad.isReady && !ad.isChecking) || force) {
      ad.isChecking = true;
      AdMobInterstitial.isReady((bool) => {
        ad.isReady = bool;
        ad.isChecking = false;
      });
    }
  },
  showAd: function() {
    AdMobInterstitial.showAd(ad.interstitialDidClose);
  },
  justShow: function() {
    AdMobInterstitial.requestAd((err) => {
      if (!err) {
        AdMobInterstitial.showAd();
      }
    });
  }
};

export default ad;
