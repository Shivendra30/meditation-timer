import React, { useState, useEffect } from "react";
import styles from "./Timer.module.css";
import { playAudio } from "./audio.js";
import Modal from "react-modal";

Modal.setAppElement("#root");
let sampleCheckpoint = new Map();
sampleCheckpoint.set(0, { hours: "00", mins: "39", sec: "59" });
sampleCheckpoint.set(1, { hours: "00", mins: "24", sec: "39" });
sampleCheckpoint.set(2, { hours: "00", mins: "09", sec: "19" });
console.log("sampe", sampleCheckpoint);

const Timer = props => {
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [hours, setHours] = useState("00");
  const [value, setValue] = useState("");
  const [clicked, setClicked] = useState(false);
  const [timer, setTimer] = useState(null);
  const [checkpoints, setCheckpoints] = useState(sampleCheckpoint);

  const startTimer = () => {
    let secondsLeft =
      parseInt(hours * 3600) + parseInt(minutes * 60) + parseInt(seconds);
    if (secondsLeft === 0) return;
    setClicked(true);

    let interval = setInterval(() => {
      const hoursLeft = Math.floor(secondsLeft / 3600);
      const minsLeft = Math.floor(secondsLeft / 60) - hoursLeft * 60;
      const secsLeft = secondsLeft - (minsLeft * 60 + hoursLeft * 3600);

      secsLeft < 10 ? setSeconds(`0${secsLeft}`) : setSeconds(secsLeft);
      minsLeft < 10 ? setMinutes(`0${minsLeft}`) : setMinutes(minsLeft);
      hoursLeft < 10 ? setHours(`0${hoursLeft}`) : setHours(hoursLeft);

      // console.log({ secsLeft, minsLeft, hoursLeft });

      if (secondsLeft < 0) {
        playAudio();
        clearTimer();
      }
      Object.values(checkpoints).forEach(item => {
        const { hours, mins, sec } = item;
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
    setValue("");
    setClicked(false);
    setMinutes("00");
    setSeconds("00");
    setHours("00");
  };

  useEffect(() => {
    const numArr = value
      .toString()
      .split("")
      .reverse();

    let newArr = new Array(6).fill("0");
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
        value={value}
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

const Checkpoints = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState(false);
  const { checkpoints, setCheckpoints } = props;
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)"
    }
  };
  const closeModal = () => setIsModalOpen(false);

  const addCheckoint = () => {
    const numArr = value
      .toString()
      .split("")
      .reverse(); //[3,2,1]

    let newArr = new Array(6).fill("0");
    numArr.forEach((num, i) => {
      newArr[i] = num;
    });
    newArr = newArr.reverse();
    let newCp = {};
    newCp["hours"] = `${newArr[0]}${newArr[1]}`;
    newCp["mins"] = `${newArr[2]}${newArr[3]}`;
    newCp["sec"] = `${newArr[4]}${newArr[5]}`;

    const newCpMap = new Map(checkpoints);
    newCpMap.set(newCpMap.length + 1, newCp);
    console.log(newCpMap);
    setCheckpoints(newCpMap);
    closeModal();
    setValue("");
  };

  const deleteCheckpoint = key => {
    if (!window.confirm("Do you want to delete this checkpoint?")) return;

    let filteredCps = new Map(checkpoints);
    // Object.values(checkpoints).forEach((cp, i) => {
    //   if (i !== index) {
    //     filteredCps[index] = cp;
    //   }
    // });
    filteredCps.delete(key);

    setCheckpoints(filteredCps);
  };

  let cpElements = [];
  checkpoints.forEach((val, key, map) => {
    const { hours, mins, sec } = val;
    cpElements.push(
      <p
        style={{ textAlign: "center" }}
        onClick={() => deleteCheckpoint(key)}
        key={key}
      >{`${hours}h ${mins}m ${sec}s`}</p>
    );
  });

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Checkpoints</h3>

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
        <div>
          <input
            value={value}
            onChange={e => {
              if (e.target.value.length <= 6) setValue(e.target.value);
            }}
            type="number"
          />
          <button onClick={() => addCheckoint()}>Add Checkpoint</button>
        </div>
      </Modal>
    </div>
  );
};

export default Timer;
