// import gong from '../../assets/';

export const makeSound = () => {
  var acontext = new AudioContext();
  var o = acontext.createOscillator();
  o.type = 'sine';
  o.connect(acontext.destination);
  o.start();
  setTimeout(() => {
    o.stop();
    // o.close();
  }, 1500);
};

// const makeSound = (vol=10, freq=1, duration=1000) => {
//   v=a.createOscillator()
//   u=a.createGain()
//   v.connect(u)
//   v.frequency.value=freq
//   v.type="square"
//   u.connect(a.destination)
//   u.gain.value=vol*0.01
//   v.start(a.currentTime)
//   v.stop(a.currentTime+duration*0.001)
// }
export const playAudio = async (cb = () => {}) => {
  // const videoUrl = 'http://www.orangefreesounds.com/wp-content/uploads/2014/11/Gong-sound.mp3';
  // const videoUrl =
  //  'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3';
  // const videoUrl = '../../assets/gong.mp3';
  // var audio = new Audio(videoUrl);
  var audio = document.getElementById('audio-element') as HTMLAudioElement;

  console.log(audio.src);
  // audio.type = 'audio/mp3';
  try {
    await audio.play();
    console.log('Playing...');
    // console.log(audio);
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;

      cb();
    }, 4000);
  } catch (err) {
    console.log('Failed to play...');
    console.error(err);
    makeSound();
  }
};
