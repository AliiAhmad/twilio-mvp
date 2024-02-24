// src/components/Dialer.tsx
import React, { useState, useEffect } from 'react';
import styles from './Dialer.module.css';
import { Device } from '@twilio/voice-sdk';
import axios from 'axios';

const Dialer: React.FC = () => {
  const [input, setInput] = useState('');
  const [device, setDevice] = useState<Device| null>(null);
  const [callActive, setCallActive] = useState(false);

  useEffect(()=>{
    console.log(callActive);
  },[callActive])
  useEffect(() => {
    
    const fetchToken = async () => {
        try {
          const response = await axios.get('http://localhost:4000/token');
          const data = response.data;
          // Setup Twilio Device with the token
          const newDevice = new Device(data.token) as any;
          
          // newDevice.on('ready', () => {
          //   console.log('Twilio.Device Ready!');
          //   setDevice(newDevice);
          // });
          newDevice.on('disconnect', () => {
            console.log('Call ended');
            setCallActive(false);
            // setNotification('Call ended');
            // Reset the notification after a delay
            // setTimeout(() => setNotification(''), 3000);
          });

          setDevice(newDevice);
        } catch (error) {
            console.error('Error in fetching token');
        }
    };

    fetchToken();
  }, []);

  const handleInput = (digit: string) => {
    setInput((prev) => prev + digit);
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleCall = (e: any) => {
    e.preventDefault();
    console.log('Initiating call to:', input);
    if (device) {
      const params : any = { To: '+19292243712' };
      device.connect(params);
      // setCallActive(true);
    }
  };

  const handleCancel = (e: any) => {
    console.log('Initiating call to:', input);
    if (device) {
      const params : any = { To: '+19292243712' };
      device.connect(params);
      // setCallActive(true);
    }
  };

  // Generates the keypad with rows of buttons
  const keypadDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  const renderKeypad = keypadDigits.map((digit, index) => (
    <button
      key={index}
      className={styles.keypadButton}
      onClick={() => handleInput(digit)}
    >
      {digit}
    </button>
  ));

  return (
    <div className={styles.dialer}>
      <div className={styles.display}>{input || ' '}</div>
      <div className={styles.keypad}>
        {renderKeypad}
      </div>
      <div className={styles.actions}>
        {/* Spacer to ensure the call button stays centered */}
        <div className={`${styles.backspace} ${input ? '' : styles.backspaceVisible}`} />
        {
          !callActive ? 
          <button className={styles.callButton} onClick={handleCall}>
            &#x260E; {/* Telephone icon */}
          </button>:
          <button className={styles.cancelButton} onClick={handleCancel}>
            X {/* Telephone icon */}
          </button>
        }
        {/* Backspace button; only visible when there's input */}
        <button
          className={`${styles.backspace} ${input ? styles.backspaceVisible : ''}`}
          onClick={handleBackspace}
        >
          ⌫
        </button>
      </div>
    </div>
  );
};

export default Dialer;
