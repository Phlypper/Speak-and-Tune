import React, { useEffect, useRef, useState } from 'react';
import { createTuner } from '@chordbook/tuner';
import { useLiveRegion } from '@chakra-ui/live-region';

const TunerComponent = () => {
  const tunerRef = useRef(null);
  const [note, setNote] = useState('');
  const [frequency, setFrequency] = useState('');
  const region = useLiveRegion();

  useEffect(() => {
    const tuner = createTuner(tunerRef.current);

    tuner.onNoteDetected = (detectedNote, detectedFrequency) => {
      setNote(detectedNote);
      setFrequency(detectedFrequency);
      speak(`Note: ${detectedNote}, Frequency: ${detectedFrequency} Hz`);
      region.speak(`Note: ${detectedNote}, Frequency: ${detectedFrequency} Hz`);
    };

    return () => {
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