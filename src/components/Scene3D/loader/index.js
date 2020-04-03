import { TextureLoader } from 'three';

export const assets = [];

export default class Loader {
  constructor () {
    this.textureLoader = new TextureLoader();
    this.currentAssetsLoaded = 0;
    this.nbAssetsToLoad = 0;

    this.callback = null;
  }

  onAssetLoaded(assetUrl, texture) {
    
    assets[assetUrl] = texture;
    this.currentAssetsLoaded++;

    if (this.currentAssetsLoaded === this.nbAssetsToLoad && this.callback) {
      this.callback();      
    }
  }


  load (assets, cb) {
    this.callback = cb;
    this.nbAssetsToLoad = assets.length;
    this.currentAssetsLoaded = 0;

    for (let i = 0; i < assets.length; i++) {
      const assetUrl = assets[i];

      this.textureLoader.load(
        assetUrl,
        (texture) => {
          this.onAssetLoaded(assetUrl, texture)
        },
        (err) => {
          console.error( 'An error happened.', err );
          this.onAssetLoaded(assetUrl, null)
        },
      ); 
    }
  }
}