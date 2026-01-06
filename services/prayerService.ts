
import { PrayerTimes } from '../types';

export const fetchPrayerTimes = async (lat: number, lon: number): Promise<PrayerTimes> => {
  try {
    const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`);
    const data = await response.json();
    const timings = data.data.timings;
    const date = data.data.date.readable;
    const hijri = data.data.date.hijri.day + " " + data.data.date.hijri.month.en;

    return {
      Fajr: timings.Fajr,
      Dhuhr: timings.Dhuhr,
      Asr: timings.Asr,
      Maghrib: timings.Maghrib,
      Isha: timings.Isha,
      Sunrise: timings.Sunrise,
      date: `${date} (${hijri})`,
      location: "Current Location"
    };
  } catch (error) {
    throw new Error("Could not fetch prayer times");
  }
};
