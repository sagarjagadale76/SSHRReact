export const parcelData = [
  { date: '2023-06-01', created: 10, delivered: 5, cancelled: 2, inTransit: 3 },
  { date: '2023-06-02', created: 15, delivered: 8, cancelled: 1, inTransit: 6 },
  { date: '2023-06-03', created: 12, delivered: 10, cancelled: 3, inTransit: 4 },
  { date: '2023-06-04', created: 20, delivered: 12, cancelled: 2, inTransit: 6 },
  { date: '2023-06-05', created: 18, delivered: 15, cancelled: 1, inTransit: 2 },
  { date: '2023-06-06', created: 25, delivered: 18, cancelled: 3, inTransit: 4 },
  { date: '2023-06-07', created: 22, delivered: 20, cancelled: 2, inTransit: 5 },
];

export const parcelStatuses = [
  { name: 'Created', value: 122 },
  { name: 'Delivered', value: 88 },
  { name: 'Cancelled', value: 14 },
  { name: 'In Transit', value: 30 },
  { name: 'Accepted', value: 45 },
  { name: 'In Customs', value: 15 },
  { name: 'Other', value: 5 },
];

export const parcelStatusSummary = {
  today: { date: '2023-06-07', created: 25, delivered: 18, cancelled: 3, inTransit: 4 },
  yesterday: { date: '2023-06-06', created: 22, delivered: 20, cancelled: 2, inTransit: 5 },
  previousWeek: { startDate: '2023-05-31', endDate: '2023-06-06', created: 122, delivered: 88, cancelled: 14, inTransit: 30 },
  total: { startDate: '2023-01-01', endDate: '2023-06-07', created: 169, delivered: 126, cancelled: 19, inTransit: 39 },
};

export const batchDistribution = [
  { name: 'Created', value: 65 },
  { name: 'Found', value: 35 },
];

export const batchSummary = {
  today: { date: '2023-06-07', error: 2, created: 15, duplicate: 1, found: 7 },
  yesterday: { date: '2023-06-06', error: 1, created: 12, duplicate: 0, found: 9 },
  previousWeek: { startDate: '2023-05-31', endDate: '2023-06-06', error: 10, created: 80, duplicate: 5, found: 45 },
  total: { startDate: '2023-01-01', endDate: '2023-06-07', error: 13, created: 107, duplicate: 6, found: 61 },
};

