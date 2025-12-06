import { findGCD } from "./NumberHandler.js";

function dateSubtraction(date1, date2) {
  return date2 - date1;
}

function toSimplifiedFractionString(numerator, denominator) {
  const gdc = findGCD(numerator, denominator);
  //console.log(gdc);
  numerator /= gdc;
  denominator /= gdc;
  return numerator.toString() + "/" + denominator.toString();
}

function getProgress(start, end) {
  const start_date = new Date(start);
  const end_date = new Date(end);
  const current_date = new Date(Date.now());
  const progress = dateSubtraction(start_date, current_date) / dateSubtraction(start_date, end_date);

  return progress;
}

function toProgressFractionString(start, end) { 
  const progress = getProgress(start, end);
  const percentage = progress.toFixed(2) * 100;    
  return toSimplifiedFractionString(percentage, 100);
}

function isEndingSoon(start, end) {
  const milliseconds_ending_zone = dateSubtraction(start, end) / 10;
  const current_milliseconds = Date.now();
  const end_milliseconds = Date.parse(end);
  const remaining_milliseconds = end_milliseconds - current_milliseconds;

  if (milliseconds_ending_zone === null || remaining_milliseconds === null) return false;
  if (remaining_milliseconds <= milliseconds_ending_zone) {
    return true;
  } 
  
  return false;
}

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

function convertToDate(milliseconds) {
  return Math.floor(milliseconds / MS_PER_DAY);
}

function convertToHour(milliseconds) {
  return Math.floor(milliseconds / MS_PER_HOUR);
}

function convertToMinute(milliseconds) {
  return Math.floor(milliseconds / MS_PER_MINUTE);
}

function convertToSecond(milliseconds) {
  return Math.floor(milliseconds / MS_PER_SECOND);
}

function convertToRemainingTime(milliseconds) {
  const day_remaining = convertToDate(milliseconds);
  milliseconds -= (day_remaining * MS_PER_DAY);  

  const hour_remaining = convertToHour(milliseconds);
  milliseconds -= (hour_remaining * MS_PER_HOUR);  

  const minute_remaining = convertToMinute(milliseconds);
  milliseconds -= (minute_remaining * MS_PER_MINUTE);  

  const second_remaining = convertToSecond(milliseconds);
  milliseconds -= (minute_remaining * MS_PER_SECOND);
  
  return {
    day_remaining,
    hour_remaining,
    minute_remaining,
    second_remaining
  }
}

function remainingTime(ending_date) {
  const now = Date.now();  
  const ending_date_to_millseconds = Date.parse(ending_date);  
  const remaining_milliseconds = dateSubtraction(now, ending_date_to_millseconds);  

  return convertToRemainingTime(remaining_milliseconds);
}

function isExpired(ending_date) {
  const now = new Date(Date.now());  
  const end_date = new Date(ending_date);  
  return dateSubtraction(now, end_date) <= 0;
}

function formatCustomDate(dateString) {
  const date = new Date(dateString);

  // 1. Define Vietnamese weekdays (matching your requested casing)
  const daysOfWeek = [
    "Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", 
    "Thứ năm", "Thứ sáu", "Thứ bảy"
  ];

  // 2. Helper to pad numbers with a leading zero (e.g., 9 -> "09")
  const pad = (num) => num.toString().padStart(2, '0');

  // 3. Extract UTC components to preserve the "15:30" from the input
  const dayName = daysOfWeek[date.getUTCDay()];
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Months are 0-indexed
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  // 4. Return the constructed string using Template Literals
  return `${dayName}, ${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

export { remainingTime, isEndingSoon, toProgressFractionString, getProgress, isExpired, formatCustomDate };

