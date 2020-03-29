import React, { useState, useEffect } from 'react';
import styles from './Timer.module.css';
import { playAudio } from './audio';
import Modal from 'react-modal';

Modal.setAppElement('#root');
let sampleCheckpoint = new Map();
sampleCheckpoint.set(0, { hours: '00', mins: '34', sec: '59' });
sampleCheckpoint.set(1, { hours: '00', mins: '19', sec: '39' });
sampleCheckpoint.set(2, { hours: '00', mins: '04', sec: '19' });

const Timer = () => {
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');
  const [hours, setHours] = useState('00');
  const [value, setValue] = useState('');
  const [clicked, setClicked] = useState(false);
  const [timer, setTimer] = useState<number | undefined>(undefined);
  const [checkpoints, setCheckpoints] = useState(sampleCheckpoint);

  const startTimer = () => {
    let secondsLeft =
      parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    if (secondsLeft === 0) return;
    setClicked(true);

    let interval = window.setInterval(() => {
      const hoursLeft = Math.floor(secondsLeft / 3600);
      const minsLeft = Math.floor(secondsLeft / 60) - hoursLeft * 60;
      const secsLeft = secondsLeft - (minsLeft * 60 + hoursLeft * 3600);

      secsLeft < 10
        ? setSeconds(`0${secsLeft}`)
        : setSeconds(secsLeft.toString());
      minsLeft < 10
        ? setMinutes(`0${minsLeft}`)
        : setMinutes(minsLeft.toString());
      hoursLeft < 10
        ? setHours(`0${hoursLeft}`)
        : setHours(hoursLeft.toString());

      if (secondsLeft < 0) {
        playAudio();
        clearTimer();
      }
      checkpoints.forEach((val, key, map) => {
        const { hours, mins, sec } = val;
        if (
          hoursLeft === parseInt(hours) &&
          minsLeft === parseInt(mins) &&
          secsLeft === parseInt(sec)
        )
          playAudio();
      });

      secondsLeft--;
    }, 1000);
    setTimer(interval);
  };

  const clearTimer = () => {
    clearInterval(timer);
    setValue('');
    setClicked(false);
    setMinutes('00');
    setSeconds('00');
    setHours('00');
  };

  useEffect(() => {
    const numArr = value
      .toString()
      .split('')
      .reverse();

    let newArr = new Array(6).fill('0');
    numArr.forEach((num, i) => {
      newArr[i] = num;
    });
    newArr = newArr.reverse();

    setHours(`${newArr[0]}${newArr[1]}`);
    setMinutes(`${newArr[2]}${newArr[3]}`);
    setSeconds(`${newArr[4]}${newArr[5]}`);
  }, [value]);

  return (
    <div className={styles.mainContainer}>
      <h1>Meditation Timer</h1>
      <div className={styles.timerContainer}>
        {hours}h &nbsp;
        {minutes}m&nbsp;
        {seconds}s&nbsp;
      </div>
      <input
        className={styles.timerInputContainer}
        value={clicked ? '' : value}
        autoFocus={true}
        placeholder="Enter desired time"
        onChange={e => {
          if (e.target.value.length <= 6) setValue(e.target.value);
        }}
        type="number"
        disabled={clicked}
      />
      <div className={styles.buttonContainer}>
        {!clicked && (
          <button
            onClick={startTimer}
            className={styles.startButton}
            disabled={clicked}
          >
            Start
          </button>
        )}
        {clicked && (
          <button onClick={clearTimer} className={styles.stopButton}>
            Stop
          </button>
        )}
      </div>
      <Checkpoints checkpoints={checkpoints} setCheckpoints={setCheckpoints} />
    </div>
  );
};

interface CheckpointsProps {
  checkpoints: Map<any, any>;
  setCheckpoints: React.Dispatch<React.SetStateAction<Map<any, any>>>;
}

interface CheckpointsMap {
  hours: string;
  mins: string;
  sec: string;
}

const Checkpoints = (props: CheckpointsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState('');
  const { checkpoints, setCheckpoints } = props;
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  };
  const closeModal = () => setIsModalOpen(false);

  const addCheckoint = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const numArr = value
      .toString()
      .split('')
      .reverse(); //[3,2,1]

    let newArr = new Array(6).fill('0');
    numArr.forEach((num, i) => {
      newArr[i] = num;
    });
    newArr = newArr.reverse();

    let newCp: CheckpointsMap = {} as CheckpointsMap;
    newCp['hours'] = `${newArr[0]}${newArr[1]}`;
    newCp['mins'] = `${newArr[2]}${newArr[3]}`;
    newCp['sec'] = `${newArr[4]}${newArr[5]}`;

    const newCpMap = new Map(checkpoints);
    newCpMap.set(newCpMap.size + 1, newCp);
    setCheckpoints(newCpMap);
    closeModal();
    setValue('');
  };

  const deleteCheckpoint = (key: number): void => {
    if (!window.confirm('Do you want to delete this checkpoint?')) return;

    let filteredCps = new Map(checkpoints);
    // Object.values(checkpoints).forEach((cp, i) => {
    //   if (i !== index) {
    //     filteredCps[index] = cp;
    //   }
    // });
    filteredCps.delete(key);

    setCheckpoints(filteredCps);
  };

  let cpElements: JSX.Element[] = [];
  checkpoints.forEach((val, key, map) => {
    const { hours, mins, sec } = val;
    cpElements.push(
      <p
        style={{ textAlign: 'center' }}
        onClick={() => deleteCheckpoint(key)}
        key={key}
      >{`${hours}h ${mins}m ${sec}s`}</p>
    );
  });

  return (
    <div>
      <h3 style={{ textAlign: 'center' }}>Checkpoints</h3>

      {cpElements}
      <button
        onClick={() => setIsModalOpen(true)}
        className={styles.addCheckpointButton}
      >
        Add Checkpoint
      </button>
      <Modal
        isOpen={isModalOpen}
        onAfterOpen={() => null}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <form onSubmit={addCheckoint}>
          <input
            value={value}
            autoFocus={true}
            onChange={e => {
              if (e.target.value.length <= 6) setValue(e.target.value);
            }}
            type="number"
          />
          {/* <button onClick={() => addCheckoint()}>Add Checkpoint</button> */}
          <input type="submit" value="Add Checkpoint" />
        </form>
      </Modal>
    </div>
  );
};

export default Timer;
