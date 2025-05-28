export const thirtyDaysFromNow = () =>
  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

export const oneYearFromNow = () =>
  new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

export const fifteenminutesFromNow = () =>
  new Date(Date.now() + 15 * 60 * 1000);
export const tenmintuseFromNow = () =>
  new Date(Date.now() + 10 * 60 * 1000);

export const msInADay = 24 * 60 * 60 * 1000;

export const fiveMinuteAgo = () => new Date(Date.now() - (1000 * 60 * 5));
export const fiveMinutesFromNow = () => new Date(Date.now() + 1000 * 60 * 5); 
