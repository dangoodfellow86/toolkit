"use client"
import {React, useState, useEffect} from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/app/firebase'; // Replace './firebase' with the path to your Firebase configuration file

const Overtime = () => {
  const [overtimes, setOvertimes] = useState([]);

  useEffect(() => {
    // Fetch overtime data from firestore
    const fetchOvertimes = async () => {
      const overtimeCollection = collection(firestore, 'overtime');
      const overtimeSnapshot = await getDocs(overtimeCollection);
      const overtimeList = overtimeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOvertimes(overtimeList);
    };

    fetchOvertimes();
  }, []);



  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold mb-4">Overtime List</h2>
      <ul className="grid grid-cols-3 gap-4 m-4">
        {overtimes.map((overtime) => (
          <li key={overtime.id} className="bg-gray-100 p-4 rounded shadow-xl">
            <div>Date: {overtime.date}</div>
            <div>Type: {overtime.type}</div>
            <div>Hours: {overtime.hours}</div>
            <div><button className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded'>Delete</button></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Overtime;
