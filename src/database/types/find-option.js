const defaultFindOption = () => ({
  sort: 'asc',
  page: 1,
  limit: 10,
  from: new Date(0),
  to: new Date(),
});

module.exports = { defaultFindOption };