import { useRef, useState } from 'react';
import './App.css';
import {
  VolumeUpIcon, VolumeOffIcon,
} from "../node_modules/@heroicons/react/outline"

function App() {

  const [currentMusicDetails, setCurrentMusicDetails] = useState({
    songName: 'Song title',
    songArtist: 'Song artist',
    songSrc: './Assets/songs/',
    songAvatar: './Assets/Images/'
  })

  //UseStates Variables
  const [audioProgress, setAudioProgress] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [musicIndex, setMusicIndex] = useState(0);
  const [musicTotalLength, setMusicTotalLength] = useState('03 : 59');
  const [musicCurrentTime, setMusicCurrentTime] = useState('00 : 00');
  const [volume, setVolume] = useState(100);

  const currentAudio = useRef()

  const handleMusicProgressBar = (e) => {
    setAudioProgress(e.target.value);
    currentAudio.current.currentTime = e.target.value * currentAudio.current.duration / 100;
  }

  //Change Avatar Class
  let avatarClass = ['objectFitCover', 'objectFitContain', 'none']
  const [avatarClassIndex, setAvatarClassIndex] = useState(0)
  const handleAvatar = () => {
    if (avatarClassIndex >= avatarClass.length - 1) {
      setAvatarClassIndex(0)
    } else {
      setAvatarClassIndex(avatarClassIndex + 1)
    }
  }


  //Play Audio Function
  const handleAudioPlay = () => {
    if (currentAudio.current.paused) {
      currentAudio.current.play();
      setIsAudioPlaying(true)
    } else {
      currentAudio.current.pause();
      setIsAudioPlaying(false)
    }
  }
  //calls the handleAudioPlay function when spacebar is pressed
  document.body.onkeydown = function (e) {
    if (e.key === " " ||
      e.code === "Space" ||
      e.keyCode === 32
    ) {
      handleAudioPlay()
    } else if (
      e.code === "ArrowLeft" ||
      e.keyCode === 37
    ) {
      currentAudio.current.currentTime -= 5;
    } else if (
      e.code === "ArrowRight" ||
      e.keyCode === 39
    ) {
      currentAudio.current.currentTime += 5;
    } else if (
      e.code === "m" || e.keyCode === 77
    ) {
      if (currentAudio.current.volume !== 0) {
        setVolume(0)
        currentAudio.current.volume = 0;
      } else {
        setVolume(50)
        currentAudio.current.volume = 0.5;
      }

    } else if (e.keyCode === 188) {
      handlePrevSong()
    } else if (e.keyCode === 190) {
      handleNextSong()
    }
  }

  const musicAPI = [
    {
      songName: 'Song title',
      songArtist: 'Song artist',
      songSrc: './Assets/songs/',
      songAvatar: './Assets/Images/'
    }

  ]

  const handleNextSong = () => {
    if (musicIndex >= musicAPI.length - 1) {
      let setNumber = 0;
      setMusicIndex(setNumber);
      updateCurrentMusicDetails(setNumber);
    } else {
      let setNumber = musicIndex + 1;
      setMusicIndex(setNumber)
      updateCurrentMusicDetails(setNumber);
    }
    // handleChangeBackground();
  }

  const handlePrevSong = () => {
    if (musicIndex === 0) {
      let setNumber = musicAPI.length - 1;
      setMusicIndex(setNumber);
      updateCurrentMusicDetails(setNumber);
    } else {
      let setNumber = musicIndex - 1;
      setMusicIndex(setNumber)
      updateCurrentMusicDetails(setNumber);
    }
    // handleChangeBackground();
  }

  const updateCurrentMusicDetails = (number) => {
    let musicObject = musicAPI[number];
    currentAudio.current.src = musicObject.songSrc;
    currentAudio.current.play();
    setCurrentMusicDetails({
      songName: musicObject.songName,
      songArtist: musicObject.songArtist,
      songSrc: musicObject.songSrc,
      songAvatar: musicObject.songAvatar
    })
    setIsAudioPlaying(true);
  }

  const handleAudioUpdate = () => {
    //Input total length of the audio
    let minutes = Math.floor(currentAudio.current.duration / 60);
    let seconds = Math.floor(currentAudio.current.duration % 60);
    let musicTotalLength0 = `${minutes < 10 ? `0${minutes}` : minutes} : ${seconds < 10 ? `0${seconds}` : seconds}`;
    setMusicTotalLength(musicTotalLength0);

    //Input Music Current Time
    let currentMin = Math.floor(currentAudio.current.currentTime / 60);
    let currentSec = Math.floor(currentAudio.current.currentTime % 60);
    let musicCurrentT = `${currentMin < 10 ? `0${currentMin}` : currentMin} : ${currentSec < 10 ? `0${currentSec}` : currentSec}`;
    setMusicCurrentTime(musicCurrentT);

    const progress = parseInt((currentAudio.current.currentTime / currentAudio.current.duration) * 100);
    setAudioProgress(isNaN(progress) ? 0 : progress)
  }

  return (
    <>
      <div className="container">
        <audio src='./Assets/songs/' ref={currentAudio} onEnded={handleNextSong} onTimeUpdate={handleAudioUpdate}></audio>

        {/* <video src='./Assets/Videos/video1.mp4' loop muted className='backgroundVideo'></video> */}
        <div className="blackScreen"></div>
        <div className="music-Container">
          <p className='musicPlayer'>Music Player</p>
          <p className='music-Head-Name'>{currentMusicDetails.songName}</p>
          <p className='music-Artist-Name'>{currentMusicDetails.songArtist}</p>
          <img src={currentMusicDetails.songAvatar} className={avatarClass[avatarClassIndex]} onClick={handleAvatar} alt="song Avatar" id='songAvatar' />
          <div className="musicTimerDiv">
            <p className='musicCurrentTime'>{musicCurrentTime}</p>
            <p className='musicTotalLenght'>{musicTotalLength}</p>
          </div>
          <input type="range" name="musicProgressBar" className='musicProgressBar' value={audioProgress} onChange={handleMusicProgressBar} />
          <div className="musicControlers">
            {/* comment for the volume seperation */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end">
              <VolumeOffIcon onClick={() => {
                if (volume > 0) {
                  setVolume(volume - 10)
                  currentAudio.current.volume -= 0.1;
                  console.log(currentAudio.current.volume)
                }
              }
              } className="button" />
              <input className="w-14 md:w-28" type="range" value={volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  currentAudio.current.volume = Number(e.target.value) / 100;
                  console.log(currentAudio.current.volume)
                }} min={0} max={100} />
              <VolumeUpIcon onClick={() => {
                if (volume < 100) {
                  setVolume(volume + 10)
                  currentAudio.current.volume += 0.1;
                  console.log(currentAudio.current.volume)
                }
              }
              } className="button" />
            </div>

            <i className='fa-solid fa-backward musicControler' onClick={handlePrevSong}></i>
            <i className={`fa-solid ${isAudioPlaying ? 'fa-pause-circle' : 'fa-circle-play'} playBtn`} onClick={handleAudioPlay}></i>
            <i className='fa-solid fa-forward musicControler' onClick={handleNextSong}></i>
          </div>
        </div>

      </div>
    </>
  );
}

export default App;
