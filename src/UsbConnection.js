import React, { useEffect, useState } from 'react';
import { useLiveRegion } from '@chakra-ui/live-region';

const UsbConnection = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [connected, setConnected] = useState(false);
  const [deviceInstance, setDeviceInstance] = useState(null);
  const region = useLiveRegion();

  useEffect(() => {
    const listDevices = async () => {
      try {
        const deviceList = await navigator.usb.getDevices();
        setDevices(deviceList);
      } catch (error) {
        console.error('Failed to enumerate USB devices:', error);
      }
    };

    listDevices();

    navigator.usb.addEventListener('connect', (event) => {
      setDevices(prevDevices => [...prevDevices, event.device]);
    });

    navigator.usb.addEventListener('disconnect', (event) => {
      setDevices(prevDevices => prevDevices.filter(device => device !== event.device));
    });

    return () => {
      navigator.usb.removeEventListener('connect', () => {});
      navigator.usb.removeEventListener('disconnect', () => {});
    };
  }, []);

  const connectGuitar = async () => {
    if (!selectedDevice) {
      alert('Please select a device.');
      region.speak('Please select a device.');
      return;
    }

    try {
      await selectedDevice.open();
      setDeviceInstance(selectedDevice);
      setConnected(true);
      region.speak('Guitar connected');
    } catch (error) {
      console.error('Failed to connect to USB device:', error);
      region.speak('Failed to connect to guitar');
    }
  };

  const disconnectGuitar = async () => {
    if (deviceInstance) {
      try {
        await deviceInstance.close();
        setDeviceInstance(null);
        setConnected(false);
        region.speak('Guitar disconnected');
      } catch (error) {
        console.error('Failed to disconnect from USB device:', error);
        region.speak('Failed to disconnect from guitar');
      }
    }
  };

  return (
    <div>
      <label htmlFor="device-select">Select USB Device:</label>
      <select
        id="device-select"
        value={selectedDevice ? selectedDevice.productName : ''}
        onChange={(e) => {
          const device = devices.find(d => d.productName === e.target.value);
          setSelectedDevice(device);
        }}
      >
        <option value="" disabled>Select a device</option>
        {devices.map((device, index) => (
          <option key={index} value={device.productName}>
            {device.productName}
          </option>
        ))}
      </select>
      <button onClick={connectGuitar} disabled={connected || !selectedDevice}>
        Connect Guitar
      </button>
      <button onClick={disconnectGuitar} disabled={!connected}>
        Disconnect Guitar
      </button>
      <p>{connected ? 'Guitar Connected' : 'No Guitar Connected'}</p>
    </div>
  );
};

export default UsbConnection;