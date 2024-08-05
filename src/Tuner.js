import React, { useEffect, useRef, useState } from 'react';
import { createTuner } from '@chordbook/tuner';

const TunerComponent = () => {
  const tunerRef = useRef(null);
  const [note, setNote] = useState('');
  const [frequency, setFrequency] = useState('');

  useEffect(() => {
    const tuner = createTuner(tunerRef.current);

    // Assuming createTuner returns an object with an onNoteDetected event or similar
    tuner.onNoteDetected = (detectedNote, detectedFrequency) => {
      setNote(detectedNote);
      setFrequency(detectedFrequency);
      speak(`Note: ${detectedNote}, Frequency: ${detectedFrequency} Hz`);
    };

    return () => {
      // Assuming there is a method to clean up or destroy the tuner instance
      tuner.destroy && tuner.destroy();
    };
  }, []);

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };

  return (
    <div>
      <h2>Tuner</h2>
      <div ref={tunerRef}></div>
      <p>Current Note: {note}</p>
      <p>Frequency: {frequency} Hz</p>
    </div>
  );
};

export default TunerComponent;
