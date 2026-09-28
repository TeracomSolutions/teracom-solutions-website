// Generate exactly the correct calendar grid for a month
export function monthGrid(year, month) {
  // Create a date for the first day of the month
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  
  // Find the Monday of the week that contains the first day of the month
  const dayOfWeek = firstDay.getUTCDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, so we need to go back 6 days
  const startDate = new Date(firstDay);
  startDate.setUTCDate(firstDay.getUTCDate() - daysToMonday);
  
  const grid = [];
  let currentDate = new Date(startDate);
  
  // We'll generate weeks until we've passed the last day of the month
  let weekCount = 0;
  let lastDayOfCurrentMonth = new Date(Date.UTC(year, month, 0)); // Last day of target month
  
  while (weekCount < 6) {
    const weekDays = [];
    
    // Loop through days of the week (Monday to Sunday)
    for (let day = 0; day < 7; day++) {
      const dateStr = currentDate.toISOString().slice(0, 10); // YYYY-MM-DD
      const inMonth = currentDate.getUTCMonth() === firstDay.getUTCMonth();
      
      weekDays.push({ date: dateStr, inMonth });
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    
    grid.push(weekDays);
    weekCount++;
    
    // Check if we've moved past the last day of our target month
    // The key is to check this after adding a full week
    const firstDayOfCurrentWeek = new Date(Date.UTC(year, month - 1, 1));
    firstDayOfCurrentWeek.setUTCDate(firstDayOfCurrentWeek.getUTCDate() + (weekCount - 1) * 7);
    
    // If the first day of this week is past the last day of the month, we're done
    if (firstDayOfCurrentWeek > lastDayOfCurrentMonth) {
      break;
    }
  }
  
  // Remove any trailing weeks that only contain out-of-month dates
  while (grid.length > 0) {
    const lastWeek = grid[grid.length - 1];
    if (!lastWeek.some(day => day.inMonth)) {
      grid.pop();
    } else {
      break;
    }
  }
  
  return grid;
}

export function melbourneDate(iso) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Australia/Melbourne',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

export function melbourneTime(iso) {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Melbourne',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date).replace(/\s+/g, ' ').toLowerCase();
}

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];